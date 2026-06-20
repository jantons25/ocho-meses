export interface Memory {
  type: 'photo' | 'video' | 'message';
  title: string;
  text: string;
  /** Foto o póster del video */
  src?: string;
  /** Ruta del video en public/videos (opcional) */
  videoSrc?: string;
}

export const MEMORIES: Memory[] = [
  {
    type: 'photo',
    title: 'Nuestra primera foto',
    text: 'El día que empezó todo, sin saber que sería para siempre.',
    src: '/photos/img018.webp',
  },
  {
    type: 'message',
    title: 'Lo que más amo de ti',
    text: 'Tu risa cuando algo te da vergüenza, tu forma de cuidarme sin que te lo pida, y cómo haces que lo ordinario se sienta extraordinario.',
  },
  {
    type: 'photo',
    title: 'Atardecer en Arequipa',
    text: 'El volcán de testigo y tú de protagonista.',
    src: '/photos/img010.webp',
  },
  {
    type: 'video',
    title: 'Un momento en movimiento',
    text: 'Porque hay recuerdos que merecen verse una y otra vez.',
    src: '/photos/p11.svg',
    videoSrc: '/videos/video001.mp4',
  },
  {
    type: 'photo',
    title: 'Cualquier día contigo',
    text: 'No hace falta una ocasión especial: tú la conviertes en una.',
    src: '/photos/img002.webp',
  },
  {
    type: 'message',
    title: 'Mi promesa',
    text: 'Prometo seguir eligiéndote en los días fáciles y abrazarte más fuerte en los difíciles. Ocho meses son solo el comienzo.',
  },
];
