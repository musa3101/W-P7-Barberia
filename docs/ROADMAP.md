# Roadmap — Proyecto Web P7 Barber Master Studio

## Fase 1 — Estudio y Planificación (COMPLETADA)
- [x] Instalación del Setup de Musa 2.0 y control de ramas en `dev`.
- [x] Análisis del esquema Freeform de Musa y dirección artística ("Esmeralda & Oro" + Crema + Carbono).
- [x] Creación de `docs/DESIGN.md`, `PRODUCT.md` y `docs/DATOS_OFICIALES_NEGOCIO.md`.

---

## Fase 2 — Boceto Base y Traspaso a `web/v1/` (COMPLETADA)
- [x] Selección tipográfica (**Boska** + **General Sans**).
- [x] Recorte del logo P7 a PNG transparente y optimización de imágenes/vídeos a AVIF/WebP/MP4.
- [x] Maquetación modular (`src/`) y compilación de `index.html` con `scripts/build.py`.
- [x] Traspaso oficial del proyecto a **`web/v1/`** y repositorio conectado a `https://github.com/musa3101/W-P7-Barberia`.

---

## Fase 3 — Pulido Sección por Sección y Auditoría Móvil (COMPLETADA)
- [x] **Hero Principal (`01-hero.html`):**
  - [x] Video background nítido sin marcos, título centrado "Precisión en cada corte." y botón directo "Reservar cita".
  - [x] Corrección `100lvh` en móvil para ocultar 100% la cinta y la bandera de Colombia bajo el pliegue inicial en iPhone Safari.
- [x] **Cinta Editorial Recta:**
  - [x] Marquee fluido GPU continuo en negro carbono `#0b0b0c` con separadores ✦ y bandera colombiana artesanal.
- [x] **Sección 02 — "Sobre nosotros" + Galería 1 + Página "Nuestro equipo" (`equipo.html`):**
  - [x] Slider automático infinito Galería 1 adaptado de `21st.dev` (HTML/CSS puro).
  - [x] Botón **Liquid Glass** y página `equipo.html` con 3 barberos y revelado 3D + parallax al scroll.
- [x] **Sección 03 — "Nuestro trabajo" + Galería 2 + Página `galeria.html` (Galería 3) + Carta de Precios:**
  - [x] Galería 2 (`ExpandableGallery` con 6 trabajos reales en foto/vídeo y Lightbox sin controles de vídeo).
  - [x] Página `galeria.html` (`StaircaseCarousel` infinito con 26 trabajos reales y controles táctiles).
  - [x] Integración de botón visible "← Volver atrás" y memoria de navegación compatible con `bfcache` en Safari iOS.
  - [x] Desplegable **Lista de precios** estilo póster suizo full-bleed (`100vw`) con autocierre inteligente al hacer scroll.
- [x] **Sección 04 — "Reseñas":**
  - [x] Eliminada como sección independiente para evitar citas inventadas; integrada prueba social verificada (`5,0 ★ · 296 reseñas en Booksy`).
- [x] **Sección 05 — "Contacto" + "¿Dónde estamos?" + "Preguntas frecuentes":**
  - [x] Bloques gemelos *Información del local* (`#EFE6D5`) y *Reserva tu hora* (`#0B2E22`).
  - [x] Banda carbono (`#111112`) con mapa limpio centrado `¿Dónde estamos?` y acordeón de 6 FAQs con animación `BlurredStagger` + CTA a WhatsApp.
- [x] **Pie de página — Halftone Wordmark Footer:**
  - [x] Canvas 2D interactivo con partículas reactivas, enlace oficial a MYNEXT y botón Volver arriba ↑.
  - [x] Unificación de color a negro carbono `#0b0b0c` en `html`, `body` y `<meta name="theme-color">` eliminando franjas verdes en iOS Safari.
- [x] **Páginas Legales:**
  - [x] Creadas `aviso-legal.html`, `privacidad.html` y `cookies.html` enlazadas con `assets/css/legal.css` y botón de retorno al footer.
- [x] **Auditoría Técnica 360° (Playwright CLI + TestSprite):**
  - [x] 36/36 pases en Playwright sin desbordamientos en iPhone 14, Pro Max, SE, iPad y Desktop.
  - [x] 14/14 pases en TestSprite con API Key global actualizada. Cero archivos residuales en `web/v1/`.
- [x] **Rediseño de Paleta Oficial del Logo P7 y Pulido Editorial (22/11/2026):**
  - [x] Sustitución completa de la paleta verde esmeralda por los tonos oficiales del logo (`#0A0909`, `#0B0702`, `#242423`, `#AC986C`, `#C3B9A0`, `#9D9B95`, `#FDFDFC`, `#F6F5F5`) + acento Brick Red (`#C1091E`).
  - [x] Unificación de botones Liquid Glass transparentes con bordado rojo `#C1091E` en toda la web (incluido Hero) y variante amarilla en Booksy.
  - [x] Bandas full-bleed editoriales en Piedra Champán Mate para *Cómo se trabaja en P7* y *Contacto*; *Lista de precios* (plantilla Pinterest) en Champán Arena `#C3B9A0` con tinta Carbón `#0A0909`.
  - [x] Mapa blanco proporcionado (`880px` × hasta `460px`), FAQ centrada con las 6 preguntas cerradas por defecto y separadores Bandera de Colombia restaurados.
  - [x] Galería 3 móvil limpia (solo botón *Volver* en header, sin menú ni botón inferior, swipe horizontal/diagonal sin bloquear el scroll vertical).
  - [x] **Pulido Móvil/Tablet + Galería 1 Real + Equipo `21st.dev` (22/11/2026 noche):**
    - [x] Hero móvil `calc(100lvh + 76px)` limpio y vídeo Hero en autoplay/bucle continuo garantizado.
    - [x] Menú móvil y tablet (`< 1024px`) migrado a `StaggeredMenu` pantalla completa (React Bits) con icono Instagram y botón Liquid Glass; escritorio (`≥ 1024px`) con `Curved Menu`.
    - [x] Galería 1 actualizada con 2 fotos y 4 clips reales en bucle (AVIF/WebP/MP4) + lightbox limpio sin controles ni marcos.
    - [x] Página `equipo.html` rediseñada con carrusel `TeamMemberCard` (`Cormorant Garamond` + `Plus Jakarta Sans`), enlaces a Instagram y versión móvil compacta.
    - [x] Footer móvil ampliado (`548px`) sin solape con `VOLVER ARRIBA ↑` y desplegado en `main` (`daa776f`).
  - [x] **Sistema Tipográfico v2 + Paleta Bandera Colombia + Autoplay Hero iOS + Retrato Real de Manu + Pulido Crema (23/11/2026):**
    - [x] Migración completa de las 7 páginas a **`Fraunces`** + **`IBM Plex Mono`** + **`Switzer`** (regla blindada en `docs/DESIGN.md`), eliminando `@import` duplicados y fuentes heredadas.
    - [x] Ampliación oficial de paleta con tokens `--p7-colombia-yellow` (`#FCD116`), `--p7-colombia-blue` (`#003893`) y `--p7-colombia-red` (`#C1091E`).
    - [x] Guardián de autoplay continuo del vídeo Hero en iOS Safari (`assets/js/site.js`).
    - [x] Contraste "blanco hueso" (`#E8E5DF`), footer legible (`≥ 12px`, `opacity: 1`), corrección de compresión móvil y retrato real de Manu en `equipo.html`.
    - [x] Pulido de secciones sobre crema (*Cómo se trabaja en P7* y *Contacto*) con bordes negros y logo limpio (`logo-p7-crema-512w.webp`). Desplegado en `main` (`2c45d72`).

---

## Fase 4 — Próximos Pasos (Fase 4 y Futuras)
- [ ] **Integración de Setmore (PRÓXIMA SESIÓN):**
  - [ ] Conectar la configuración/enlaces de Setmore que está preparando Musa en el flujo de reserva online y verificarlo en móvil y desktop.
- [ ] **Retoque del Preloader / Loading (en carpeta aparte `web/loading/`):**
  - [ ] Pulir diseño y animación en `web/loading/` antes de decidir su integración definitiva.
- [ ] **Sustitución de datos provisionales:** Fotos de alta resolución de Manu / barberos reales en caso de que aporten nuevo material fotográfico.
- [ ] **Migración a Astro + Backend con InsForge + idiomas `EN` / `DE` (TRAS EL OK DEL CLIENTE):**
  > [!IMPORTANT]
  > **RECORDATORIO OBLIGATORIO PARA CUALQUIER SESIÓN FUTURA:** En cuanto Musa diga que ya enseñó el demo al cliente y que **le gustó / vamos a trabajar en el proyecto en serio**, recordar inmediatamente dar el **salto a Astro** antes de activar `EN`/`DE` e **InsForge** (para unificar Header/Footer, tener rutas SEO `/es/`, `/en/`, `/de/` y modularizar el código).
  - [ ] Migrar la v1 aprobada (HTML/CSS/JS) a **Astro** (Cloudflare Pages).
  - [ ] Conectar contratos `*-data.js` con **InsForge** y activar multiidioma `ES` / `EN` / `DE` con URLs separadas.
