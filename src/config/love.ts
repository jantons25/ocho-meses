/**
 * Único punto de personalización: cambia aquí fechas, textos,
 * rutas de fotos y música, y toda la web se actualiza.
 */
export const LOVE = {
  // Fecha en que empezó la relación (8 meses antes del 12 de junio de 2026)
  startDate: new Date(2025, 9, 12, 0, 0, 0), // 12 de octubre de 2025

  heroPhoto: '/photos/hero.svg',
  rainPhoto: '/photos/rain-bg.svg',

  // Coloca tu canción en public/audio/cancion.mp3
  audioSrc: '/audio/cancion.mp3',

  firstDate: {
    lat: -6.8367,
    lng: -79.9342,
    place: 'Pimentel, Chiclayo, Perú',
    date: '12 de junio',
    message: 'Aquí, frente al mar, comenzó la mejor historia de mi vida.',
  },

  letter: {
    heading: 'Para ti, mi amor',
    body: `Hoy cumplimos ocho meses y todavía me sorprende lo natural que se siente amarte.

Gracias por cada risa compartida, por cada momento vivido, por cada plan y aventura juntos que terminó siendo perfecto solo porque estabas tú.

Me enseñaste un amor bonito, que crece a pesar de la distancia generando una costumbre hermosa: elegirte cada mañana, extrañarte siempre y agradecerte por toda la vida.

No sé qué nos espera, pero sé que quiero descubrirlo contigo.`,
    signature: 'Tuyo, por infinito',
  },

  finale: {
    lines: [
      'Gracias por estos maravillosos 8 meses.',
      'Cada día contigo confirma que eres el amor de mi vida.',
      'Te amo hoy, mañana y por infinito.',
    ],
  },
} as const;
