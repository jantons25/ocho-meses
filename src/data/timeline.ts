import type { FrameShape } from '../components/common/PhotoFrame';

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  image: string;
  shape: FrameShape;
}

export const TIMELINE: TimelineEvent[] = [
  {
    date: '12 · Octubre · 2025',
    title: 'El comienzo de todo',
    description: 'El día en que dijimos sí y el mundo se volvió más hermoso.',
    image: '/photos/img008.webp',
    shape: 'polaroid',
  },
  {
    date: '12 · Noviembre · 2025',
    title: 'Nuestro primer mes',
    description: 'Treinta días que se sintieron como un suspiro y una eternidad a la vez.',
    image: '/photos/img007.webp',
    shape: 'heart',
  },
  {
    date: '25 · Diciembre · 2025',
    title: 'Una navidad juntos',
    description: 'Luces, abrazos, adornos y una navidad donde el mejor regalo eras tú.',
    image: '/photos/img003.webp',
    shape: 'elegant',
  },
  {
    date: '01 · Enero · 2026',
    title: 'Año nuevo, mismo amor',
    description: 'Empezamos el año con un beso y una promesa: muchos más juntos.',
    image: '/photos/img014.webp',
    shape: 'circle',
  },
  {
    date: '12 · Febrero · 2026',
    title: 'Cuatro meses de nosotros',
    description: 'Aprendimos que el amor también vive y crece a pesar de la distancia.',
    image: '/photos/img015.webp',
    shape: 'square',
  },
  {
    date: '12 · Marzo · 2026',
    title: 'Aventuras compartidas',
    description: 'Nuevos lugares, nuevas risas, la misma mano entrelazada.',
    image: '/photos/img004.webp',
    shape: 'polaroid',
  },
  {
    date: '12 · Abril · 2026',
    title: 'Medio año y más',
    description: 'Seis meses confirmando que contigo todo es mejor.',
    image: '/photos/img011.webp',
    shape: 'elegant',
  },
  {
    date: '12 · Junio · 2026',
    title: 'Ocho meses, un infinito',
    description: 'Hoy celebramos lo vivido y soñamos todo lo que viene.',
    image: '/photos/img013.webp',
    shape: 'heart',
  },
];
