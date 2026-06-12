import { useMemo } from 'react';

interface FloatingHeartsProps {
  count?: number;
  /** Color CSS de los corazones. */
  color?: string;
}

/** Corazones que ascienden suavemente — animación CSS de bajo costo. */
export function FloatingHearts({ count = 10, color }: FloatingHeartsProps) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${(i * 97) % 100}%`,
        size: 12 + ((i * 53) % 16),
        duration: 9 + ((i * 31) % 8),
        delay: -((i * 73) % 12),
        drift: `${-30 + ((i * 41) % 60)}px`,
        opacity: 0.35 + ((i * 17) % 40) / 100,
      })),
    [count],
  );

  return (
    <div className="floating-hearts" aria-hidden>
      {hearts.map((h, i) => (
        <span
          key={i}
          style={{
            left: h.left,
            fontSize: h.size,
            color,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            ['--h-drift' as string]: h.drift,
            ['--h-opacity' as string]: h.opacity,
          }}
        >
          ♥
        </span>
      ))}
    </div>
  );
}
