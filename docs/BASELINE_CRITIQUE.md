# Auditoría de Estado de Partida (Baseline Critique) — `x/v1/index.html`

**Fecha:** 2026-11-18  
**Objetivo:** Línea base previa a la Fase 2 (rediseño/pulido editorial con `taste-skill-v2` + `impeccable critique`).  
**Archivo auditado:** [`x/v1/index.html`](file:///Users/musa/Documents/PROJ%20recientes/webs/v1-P7/x/v1/index.html)  
**Captura de referencia revisada:** `media_1795026275774_aa5ad2c1.png` (vista desktop del Hero + Header).

---

## 1. Salida Exacta del Linter (`taste-skill-v2/scripts/lint.mjs`)

Comando ejecutado:
```bash
cd "/Users/musa/Documents/PROJ recientes/webs/v1-P7/x/v1" && node /Users/musa/.gemini/config/skills/taste-skill-v2/scripts/lint.mjs index.html
```

Salida exacta (código de salida `1`):
```text
TASTESKILL · LINT   1 file(s)

FAIL
  [emoji] Emoji used as UI.  (31×)
      index.html:7  ★
      index.html:243  ★
      index.html:287  ★
      index.html:338  ★
      index.html:426  ★
      index.html:552  ★
      … 25 more
  [gradient] Gradient fill. Use a flat colour or a real image (a neutral scrim over a photo is the one exception).  (19×)
      index.html:70  linear-gradient(
      index.html:96  linear-gradient(
      index.html:106  linear-gradient(
      index.html:129  radial-gradient(
      index.html:130  radial-gradient(
      index.html:276  radial-gradient(
      … 13 more
  [shadow] Shadow. Elements at rest carry none; only real overlays (menu, dialog, sticky bar) may.  (41×)
      index.html:102  box-shadow:
      index.html:162  shadow-lg
      index.html:194  shadow-md
      index.html:240  shadow-lg
      index.html:284  shadow-lg
      index.html:294  shadow-[0_15px_40px_rgba(0,0,0,0.85)]
      … 35 more
  [gradient-text] Gradient / clipped text. Use solid colour.  (1×)
      index.html:107  background-clip: text
  [hairline] Thin rule / divider line. Separate with space, tone or scale; lines belong to real tables and form fields.  (28×)
      index.html:157  border-b
      index.html:209  border-b
      index.html:234  border-t
      index.html:407  h-px
      index.html:444  border-t
      index.html:485  border-t
      … 22 more
  [micro-label] Tiny uppercase letter-spaced label.  (50×)
      index.html:194  hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-
      index.html:286  text-xs sm:text-sm font-medium tracking-wider uppercase text-gold-300
      index.html:338  text-xs uppercase tracking-widest text-cream-100 font-semibold
      index.html:346  text-xs uppercase tracking-widest text-cream-100 font-semibold
      index.html:352  text-xs uppercase tracking-widest text-cream-100 font-semibold
      index.html:393  font-stamp text-xs text-gold-300 uppercase tracking-widest block
      … 44 more

WARN
  [glass] Backdrop blur. One sticky bar at most; glass cards are a tell.  (7×)
      index.html:157  backdrop-blur
      index.html:208  backdrop-blur
      index.html:333  backdrop-blur
      index.html:1226  backdrop-blur
      index.html:1322  backdrop-blur
      index.html:1352  backdrop-blur
      … 1 more
  [transition-all] transition: all. Name the properties (transform, opacity).  (21×)
      index.html:157  transition-all
      index.html:188  transition-all
      index.html:189  transition-all
      index.html:190  transition-all
      index.html:194  transition-all
      index.html:236  transition-all
      … 15 more
  [outlined-box] A 1px outlined box. Prefer a filled surface or no box.  (3×)
      index.html:187  border
      index.html:715  border
      index.html:716  border
  [h-screen] 100vh jumps on mobile. Use 100svh / 100dvh.  (1×)
      index.html:208  h-screen
  [bounce] Looping attention animation (bounce / ping / pulse dot).  (2×)
      index.html:285  animate-pulse
      index.html:1029  animate-ping
  [copy] Stock marketing phrase. Say the specific thing the product does.  (1×)
      index.html:1563  Seamless

RESULT: 170 FAIL, 35 WARN — fix the FAILs before rendering.
```

---

## 2. Puntuación Inicial Estimada (sobre 10)

| Bloque | Puntuación | Diagnóstico Breve |
| :--- | :---: | :--- |
| **Primera Impresión** | **5.5 / 10** | La identidad cromática esmeralda y oro transmite barbería clásica, pero el Hero en la captura (`media_1795026275774_aa5ad2c1.png`) aparece verticalmente sobrecargado: la píldora pulsante, el escudo central duplicado (ya visible en el header) y el bloque de texto empujan los botones CTA y la barra de garantías fuera del primer pantallazo. |
| **Tipografía** | **6.0 / 10** | La combinación `Boska` + `General Sans` + `Rye` es acertada para el sector, pero está saturada por **50 micro-etiquetas** en `uppercase tracking-widest`, uso de `Rye` (`font-stamp`) en textos de maqueta (`"Subsección · Galería 1"`, `"Subsección · Carta de Servicios en HTML"`) y **31 emojis `★`** usados como elemento UI. |
| **Color / Contraste** | **6.5 / 10** | El contraste base (`#0F3D2E` / `#0B2E22` con `#F8F1E4` y `#F1D592`) es legible, pero la estética se degrada por **19 gradientes** (`bg-gold-metallic`, `radial-gradient`, `paper-parchment` con trama de puntos), **1 uso de `gradient-text`** y tarjetas con bordes dorados finos + sombras pesadas. |
| **Composición / Ritmo** | **5.0 / 10** | Ritmo monótono y simétrico de plantilla: casi todas las secciones repiten `py-16 lg:py-24` con grids uniformes de 3 columnas (`rounded-2xl border border-gold-500/35 shadow-xl`), **28 líneas divisorias** (`border-t`/`border-b`/`h-px`) y separadores SVG centrados redundantes. |
| **Movimiento / Interacción** | **4.5 / 10** | Predominan animaciones de relleno (`animate-pulse`, `animate-ping`, Ken Burns 24s sobre imagen de respaldo detrás de un vídeo), **21× `transition-all`** sin propiedades específicas, `h-screen` en el menú móvil y ausencia de cierre por tecla `Escape` o gestión de foco en modales. |
| **Media Global** | **5.5 / 10** | Base funcional y multilingüe (ES/EN/DE), pero con clara firma visual de plantilla generada por IA (**170 FAIL / 35 WARN**). |

---

## 3. Los 5 Defectos Principales (Look de Plantilla IA) y Plan de Cambio para Fase 2

### 1. Hero sobrecargado, centrado-cliché y cortado por encima del fold
- **Lo observado (código + captura):** En `media_1795026275774_aa5ad2c1.png`, el header fijo (`h-20`) más el pill badge superior (`animate-pulse`), el escudo circular de `w-36 h-36` (duplicando el logo del header), el sello `BARBER MASTER STUDIO · PALMA`, el `H1` y el subtítulo de 3 líneas consumen toda la altura útil del viewport. Los dos botones CTA (`Reservar Cita`, `Ver Nuestro Trabajo`) y la barra de garantías quedan invisibles debajo del fold.
- **Qué debe cambiar en Fase 2:**
  - Eliminar el escudo duplicado del centro del Hero y el badge-píldora con punto pulsante.
  - Diseñar un Hero de `min-h-[100svh]` más limpio (composición editorial asimétrica o centrada compacta) donde titular, propuesta de valor y CTA principal sean 100% visibles en el primer pantallazo tanto en desktop como en móvil.
  - Quitar el `backdrop-blur-md` de la barra de garantías o integrarla de forma sobria sin aspecto de "glass card".

### 2. Etiquetas de "wireframe / prompt" visibles y abuso de micro-labels + emojis
- **Lo observado:** El código contiene **50 `micro-label`** y **31 emojis `★`**. Varios eyebrows exponen la estructura técnica del prompt al cliente final: `"Subsección · Galería 1"`, `"Portfolio · Galería 2"`, `"Subsección · Carta de Servicios en HTML"`, `"Subsección · Reserva Instantánea 24/7"`. Además, el texto en inglés incluye `"Seamless"` (`copy` warning en línea 1563).
- **Qué debe cambiar en Fase 2:**
  - Reescribir todos los eyebrows en ES/EN/DE con copy editorial real de barbería (cero menciones a "Subsección", "Galería 1/2" o "en HTML") y sustituir `"Seamless"` por una descripción técnica real (ej. `"Zero-gap skin transition"`).
  - Reemplazar los 31 `★` en UI por iconos SVG limpios o texto tipográfico (`5.0 / 5.0`), dejando el código libre de `[emoji]`.
  - Reducir drásticamente los micro-labels `uppercase tracking-widest`, usando jerarquía de tamaño y peso tipográfico en lugar de poner todo en versalitas microscópicas.

### 3. Abuso de sombras en reposo, gradientes metálicos, glassmorphism y líneas divisorias
- **Lo observado:** El linter reporta **41 `shadow`**, **28 `hairline`**, **19 `gradient`** y **7 `backdrop-blur`**. Cada tarjeta, contador, botón y contenedor lleva `shadow-xl`/`shadow-2xl`, bordes `border-gold-500/35` y botones con gradiente animado (`bg-gold-metallic`). La carta de precios usa doble marco (`border-2` + `border`) y una textura de puntos con `radial-gradient`.
- **Qué debe cambiar en Fase 2:**
  - Eliminar las sombras en reposo de tarjetas, contadores, botones y badges; reservar `shadow` únicamente para capas flotantes reales (header sticky, barra móvil inferior fija, tarjeta del mapa, lightbox y modal legal).
  - Sustituir `bg-gold-metallic` y gradientes decorativos por oro sólido calibrado (`#C9A45C` / `#F1D592`) con transición limpia de color/escala en hover.
  - Reducir `backdrop-blur` al máximo (solo header sticky o overlays modales) y sustituir las 28 líneas divisorias (`border-t`/`border-b`) por separación mediante espacio negativo y alternancia de tono (`#0B2E22`, `#0F3D2E`, `#F8F1E4`).

### 4. Composición repetitiva y simetría rígida de tarjetas
- **Lo observado:** El ritmo entre secciones es plano: *Nuestro Equipo* (3 tarjetas iguales), *Nuestro Trabajo* (6 tarjetas iguales en grid 3×2 con gradiente inferior oscuro), *Reseñas* (3 tarjetas iguales), *Contacto y Reserva* (2 bloques equivalentes). Todos comparten el mismo `rounded-2xl`, padding uniforme y separación `py-16 lg:py-24`.
- **Qué debe cambiar en Fase 2:**
  - Introducir variación rítmica real: en *Sobre Nosotros / Equipo*, dar protagonismo editorial al retrato de Manu junto al manifiesto y presentar el atelier con una composición asimétrica en lugar de 3 cards idénticas.
  - En *Nuestro Trabajo*, evitar el gradiente oscuro pesado sobre todas las fotos (usar pies limpios bajo la fotografía o scrim neutro mínimo solo donde haya texto).
  - En *Lista de Precios*, simplificar los marcos concéntricos redundantes manteniendo la estética de carta clásica sobre crema (`#F8F1E4`) con tipografía editorial clara.

### 5. Animaciones cliché e interacción técnica mejorable
- **Lo observado:** Los únicos elementos animados que llaman la atención son dos puntos en bucle infinito (`animate-pulse` en el Hero y `animate-ping` en Contacto), junto con **21 `transition-all`** que afectan rendimiento y predictibilidad. El menú móvil usa `h-screen` (propenso a saltos en iOS/Android) y los modales (`lightbox-modal`, `legal-modal`) no cierran con `Escape`.
- **Qué debe cambiar en Fase 2:**
  - Eliminar por completo `animate-pulse`, `animate-ping` y todos los `transition-all` (reemplazar por propiedades explícitas como `transition-colors`, `transition-transform`, `transition-opacity`).
  - Cambiar `h-screen` por `h-[100dvh]` en el overlay del menú móvil.
  - Añadir cierre con tecla `Escape` y soporte `prefers-reduced-motion` completo para cualquier transición o revelado editorial de scroll.
