import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { FloatingHearts } from '../common/FloatingHearts';
import { LOVE } from '../../config/love';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/**
 * Hero a pantalla completa: fade cinematográfico de la foto,
 * aparece "8 meses juntos" y el 8 (SVG) gira 90° convirtiéndose
 * en el símbolo infinito mientras el texto cambia.
 */
export function HeroSection() {
  const rootRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const eightRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [phase, setPhase] = useState<'months' | 'infinity'>('months');
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setPhase('infinity');
      return;
    }

    const path = pathRef.current;
    const len = path?.getTotalLength() ?? 600;
    if (path) {
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = `${len}`;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // 1. Fade cinematográfico de la fotografía
      tl.fromTo(
        photoRef.current,
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 2, ease: 'power1.inOut' },
      );

      // 2. El 8 se dibuja trazo a trazo + texto "meses juntos"
      tl.to(pathRef.current, { strokeDashoffset: 0, duration: 1.8, ease: 'power1.inOut' }, '-=0.6');
      tl.fromTo('.hero-caption', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1 }, '-=0.8');

      // 3. Pausa para contemplar, luego el 8 gira 90° → infinito
      tl.to(eightRef.current, {
        rotation: 90,
        scale: 1.12,
        duration: 1.6,
        ease: 'power2.inOut',
        delay: 1.4,
        onStart: () => {
          gsap.to('.hero-caption', { opacity: 0, y: -12, duration: 0.5 });
        },
        onComplete: () => setPhase('infinity'),
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reduced]);

  // 4. Al completarse el giro, entra el texto final
  useEffect(() => {
    if (phase !== 'infinity' || reduced) return;
    gsap.fromTo('.hero-caption', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1 });
  }, [phase, reduced]);

  return (
    <section
      ref={rootRef}
      className="full-bleed"
      style={{
        height: '100svh',
        display: 'grid',
        placeItems: 'center',
        overflow: 'hidden',
        textAlign: 'center',
      }}
      aria-label="8 meses juntos"
    >
      {/* Fotografía de fondo */}
      <div
        ref={photoRef}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(rgba(74, 21, 40, 0.45), rgba(74, 21, 40, 0.62)), url(${LOVE.heroPhoto})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: reduced ? 1 : 0,
        }}
      />

      <FloatingHearts count={12} />
      <SoftParticles />

      <div style={{ position: 'relative', zIndex: 3, padding: '0 1.5rem' }}>
        {/* El 8 que se vuelve infinito */}
        <svg
          ref={eightRef}
          width="150"
          height="230"
          viewBox="0 0 150 230"
          style={{
            display: 'block',
            margin: '0 auto 0.6rem',
            transform: reduced ? 'rotate(90deg)' : undefined,
          }}
          role="img"
          aria-label="El número ocho se transforma en el símbolo infinito"
        >
          <path
            ref={pathRef}
            d="M75 112 C 38 96, 32 30, 75 25 C 118 30, 112 96, 75 112 C 38 128, 32 200, 75 205 C 118 200, 112 128, 75 112 Z"
            fill="none"
            stroke="var(--paper)"
            strokeWidth="9"
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 3px 14px rgba(232, 200, 209, 0.6))' }}
          />
        </svg>

        <p
          className="hero-caption"
          style={{
            fontFamily: 'var(--font-script)',
            fontSize: 'clamp(2rem, 8vw, 2.9rem)',
            color: 'var(--paper)',
            textShadow: '0 2px 16px rgba(74, 21, 40, 0.7)',
            opacity: reduced ? 1 : 0,
            minHeight: '1.4em',
          }}
        >
          {phase === 'months' ? 'meses juntos' : 'Juntos por infinito ♾️'}
        </p>

        <ScrollHint />
      </div>
    </section>
  );
}

function SoftParticles() {
  const particles = Array.from({ length: 14 }, (_, i) => ({
    left: `${(i * 67) % 100}%`,
    top: `${(i * 43) % 100}%`,
    size: 3 + ((i * 29) % 5),
    duration: 5 + ((i * 13) % 6),
    x: `${-14 + ((i * 19) % 28)}px`,
    y: `${-26 + ((i * 23) % 18)}px`,
  }));

  return (
    <div className="soft-particles" style={{ position: 'absolute', inset: 0, zIndex: 2 }} aria-hidden>
      {particles.map((p, i) => (
        <span
          key={i}
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            ['--p-x' as string]: p.x,
            ['--p-y' as string]: p.y,
          }}
        />
      ))}
    </div>
  );
}

function ScrollHint() {
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: 'calc(-38svh + 110px)',
        color: 'var(--rose-light)',
        fontSize: '0.7rem',
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
      }}
      aria-hidden
    >
      <span style={{ display: 'block', marginBottom: 6 }}>Desliza</span>
      <svg width="16" height="22" viewBox="0 0 16 22" style={{ margin: '0 auto', display: 'block' }}>
        <path
          d="M8 2 V18 M3 13 L8 19 L13 13"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 3; 0 0"
            dur="1.6s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>
  );
}
