# DESIGN.md — P7 Barber Master Studio

Fuente de verdad del diseño. Cualquier decisión nueva se anota aquí.

## 1. Marca
- **Nombre:** P7 Barber Master Studio · Since 2023
- **Lugar:** C/ Miguel Ángel Riera, 2 — 07004 Palma de Mallorca
- **Prueba social:** 5,0 ★ en Booksy (+250 reseñas)
- **Logo:** monograma P7 gótico, oro metálico, filigrana (`x/referencias/Logo-P7-v1.jpg`; vectorizar a SVG)
- **Personalidad:** artesanal, exclusivo, cálido, seguro de sí mismo. Nunca genérico ni pálido.
- **Idiomas:** ES · EN · DE

## 2. Paleta "Esmeralda & Oro"
| Token | Hex | Uso |
|---|---|---|
| `emerald-900` | `#0B2E22` | Fondo más profundo (hero overlay, footer) |
| `emerald-800` | `#0F3D2E` | Fondo principal |
| `emerald-700` | `#164A38` | Tarjetas, secciones alternas |
| `gold-300` | `#F1D592` | Brillo del degradado |
| `gold-500` | `#C9A45C` | Acento principal, líneas, iconos |
| `gold-700` | `#9A7838` | Sombra del degradado |
| `cream-100` | `#F8F1E4` | Secciones claras |
| `cream-200` | `#F3E9D7` | Texto sobre verde |
| `burgundy-600` | `#7A1F2B` | Contraste puntual (badges, hover) |

**Degradado oro:** `linear-gradient(135deg, #9A7838, #F1D592 45%, #C9A45C 70%, #9A7838)`
**Reglas:** el oro es acento (≤10 % de la pantalla). Alternar secciones verde / crema para ritmo.

## 3. Tipografía (propuesta, validar)
| Rol | Fuente | Nota |
|---|---|---|
| Display / títulos | **Playfair Display** o **Cormorant** (serif alta con contraste) | Grande, a veces en oro |
| Etiquetas / detalles | **Rye** o similar western, solo en pequeño | Eco del "BARBER" del logo |
| Texto | **Inter** / **Manrope** | Legible, moderna |

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
Mobile-first. Vídeo vertical ligero + póster. Barra inferior fija: **Reservar · Llamar · Cómo llegar**.

## 7. Stack
Astro · islas React (21st.dev) · Tailwind CSS v4 · GSAP + ScrollTrigger · Lenis · i18n ES/EN/DE · Cloudflare Pages.
Contenido en archivos de datos por idioma (preparado para Nextool en el futuro).

## 8. Pendiente
Horario, teléfono e Instagram de P7 · nombres del equipo · vídeo propio · logo oficial en vector.

