# Instagram y visualización 3D/RA

## Publicaciones recientes de Instagram

La portada muestra el perfil insertable oficial configurado en Ajustes del panel
dentro de un iframe, mediante `https://www.instagram.com/{usuario}/embed/`.
Instagram proporciona el contenido y sus publicaciones recientes directamente;
no hay que copiar publicaciones manualmente ni configurar una API o un token.

Mantener la cuenta pública y habilitada la opción de Instagram para insertar el
perfil y las publicaciones en otros sitios. El iframe conserva la interfaz nativa
de Instagram, recortada visualmente a la primera fila de tres publicaciones, sin
su cabecera blanca. El desplazamiento interno está desactivado. El recorte superior
de 137 px se midió en escritorio y móvil; si Instagram cambia su diseño habrá que
ajustarlo en `.ck-instagram-embed`. Los navegadores que bloqueen contenido externo pueden impedir su
carga; el enlace al perfil permanece disponible junto al feed.

La inserción se verificó con las publicaciones reales de la cuenta el 22 de octubre
de 2026. No se guardan credenciales ni se copian imágenes de Instagram al repositorio.

## Motor 3D y realidad aumentada

`components/ArViewer.tsx` carga `@google/model-viewer` al abrir un modelo. Permite
rotación y zoom, y ofrece realidad aumentada cuando el dispositivo la admite.
No se descarga el motor si la pieza no tiene modelo o el visitante no lo abre.

El visor no convierte fotografías en geometría. Hay que generar y revisar cada
modelo con una herramienta 3D y cargarlo desde la sección `3D / RA` del panel.
El panel conserva los originales validados en Vercel Blob y asocia los modelos
guardados a la pieza del catálogo. No se asignan modelos de ejemplo.

Para activar una pieza:

1. Exportar un modelo GLB con texturas incluidas y dimensiones reales en metros.
   USDZ es opcional y se usa en dispositivos Apple compatibles.
2. En el panel, elija la pieza en la sección `3D / RA` y cargue el GLB y, si está
   disponible, el USDZ. El servidor valida los archivos antes de guardarlos.
3. Compruebe rotación, zoom, escala y materiales en la vista previa. Pruebe
   “Ver en tu espacio” en dispositivos compatibles desde HTTPS.

Las piezas sin modelo muestran su estado pendiente. No se convierten fotografías
en geometría ni se asignan modelos de ejemplo. El motor se verificó con un modelo
oficial en una ruta de prueba temporal, incluida la recuperación ante un archivo
inexistente; la RA requiere una prueba final en un teléfono compatible.

Referencia: [model-viewer y realidad aumentada](https://modelviewer.dev/examples/augmented-reality.html).

## Comprobaciones

```sh
npm run lint
npm run build
```

Verificar que el perfil insertado muestre publicaciones reales en escritorio y móvil.
Para 3D/RA, comprobar un modelo válido, el estado sin modelo y el error de carga.
La realidad aumentada requiere una prueba adicional en dispositivos reales compatibles.

### Revisión responsive

La versión pública previa al CMS se comprobó en Chrome con anchos CSS de 320, 390 y
430 píxeles. Se revisaron portada, colecciones, ficha, contacto, diseñadores,
La Casa, interiorismo y Journal. Se corrigieron mínimos de columnas que causaban
desbordamiento en Contacto, La Casa y Journal, y la distribución de nombres y
países en Diseñadores. Las comprobaciones posteriores de ancho no detectaron
scroll horizontal. Se verificaron apertura del menú, cambio EN/ES y navegación.
El feed queda recortado a tres publicaciones sin cabecera blanca.

Estas pruebas son de emulación en Chrome; no sustituyen pruebas en dispositivos
físicos iOS y Android. El envío del formulario y la RA real no se verificaron en
esta revisión visual.
