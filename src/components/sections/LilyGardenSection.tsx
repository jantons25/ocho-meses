import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useInView } from 'react-intersection-observer';
import { Reveal } from '../common/Reveal';
import { Divider } from '../common/Divider';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const MONTH_LABELS = ['Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May'];

/**
 * Jardín de 8 lirios rosados — uno por cada mes juntos.
 * Emergen desde abajo con GSAP y luego se mecen suavemente.
 */
export default function LilyGardenSection() {
  const gardenRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { ref: inViewRef, inView } = useInView({ triggerOnce: true, threshold: 0.25 });

  useEffect(() => {
    if (!inView || !gardenRef.current) return;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.lily', { opacity: 1, y: 0 });
        gsap.set('.lily-leaf', { opacity: 1 });
        gsap.set('.lily-bloom', { scale: 1, opacity: 1 });
        return;
      }

      // Tallos: dibujo trazo a trazo (sin transformaciones de escala,
      // que en paths SVG producen desplazamientos inconsistentes)
      const stems = gsap.utils.toArray<SVGPathElement>('.lily-stem');
      stems.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });

      const tl = gsap.timeline();
      // Cada lirio emerge desde la parte inferior
      tl.fromTo(
        '.lily',
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', stagger: 0.22 },
      );
      tl.to(
        stems,
        { strokeDashoffset: 0, duration: 1.2, ease: 'power1.inOut', stagger: 0.22 },
        '-=2.2',
      );
      tl.fromTo(
        '.lily-leaf',
        { opacity: 0 },
        { opacity: 0.85, duration: 0.8, stagger: 0.22 },
        '-=2.6',
      );
      // Las flores se abren con un pequeño rebote elegante
      tl.fromTo(
        '.lily-bloom',
        { scale: 0, opacity: 0, transformOrigin: '50% 70%' },
        { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.6)', stagger: 0.22 },
        '-=2.4',
      );
      // Etiquetas de mes
      tl.fromTo(
        '.lily-label',
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
        '-=1.6',
      );
      // Mecido perpetuo, natural y desincronizado
      gsap.utils.toArray<HTMLElement>('.lily').forEach((el, i) => {
        gsap.to(el, {
          rotation: i % 2 === 0 ? 2.4 : -2.4,
          duration: 2.6 + i * 0.25,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          transformOrigin: 'bottom center',
          delay: 2.6,
        });
      });
    }, gardenRef);

    return () => ctx.revert();
  }, [inView, reduced]);

  return (
    <section ref={inViewRef} aria-label="Jardín de 8 lirios, uno por cada mes">
      <Reveal>
        <p className="section-kicker">Un lirio por cada mes</p>
        <h2 className="script-title">Nuestro jardín</h2>
        <Divider />
        <p className="section-sub">
          Ocho lirios rosados, ocho meses floreciendo juntos.
        </p>
      </Reveal>

      <div
        ref={gardenRef}
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: '0.1rem',
          marginTop: '2.2rem',
          paddingBottom: '0.5rem',
          borderBottom: '2px solid rgba(198, 138, 155, 0.35)',
          overflow: 'hidden',
        }}
      >
        {MONTH_LABELS.map((label, i) => (
          <Lily key={label} label={label} tall={i % 3 === 1} />
        ))}
      </div>
    </section>
  );
}

function Lily({ label, tall }: { label: string; tall: boolean }) {
  const h = tall ? 165 : 140;
  return (
    <div className="lily" style={{ opacity: 0, textAlign: 'center', flex: '1 1 0' }}>
      <svg
        width="100%"
        height={h}
        viewBox={`0 0 60 ${h}`}
        style={{ display: 'block', maxWidth: 60, margin: '0 auto' }}
        aria-hidden
      >
        {/* tallo */}
        <path
          className="lily-stem"
          d={`M30 ${h} C 28 ${h - 40}, 33 ${h - 70}, 30 ${h - 95}`}
          stroke="#7a9b76"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        {/* hoja */}
        <path
          className="lily-leaf"
          d={`M30 ${h - 35} C 18 ${h - 42}, 12 ${h - 58}, 16 ${h - 64} C 26 ${h - 58}, 30 ${h - 48}, 30 ${h - 35}`}
          fill="#8fae8b"
          opacity="0.85"
        />
        {/* flor: 6 pétalos de lirio */}
        <g className="lily-bloom" transform={`translate(30 ${h - 100})`}>
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <path
              key={deg}
              d="M0 4 C -9 -8, -7 -26, 0 -32 C 7 -26, 9 -8, 0 4 Z"
              fill={deg % 120 === 0 ? '#e8c8d1' : '#d9a8b8'}
              stroke="#c68a9b"
              strokeWidth="0.8"
              transform={`rotate(${deg})`}
            />
          ))}
          {/* pistilos */}
          {[-18, 0, 18].map((deg) => (
            <line
              key={deg}
              x1="0"
              y1="0"
              x2={Math.sin((deg * Math.PI) / 180) * 13}
              y2={-Math.cos((deg * Math.PI) / 180) * 13}
              stroke="#8b1538"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          ))}
          <circle r="3" fill="#8b1538" />
        </g>
      </svg>
      <span
        className="lily-label"
        style={{
          fontSize: '0.62rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--rose)',
          opacity: 0,
          display: 'block',
          marginTop: 4,
        }}
      >
        {label}
      </span>
    </div>
  );
}
