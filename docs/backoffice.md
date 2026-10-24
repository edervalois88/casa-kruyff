# Administración de Casa Kruyff

El panel `/admin` utiliza Neon Postgres para contenido, credenciales, sesiones y registros de archivos; Vercel Blob público almacena únicamente imágenes y modelos que hayan pasado la validación del servidor. No utiliza SQLite ni depende del disco de las funciones. El runtime es Node.js 24, con Vercel Fluid Compute y un pool `pg` asociado a `attachDatabasePool`.

## Configuración del entorno

Las conexiones de Neon y Blob del proyecto Vercel proporcionan las variables siguientes. Deben permanecer privadas y fuera de Git:

| Variable | Uso |
| --- | --- |
| `DATABASE_URL` | Conexión agrupada de Postgres para solicitudes del sitio y panel |
| `DATABASE_URL_UNPOOLED` | Conexión directa para migraciones Drizzle |
| `BLOB_STORE_ID` | Almacén público conectado al proyecto |
| `VERCEL_OIDC_TOKEN` | Identidad temporal de Vercel; las funciones la obtienen automáticamente |
| `BETTER_AUTH_SECRET` | Secreto distinto por entorno para firmar sesiones y cookies de Better Auth |
| `BETTER_AUTH_URL` | Origen de producción `https://casakruyff.com`; en Preview Better Auth infiere el host de la solicitud |
| `CMS_SETUP_TOKEN` | Clave de configuración inicial, aleatoria, de 43 a 128 caracteres alfanuméricos, guion o guion bajo |

Para desarrollo, use `.env.local` ignorado por Git. La identidad OIDC local caduca: renueve la conexión del CLI si Blob rechaza las cargas. No introduzca ninguna de estas variables como `NEXT_PUBLIC_*`.

## Migraciones y primera cuenta

1. Instale con `npm ci`.
2. Ejecute `npm run cms:migrate` usando la conexión directa del entorno correspondiente. Las migraciones versionadas están en `drizzle/`, generadas desde `lib/server/schema.ts` mediante Drizzle Kit.
3. Configure `CMS_SETUP_TOKEN` como secreto del servidor y consérvelo solo para la primera configuración. No existe contraseña predeterminada.
4. Abra `/admin/setup`, introduzca la clave de bootstrap, su correo y una contraseña de entre 12 y 128 caracteres.
5. Better Auth crea la cuenta y su registro de credenciales. La tabla `cms_admins` vincula esa identidad como único administrador; el bloqueo de fila y la clave de bootstrap de un solo uso impiden altas concurrentes o públicas. Cambiar `CMS_SETUP_TOKEN` antes del alta invalida la clave anterior. Después de crear la cuenta, retire `CMS_SETUP_TOKEN` de producción.

El contenido original se inserta una sola vez, sin reemplazar las ediciones al reiniciar o desplegar. El alta no migra automáticamente contenido de una antigua instalación SQLite; una importación de esa instalación debe planearse por separado antes de sustituirla.

Cada entorno debe apuntar a su propia rama/base Neon. No ejecute pruebas ni migraciones de preview contra producción. `cms:migrate` falla si falta `DATABASE_URL_UNPOOLED`; no cambia la URL agrupada que utilizan las solicitudes del servidor.

## Sesiones y edición

Better Auth administra usuarios, hashes de contraseña y sesiones en Neon. El registro por correo está deshabilitado; la única cuenta se crea por el flujo de bootstrap. La cookie de sesión es HttpOnly, SameSite=Strict y Secure en producción HTTPS. Las sesiones duran ocho horas y el login usa límites de frecuencia guardados en Postgres. La ruta del panel comprueba en el servidor que la sesión corresponda al usuario enlazado como administrador. Cambiar la contraseña revoca las demás sesiones y cierra la actual.

Guardar aplica la revisión actual a un documento completo validado. Si otra pestaña ya guardó, la revisión obsoleta recibe HTTP 409; recargue el contenido antes de guardar otra vez. Las piezas en borrador y sus registros de imagen se excluyen del documento público.

Los archivos de Blob son públicos, incluso si todavía no aparecen en una pieza publicada. El estado de borrador no revoca una URL compartida. Los modelos asignados a piezas deben constar en el registro de cargas validadas de este CMS. Los archivos conservan nombres aleatorios e inmutables. Si el registro en Postgres falla después de subir un archivo, el servidor intenta eliminar ese Blob; si también falla la eliminación, devuelve un error explícito para que el administrador revise el almacén.

## Cargas en Vercel

Se aceptan JPEG, PNG y WebP hasta 12 MB y 40 megapíxeles, con decodificación real antes de publicar el archivo. Los modelos GLB 2 y USDZ admiten hasta 32 MB. Los GLB deben ser autónomos y no contener recursos externos; los USDZ deben ser ZIP sin compresión/cifrado, con alineación, CRC y un archivo USD inicial reconocible. No se permite SVG.

Las cargas pequeñas usan `/api/admin/assets`. Para superar el límite de cuerpo de las funciones Vercel, el panel divide archivos de más de 3 MiB en fragmentos de hasta 3 MiB. Estos fragmentos se conservan temporalmente en Postgres, sin URL pública. El último fragmento reconstruye y valida el archivo completo antes de subirlo a Blob. Se verifica el orden; una repetición o pérdida de estado devuelve HTTP 409 y requiere reiniciar la carga.

El estado temporal caduca a los 30 minutos y se limpia al recibir la siguiente carga fragmentada. Se admiten hasta cuatro cargas pendientes. Finalizar, tanto con éxito como por archivo inválido, elimina los fragmentos. Si una carga falla, el panel solicita cancelar únicamente su identificador para liberar los fragmentos. La ruta pública antigua `/media/[filename]` redirige al Blob si existe un registro del archivo.

## Contrato de rutas

Los errores devuelven `{ "error": "mensaje" }`. Todas las escrituras comprueban que `Origin` coincide exactamente con el origen de la solicitud; las rutas de contenido, archivos y contraseña exigen una sesión válida en el servidor. Los límites de acceso, configuración y cambio de contraseña se aplican de forma atómica en Postgres: 20 solicitudes por operación e IP cada 15 minutos, y un límite global de 1000. La IP se obtiene mediante el helper oficial de Vercel y se almacena como hash. Fuera de Vercel, el servidor debe estar detrás de un proxy de confianza que establezca esas cabeceras; en desarrollo sin IP se comparte una única identidad local.

| Ruta | Método | Entrada / salida |
| --- | --- | --- |
| `/api/admin/session` | GET | `{ authenticated, setupRequired, email? }`; nunca expone el correo sin sesión |
| `/api/admin/setup` | POST | JSON `{ token, email, password }`; consume el alta inicial y crea sesión |
| `/api/auth/[...all]` | GET / POST | Endpoints Better Auth; signup por correo deshabilitado |
| `/api/admin/content` | GET / PUT | Lee / guarda `SiteContent`; PUT devuelve el documento con nueva revisión |
| `/api/admin/assets` | POST | Multipart `file`; devuelve `{ url, kind, filename }` con URL Blob real |
| `/api/admin/assets/chunks` | POST | Multipart `file`, `index`, `total`, `uploadId` tras el primero; intermedio `{ uploadId, complete:false }`, final `{ url, kind, filename, complete:true }` |
| `/api/admin/assets/chunks` | DELETE | JSON `{ uploadId }`; cancela únicamente esa carga; devuelve `{ cancelled:true }` |
| `/media/[filename]` | GET | Redirección al archivo público registrado, o HTTP 404 |

`getContent()`, `getPublicContent()`, `saveContent(input)` y las funciones de sesión/autenticación son asíncronas. `requireAdmin()` valida la sesión de Better Auth y la relación de administrador antes de mostrar el panel; `requireAdminRequest(request)` hace lo mismo para las rutas privadas y devuelve HTTP 401 si falta la sesión.

## Pruebas y respaldo

Ejecute `npm test`. Las pruebas aplican la misma migración Drizzle a Postgres PGlite en memoria y sustituyen únicamente el servicio Blob; no leen credenciales ni escriben en Neon o Blob reales. Comprueban persistencia del contenido, revisiones concurrentes, bootstrap, sesiones, CSRF, límites y la validación/finalización de archivos.

Las copias de seguridad ahora corresponden a Neon y al almacén Blob. Respaldar una carpeta local no respalda este CMS. Conserve juntos el contenido y el registro de archivos de la base de datos y sus objetos Blob; borrar un objeto rompe las referencias que lo utilicen.
