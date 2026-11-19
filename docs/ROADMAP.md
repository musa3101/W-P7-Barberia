# Roadmap — Proyecto Web P7 Barber Master Studio

## Fase 1 — Estudio y Planificación (COMPLETADA)
- [x] Instalación del Setup de Musa 2.0 y control de ramas en `dev`.
- [x] Análisis del esquema Freeform de Musa y dirección artística ("Esmeralda & Oro" + Crema).
- [x] Creación de `docs/DESIGN.md`, `PRODUCT.md` y documentación base.

---

## Fase 2 — Boceto Base y Traspaso a `web/v1/` (COMPLETADA)
- [x] Selección tipográfica (**Boska** + **General Sans**).
- [x] Recorte del logo P7 a PNG transparente y optimización de imágenes a AVIF/WebP.
- [x] Maquetación modular (`src/`) y compilación de `index.html` solo en español (`EN`/`DE` congelados).
- [x] Traspaso oficial del proyecto a **`web/v1/`** y limpieza de duplicados en `x/` (`x/` queda para referencias, tipografía y componentes reutilizables).

---

## Fase 3 — Pulido Sección por Sección (EN CURSO)
*Flujo: laboratorio aislado `web/seccion <nombre>/` → auditoría mobile-first → integración en `web/v1/` y `scripts/build.py`.*

- [x] **Sección "Sobre nosotros" + Galería 1 + Página "Nuestro equipo" (`equipo.html`):**
  - [x] Slider automático infinito Galería 1 adaptado de 21st.dev (HTML/CSS puro, 4 fotos de relleno).
  - [x] Botón **Liquid Glass** (estilo Apple) guardado como componente reutilizable en `x/componentes/liquid-glass-button/`.
  - [x] Página `equipo.html` con 3 barberos, revelado 3D + parallax al scroll y auditoría mobile-first integrada en `web/v1/`.
- [ ] **Sección Hero** (pulido visual + integración del vídeo de Google Flow 16:9 y 9:16).
- [ ] **Sección "Nuestro trabajo" y Carta de Precios** (pulido en laboratorio + integración).
- [ ] **Sección Reseñas y Contacto / Mapa** (pulido en laboratorio + integración).
- [ ] **Sustitución de contenido de relleno** (`docs/CONTENIDO_PENDIENTE.md`): fotos reales del local y barberos, teléfono, horario, precios y enlaces reales de Booksy.
- [ ] **Backend con InsForge:** conectar `galeria-1` y `equipo` desde `assets/js/sobre-data.js`.
- [ ] **Idiomas EN y DE:** reactivar una vez aprobada toda la v1 en español.

---

## Fase 4 — Optimización Final y Despliegue Cloudflare
- [ ] Auditoría de rendimiento, accesibilidad y SEO con Lighthouse (objetivo ≥ 95).
- [ ] Pruebas responsive y táctiles exhaustivas en móvil y escritorio.
- [ ] Conexión a Cloudflare Pages y despliegue bajo protocolo de doble confirmación de Musa.
- [ ] Presentación de la web a Manu.
