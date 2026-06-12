import { useRef, useState } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import { Reveal } from '../common/Reveal';
import { LOVE } from '../../config/love';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/**
 * Carta romántica con efecto de escritura progresiva ligado al
 * scroll: el texto "se escribe" conforme la hoja avanza en pantalla.
 */
export default function LetterSection() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const fullText = LOVE.letter.body;
  const [chars, setChars] = useState(reduced ? fullText.length : 0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.55'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (reduced) return;
    setChars((prev) => Math.max(prev, Math.round(v * fullText.length)));
  });

  const visible = fullText.slice(0, chars);
  const done = chars >= fullText.length;

  return (
    <section aria-label="Carta de amor">
      <Reveal>
        <p className="section-kicker">Con todo mi corazón</p>
        <h2 className="script-title">Una carta para ti</h2>
      </Reveal>

      <Reveal delay={0.1}>
        <div
          ref={ref}
          style={{
            marginTop: '1.8rem',
            background: 'linear-gradient(175deg, #fffdf8 0%, #faf4ec 60%, #f4eadf 100%)',
            border: '1px solid rgba(198, 138, 155, 0.4)',
            borderRadius: 6,
            padding: '2.2rem 1.6rem 2.4rem',
            boxShadow:
              '0 18px 40px rgba(110, 15, 44, 0.12), inset 0 0 60px rgba(198, 138, 155, 0.06)',
            position: 'relative',
            /* líneas de cuaderno sutiles */
            backgroundImage:
              'repeating-linear-gradient(transparent, transparent 27px, rgba(198, 138, 155, 0.18) 28px)',
          }}
        >
          {/* esquina doblada */}
          <span
            aria-hidden
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 0,
              height: 0,
              borderTop: '26px solid var(--paper)',
              borderLeft: '26px solid rgba(198, 138, 155, 0.25)',
            }}
          />

          <h3
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: '1.9rem',
              color: 'var(--burgundy)',
              marginBottom: '1.1rem',
            }}
          >
            {LOVE.letter.heading}
          </h3>

          <p
            style={{
              fontFamily: 'var(--font-hand)',
              fontSize: '1.18rem',
              lineHeight: '28px',
              whiteSpace: 'pre-line',
              color: 'var(--ink)',
              minHeight: '14em',
            }}
            aria-label={fullText}
          >
            <span aria-hidden>
              {visible}
              {!done && (
                <span
                  style={{
                    display: 'inline-block',
                    width: 2,
                    height: '1em',
                    background: 'var(--burgundy)',
                    verticalAlign: 'text-bottom',
                    animation: 'blink 0.9s step-end infinite',
                  }}
                />
              )}
            </span>
          </p>

          <p
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: '1.6rem',
              color: 'var(--burgundy)',
              textAlign: 'right',
              marginTop: '1.4rem',
              opacity: done ? 1 : 0,
              transition: 'opacity 1.2s ease',
            }}
          >
            {LOVE.letter.signature} ♥
          </p>
        </div>
      </Reveal>

      <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
    </section>
  );
}
