# Textos Legales Básicos — P7 Barber Master Studio (Palma de Mallorca)

> **Estado:** Borrador listo para inyectar en el modal `#legal-dialog` (o en páginas legales) cuando se cierre el bloque de Footer + Legales.
> **Normativa aplicable (España / Illes Balears):** LSSI-CE (Ley 34/2002), RGPD (UE 2016/679), LOPDGDD (LO 3/2018) y criterios vigentes de la AEPD.
> **Aviso:** Este documento recoge los contenidos mínimos habituales para una web informativa de barbería en España. No sustituye el asesoramiento jurídico formal de un abogado o gestoría.

---

## 1. Diagnóstico del Footer actual (`web/v1/`)

Tras revisar `src/footer.html`, `assets/js/site.js` y `src/sections/05-contacto-mapa.html`:

1. **Estructura ya preparada:** El footer ya cuenta con la columna **Legal** con los 3 botones estándar que abren el modal `<dialog id="legal-dialog">`:
   - `Aviso legal` (`data-legal="aviso"`)
   - `Privacidad` (`data-legal="privacidad"`)
   - `Cookies` (`data-legal="cookies"`)
2. **Qué le falta al texto actual de `site.js`:**
   - Actualmente solo tiene 1 frase de relleno por cada apartado (insuficiente para LSSI-CE y RGPD).
   - Todavía menciona **Setmore** en Privacidad (si ya solo se trabaja con Booksy, conviene retirarlo).
   - Falta el bloque de derechos de los usuarios (ARCO-POL + reclamación ante la AEPD), propiedad intelectual / derechos de imagen de la galería y la mención al mapa incrustado de Google Maps.
3. **Punto técnico importante (Google Maps y Cookies):**
   - La web **no tiene formularios propios**, **no usa Google Analytics** ni píxeles publicitarios.
   - Sin embargo, en `05-contacto-mapa.html` hay un **`<iframe>` de Google Maps** cargado directamente. Según la AEPD, un `iframe` de Google Maps puede instalar cookies de terceros de Google.
   - **Dos opciones limpias al implementar:**
     - *Opción A (más limpia, sin banner de cookies):* Sustituir la carga automática del `iframe` por una vista previa estática con un botón *"Cargar mapa interactivo"* (solo carga Google Maps si el usuario pulsa). Así la web queda 100 % libre de cookies de terceros y **no necesita banner de cookies**.
     - *Opción B (mantener el `iframe` directo):* Dejar el mapa embebido tal cual y añadir un aviso/consentimiento discreto de cookies (con botones *Aceptar* y *Rechazar* al mismo nivel según guía AEPD).

> [!CAUTION]
> **Nota interna para Musa (Titular legal en Aviso Legal):**
> Por confidencialidad del cliente, en los textos de abajo **no se ha incluido ningún nombre civil**. Sin embargo, el **Art. 10 de la LSSI-CE** obliga a que el Aviso Legal de cualquier negocio en España identifique al titular legal (Razón Social si es S.L., o nombre y apellidos si es autónomo) junto con su **NIF/CIF**, dirección, correo electrónico y teléfono. Antes del lanzamiento definitivo, confirmar con el cliente los campos marcados entre corchetes `[...]`.

---

## 2. Textos listos para inyectar (Conciso y completo)

### A. Aviso Legal

**1. Datos identificativos**
En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de los datos del titular de este sitio web:

- **Nombre comercial:** P7 Barber Master Studio
- **Titular / Razón social:** `[RAZÓN SOCIAL O TITULAR LEGAL]`
- **NIF / CIF:** `[NIF / CIF]`
- **Domicilio:** Calle Miguel Ángel Riera, 2, 07004 Palma de Mallorca, Illes Balears (España)
- **Correo electrónico:** `[EMAIL OFICIAL, ej. p7barberpalma@gmail.com]`
- **Teléfono:** `[TELÉFONO OFICIAL]`
- **Actividad:** Servicios de barbería artesanal y cuidado masculino bajo cita previa.

**2. Objeto y condiciones de uso**
El presente sitio web tiene carácter meramente informativo sobre los servicios, tarifas orientativas, horarios y ubicación de P7 Barber Master Studio. El acceso y navegación implican la aceptación de estas condiciones y el compromiso de hacer un uso lícito del sitio.

**3. Propiedad intelectual e imagen**
El logotipo P7, diseños, textos, fotografías y vídeos publicados en esta web son propiedad de P7 Barber Master Studio o cuentan con autorización para su uso. Queda prohibida su reproducción o uso comercial sin permiso previo por escrito.

**4. Enlaces externos y responsabilidad**
Las citas online se gestionan a través de plataformas externas (como **Booksy**) y las consultas directas pueden redirigir a **WhatsApp** o **Google Maps**. P7 Barber Master Studio no se hace responsable de los contenidos, disponibilidad ni políticas propias de dichos sitios de terceros.

**5. Legislación aplicable**
Las presentes condiciones se rigen por la legislación española. Para cualquier controversia, las partes se someten a los Juzgados y Tribunales de Palma de Mallorca, salvo que la normativa de consumidores disponga otro fuero.

---

### B. Política de Privacidad

**1. Responsable del tratamiento**
- **Responsable:** P7 Barber Master Studio (`[RAZÓN SOCIAL O TITULAR LEGAL]`, NIF/CIF `[NIF / CIF]`)
- **Dirección:** Calle Miguel Ángel Riera, 2, 07004 Palma de Mallorca, Illes Balears
- **Contacto de privacidad:** `[EMAIL OFICIAL]`

**2. Qué datos tratamos y con qué finalidad**
Esta página web **no dispone de formularios de registro ni de recogida directa de datos personales**. Únicamente podremos tratar tus datos cuando:
- **Reservas una cita online** a través de **Booksy**: los datos necesarios para gestionar tu reserva (nombre, teléfono, correo e historial de citas) se recogen y gestionan a través de Booksy conforme a su propia política de privacidad, y se utilizan exclusivamente para prestar el servicio solicitado y gestionar tu cita.
- **Contactas con nosotros** por teléfono, correo electrónico o **WhatsApp**: utilizamos tus datos únicamente para responder tu consulta o gestionar tu cita.
- **Galería de trabajos:** las fotografías y vídeos de cortes publicados en la web se muestran con autorización previa de los interesados.

**3. Base legal (Legitimación)**
El tratamiento se basa en la ejecución de la prestación del servicio solicitado (cita en barbería), el cumplimiento de obligaciones legales y, en su caso, el consentimiento expreso del interesado (consultas directas o publicación de imágenes).

**4. Conservación y destinatarios**
Los datos se conservarán únicamente durante el tiempo necesario para gestionar tu cita o consulta y cumplir las obligaciones legales aplicables. No cedemos tus datos a terceros salvo obligación legal o a los proveedores estrictamente necesarios para la reserva y comunicación (Booksy, WhatsApp/Meta y alojamiento web en Cloudflare Pages).

**5. Tus derechos**
Puedes ejercer en cualquier momento tus derechos de **acceso, rectificación, supresión, oposición, limitación y portabilidad**, así como solicitar la retirada inmediata de cualquier imagen en la que aparezcas, escribiendo a `[EMAIL OFICIAL]`. Si consideras que no hemos atendido correctamente tus derechos, puedes presentar una reclamación ante la **Agencia Española de Protección de Datos (www.aepd.es)**.

---

### C. Política de Cookies

**1. ¿Qué son las cookies?**
Las cookies son pequeños archivos que se descargan en tu dispositivo al visitar una página web para permitir su correcto funcionamiento o recordar preferencias de navegación.

**2. ¿Qué cookies utiliza esta web?**
En **P7 Barber Master Studio** respetamos tu privacidad: **no utilizamos cookies publicitarias, ni perfiles comerciales, ni herramientas de analítica como Google Analytics**.

- **Cookies técnicas esenciales (exentas de consentimiento):** Recursos estrictamente necesarios del servidor/alojamiento (**Cloudflare Pages**) para garantizar la seguridad, la carga rápida y la correcta visualización de la página.
- **Servicios de terceros:**
  - **Mapa interactivo (Google Maps):** Al mostrar el mapa incrustado de ubicación en la sección *¿Dónde estamos?*, Google puede instalar cookies propias o tratar datos técnicos de conexión según su política de privacidad (`policies.google.com`).
  - **Enlaces externos (Booksy, WhatsApp, Instagram):** Al pulsar en estos botones abandonas nuestra web; dichas plataformas aplican sus propias políticas de cookies.

**3. Cómo desactivar o eliminar las cookies**
Puedes bloquear o eliminar las cookies en cualquier momento desde la configuración de tu navegador (Chrome, Safari, Firefox o Edge). Ten en cuenta que bloquear cookies de terceros puede impedir la carga del mapa interactivo de Google Maps, aunque podrás seguir abriendo nuestra ubicación mediante el enlace directo.

---

## 3. Bloque listo para pegar en `assets/js/site.js`

Cuando toque actualizar el modal legal (`#legal-dialog`), solo hay que sustituir el objeto `LEGAL_CONTENT` en `web/v1/assets/js/site.js` por el siguiente bloque (rellenando primero los `[...]`):

```js
const LEGAL_CONTENT = {
  aviso: {
    title: 'Aviso Legal',
    body: `
      <p>En cumplimiento de la Ley 34/2002 (LSSI-CE), se informa de los datos identificativos del titular de este sitio web:</p>
      <ul>
        <li><strong>Nombre comercial:</strong> P7 Barber Master Studio</li>
        <li><strong>Titular / Razón social:</strong> [RAZÓN SOCIAL O TITULAR LEGAL]</li>
        <li><strong>NIF / CIF:</strong> [NIF / CIF]</li>
        <li><strong>Dirección:</strong> Calle Miguel Ángel Riera, 2, 07004 Palma de Mallorca, Illes Balears</li>
        <li><strong>Email:</strong> [EMAIL OFICIAL] · <strong>Teléfono:</strong> [TELÉFONO OFICIAL]</li>
      </ul>
      <p><strong>Uso y propiedad intelectual:</strong> Esta web tiene carácter informativo sobre nuestros servicios de barbería bajo cita previa. El logotipo P7, textos, fotografías y vídeos pertenecen a P7 Barber Master Studio o cuentan con autorización para su uso; queda prohibida su reproducción sin permiso.</p>
      <p><strong>Enlaces externos y jurisdicción:</strong> Las reservas se gestionan en plataformas externas (Booksy). Este aviso se rige por la legislación española, con fuero en Palma de Mallorca salvo disposición legal de consumidores.</p>
    `
  },
  privacidad: {
    title: 'Política de Privacidad',
    body: `
      <p><strong>Responsable:</strong> P7 Barber Master Studio ([RAZÓN SOCIAL O TITULAR LEGAL], NIF/CIF [NIF / CIF]), Calle Miguel Ángel Riera, 2, 07004 Palma de Mallorca. Contacto: [EMAIL OFICIAL].</p>
      <p><strong>Finalidad y datos tratados:</strong> Esta web no recoge datos mediante formularios propios. Solo tratamos datos cuando reservas cita a través de <strong>Booksy</strong> o nos contactas por teléfono, email o <strong>WhatsApp</strong>, con la única finalidad de gestionar tu cita o responder tu consulta. Las imágenes de la galería se publican con autorización.</p>
      <p><strong>Base legal y conservación:</strong> Prestación del servicio solicitado, obligación legal y consentimiento del interesado. Conservamos los datos el tiempo estrictamente necesario para la cita y obligaciones legales. No cedemos datos a terceros salvo obligación legal o proveedores de reserva/alojamiento (Booksy, WhatsApp, Cloudflare).</p>
      <p><strong>Derechos:</strong> Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación, portabilidad o retirada de imagen escribiendo a [EMAIL OFICIAL], y reclamar ante la AEPD (www.aepd.es).</p>
    `
  },
  cookies: {
    title: 'Política de Cookies',
    body: `
      <p><strong>Sin rastreo publicitario ni analítica:</strong> Esta web no utiliza Google Analytics ni cookies de publicidad.</p>
      <p><strong>Cookies técnicas esenciales:</strong> Únicamente se emplean recursos técnicos imprescindibles del alojamiento (Cloudflare Pages) para la seguridad y correcta carga del sitio.</p>
      <p><strong>Servicios de terceros:</strong> El mapa incrustado de <strong>Google Maps</strong> en la sección de ubicación puede instalar cookies de Google según su política de privacidad. Los enlaces externos (Booksy, WhatsApp) abren sitios ajenos con sus propias políticas.</p>
      <p><strong>Gestión:</strong> Puedes bloquear o eliminar cookies en cualquier momento desde la configuración de tu navegador (Chrome, Safari, Firefox o Edge).</p>
    `
  }
};
```

---

## 4. Checklist rápida antes de publicar en producción definitiva

- [ ] Confirmar con el cliente los 4 datos obligatorios: **Titular/Razón social**, **NIF/CIF**, **email oficial** y **teléfono oficial**.
- [ ] Decidir si el mapa de `05-contacto-mapa.html` se queda con carga directa (requiere aviso/consentimiento de cookies) o con botón *"Cargar mapa interactivo"* (0 cookies de terceros, sin banner).
- [ ] Verificar en [footer.html](../src/footer.html) que los 3 botones (`Aviso legal`, `Privacidad`, `Cookies`) funcionen también en `equipo.html` y `galeria.html` cuando se unifique el footer.
- [ ] Eliminar la etiqueta `<link rel="preconnect" href="https://fonts.googleapis.com">` / `fonts.gstatic.com` de `src/head.html` si ya solo se usa Fontshare.
