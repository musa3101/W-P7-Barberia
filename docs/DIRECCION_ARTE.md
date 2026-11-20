# DIRECCION_ARTE.md — P7 Barber Master Studio (v1)

Documento rector de dirección de arte, composición, sistema visual y movimiento para **P7 Barber Master Studio**. Basado en la dirección `uneven-photographs` (*Photographs at uneven sizes*, seed `699994931`) adaptada al inventario real de la marca y a la paleta fija **Esmeralda & Oro**.

---

## 1. Inventario Único de P7
Elementos propios e intransferibles que solo existen en este estudio y sostienen toda la propuesta visual:
1. **Escudo gótico P7 con filigrana:** Monograma artesanal en oro metálico (`x/referencias/Logo-P7-v1.jpg`, vectorizado a SVG).
2. **Dirección real en Palma:** `C/ Miguel Ángel Riera, 2 — 07004 Palma de Mallorca, Illes Balears`.
3. **Trayectoria verificable:** `Since 2023`.
4. **Prueba social sólida:** `5,0 ★ en Booksy` con más de `250 reseñas` verificadas.
5. **Origen colombiano de Manu:** Maestro barbero colombiano afincado en Palma; disciplina de sastrería, calidez en el trato 1 a 1 y precisión milimétrica en degradados (*skin fades*).
6. **Ritual de toalla caliente:** Experiencia sensorial lenta y cuidada con vapor, aceites y navaja tradicional.

---

## 2. Idea Central
> **En esta página, el hilo de sastrería del origen colombiano de Manu sobre el paño esmeralda de su estudio en C/ Miguel Ángel Riera, 2 se convierte en una galería asimétrica de proporciones desiguales cosida por una cinta 2:1:1 en tonos joya.**

- **Acción viva principal del visitante:** Reservar cita en 1–2 clics mediante **Booksy** (principal) o **Setmore** (alternativa), o iniciar llamada / ruta en Google Maps desde la barra fija móvil.

---

## 3. Reglas de Color, Oro Metálico y Prohibiciones

### Paleta Fija (Esmeralda & Oro)
- **Esmeralda:** `#0B2E22` (fondo profundo: hero, footer, tinta sobre crema), `#0F3D2E` (fondo principal), `#164A38` (bloques alternos / tarjetas sutiles).
- **Oro:** `#F1D592` (brillo), `#C9A45C` (dorado plano para acentos y detalles), `#9A7838` (sombra).
- **Crema:** `#F8F1E4` (secciones claras), `#F3E9D7` (texto principal sobre esmeralda y bandas cálidas).
- **Tonos joya de acento colombiano:** Azul Zafiro Profundo `#13294B` y Burdeos `#7A1F2B`.

### Regla Estricta del Oro Metálico
- El degradado oro metálico (`linear-gradient(135deg, #9A7838, #F1D592 45%, #C9A45C 70%, #9A7838)`) queda **reservado exclusivamente** para:
  1. El **escudo gótico P7** (intro/hero/header).
  2. El **CTA principal de reserva** ("Reservar cita").
- Todo el resto de detalles dorados (iconos discretos, estrellas, bordes puntuales, enlaces activos) usan **dorado plano `#C9A45C`**.
- El oro nunca supera el 10 % de la superficie visible.

### Prohibiciones Absolutas (Anti-Slop)
- **Cero cursivas doradas forzadas** en titulares.
- **Cero píldoras o *eyebrows*** encima del H1 o de los H2.
- **Cero cristal *blur* genérico** (`backdrop-filter: blur`) en el header: el header usa fondo transparente limpio sobre el hero y transiciona a `#0B2E22` sólido al hacer scroll.
- **Cero numeración decorativa** (`01 / 02 / 03`), cero líneas de puntos en precios, cero sombras en reposo y cero tipografía monoespaciada.
- **Titulares máximos de 2 líneas** y `≤ 34 caracteres` en H1 y H2 principales.

---

## 4. Separadores Bandera de Colombia (Sastrería de Lujo 2:1:1)
Sustituyen a cualquier línea divisoria genérica entre bloques mayores. Funcionan como un **hilo fino de sastrería de `3px` de altura**, ancho completo (`100%`) y animado al entrar en pantalla:

- **Proporción exacta 2:1:1 en tonos joya:**
  - **50 %** Oro P7 (`#C9A45C`)
  - **25 %** Azul Zafiro Profundo (`#13294B`)
  - **25 %** Burdeos (`#7A1F2B`)
- **CSS de referencia:**
  ```css
  .separador-sastreria {
    width: 100%;
    height: 3px;
    background: linear-gradient(
      90deg,
      #C9A45C 0%,
      #C9A45C 50%,
      #13294B 50%,
      #13294B 75%,
      #7A1F2B 75%,
      #7A1F2B 100%
    );
    transform-origin: left center;
    transform: scaleX(0);
  }
  ```
- **Comportamiento al scroll:** Al alcanzar el 85 % del viewport, `scaleX` pasa de `0` a `1` en `900ms` con `cubic-bezier(0.16, 1, 0.3, 1)` una sola vez (estado final `scaleX(1)` garantizado con `prefers-reduced-motion`).

---

## 5. Composición Asimétrica por Secciones
Rejilla base de **12 columnas** con márgenes exteriores generosos (`5vw–6vw`). **Ninguna sección vecina repite la misma disposición** y se alternan fondos Esmeralda y Crema para dar ritmo editorial.

1. **Header Fijo (Limpio, sin blur):**
   - Transparente sobre el hero; al hacer scroll pasa a sólido `#0B2E22`.
   - Izquierda: escudo P7 SVG + nombre discreto; centro: 4 enlaces (`Inicio`, `El Estudio`, `Trabajos`, `Tarifas`, `Contacto`); derecha: botón CTA principal en oro metálico (`Reservar`).

2. **Hero — Inicio (`#0B2E22` + Vídeo en bucle):**
   - Vídeo de barbería en bucle (`16:9` escritorio, `9:16` móvil) con póster cinematográfico y velo esmeralda (`#0B2E22` al 65 %–75 %) para legibilidad total.
   - Composición escalonada: escudo P7 en oro metálico arriba a la izquierda (cols 1–2); H1 en `Boska` de 2 líneas escalonadas (línea 1 en col 2, línea 2 desplazada a col 4–5); frase breve de apoyo y botón CTA principal en oro metálico debajo de la segunda línea, más enlace secundario discreto a Setmore.

3. **Sobre Nosotros — El Estudio (`#F8F1E4` Crema · Mosaico asimétrico):**
   - H2 en cols 1–5 + párrafo introductorio breve (`max-width: 40ch`).
   - Debajo, dos bloques descompensados con `16px` de separación:
     - **Izquierda (cols 1–8):** Fotografía panorámica `16:10` del ritual de toalla caliente / sillón de barbero, con un bloque sólido en Crema `#F8F1E4` (`320px` ancho, `20px` padding) superpuesto en la esquina superior derecha con la historia de Manu.
     - **Derecha (cols 9–12):** Bloque sólido en Esmeralda `#0F3D2E` (60 % de la altura de la foto) con trazado SVG limpio del entorno de Palma marcando `C/ Miguel Ángel Riera, 2`. Debajo, rejilla 2×2 con 4 datos reales: `Fundado: 2023`, `Valoración: 5,0 ★ Booksy`, `Origen: Colombia`, `Atención: 1 a 1`.

4. **Separador Bandera de Colombia (2:1:1 · 3px).**

5. **Nuestro Trabajo — Galería Escalonada (`#0F3D2E` Esmeralda · Celdas vacías):**
   - Rejilla de 4 columnas (`gap: 16px`, margen `5vw`) con huecos intencionales:
     - **Fila 1:** Foto ancha `3:2` (cols 1–2) · **H2 apilado en 2 líneas** ocupando la celda 3 · Foto vertical `4:5` (col 4).
     - **Fila 2:** Foto `1:1` (col 2) · Foto `4:5` (col 3) · Celdas 1 y 4 vacías.
     - **Fila 3:** Foto `1:1` (col 1) · Foto ancha `3:2` (cols 3–4) · Celda 2 vacía.
   - Esquinas rectas (`0px`) o un único detalle consistente. Pie de foto en `14px`: nombre del corte a la izquierda y categoría/técnica a la derecha. Clic abre lightbox limpio.
   - En móvil: 2 columnas alternando ancho completo y desplazamientos `72%` / `60%`.

6. **Carta de Precios — Tarifas (`#F8F1E4` Crema · Formato menú de sastrería):**
   - Cols 1–3: H2 + fotografía vertical `4:5` del detalle de navaja/tijera debajo.
   - Cols 5–12: dos columnas de texto (`gap: 64px`) con grupos claros (`Cortes y Degradados`, `Barba y Ritual`, `Experiencia P7`).
   - Cada servicio: fila `flex` (`justify-content: space-between`) con nombre a la izquierda (`19px`), precio tabular a la derecha (`19px`, símbolo `€` solo en el primer ítem o por grupo) y **cero puntos de relleno ni líneas divisorias**. Debajo, 1 línea descriptiva en tinta suave (`16px`, `max-width: 36ch`).

7. **Separador Bandera de Colombia (2:1:1 · 3px).**

8. **Reseñas — Prueba Social (`#0B2E22` Esmeralda · Retrato y cita desplazada):**
   - Sin H2 centrado genérico. Cols 2–5: retrato vertical `3:4` (`~68svh`) de Manu trabajando.
   - Cols 7–12 (desplazado `120px` hacia abajo): gran cita en `Boska` (`clamp(24px, 2.5vw, 38px)`) + nombre del cliente y sello `5,0 ★ Booksy (+250 reseñas)`, con selector discreto para alternar entre las 3 reseñas.
   - Cols 10–11 (`96px` por debajo de la atribución): pequeña fotografía `1:1` de detalle del estudio.

9. **Contacto y Reservas (`#F3E9D7` Crema cálido · Banda en 3 tiempos):**
   - Fila única alineada arriba en 12 columnas:
     - Cols 1–5: frase directa de invitación (`≤ 34px`, máx. 3 líneas).
     - Cols 6–7: aire vacío.
     - Cols 8–9: fotografía cuadrada del local/fachada (`160px`, esquinas rectas).
     - Cols 10–12: enlaces directos a **Reservar en Booksy**, **Reservar en Setmore**, teléfono, Google Maps (`C/ Miguel Ángel Riera, 2`) y horario.

10. **Footer (`#0B2E22` Esmeralda profundo · Columnas arriba, wordmark abajo):**
    - Altura mínima amplia (`min-height: 85svh` / `100svh` en desktop) organizada en 3 filas (`auto 1fr auto`):
      - Arriba: 4 columnas limpias (Estudio y Dirección, Navegación, Reservas e Instagram, Horario).
      - Centro: aire esmeralda.
      - Abajo: wordmark monumental `P7 BARBER` de margen a margen en SVG o `vw` ajustado + línea legal en `13px`.

11. **Móvil (Barra inferior fija):**

---

## 6. Arquitectura de Microanimaciones al Hacer Scroll
- **Barra de progreso superior fija (`3px`):** En `position: fixed; top: 0; left: 0; z-index: 60`, con el degradado 2:1:1 en tonos joya (`#C9A45C` 50 %, `#13294B` 25 %, `#7A1F2B` 25 %), escalando con `scaleX` en sincronía directa con el scroll de la página.
- **Momento firma (Hero — *Masked line reveal*):** Al cargar, cada línea del H1 sube desde su propia línea base oculta (`overflow: hidden`) en `900ms` con `cubic-bezier(0.16, 1, 0.3, 1)` y `110ms` de retardo entre la línea 1 y la línea 2. Después aparecen suavemente la entradilla y el CTA. Sin *preloader* bloqueante: el mensaje es legible desde el primer fotograma.
- **Revelados escalonados por sección:** Cada sección dispara una única vez al entrar en el 85 % del viewport (`transform: translateY(20px)` + `opacity: 0` → `0 / 1`, `650ms`, `60–90ms` de escalonado en orden de lectura). La carta de precios entra fila a fila; la galería entra bloque a bloque.
- **Parallax sutil en imágenes:** Desplazamiento vertical suave (`±24px`) ligado al scroll mediante `GSAP ScrollTrigger` (`scrub: true`) en las fotografías grandes, siempre dentro de contenedores `overflow: hidden` (solo `transform`, cero propiedades de layout).
- **Respuesta táctil:**
  - **Carta de precios:** Al pasar el cursor por una fila, sutil desplazamiento horizontal (`translateX(6px)`) y cambio suave de tono en `200ms`.
  - **Galería:** Zoom contenido (`scale(1.03)` en `450ms ease-out`) de la fotografía dentro de su marco recto y aparición sutil del pie.
  - **Botones:** Compresión física al pulsar (`scale(0.98)` en `120ms`).
- **Accesibilidad:** Todo el movimiento se desactiva limpiamente bajo `@media (prefers-reduced-motion: reduce)` mostrando el estado final desde el inicio.
