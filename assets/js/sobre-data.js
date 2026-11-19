/**
 * Contrato de datos local para "Sobre nosotros" (Galería 1 + Equipo de 3 barberos).
 * Preparado para sustituir únicamente esta fuente por una consulta a InsForge
 * (Database + Storage) en la fase de backend sin modificar el HTML ni el CSS.
 */

export const GALERIA_1 = [
  {
    id: 'gal1-01',
    gallerySlug: 'galeria-1',
    order: 1,
    isPlaceholder: true,
    src: './assets/img/opt/salon-mediterraneo-900w.webp',
    srcsetAvif:
      './assets/img/opt/salon-mediterraneo-480w.avif 480w, ./assets/img/opt/salon-mediterraneo-900w.avif 900w, ./assets/img/opt/salon-mediterraneo-1400w.avif 1400w',
    srcsetWebp:
      './assets/img/opt/salon-mediterraneo-480w.webp 480w, ./assets/img/opt/salon-mediterraneo-900w.webp 900w, ./assets/img/opt/salon-mediterraneo-1400w.webp 1400w',
    alt: 'Interior del estudio P7 Barber Master Studio en Palma de Mallorca con sillón de barbero clásico y luz natural',
  },
  {
    id: 'gal1-02',
    gallerySlug: 'galeria-1',
    order: 2,
    isPlaceholder: true,
    src: './assets/img/opt/hero-atelier-900w.webp',
    srcsetAvif:
      './assets/img/opt/hero-atelier-480w.avif 480w, ./assets/img/opt/hero-atelier-900w.avif 900w, ./assets/img/opt/hero-atelier-1400w.avif 1400w',
    srcsetWebp:
      './assets/img/opt/hero-atelier-480w.webp 480w, ./assets/img/opt/hero-atelier-900w.webp 900w, ./assets/img/opt/hero-atelier-1400w.webp 1400w',
    alt: 'Atmósfera privada de P7 Barber Master Studio con madera oscura, iluminación cálida y tocadores individuales',
  },
  {
    id: 'gal1-03',
    gallerySlug: 'galeria-1',
    order: 3,
    isPlaceholder: true,
    src: './assets/img/opt/corte-navaja-oro-900w.webp',
    srcsetAvif:
      './assets/img/opt/corte-navaja-oro-480w.avif 480w, ./assets/img/opt/corte-navaja-oro-900w.avif 900w, ./assets/img/opt/corte-navaja-oro-1400w.avif 1400w',
    srcsetWebp:
      './assets/img/opt/corte-navaja-oro-480w.webp 480w, ./assets/img/opt/corte-navaja-oro-900w.webp 900w, ./assets/img/opt/corte-navaja-oro-1400w.webp 1400w',
    alt: 'Estación de trabajo artesanal con navaja clásica, tijeras de precisión y ritual de toalla caliente',
  },
  {
    id: 'gal1-04',
    gallerySlug: 'galeria-1',
    order: 4,
    isPlaceholder: true,
    src: './assets/img/opt/salon-lounge-900w.webp',
    srcsetAvif:
      './assets/img/opt/salon-lounge-480w.avif 480w, ./assets/img/opt/salon-lounge-900w.avif 900w',
    srcsetWebp:
      './assets/img/opt/salon-lounge-480w.webp 480w, ./assets/img/opt/salon-lounge-900w.webp 900w',
    alt: 'Zona de espera del estudio con sillón de cuero esmeralda, estantería de madera y luz cálida',
  },
];

export const EQUIPO = [
  {
    id: 'barbero-01',
    name: 'Manu',
    role: 'Fundador y Maestro Barbero',
    bio: 'Dirige P7 desde 2023. Especialista en degradados milimétricos, arquitectura de corte a tijera y ritual clásico de barba con navaja y toalla caliente.',
    photo: {
      src: './assets/img/opt/manu-portrait-900w.webp',
      srcsetAvif:
        './assets/img/opt/manu-portrait-480w.avif 480w, ./assets/img/opt/manu-portrait-900w.avif 900w, ./assets/img/opt/manu-portrait-1400w.avif 1400w',
      srcsetWebp:
        './assets/img/opt/manu-portrait-480w.webp 480w, ./assets/img/opt/manu-portrait-900w.webp 900w, ./assets/img/opt/manu-portrait-1400w.webp 1400w',
      alt: 'Retrato de Manu, fundador y maestro barbero de P7 Barber Master Studio',
    },
    isPlaceholder: false,
  },
  {
    id: 'barbero-02',
    name: 'Carlos Vega',
    role: 'Barbero especialista',
    bio: 'Especializado en degradados a cero, perfilado limpio a navaja, diseño de contornos y trabajos de coloración masculina, desde mechas sutiles hasta tintes completos.',
    specialties: ['Skin fade', 'Color y tintes', 'Perfilado a navaja'],
    photo: {
      src: './assets/img/opt/corte-navaja-oro-900w.webp',
      srcsetAvif:
        './assets/img/opt/corte-navaja-oro-480w.avif 480w, ./assets/img/opt/corte-navaja-oro-900w.avif 900w',
      srcsetWebp:
        './assets/img/opt/corte-navaja-oro-480w.webp 480w, ./assets/img/opt/corte-navaja-oro-900w.webp 900w',
      alt: 'Retrato de Carlos Vega, especialista en fade, perfilado y color en P7 Barber Master Studio',
    },
    isPlaceholder: true,
  },
  {
    id: 'barbero-03',
    name: 'Mateo Ruiz',
    role: 'Barbero especialista',
    bio: 'Enfocado en cortes clásicos a tijera, cabellos medios y largos con caída natural y arreglo integral de barba con vapor, aceites esenciales y toalla caliente.',
    specialties: ['Tijera clásica', 'Cabello medio y largo', 'Ritual de barba'],
    photo: {
      src: './assets/img/opt/hero-atelier-900w.webp',
      srcsetAvif:
        './assets/img/opt/hero-atelier-480w.avif 480w, ./assets/img/opt/hero-atelier-900w.avif 900w',
      srcsetWebp:
        './assets/img/opt/hero-atelier-480w.webp 480w, ./assets/img/opt/hero-atelier-900w.webp 900w',
      alt: 'Retrato de Mateo Ruiz, especialista en corte clásico a tijera y ritual de barba en P7 Barber Master Studio',
    },
    isPlaceholder: true,
  },
];
