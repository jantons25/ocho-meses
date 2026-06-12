import { useMemo } from 'react';
import { Reveal } from '../common/Reveal';
import { FloatingHearts } from '../common/FloatingHearts';
import { LOVE } from '../../config/love';

/** Cierre emocional: mensaje final, corazones y pétalos rosados. */
export default function FinaleSection() {
  const petals = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        left: `${(i * 61 + 7) % 100}%`,
        duration: 8 + ((i * 19) % 9),
        delay: -((i * 47) % 15),
        drift: `${-50 + ((i * 33) % 100)}px`,
        scale: 0.7 + ((i * 13) % 50) / 100,
      })),
    [],
  );

  return (
    <section
      className="full-bleed"
      style={{
        minHeight: '100svh',
        display: 'grid',
        placeItems: 'center',
        background:
          'linear-gradient(180deg, var(--paper) 0%, var(--rose-light) 45%, var(--burgundy) 130%)',
        overflow: 'hidden',
        textAlign: 'center',
      }}
      aria-label="Mensaje final"
    >
      <div aria-hidden style={{ position: 'absolute', inset: 0 }}>
        {petals.map((p, i) => (
          <span
            key={i}
            className="petal"
            style={{
              left: p.left,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              transform: `scale(${p.scale})`,
              ['--petal-drift' as string]: p.drift,
            }}
          />
        ))}
      </div>
      <FloatingHearts count={8} color="var(--burgundy)" />

      <div style={{ position: 'relative', zIndex: 3, padding: '4rem 1.8rem', maxWidth: 460 }}>
        <Reveal>
          <span style={{ fontSize: '2rem' }} aria-hidden>
            ∞
          </span>
        </Reveal>
        {LOVE.finale.lines.map((line, i) => (
          <Reveal key={line} delay={0.3 + i * 0.35}>
            <p
              style={{
                fontFamily: i === LOVE.finale.lines.length - 1 ? 'var(--font-script)' : 'var(--font-hand)',
                fontSize: i === LOVE.finale.lines.length - 1 ? '2rem' : '1.35rem',
                lineHeight: 1.6,
                color: 'var(--burgundy-deep)',
                margin: '1.1rem 0',
                textShadow: '0 1px 12px rgba(247, 242, 237, 0.5)',
              }}
            >
              {line}
            </p>
          </Reveal>
        ))}
        <Reveal delay={1.6}>
          <p
            style={{
              marginTop: '2.5rem',
              fontSize: '0.7rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(110, 15, 44, 0.7)',
            }}
          >
            8 meses · y contando ♥
          </p>
        </Reveal>
      </div>
    </section>
  );
}
