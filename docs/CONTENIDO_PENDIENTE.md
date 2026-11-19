# Contenido Pendiente de Sustitución (Pre-Producción)

Este documento recopila todos los datos de relleno (*placeholders*) y activos provisionales presentes actualmente en `x/v1/index.html` y en `x/v1/assets/` que **Musa** debe sustituir por información y material real antes de publicar en producción.

---

## 1. Teléfono y WhatsApp
- **Estado actual en `index.html`:**
  - Teléfono visible y `tel:`: `+34 600 000 000` (`href="tel:+34600000000"`, `data-relleno="telefono"`) en la sección de Contacto, en el Footer y en la barra móvil inferior.
- **Acción requerida:** Reemplazar `+34 600 000 000` (`tel:+34600000000`) por el teléfono oficial del estudio y, si aplica, añadir el enlace real de WhatsApp Business.

---

## 2. Horario Exacto
- **Estado:** ✅ **COMPLETADO / ACTUALIZADO CON DATOS REALES DE BOOKSY** (19/11/2026)
- **Horario Oficial Verificado:**
  - Lunes: 10:00 – 19:00
  - Martes a Jueves: 10:00 – 20:00
  - Viernes y Sábado: 08:00 – 19:00
  - Domingo: Cerrado
- **Archivos actualizados:** `index.html` (Schema.org JSON-LD, sección Contacto y Footer) y `DATOS_OFICIALES_NEGOCIO.md`.

---

## 3. Precios y Nombres Finales de Servicios
- **Estado:** ✅ **COMPLETADO / ACTUALIZADO CON DATOS REALES DE BOOKSY** (19/11/2026)
- **Tarifas Oficiales Verificadas:**
  - **Corte de pelo:** 25,00 € (sesión individual de 1 hora)
  - **Corte + barba:** 30,00 € (sesión individual de 1 hora)
- **Archivos actualizados:** `index.html` (Carta de Servicios #lista-precios) y `DATOS_OFICIALES_NEGOCIO.md`.

---

## 4. Reseñas Reales (desde Booksy)
- **Estado actual en `index.html`:**
  - Insignia y textos: `5,0 en Booksy · +250 reseñas verificadas`
  - 3 reseñas de ejemplo (`data-relleno="resena"`) en el selector interactivo (`1 / 2 / 3`):
    1. `Carlos M. · Cliente habitual`
    2. `Javier R. · Reseña en Booksy`
    3. `Daniel S. · Reseña en Booksy`
- **Acción requerida:** Sustituir las 3 reseñas de ejemplo por testimonios reales copiados de la ficha oficial de Booksy (nombre/iniciales del cliente, contexto y texto literal) y actualizar la cifra exacta de reseñas y puntuación media.

---

## 5. Handle de Instagram y Enlaces Reales de Booksy / Setmore
- **Estado actual en `index.html`:**
  - Instagram (`data-relleno="instagram"`): `@p7barberpalma` (en Contacto apunta a `https://instagram.com/p7barberpalma` y en el Footer a `https://www.instagram.com/`).
  - Booksy: botón principal apuntando a la home genérica `https://booksy.com/es-es/`.
  - Setmore: botón secundario apuntando a la home genérica `https://www.setmore.com/`.
- **Acción requerida:**
  - Confirmar el `@handle` definitivo de Instagram y unificar la URL completa del perfil (`https://www.instagram.com/<handle>/`) tanto en Contacto como en el Footer.
  - Reemplazar los enlaces genéricos de **Booksy** y **Setmore** por las URLs directas de reserva del perfil de P7 Barber Master Studio.

---

## 6. Fotos Reales de Cortes/Equipo y Vídeo Final de Google Flow
- **Fotos actuales en `x/v1/assets/img/` (y variantes optimizadas en `x/v1/assets/img/opt/`):**
  - `hero-atelier.png`
  - `manu-portrait.png`
  - `corte-navaja-oro.png`
  - `salon-mediterraneo.png`
  - **Acción requerida:** Sustituir por fotografías reales del salón, de Manu y del equipo trabajando, y de cortes/rituales reales (y volver a exportar sus versiones `.webp` y `.avif` en `assets/img/opt/`).
- **Vídeo de fondo / Hero (`x/v1/assets/video/raw/`):**
  - Actualmente el directorio `x/v1/assets/video/raw/` está vacío.
  - **Acción requerida:** Colocar aquí el vídeo final generado con Google Flow (o grabación real del estudio) para procesarlo y exportarlo en formatos web optimizados (`.mp4` / `.webm`).
