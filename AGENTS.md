# Reglas del Setup de Musa (estrictas)

Se activan cuando el usuario dice: **"setup de Musa"**, **"@setup"**, **"abre el setup de Musa"**, **"instálame el setup de Musa"**. Protocolo completo: `SETUP_MUSA.md`.

## 1. Abrir sesión
- Ejecutar `scripts/session-start.sh`: cambia a la rama `dev` (la crea si no existe) y crea `.musa/session.json`.
- **Prohibido trabajar en `main`.**
- Si es la primera vez en el proyecto, hacer la entrevista de `interview.md`.
- No instalar dependencias, no levantar servidores, no tocar skills salvo que el usuario lo pida.

## 2. Mientras la sesión está abierta
- Todo cambio se hace en `dev`. El usuario puede pedir volver atrás.
- Antes de cualquier acción, recordar: **sesión Musa abierta, rama `dev`, sin merge sin la frase**.
- Con dos ventanas en el mismo proyecto: **nunca** cambiar de rama en la carpeta compartida.

## 3. Merge, push y deploy
- Solo con la frase exacta: **"Tienes mi OK, haz el merge"**. Un "ok" suelto NO vale.
- **Doble confirmación** antes de `git push` o deploy: (1) resumir qué se sube y que **desplegará la web en Cloudflare**; (2) volver a preguntar y esperar respuesta.
- Usar siempre `scripts/mini-merge.sh` (usa un worktree temporal; no cambia la rama de la carpeta).
- **Un merge NO cierra la sesión.** Después seguir en `dev` con el setup activo y anotar el merge en `.musa/merges.log`.

## 4. Cerrar sesión
- Solo con `@final`, `@end`, "cierra sesión" o "terminar".
- Ejecutar `scripts/session-end.sh` y escribir `docs/SESSION_LATEST_ES.md` y `docs/ROADMAP.md` (español sencillo, cortos): qué se hizo (incluidos los mini-merges), archivos tocados, problemas resueltos, qué queda pendiente y qué recomiendas para la próxima sesión.

## 5. Nunca
- Listar tokens o credenciales.
- Hacer commit en `main`, merge o push sin la frase y la doble confirmación.
- Instalar o copiar skills por defecto (ver `interview.md` / `skills-library`).
- **NUNCA añadir barras fijas/pegajosas inferiores en móvil** (tipo "Reservar / Llamar / Cómo llegar" o botones flotantes abajo). Las webs de MYNEXT tienen estándar de agencia de lujo (10.000 €+): limpias, libres, sin barras invasivas que tapen contenido o parezcan apps genéricas baratas.
- **SIEMPRE mantener Memoria de Navegación (regla UX MYNEXT):** En todas las páginas secundarias (equipo, galería, legales, etc.), el botón de retorno debe decir **«Volver atrás»** y devolver al usuario al punto/píxel exacto (mismo botón o sección) desde donde salió, nunca mandarlo arriba de la página. Especificación completa en `docs/MEMORIA_NAVEGACION.md`.

## 6. Recordatorio obligatorio tras el demo (Astro)
- Cuando Musa comente en el futuro que **ya enseñó la web/demo al cliente y le gustó** (para pasar a trabajar en el proyecto definitivo), **recordarle siempre sin falta** que ese es el momento ideal para **migrar la web a Astro** antes de activar los idiomas **`EN` / `DE`** (rutas SEO separadas) y conectar **InsForge**.

