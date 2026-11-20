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

## Fase 3 — Pulido Sección por Sección (EN CURSO)
*Flujo: laboratorio aislado `web/seccion <nombre>/` → auditoría mobile-first → integración en `web/v1/` y `scripts/build.py`.*

- [x] **Sección 02 — "Sobre nosotros" + Galería 1 + Página "Nuestro equipo" (`equipo.html`):**
  - [x] Slider automático infinito Galería 1 adaptado de `21st.dev` (HTML/CSS puro).
  - [x] Botón **Liquid Glass** guardado en `x/componentes/liquid-glass-button/`.
  - [x] Página `equipo.html` con 3 barberos y revelado 3D + parallax al scroll.
- [x] **Sección 03 — "Nuestro trabajo" + Galería 2 + Página `galeria.html` (Galería 3) + Carta de Precios:**
  - [x] Galería 2 (`ExpandableGallery` con 6 trabajos reales en foto/vídeo y Lightbox sin controles de vídeo).
  - [x] Página `galeria.html` (`StaircaseCarousel` infinito con 26 trabajos reales y soporte táctil móvil).
  - [x] Bloque editorial *"Cómo se trabaja en P7"* con moneda/escudo P7 giratorio 3D 360°.
  - [x] Desplegable **Lista de precios** estilo póster suizo full-bleed (`100vw`) con autocierre inteligente al hacer scroll.
- [x] **Sección 04 — "Reseñas":**
  - [x] Eliminada como sección independiente para evitar citas inventadas; integrada prueba social verificada (`5,0 ★ · 296 reseñas en Booksy`).
- [x] **Sección 05 — "Contacto" + "¿Dónde estamos?" + "Preguntas frecuentes":**
  - [x] Bloques gemelos *Información del local* (`#EFE6D5`) y *Reserva tu hora* (`#0B2E22`).
  - [x] Banda carbono (`#111112`) con mapa limpio centrado `¿Dónde estamos?` y acordeón de 6 FAQs con animación `BlurredStagger` + CTA a WhatsApp.
- [ ] **Próxima Sesión — Bloque `Hero` + `Header` + `Footer` + `Legales`:**
  - [ ] **Hero (`01-hero.html`):** Pulido visual, tipográfico y vídeo en bucle (escritorio y móvil).
  - [ ] **Header (`src/header.html`):** Pulido de barra de navegación principal y menú móvil (y unificación con `equipo.html` y `galeria.html`).
  - [ ] **Footer (`src/footer.html`):** Rediseño del pie de página y enlaces (y unificación con `equipo.html` y `galeria.html`).
  - [ ] **Legales:** Creación de páginas/modales de Aviso Legal, Política de Privacidad y Política de Cookies.
- [ ] **Sustitución de datos provisionales pendientes:** Teléfono definitivo, Gmail oficial y fotos reales de Galería 1 / retratos del equipo.
- [ ] **Backend con InsForge e idiomas `EN` / `DE`:** Conectar contratos `*-data.js` y activar selector multiidioma al cerrar la v1 en español.

---

## Fase 4 — Despliegue y Producción en Cloudflare Pages (EN CURSO)
- [x] Primer despliegue en producción conectado a GitHub (`W-P7-Barberia`, rama `main`) en Cloudflare Pages para pruebas reales en móvil.
- [ ] Auditoría final de Lighthouse (Rendimiento, Accesibilidad, Buenas Prácticas y SEO ≥ 95) tras terminar Hero, Header, Footer y Legales.
