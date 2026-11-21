# Especificación y Regla de Diseño: Memoria de Navegación (MYNEXT / P7)

**Estado:** Hipótesis de trabajo (pendiente de validar casos límite antes de implementar)
**Autor:** Musa
**Ámbito:** `web/v1/` (P7 Barber Master Studio) y futuros proyectos web de MYNEXT.

---

## 1. Problema que resuelve
Al navegar desde una página principal (`index.html`) hacia una página secundaria (`equipo.html`, `galeria.html`, `aviso-legal.html`, `privacidad.html`, `cookies.html`), los enlaces tradicionales de retorno (`href="./index.html"` o `href="./index.html#seccion"`) rompen el contexto del usuario:
- Lo devuelven al inicio de la página (`scrollY = 0`) o al principio de una sección, perdiendo el punto exacto donde estaba.
- Si entró desde el footer hacia *Aviso legal* y pulsa *Volver atrás*, espera regresar al footer donde pulsó, no al vídeo del Hero.
- Si entró desde el botón *Ver nuestro equipo* en *Sobre nosotros*, espera volver al mismo píxel/botón al instante.

---

## 2. Mecanismo técnico propuesto (HTML/JS estático sin framework)
Para que funcione igual en móvil, simulador y escritorio sin saltos visibles:
1. **Registro al salir (`sessionStorage`):** Al hacer clic en cualquier enlace interno hacia otra página (`.html`), guardar un estado ligero:
   - `fromUrl`: ruta de origen (ej. `/index.html`).
   - `scrollY`: posición exacta en píxeles (`window.scrollY`).
   - `anchorId`: identificador del botón o sección desde donde salió (como respaldo si cambia la altura de pantalla).
2. **Botón `← Volver atrás` inteligente:**
   - Si existe estado guardado de origen dentro del mismo dominio, navega de vuelta con marca de restauración (o `history.back()` controlado).
   - Si no existe historial previo dentro de la web (entrada directa desde Google o WhatsApp), usa un destino de respaldo limpio (ej. `./index.html#p7-halftone-footer` en legales, `./index.html#sobre-nosotros` en `equipo.html`, `./index.html#nuestro-trabajo` en `galeria.html`).
3. **Restauración instantánea al volver:**
   - Configurar `history.scrollRestoration = 'manual'` cuando exista un retorno pendiente.
   - Restaurar `window.scrollTo({ top: savedScrollY, behavior: 'instant' })` antes del primer pintado útil (sin animación lenta que maree) y limpiar el registro tras aplicarlo.

---

## 3. Casos límite y riesgos a validar (Stress-Test)
1. **Salto entre páginas secundarias (cadena):** El usuario entra desde el footer a `aviso-legal.html`, desde ahí pulsa `Privacidad` y luego `Cookies`, y finalmente pulsa `← Volver atrás`.
   - *Riesgo:* Si `← Volver atrás` usa `history.back()`, lo lleva a `privacidad.html` (3 clics para salir). Si usa el origen guardado de la página principal, lo devuelve en 1 toque directo al footer de `index.html`.
2. **Desplazamiento de altura (Layout Shift al restaurar):** Si el usuario vuelve al footer (`scrollY` alto) y hay imágenes con `loading="lazy"` o la *Carta de precios* estaba abierta al salir, la altura total del documento al recargar puede variar unos cientos de píxeles.
   - *Mitigación:* Combinar `scrollY` exacto con el selector del elemento pulsado (`element.scrollIntoView({ block: 'center', behavior: 'instant' })` si la desviación supera un umbral).
3. **Entrada directa sin historial (Deep link):** Alguien abre `/equipo.html` o `/aviso-legal.html` directamente desde un enlace compartido. `history.back()` lo sacaría de la web o no haría nada.
   - *Mitigación:* Fallback determinista por página (`#sobre-nosotros`, `#nuestro-trabajo`, `#p7-halftone-footer`).

---

## 4. Criterios de éxito
- Todos los botones de retorno muestran **«← Volver atrás»** (no «Volver al inicio»).
- Volver desde `equipo.html`, `galeria.html` o cualquier página legal devuelve al usuario al punto exacto de origen en 0 ms perceptibles.
- Funciona tanto con el botón «← Volver atrás» de la interfaz como con el botón atrás del navegador/móvil.
- Cero scroll animado indeseado al restaurar posición.
