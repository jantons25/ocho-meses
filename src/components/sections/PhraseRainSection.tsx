import { useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { PHRASES } from '../../data/phrases';
import { LOVE } from '../../config/love';

const TOTAL = 100;

/**
 * Lluvia de 100 frases románticas sobre una fotografía de la pareja.
 * Cada frase varía en velocidad, tamaño y opacidad. Las animaciones
 * se pausan cuando la sección sale de pantalla (ahorro de batería).
 */
export default function PhraseRainSection() {
  const { ref, inView } = useInView({ threshold: 0 });

  const drops = useMemo(
    () =>
      Array.from({ length: TOTAL }, (_, i) => ({
        text: PHRASES[i % PHRASES.length],
        left: `${(i * 37 + 11) % 96}%`,
        fontSize: `${0.78 + ((i * 17) % 70) / 100}rem`,
        opacity: 0.3 + ((i * 23) % 60) / 100,
        duration: 9 + ((i * 13) % 14),
        delay: -((i * 41) % 22),
      })),
    [],
  );

  return (
    <section
      ref={ref}
      className="full-bleed"
      style={{
        minHeight: '110svh',
        backgroundImage: `linear-gradient(rgba(110, 15, 44, 0.55), rgba(74, 21, 40, 0.7)), url(${LOVE.rainPhoto})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
        display: 'grid',
        placeItems: 'center',
      }}
      aria-label="Lluvia de frases de amor"
    >
      <div aria-hidden style={{ position: 'absolute', inset: 0 }}>
        {drops.map((d, i) => (
          <span
            key={i}
            className="phrase-drop"
            style={{
              left: d.left,
              fontSize: d.fontSize,
              opacity: d.opacity,
              animationDuration: `${d.duration}s`,
              animationDelay: `${d.delay}s`,
              animationPlayState: inView ? 'running' : 'paused',
            }}
          >
            {d.text}
          </span>
        ))}
      </div>

      <h2
        style={{
          position: 'relative',
          zIndex: 2,
          fontFamily: 'var(--font-script)',
          fontSize: 'clamp(2.2rem, 9vw, 3.2rem)',
          color: 'var(--paper)',
          textAlign: 'center',
          textShadow: '0 2px 18px rgba(74, 21, 40, 0.8)',
          padding: '0 1.5rem',
        }}
      >
        Todo lo que eres para mí
      </h2>
    </section>
  );
}
