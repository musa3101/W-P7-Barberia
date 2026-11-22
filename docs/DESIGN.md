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

**Degradado Insignia del Escudo:** `linear-gradient(135deg, #0B0702 0%, #AC986C 35%, #C3B9A0 55%, #AC986C 75%, #0B0702 100%)`  
**Degradado Liquid Glass Red Rim:** `linear-gradient(135deg, rgba(193, 9, 30, 0.75), rgba(193, 9, 30, 0.25) 50%, rgba(193, 9, 30, 0.8))`  
**Reglas:** El negro carbono y ébano forman el 70% de la superficie; el bronce y champán son el acento noble (15%); y el rojo `#C1091E` se reserva con precisión para el bordado de los botones Liquid Glass interactivos.

## 3. Tipografía (v1 consolidada)
| Rol | Fuente | Nota |
|---|---|---|
| Display / títulos | **Boska** (Fontshare) | Serif editorial de alto contraste; sin cursivas doradas forzadas |
| Cuerpo y UI | **General Sans** (Fontshare) | Limpia, moderna, cifras tabulares en precios |

> **Notas consolidadas en el rediseño v1:**
> - **Oro metálico reservado:** el degradado metálico se aplica únicamente en el escudo P7 y en el botón principal de reserva; el resto de acentos usan `#C9A45C` plano (y `#6E521C` sobre crema para cumplir contraste AA).
> - **Separadores Bandera de Colombia (2:1:1):** hilo de sastrería de `3px` animado al scroll (`#C9A45C` 50 %, `#13294B` 25 %, `#7A1F2B` 25 %).
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

