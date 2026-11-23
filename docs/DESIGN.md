# DESIGN.md — P7 Barber Master Studio

Fuente de verdad del diseño. Cualquier decisión nueva se anota aquí.

## 1. Marca
- **Nombre:** P7 Barber Master Studio · Since 2023
- **Lugar:** C/ Miguel Ángel Riera, 2 — 07004 Palma de Mallorca
- **Prueba social:** 5,0 ★ en Booksy (+250 reseñas)
- **Logo:** monograma P7 gótico, oro metálico, filigrana (`x/referencias/Logo-P7-v1.jpg`; vectorizar a SVG)
- **Personalidad:** artesanal, exclusivo, cálido, seguro de sí mismo. Nunca genérico ni pálido.
- **Idiomas:** ES · EN · DE

## 2. Paleta Oficial P7 (ADN del Escudo + Bordado Liquid Glass)
Basada en el documento rector `p7-logo-paleta.pdf` (extracción oficial del escudo) y el acento de sastrería `Brick Red (#C1091E)` para los botones Liquid Glass:

| Token Semántico | Código Hex | Uso en la Web |
|---|---|---|
| `carbon-900` | `#0A0909` | Fondo general de la web, cuerpo y canvas de footer |
| `ebony-950` | `#0B0702` | Fondo Hero y cintas principales del escudo |
| `anthracite-800` | `#242423` | Superficies de tarjetas, desplegables y bordes estructurados |
| `gold-antique-500` | `#AC986C` | Acento noble principal, botones primarios y destellos |
| `champagne-300` | `#C3B9A0` | Oro blanco/champán para líneas finas y subtítulos |
| `silver-titanium-400`| `#9D9B95` | Plata satinada para textos secundarios y etiquetas |
| `white-pure` | `#FFFFFF` | Titulares y contraste máximo |
| `snow-100` | `#FDFDFC` | Texto de lectura nítido |
| `smoke-150` | `#F6F5F5` | Texto suave y fondos claros alternos |
| `brick-red-500` | `#C1091E` | **Bordado táctil en botones Liquid Glass** (ribete, destello y hover) |

### 2.1 Acentos Bandera de Colombia (añadidos 23/11/2026)
Tomados de los separadores de página (2:1:1). **Se suman** a la paleta del logo, no la sustituyen.

| Token CSS | Código Hex | Uso en la Web (sobre fondo negro) |
|---|---|---|
| `--p7-colombia-yellow` | `#FCD116` | Bordeados Liquid Glass (Booksy), cifras/numeraciones, roles, detalles que deben brillar |
| `--p7-colombia-red` | `#C1091E` (= `brick-red-500`) | Bordeados de botones, superíndices `01–04`, etiquetas (`SOCIAL`), ✕ de cierre |
| `--p7-colombia-blue` | `#003893` | Solo hilos y detalles finos (separadores, filetes). Nunca texto ni botones: poco contraste sobre negro |

Variantes `*-rgb` disponibles para transparencias: `rgba(var(--p7-colombia-yellow-rgb), 0.45)`.

**Degradado Insignia del Escudo:** `linear-gradient(135deg, #0B0702 0%, #AC986C 35%, #C3B9A0 55%, #AC986C 75%, #0B0702 100%)`  
**Degradado Liquid Glass Red Rim:** `linear-gradient(135deg, rgba(193, 9, 30, 0.75), rgba(193, 9, 30, 0.25) 50%, rgba(193, 9, 30, 0.8))`  
**Reglas:** El negro carbono y ébano forman el 70% de la superficie; el bronce y champán son el acento noble (15%); el amarillo `#FCD116` y el rojo `#C1091E` de la bandera son acentos vivos y puntuales (bordeados, cifras, numeraciones, CTA); el azul `#003893` queda para hilos finos.

## 3. Tipografía Oficial (v2 — Obligatoria en toda la web)

> [!IMPORTANT]
> **REGLA ESTRICTA:** Toda la web (`index.html`, `equipo.html`, `galeria.html`, `aviso-legal.html`, `privacidad.html`, `cookies.html` y cualquier sección futura) DEBE usar exclusivamente estas 3 familias mediante sus tokens CSS. Prohibido introducir fuentes externas adicionales o `@import` duplicados.

| Token CSS | Fuente | Origen / Pesos | Uso en la Web |
|---|---|---|---|
| `--font-display` | **Fraunces** | Google Fonts (`600, 700, 800` + `600i`) | Hero, títulos H1/H2/H3, nombres de servicios y equipo (peso `700` sobre fondo negro) |
| `--font-accent` | **IBM Plex Mono** | Google Fonts (`500, 600`) | Eyebrows/kickers, numeración (`01–04`), precios (`30,00 €`), horarios, títulos de columna del footer |
| `--font-sans` | **Switzer** | Fontshare (`400, 500, 600, 700`) | Subtítulos, párrafos de lectura, botones, FAQ, navegación del footer y páginas legales |

- **Contraste sobre fondo negro (`#0A0909`):** títulos en `#FFFFFF` (peso `700`), subtítulos y párrafos en blanco hueso **`--p7-bone: #E8E5DF`** (nunca gris apagado `#9D9B95` para lectura principal), y enlaces de footer ≥ `12px` en `#F2EFE9` con `opacity: 1`.

> **Notas consolidadas en el rediseño v1:**
> - **Oro metálico reservado:** el degradado metálico se aplica únicamente en el escudo P7 y en el botón principal de reserva; el resto de acentos usan `#C9A45C` plano (y `#6E521C` sobre crema para cumplir contraste AA).
> - **Separadores Bandera de Colombia (2:1:1):** hilo de `3px` (`#FCD116` 50 %, `#003893` 25 %, `#C1091E` 25 %) vía tokens `--p7-colombia-*`.
> - **Idiomas:** v1 activa en **ES**; diccionarios `EN` / `DE` congelados en `assets/js/i18n-congelado.js` hasta aprobar la v1 en español.

## 4. Estructura (aprobada — Freeform)
1. **Header** fijo: logo · Inicio · Sobre nosotros · Nuestro trabajo · Contacto · ES/EN/DE · botón "Reservar"
2. **Inicio** — vídeo de barbería en bucle (stock), overlay verde, P7 animado, "Barber Master Studio", CTA
3. **Sobre nosotros** — historia de Manu, cifras · ↳ **Nuestro equipo** (galería 1)
4. **Nuestro trabajo** (galería 2) · ↳ **Lista de precios** en HTML
5. *(Propuesta)* **Reseñas** — 5,0 ★ Booksy
6. **Contacto** · ↳ Info del local · ↳ **Reserva** (Booksy + Setmore)
7. **Dónde estamos** — mapa estilizado
8. **Footer** — logo, datos, redes, legales

## 5. Movimiento
- Intro: el P7 se dibuja en oro (≤1,5 s).
- Brillo metálico que recorre títulos y botones.
- Revelados al scroll, scroll suave (Lenis), galerías arrastrables, lightbox.
- `prefers-reduced-motion` respetado; animaciones más ligeras en móvil.

## 6. Móvil

## 7. Stack
Astro · islas React (21st.dev) · Tailwind CSS v4 · GSAP + ScrollTrigger · Lenis · i18n ES/EN/DE · Cloudflare Pages.
Contenido en archivos de datos por idioma (preparado para Nextool en el futuro).

## 8. Pendiente
Horario, teléfono e Instagram de P7 · nombres del equipo · vídeo propio · logo oficial en vector.

