import { Reveal } from '../common/Reveal';
import { PhotoFrame } from '../common/PhotoFrame';
import type { FrameShape } from '../common/PhotoFrame';

interface InterludePhoto {
  src: string;
  alt: string;
  shape: FrameShape;
  caption?: string;
  rotate?: number;
}

interface GalleryInterludeProps {
  photos: InterludePhoto[];
  quote?: string;
}

/**
 * Mini-collage fotográfico que se intercala entre secciones:
 * así las fotos viven distribuidas por toda la experiencia
 * en lugar de concentrarse en una galería tradicional.
 */
export default function GalleryInterlude({ photos, quote }: GalleryInterludeProps) {
  return (
    <section aria-label="Momentos juntos" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      {quote && (
        <Reveal>
          <p
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: '1.7rem',
              color: 'var(--rose)',
              textAlign: 'center',
              marginBottom: '1.8rem',
            }}
          >
            {quote}
          </p>
        </Reveal>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1.1rem',
          alignItems: 'start',
        }}
      >
        {photos.map((photo, i) => (
          <Reveal key={photo.src} delay={i * 0.12} y={34}>
            <div style={{ marginTop: i % 2 === 1 ? '1.8rem' : 0 }}>
              <PhotoFrame {...photo} rotate={photo.rotate ?? (i % 2 === 0 ? -2.5 : 2.5)} />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
