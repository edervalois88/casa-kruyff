# Visor AR "Ver en tu espacio" — Diseño

## Contexto y objetivo

Casa Kruyff quiere que los clientes puedan ver una pieza del catálogo colocada en su propia casa usando la cámara de su teléfono, al estilo de la función "View in Your Room" de Amazon. Hoy el catálogo (`lib/site-data.ts`) solo tiene fotografías 2D de stock; no existe ningún modelo 3D de las piezas.

El origen de los modelos 3D es un flujo interno: el equipo de curaduría de Casa Kruyff (no el cliente final que compra) sube varias fotografías en alta definición de una pieza ya existente en el catálogo, y un servicio de IA (Meshy.ai) convierte esas fotos en un modelo 3D (`.glb`). Este es un proceso que se hace una vez por pieza, no algo que dispara el comprador.

## Alcance

**Dentro de alcance:**
- Página interna protegida por contraseña para subir fotos y generar el modelo 3D de una pieza.
- Integración server-side con la API de Meshy.ai (Image-to-3D).
- Almacenamiento persistente del modelo generado en Vercel Blob.
- Botón "Ver en tu espacio" en `/piezas/[id]` que abre un visor AR (`<model-viewer>`) cuando existe un modelo para esa pieza.
- Soporte Android (Scene Viewer, vía `.glb`) garantizado desde el día uno.

**Fuera de alcance (por ahora):**
- Que el cliente final suba sus propias fotos (de su mueble o su espacio).
- Panel de administración con base de datos completa, roles de usuario, o historial de versiones de modelos.
- Soporte iOS (AR Quick Look) garantizado — depende de si Meshy entrega `.usdz` directamente (ver "Preguntas abiertas").
- Generación en lote de las 9 piezas actuales (se hacen una por una, a mano, vía la herramienta).

## Costos (Meshy.ai, referencia sep-2026)

- 20 créditos por generación estándar Image-to-3D.
- Plan Pro: $20 USD/mes, 1,000 créditos (~50 generaciones), incluye acceso a API y propiedad privada del modelo (sin atribución obligatoria — necesario para uso comercial). Primer mes con 50% de descuento.
- Las 9 piezas actuales caben cómodamente en un solo mes del plan Pro (180 de 1,000 créditos).

## Arquitectura

### Componentes nuevos

1. **`/admin/modelos`** (ruta protegida): formulario para elegir una pieza existente del catálogo y subir 3–8 fotos.
2. **API route `/api/admin/generate-model`**: recibe las fotos, llama a la API de Meshy Image-to-3D (API key server-side, nunca expuesta al navegador), hace polling del estado de la tarea hasta completarse o expirar (timeout ~5 min), descarga el `.glb` resultante.
3. **Vercel Blob**: almacenamiento persistente del archivo `.glb` (y `.usdz` si aplica). Necesario porque el filesystem de las funciones serverless de Vercel no persiste entre despliegues.
4. **`models.json`** (también en Vercel Blob): mapa ligero `{ [pieceId]: { glbUrl, usdzUrl?, createdAt } }`. Actúa como "base de datos" mínima — se lee en cada visita a `/piezas/[id]` (o se cachea con revalidación corta) sin necesitar una base de datos real.
5. **`components/ArViewer.tsx`**: envuelve `<model-viewer>` (web component de Google), mostrando el botón "Ver en tu espacio" solo si hay un modelo para esa pieza. En Android abre Scene Viewer directo; en iOS usa AR Quick Look si hay `.usdz`, o si no, cae a un visor 3D interactivo en pantalla (rotar/zoom, sin AR en vivo).

### Autenticación de `/admin/modelos`

Contraseña compartida simple vía variable de entorno (`ADMIN_MODELS_PASSWORD`), sin sistema de usuarios. Suficiente para un equipo pequeño; no diseñado para escalar a múltiples roles.

### Flujo paso a paso

1. El equipo entra a `/admin/modelos` y mete la contraseña.
2. Elige la pieza del catálogo (dropdown con las piezas de `PIECES`).
3. Sube 3–8 fotos (recomendación en pantalla: distintos ángulos, fondo simple, buena luz).
4. Clic en "Generar modelo 3D" → barra de progreso mientras Meshy procesa (1–3 min típico).
5. Al terminar, preview del modelo 3D directo en la página antes de confirmar.
6. Confirma → se sube a Vercel Blob, se actualiza `models.json`, el botón AR aparece en el sitio público sin necesidad de deploy.

### Manejo de errores

- Timeout o fallo de Meshy → mensaje de error claro, nada se guarda a medias, se puede reintentar.
- Generar un modelo nuevo para una pieza que ya tiene uno → pide confirmación antes de reemplazar.
- Pieza sin modelo generado → la ficha de producto se ve exactamente igual que hoy, sin botón AR. Cero impacto en piezas sin modelo.

## UI en `/piezas/[id]`

El botón "Ver en tu espacio" aparece junto a "Añadir a cotización" y "Agendar cita privada", con el mismo lenguaje visual del sitio (Montserrat uppercase, mismos colores). Solo se renderiza si `models.json` tiene una entrada para esa pieza.

## Preguntas abiertas / riesgos

1. **USDZ para iOS**: hay que confirmar en la implementación si Meshy entrega `.usdz` directamente en su respuesta de API, o si hace falta un paso de conversión `.glb → .usdz` aparte (herramienta adicional). Si no hay `.usdz` de entrada, Android funciona completo desde el día uno; iOS muestra el modelo 3D interactivo pero sin el gesto nativo de AR Quick Look hasta resolver la conversión.
2. **Calidad del modelo generado**: la calidad de un modelo generado por IA a partir de fotos varía según la pieza (materiales reflejantes, formas muy finas, texturas complejas pueden salir peor). Se recomienda revisar visualmente cada modelo antes de confirmarlo (paso 5 del flujo ya contempla esto).
3. **Pruebas**: el comportamiento AR no se puede verificar bien en navegador de escritorio — se requiere probar en un iPhone y un Android reales antes de dar la función por terminada.

## Pruebas

- Verificación manual del flujo de generación end-to-end con al menos una pieza real.
- Verificación manual en un dispositivo iOS y uno Android reales de que el botón AR funciona (o cae correctamente al visor 3D interactivo si no hay `.usdz`).
- Verificar que piezas sin modelo no muestran el botón y no rompen la página.
