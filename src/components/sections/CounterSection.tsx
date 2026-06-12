import { Reveal } from '../common/Reveal';
import { Divider } from '../common/Divider';
import { useTimeTogether } from '../../hooks/useTimeTogether';
import { LOVE } from '../../config/love';

const UNITS: { key: keyof ReturnType<typeof useTimeTogether>; label: string }[] = [
  { key: 'months', label: 'Meses' },
  { key: 'days', label: 'Días' },
  { key: 'hours', label: 'Horas' },
  { key: 'minutes', label: 'Min' },
  { key: 'seconds', label: 'Seg' },
];

/** Contador en tiempo real desde el inicio de la relación. */
export default function CounterSection() {
  const time = useTimeTogether(LOVE.startDate);

  return (
    <section aria-label="Tiempo juntos">
      <Reveal>
        <p className="section-kicker">Cada segundo cuenta</p>
        <h2 className="script-title">Nuestro tiempo juntos</h2>
        <Divider />
      </Reveal>

      <Reveal delay={0.15}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '0.5rem',
          }}
          role="timer"
          aria-live="off"
        >
          {UNITS.map(({ key, label }) => (
            <div
              key={key}
              style={{
                background: 'rgba(255, 253, 249, 0.75)',
                border: '1px solid var(--rose-light)',
                borderRadius: 14,
                padding: '0.9rem 0.2rem',
                textAlign: 'center',
                boxShadow: '0 6px 16px rgba(110, 15, 44, 0.07)',
              }}
            >
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-hand)',
                  fontWeight: 600,
                  fontSize: 'clamp(1.5rem, 6.5vw, 2.1rem)',
                  color: 'var(--burgundy)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {String(time[key]).padStart(2, '0')}
              </span>
              <span
                style={{
                  fontSize: '0.62rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--rose)',
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
        <p className="section-sub">…y seguimos sumando, sin prisa y sin pausa.</p>
      </Reveal>
    </section>
  );
}
