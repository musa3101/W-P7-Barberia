# Resumen de Sesión — 23 de Noviembre de 2026 (Tipografía Oficial v2, Paleta Colombia, Autoplay Hero iOS, Retrato Real de Manu y Pulido Crema)

## 1. Qué se ha hecho hoy
- **Autoplay infinito del vídeo Hero en iOS Safari:**
  - Añadido guardián en `assets/js/site.js` (`v=20261123a`) con reintentos automáticos con backoff, recuperación ante `pause`, `pageshow` (bfcache) y cambio de pestaña, desbloqueo al primer gesto y vigilante cada `1,5 s`.
- **Paleta oficial ampliada (Bandera de Colombia 2:1:1):**
  - Añadidos en `assets/css/site.css` y `docs/DESIGN.md` los tokens `--p7-colombia-yellow` (`#FCD116`), `--p7-colombia-blue` (`#003893`) y `--p7-colombia-red` (`#C1091E`) + variantes `*-rgb`, sin eliminar ningún color extraído del logo.
- **Nuevo sistema tipográfico oficial en toda la web (3 fuentes obligatorias):**
  - Migradas las 7 páginas HTML (`index.html`, `equipo.html`, `galeria.html`, `aviso-legal.html`, `privacidad.html`, `cookies.html` y `src/head.html`) a **`Fraunces`** (títulos `600/700/800`) + **`IBM Plex Mono`** (kickers, cifras, precios, headers de footer) + **`Switzer`** (cuerpo, botones, navegación y legales).
  - Eliminados los `@import` bloqueantes/duplicados de `assets/css/fonts.css` y las 6 familias mezcladas de `equipo.html`.
  - Blindada la regla en `docs/DESIGN.md` para que ninguna sección futura invente fuentes.
- **Contraste ("adiós blanco muerto") y responsive móvil:**
  - Subido el H1 del Hero en móvil a `39,2px` (`weight: 700`) y todos los H2/nombres a `700`.
  - Elevados subtítulos y párrafos sobre negro a blanco hueso `--p7-bone: #E8E5DF`.
  - Renovado el footer: navegación legible (`12px` móvil / `13px` desktop, `opacity: 1`, hover amarillo `#FCD116`) y `MADE BY MYNEXT` en contraste AA.
  - Reducida la compresión móvil en *Cómo se trabaja en P7* (`332px` útiles), *Tarjeta de Reserva* (`320px` útiles) y equilibrado el hueco Mapa → FAQ (`48px`). Verificado PASS en Playwright (`390×844` y `1440×900`).
- **Retrato real de Manu en `equipo.html`:**
  - Compuesta la foto original de Manu (`ManuCuts copia.PNG`) sobre un fondo editorial oscuro de estudio (`manu-real-900w.webp` y `manu-real-480w.webp`) y actualizada en `equipo.html`.
- **Secciones sobre crema ("Cómo se trabaja en P7" y "Contacto") — Chat paralelo (`407c6731`):**
  - Aplicado bordeado negro limpio en tarjetas y bloque de contacto sobre fondo crema, mejoradas las píldoras (*1 hora / Oficio / Detalle*), reubicado y ampliado el escudo P7 en móvil, eliminado el disco negro `.coin-edge` y generado `logo-p7-crema-512w.webp`.
- **Textos oficiales finales + Eslogan bajo el logo en el Footer:**
  - Actualizados los subtítulos de **Sobre nosotros** (presentando a Manuel / `ManuCuts`) y **Nuestro trabajo**.
  - Añadido el eslogan *"Pasión por el oficio. Respeto por el detalle en cada corte."* centrado y bien espaciado debajo del escudo en el footer de todas las páginas (`footer.css?v=20261123c`).

### Mini-merges realizados hoy
- `2026-11-23 | feat(v1): tipografia oficial Fraunces+IBM Plex Mono+Switzer, paleta bandera Colombia, autoplay Hero iOS, retrato real Manu y pulido secciones crema (2c45d72) | push=1`
- `2026-11-23 | feat(v1): textos oficiales Sobre nosotros (ManuCuts), Nuestro trabajo y eslogan bajo logo en footer | push=1`

---

## 2. Archivos modificados y creados
- **CSS:** `assets/css/cinta.css`, `contacto.css`, `fonts.css`, `footer.css`, `galeria.css`, `header.css`, `legal.css`, `site.css`, `sobre.css`, `trabajo.css`
- **JS:** `assets/js/site.js`, `assets/js/trabajo.js`
- **HTML / Plantillas:** `index.html`, `equipo.html`, `galeria.html`, `aviso-legal.html`, `privacidad.html`, `cookies.html`, `src/head.html`, `src/footer.html`, `src/sections/03-trabajo-precios.html`, `src/sections/05-contacto-mapa.html`
- **Imágenes nuevas:** `assets/img/opt/manu-real-480w.webp`, `assets/img/opt/manu-real-900w.webp`, `assets/img/opt/logo-p7-crema-512w.webp`
- **Documentación:** `docs/DESIGN.md`, `docs/ROADMAP.md`, `docs/SESSION_LATEST_ES.md`

---

## 3. Problemas solucionados
- Corregido el parón del vídeo Hero al recargar en iPhone Safari (reintentos automáticos + `pageshow` + vigilante).
- Eliminada la carga duplicada de 6 fuentes en `equipo.html` y unificada toda la web a 3 fuentes oficiales.
- Corregidos fallos críticos de contraste (`.exp-title` casi invisible sobre oscuro, `.equipo-kicker`, `.precios-item-num` y footer apagado de `10px`).
- Eliminado el fondo negro del escudo en la sección crema (`.coin-edge`) y la compresión excesiva de textos en móvil (`390px`).

---

## 4. Qué queda pendiente
- **Integrar Setmore** en los botones/flujo de reserva online (Musa ya está preparando los datos/enlaces de Setmore).
- Sustituir las fotos provisionales de los otros 2 barberos en `equipo.html` (y sus `@instagram` individuales) cuando haya material real.
- Retocar el preloader/loading en `web/loading/` si se decide integrarlo.
- **Fase futura tras OK del cliente:** Migración a Astro + multiidioma (`ES`/`EN`/`DE`) + backend con InsForge.

---

## 5. Qué se recomienda hacer en la próxima sesión
1. **Integrar Setmore** con la configuración/enlaces que pase Musa y probar el flujo completo de reserva desde móvil y desktop.
2. Verificar en iPhone real la versión recién desplegada en producción (`2c45d72`): nueva tipografía, vídeo Hero en recarga, foto real de Manu en `equipo.html` y secciones sobre crema.
3. Preparar la demo final para Manu y, tras su OK, planificar el salto a **Astro**.
