# Análisis Colorimétrico Exhaustivo del Logo Original de P7

Extracción y análisis pixel por pixel de la imagen del logotipo oficial de P7 Barber Master Studio, procesando **647.728 píxeles** (excluyendo el fondo blanco de recorte).

---

## 1. Conclusiones Clave del Análisis del Logo

1. **Cero Verde (0,0%):** En todo el escudo no existe ni un solo matiz verde. El verde anterior fue una invención conceptual que alejaba a la web de la identidad real de P7.
2. **No es Oro Amarillo Tradicional:** El metal del logotipo **no es amarillo chillón ni dorado cálido**, sino un **Champán Platino / Oro Blanco envejecido y desaturado**. Su saturación cromática media es de apenas **13% a 22%** con tono entre 40° y 48° (muy sobrio, aristocrático y frío).
3. **El Negro Ónix es el 61,3% de la Marca:** Las cintas curvas con las leyendas `"BARBER"`, `"MASTER STUDIO"` y `"SINCE 2023"`, así como los bordes de la filigrana, están construidos sobre negro azabache absoluto (`#000000`) y negro carbono (`#080808` / `#111215`).
4. **Blanco Acero Puro (5,7%):** Las letras talladas en las cintas y las aristas de luz en el centro de las letras "P" y "7" son **Blanco Plata Puro** (`#FFFFFF` y `#F0F0F0`).
5. **Relieve Esculpido y Bajorrelieves (6,3%):** Las sombras de profundidad no son negros planos, sino transiciones de bronce quemado y grafito (`#383028` y `#606060`).

---

## 2. Muestreo de Códigos HEX Extraídos del Logo

| Elemento del Escudo | Color Dominante | Código HEX | RGB | % en el Logo |
|---|---|---|---|---|
| **Cintas y Silueta Exterior** | Negro Ónix Puro | `#000000` | `(0, 0, 0)` | **61,3%** |
| **Bordes de Cinta y Profundidad** | Negro Carbón Grafito | `#080808` / `#111215` | `(8, 8, 8)` | Soporte |
| **Monograma P7 y Filigranas** | Champán Platino Metálico | `#E8D8B8` | `(232, 216, 184)` | **26,7%** |
| **Biseles de Luz en P y 7** | Champán Perla Luminoso | `#F0E8D0` / `#F8F8E8` | `(240, 232, 208)` | Brillo |
| **Sombras y Aristas de Metal** | Bronce Satinado Mate | `#C8B898` / `#B8A880` | `(200, 184, 152)` | Relieve |
| **Letras BARBER MASTER STUDIO** | Blanco Acero Puro | `#FFFFFF` / `#E8E8E8` | `(255, 255, 255)` | **5,7%** |
| **Bajorrelieve y Sombra 3D** | Bronce Quemado Ahumado | `#383028` | `(56, 48, 40)` | **6,3%** |

---

## 3. Propuesta de Nuevos Tokens CSS para `site.css`

```css
:root {
  /* Fondo general y Hero (Negro Ónix y Carbón de la cinta del escudo) */
  --bg-page: #080809;
  --bg-hero: #080809;
  --bg-footer: #080809;

  /* Módulos, tarjetas y contenedores */
  --bg-surface: #111215;
  --bg-surface-elevated: #18191E;

  /* Acento metálico noble (Champán Platino del monograma central) */
  --accent-champagne: #E8D8B8;
  --accent-champagne-light: #F0E8D0;
  --accent-bronze-shadow: #383028;

  /* Tipografía de títulos y alto contraste (Letras talladas del logo) */
  --text-pure-white: #FFFFFF;
  --text-muted: #9A9AA2;

  /* Degradado insignia metálico del escudo */
  --gradient-p7-crest: linear-gradient(
    135deg,
    #383028 0%,
    #E8D8B8 38%,
    #F8F8E8 52%,
    #C8B898 74%,
    #383028 100%
  );
}
```
