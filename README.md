# 8 Meses Juntos ∞

Experiencia web romántica premium, mobile-first, construida con React + Vite + TypeScript, Framer Motion, GSAP y React Intersection Observer.

## Comandos

```bash
npm install      # instalar dependencias
npm run dev      # desarrollo → http://localhost:5173
npm run build    # producción → carpeta dist/
npm run preview  # previsualizar el build
```

## Cómo personalizar (todo en 4 archivos)

### 1. Fechas, carta, mapa y música → [src/config/love.ts](src/config/love.ts)
- `startDate`: fecha de inicio de la relación (alimenta el contador en vivo).
- `letter`: encabezado, cuerpo y firma de la carta.
- `firstDate`: coordenadas, lugar y mensaje del mapa.
- `finale`: las líneas del mensaje de cierre.

### 2. Línea de tiempo → [src/data/timeline.ts](src/data/timeline.ts)
8 eventos con fecha, título, descripción, imagen y forma del marco
(`polaroid`, `heart`, `circle`, `elegant`, `square`).

### 3. Frases que llueven → [src/data/phrases.ts](src/data/phrases.ts)

### 4. Carrusel de recuerdos → [src/data/memories.ts](src/data/memories.ts)
Acepta `photo`, `video` (con `videoSrc`) y `message`.

## Reemplazar fotos, música y video

| Qué | Dónde ponerlo |
|---|---|
| Foto principal del hero | `public/photos/hero.svg` → reemplaza por tu `.jpg/.webp` y actualiza la ruta en `love.ts` |
| Foto de fondo de la lluvia de frases | `public/photos/rain-bg.svg` (igual que arriba) |
| Fotos de secciones | `public/photos/p1` … `p12` (actualiza rutas en `timeline.ts`, `memories.ts` y `App.tsx`) |
| Canción | `public/audio/cancion.mp3` (el botón ♪ aparece solo si el archivo existe) |
| Video del carrusel | `public/videos/recuerdo.mp4` |

> Consejo: exporta las fotos a WebP de ~1200 px de ancho máximo para mantener Lighthouse > 90.

## Rendimiento

- Solo el Hero se carga al inicio; cada sección es un chunk independiente (`React.lazy` + `Suspense`) que se descarga al acercarse (IntersectionObserver con margen de 700 px).
- Leaflet (~44 KB gzip) solo se descarga si el usuario llega al mapa.
- Imágenes con `loading="lazy"` y `decoding="async"`.
- Animaciones de partículas/corazones/frases en CSS puro; la lluvia de frases se pausa al salir de pantalla.
- `prefers-reduced-motion` respetado en todas las animaciones.
