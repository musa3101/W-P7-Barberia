# Guía de Buenas Prácticas Web Modernas (`modern-web-guidance`)

Consolidación de reglas exactas, citas literales y estrategias de fallback obtenidas mediante `npx -y modern-web-guidance@latest` para el rediseño en `x/v1`.

**Guías recuperadas (`<id>`):**
`lazy-load-video-and-audio`, `html`, `motion`, `scroll-entry-exit-effects`, `dialog`, `light-dismiss-a-dialog`, `prevent-page-scroll-under-modal-dialog`, `animate-to-from-top-layer`, `optimize-image-priority`, `performance`, `visually-stable-font-fallbacks`, `accessibility`.

---

## 1. Vídeo de fondo con `autoplay`, `prefers-reduced-motion` y media responsive

### Reglas clave (`lazy-load-video-and-audio`, `html`, `motion`, `performance`)
- **Vídeos above-the-fold / Hero (LCP)**:
  - **NO** aplicar `loading="lazy"`; omitir `loading` (usa `eager` por defecto) para no retrasar el `poster` ni el arranque del vídeo.
  - Si el `poster` del vídeo es el candidato LCP, precargarlo en `<head>` con `<link rel="preload" as="image" href="..." fetchpriority="high">`.
- **Vídeos below-the-fold**:
  - Añadir `loading="lazy"` junto con `preload="none"` o `preload="metadata"`.
  - **OBLIGATORIO**: especificar atributos enteros `width` y `height` en `<video>` (sin ellos, el tamaño intrínseco es `300×150`, puede causar CLS o no intersectar el viewport).
  - Servir formatos modernos por negociación de `<source>`: `video/webm` primero y `video/mp4` como respaldo.
- **Vídeos de fondo decorativos con `autoplay`**:
  - Deben llevar `autoplay loop muted playsinline` y omitir `controls` (para no ser enfocables).
  - Marcar con `aria-hidden="true"` o `role="none"` **solo** porque al omitir `controls` no son enfocables.
  - **WCAG 2.2.2 (Pause, Stop, Hide)**: cualquier contenido en movimiento automático que dure más de 5 segundos junto a otro contenido necesita un control visible (`<button>`) accesible por teclado para pausar/detener. `prefers-reduced-motion` **no sustituye** a este botón.
  - Si hubiera audio > 3s en autoplay, WCAG 1.4.2 exige control para pausar/detener o ajustar volumen independientemente del SO.
- **Respeto a `prefers-reduced-motion` en JS y CSS**:
  - En JS, escuchar `window.matchMedia('(prefers-reduced-motion: reduce)')`: si `matches === true`, quitar `autoplay` y llamar a `video.pause()` sobre los `video[autoplay]`, y reaccionar al evento `change`.
  - No depender de `@media (prefers-reduced-motion)` solo en CSS para detener un `<video autoplay>`.

### Soporte y Fallback (`lazy-load-video-and-audio`)
- `loading="lazy"` en `<video>`/`<audio>`: **Limited availability** (Chrome 150, Edge 150; sin soporte en Firefox/Safari).
- **Fallback recomendado (Progressive Enhancement)**: combinar `loading="lazy"` con `preload="none"` o `preload="metadata"`. Si se requiere diferir estrictamente el `poster` en navegadores sin soporte, detectar `Object.hasOwn(HTMLMediaElement.prototype, 'loading')` y usar `IntersectionObserver` con `data-poster`, `data-preload` y `data-src` + `media.load()`.

### Citas literales cortas (para divulgación)
- `lazy-load-video-and-audio`: `"Always set explicit width and height attributes on <video> elements. Unloaded videos have a 300×150 intrinsic size and will never load if they do not intersect a visible part of the page."`
- `lazy-load-video-and-audio`: `"DO NOT apply loading=\"lazy\" to above-the-fold or Largest Contentful Paint (LCP) <video> elements, as it delays fetching both the poster image and video data."`
- `html`: `"ensure background videos are muted, provide users with full control over playback, and use role=\"none\" or aria-hidden=\"true\". The controls attribute must also be omitted to make sure the video is not focusable."`

---

## 2. Animaciones al hacer scroll (`scroll-driven animations`, `IntersectionObserver`, rendimiento)

### Reglas clave (`scroll-entry-exit-effects`, `motion`)
- **Propiedades en compositor**: animar únicamente `opacity` y `transform` (o propiedades individuales como `translate`, `scale`, `rotate`) para mantenerse en el *compositor thread*. Evitar animar `width`, `height`, `top`/`left`.
- **Scroll-Driven Animations nativas**:
  - Usar `animation-timeline: view()` (anónimo cuando el elemento rastreado es el mismo que se anima) y `animation-range: entry, exit` (o un único `@keyframes` con selectores `entry 0%`, `entry 100%`, `exit 0%`, `exit 100%` y `animation-fill-mode: both`).
  - **Orden obligatorio**: declarar `animation-timeline` y `animation-range` **después** del shorthand `animation` para que el shorthand no los reinicie.
  - Envolver la regla CSS en `@media (prefers-reduced-motion: no-preference)` y `@supports ((animation-timeline: view()) and (animation-range: entry))`.
  - **OBLIGATORIO incluir `(animation-range: entry)`** en `@supports` para filtrar navegadores con soporte parcial.
- **Reduced motion (`motion`)**:
  - Usar `@media (prefers-reduced-motion: no-preference)` cuando la estrategia sea **no tener animación** (partir del estado estático visible por defecto, nunca dejar elementos atrapados en `opacity: 0`).
  - Usar `@media (prefers-reduced-motion: reduce)` solo cuando se ajustan parámetros (p. ej. ralentizar o acortar duración).
  - **PROHIBIDO** aplicar globalmente `animation-duration: 0.01ms;`.
  - Nunca superar 3 destellos por segundo (WCAG 2.3.1), ni siquiera dentro de `no-preference`.

### Soporte y Fallback (`scroll-entry-exit-effects`)
- Scroll-driven animations: **Newly available** (Baseline desde 2026-10-27: Chrome 115, Edge 115, Firefox 159, Safari 26).
- **NO usar** `scroll-timeline-polyfill` (incompleto y con errores conocidos).
- **Fallback**:
  - Si la animación es meramente decorativa: **Progressive Enhancement** sin fallback JS.
  - Si se requiere efecto en navegadores antiguos: usar `IntersectionObserver` solo cuando `!CSS.supports('(animation-timeline: view()) and (animation-range: entry)') && matchMedia('(prefers-reduced-motion: no-preference)').matches`.

### Citas literales cortas (para divulgación)
- `scroll-entry-exit-effects`: `"The (animation-range: entry) check MUST be included here, to filter out browsers with only partial support."`
- `scroll-entry-exit-effects`: `"DO NOT use the scroll-timeline-polyfill package for the fallback strategy as it is not feature complete and has a lot of known issues."`
- `motion`: `"Use @media (prefers-reduced-motion: no-preference) when the reduced-motion strategy is to not have the animation at all"`
- `motion`: `"DO NOT globally apply animation-duration: 0.01ms; as it can cause certain animations to become more jarring."`

---

## 3. Modal / Lightbox con `<dialog>` nativo y light dismiss

### Reglas clave (`dialog`, `light-dismiss-a-dialog`, `prevent-page-scroll-under-modal-dialog`, `animate-to-from-top-layer`)
- **Semántica y apertura**:
  - Usar `<dialog>` nativo abierto con `dialog.showModal()` (o declarativamente `command="show-modal" commandfor="..."` en `<button>`). Nunca usar `show()` ni el atributo `open` para modales.
  - **NO** añadir `role="dialog"`, `aria-modal`, focus traps manuales, toggling de `inert` ni handlers propios de `Esc` (el navegador ya los gestiona en `showModal()`).
  - Nombrar siempre con `aria-labelledby` (apuntando al título del modal) o `aria-label`.
  - Incluir siempre un botón visible de cierre (`<button>` con nombre accesible o `<form method="dialog">`).
  - No poner `display: flex/grid/block` incondicional sobre `dialog`; acotarlo siempre a `dialog[open]`.
  - En el evento `close`, leer `dialog.returnValue` y resetearlo inmediatamente (`dialog.returnValue = ''`) para evitar valores obsoletos.
- **Light Dismiss (`closedby`)**:
  - Añadir `closedby="any"` al `<dialog>` para permitir cierre al hacer clic fuera (backdrop) además de `Esc`.
- **Bloqueo de scroll del fondo (`prevent-page-scroll-under-modal-dialog`)**:
  - **PROHIBIDO** aplicar `overflow: hidden` o `position: fixed` a `<html>` o `<body>` (elimina el scrollbar, causa CLS horizontal y rompe `position: sticky`).
  - Usar CSS puro en top-layer:
    ```css
    dialog:modal { overscroll-behavior: contain; }
    dialog::backdrop { overflow: hidden; overscroll-behavior: contain; }
    ```
  - `overflow: hidden` en `dialog::backdrop` es **obligatorio** porque `::backdrop` tiene `overflow: visible` por defecto y si no es contenedor de scroll ignora `overscroll-behavior`.
- **Animación entrada/salida en Top Layer (`animate-to-from-top-layer`)**:
  - Transicionar `opacity, transform, display, overlay` (colocando `transition-behavior: allow-discrete;` en declaración **separada**, nunca dentro del shorthand `transition` para no romper navegadores antiguos).
  - Definir el estado inicial de entrada con `@starting-style` dentro/después de `dialog[open]` y `dialog[open]::backdrop`.
  - Aplicar `transform: scale(...)` solo dentro de `@media (prefers-reduced-motion: no-preference)`, y acortar `transition-duration` en `reduce`.

### Soporte y Fallbacks
1. **`closedby="any"`** (`dialog`, `light-dismiss-a-dialog`): **Limited availability** (Chrome 134, Edge 134, Firefox 141; sin soporte en Safari).
   - **Fallback obligatorio**: detectar `!('closedBy' in HTMLDialogElement.prototype)`. Comprobar coordenadas `getBoundingClientRect()` usando `pointerdown` + `pointerup` fuera del rectángulo (no confiar solo en `event.target === dialog` porque el padding del `<dialog>` también tiene `event.target === dialog`, y usar `pointerdown`+`pointerup` evita cerrar al arrastrar una selección de texto hacia el backdrop).
2. **`overscroll-behavior` en contenedores no desplazables** (`prevent-page-scroll-under-modal-dialog`): **Limited availability** (Chrome 144, Edge 144, Firefox 150; sin soporte en Safari).
   - **No** detectar con `@supports (overscroll-behavior: contain)`. Tratar como **Progressive Enhancement** (en Safari sigue conteniendo scroll si el contenido del diálogo desborda).
3. **`overlay` y `transition-behavior: allow-discrete` en `display`** (`animate-to-from-top-layer`): **Limited availability** (`overlay` solo Chrome/Edge 117+; Firefox 129+ parsea `allow-discrete` pero no transiciona `display`).
   - **Fallback**: la entrada con `@starting-style` funciona en CSS puro (Baseline 2024-08-06). Para animar la salida en Firefox/Safari, sondear `canTransitionDisplay()` + `CSS.supports('overlay', 'auto')` y, si falta soporte, usar atributo `data-closing`, esperar `element.getAnimations({ subtree: true })` y llamar a `dialog.close()` interceptando `cancel` con `event.preventDefault()`.
4. **Invoker Commands (`command` / `commandfor`)** (`dialog`): **Newly available** (Baseline 2025-12-12). Si se usan, cargar `invokers-polyfill` solo si `!('commandForElement' in HTMLButtonElement.prototype)` (o usar `addEventListener` con `showModal()` directamente).

### Citas literales cortas (para divulgación)
- `dialog`: `"DON'T add role=\"dialog\", aria-modal, a focus trap, inert toggling or an Esc handler."`
- `light-dismiss-a-dialog`: `"For browsers that do not yet support closedby, you must implement a fallback for light-dismiss by checking if a click occurred outside the dialog content's boundaries"`
- `prevent-page-scroll-under-modal-dialog`: `"Set overflow: hidden (or overflow: auto) on dialog::backdrop so that it becomes a scroll container. Without this declaration ::backdrop defaults to overflow: visible and overscroll-behavior will have no effect."`
- `animate-to-from-top-layer`: `"DO NOT: Use allow-discrete in the transition shorthand — it will make older browsers ignore the entire transition declaration."`

---

## 4. Rendimiento LCP, imágenes responsive y fuentes web

### Reglas clave (`optimize-image-priority`, `performance`, `html`, `visually-stable-font-fallbacks`, `accessibility`)
- **Prioridad y descubrimiento LCP**:
  - Declarar la imagen LCP directamente en el HTML inicial (`<img>` o `<picture>`), no inyectada por JS/CSS, para que el *preload scanner* la descubra de inmediato.
  - Aplicar `fetchpriority="high"` únicamente a 1–2 imágenes críticas (la imagen LCP). **Nunca** combinar `fetchpriority="high"` con `loading="lazy"`.
  - **NO** usar `loading="lazy"` en imágenes above-the-fold.
  - Para imágenes above-the-fold inicialmente ocultas (slides ocultos de carrusel, megamenús): usar `fetchpriority="low"` (y opcionalmente `loading="lazy"`).
  - Para imágenes estándar below-the-fold: usar solo `loading="lazy"` (sin `fetchpriority="low"`, para que carguen a prioridad normal al acercarse al viewport).
  - Omitir `fetchpriority` cuando se quiera prioridad normal (evitar `fetchpriority="auto"` y el obsoleto `importance`).
- **Imágenes responsive (`<picture>`, `srcset`, `sizes`, CLS)**:
  - Usar `<picture>` con `<source type="image/avif">` y `<source type="image/webp">` antes del `<img>` de respaldo (JPG/PNG/WebP), y `media="(max-width: ...)"` si hay *art direction* distinta en móvil/desktop.
  - Incluir siempre `sizes` cuando se use `srcset` con descriptores `w` (sin `sizes`, el navegador asume `100vw`).
  - Especificar siempre `width` y `height` explícitos en `<img>` (y en `<source>` si cambia el aspect ratio) para evitar CLS.
  - Incluir siempre `alt` descriptivo, o `alt=""` si es puramente decorativa.
- **Fuentes web (`performance`, `visually-stable-font-fallbacks`)**:
  - Precargar solo fuentes críticas visibles above-the-fold: `<link rel="preload" href="..." as="font" type="font/woff2" crossorigin>`. Incluir `crossorigin` **siempre**, incluso en mismo origen.
  - **NO** añadir `fetchpriority="high"` a fuentes (ya cargan con prioridad alta por defecto) ni precargar todas las fuentes.
  - Usar subconjuntos (*subsetting*) de fuentes (`woff2`) para reducir peso.
  - Aplicar `font-size-adjust: from-font;` en contenedores de texto para igualar la *x-height* del fallback y eliminar saltos de layout (CLS) al intercambiar fuentes.
- **CSS / JS / CRP (`performance`)**:
  - No usar `@import` en CSS.
  - Usar `type="module"` o `defer` en scripts no críticos; evitar scripts bloqueantes en `<head>`.
  - En páginas largas con secciones complejas off-screen, valorar `content-visibility: auto` emparejado con `contain-intrinsic-size: auto ...` (no usar en contenido above-the-fold ni en páginas simples).

### Soporte y Fallbacks
- `fetchpriority`: **Newly available** (Baseline 2024-10-29). Progressive enhancement (navegadores antiguos lo ignoran).
- `font-size-adjust: from-font`: **Newly available** (Baseline 2024-07-25: Chrome 127, Edge 127, Firefox 118, Safari 17). Fallback opcional en `@font-face`: `size-adjust`, `ascent-override`, `descent-override`.

### Citas literales cortas (para divulgación)
- `optimize-image-priority`: `"Do not use fetchpriority=\"low\" on standard below-the-fold images that are already using loading=\"lazy\". These images should load at normal priority once they enter the viewport."`
- `performance`: `"DO preload critical fonts: Use <link rel=\"preload\" as=\"font\" type=\"font/woff2\" crossorigin> for fonts seen above the fold. Do include the crossorigin attribute for all fonts (even same origin fonts)."`
- `performance`: `"DON'T omit the sizes attribute when using srcset: Without sizes, the browser assumes 100vw and downloads the largest available image."`
- `visually-stable-font-fallbacks`: `"Use the from-font keyword to let the browser extract the ratio from your primary web font."`
