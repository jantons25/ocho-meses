import { Reveal } from '../common/Reveal';
import { Divider } from '../common/Divider';
import { PhotoFrame } from '../common/PhotoFrame';
import { TIMELINE } from '../../data/timeline';

/** Línea de tiempo vertical con los 8 hitos de la relación. */
export default function TimelineSection() {
  return (
    <section aria-label="Nuestra historia">
      <Reveal>
        <p className="section-kicker">Capítulo a capítulo</p>
        <h2 className="script-title">Nuestra historia</h2>
        <Divider />
      </Reveal>

      <div style={{ position: 'relative', paddingLeft: '1.7rem' }}>
        {/* Línea orgánica central */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: 7,
            top: 8,
            bottom: 8,
            width: 2,
            background:
              'linear-gradient(to bottom, var(--rose-light), var(--rose), var(--burgundy))',
            borderRadius: 2,
          }}
        />

        {TIMELINE.map((event, i) => (
          <Reveal key={event.date} delay={0.08} className="">
            <article style={{ position: 'relative', paddingBottom: '3.2rem' }}>
              {/* Nodo corazón sobre la línea */}
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  left: 'calc(-1.7rem + 1px)',
                  top: 2,
                  fontSize: 13,
                  color: 'var(--burgundy)',
                  background: 'var(--paper)',
                  lineHeight: 1,
                  padding: '2px 0',
                }}
              >
                ♥
              </span>

              <p
                style={{
                  fontSize: '0.7rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--rose)',
                  marginBottom: '0.3rem',
                }}
              >
                {event.date}
              </p>
              <h3
                style={{
                  fontFamily: 'var(--font-hand)',
                  fontWeight: 600,
                  fontSize: '1.5rem',
                  color: 'var(--burgundy)',
                  marginBottom: '0.7rem',
                }}
              >
                {event.title}
              </h3>

              <div style={{ maxWidth: 280, margin: '0 auto 0.9rem' }}>
                <PhotoFrame
                  src={event.image}
                  alt={event.title}
                  shape={event.shape}
                  rotate={i % 2 === 0 ? -2 : 2}
                />
              </div>

              <p style={{ fontSize: '0.9rem', fontWeight: 300, lineHeight: 1.7 }}>
                {event.description}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
