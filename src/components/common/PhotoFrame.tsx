import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export type FrameShape = 'polaroid' | 'heart' | 'circle' | 'elegant' | 'square';

interface PhotoFrameProps {
  src: string;
  alt: string;
  shape?: FrameShape;
  caption?: string;
  /** Rotación sutil en grados (−4 a 4 recomendado). */
  rotate?: number;
  width?: string;
}

const HEART_CLIP =
  'polygon(50% 100%, 8% 58%, 0% 38%, 4% 18%, 18% 5%, 35% 4%, 50% 16%, 65% 4%, 82% 5%, 96% 18%, 100% 38%, 92% 58%)';

/**
 * Marco fotográfico reutilizable: polaroid, corazón, círculo,
 * marco elegante o cuadrado — con parallax y zoom suaves.
 */
export function PhotoFrame({
  src,
  alt,
  shape = 'square',
  caption,
  rotate = 0,
  width = '100%',
}: PhotoFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [14, -14]);

  const isPolaroid = shape === 'polaroid';
  const isHeart = shape === 'heart';
  const isCircle = shape === 'circle';
  const isElegant = shape === 'elegant';

  return (
    <motion.div
      ref={ref}
      style={{ width, rotate, y: parallaxY, position: 'relative' }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
    >
      <figure
        style={{
          margin: 0,
          background: isPolaroid ? '#fffdf9' : isElegant ? 'var(--paper-alt)' : 'transparent',
          padding: isPolaroid ? '10px 10px 14px' : isElegant ? '10px' : 0,
          borderRadius: isCircle || isHeart ? 0 : isPolaroid ? 4 : 12,
          border: isElegant ? '1px solid var(--rose)' : 'none',
          boxShadow:
            isHeart || isCircle
              ? 'none'
              : '0 12px 30px rgba(110, 15, 44, 0.16), 0 3px 8px rgba(110, 15, 44, 0.08)',
          outline: isElegant ? '1px solid rgba(139, 21, 56, 0.35)' : 'none',
          outlineOffset: isElegant ? '4px' : 0,
        }}
      >
        <div
          style={{
            overflow: 'hidden',
            aspectRatio: isHeart || isCircle ? '1 / 1' : '4 / 5',
            borderRadius: isCircle ? '50%' : isPolaroid ? 2 : 8,
            clipPath: isHeart ? HEART_CLIP : undefined,
            boxShadow: isCircle ? '0 12px 28px rgba(110, 15, 44, 0.2)' : undefined,
            filter: isHeart ? 'drop-shadow(0 10px 18px rgba(110, 15, 44, 0.22))' : undefined,
          }}
        >
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        {caption && (
          <figcaption
            style={{
              fontFamily: 'var(--font-hand)',
              fontSize: '1.05rem',
              color: 'var(--ink)',
              textAlign: 'center',
              paddingTop: isPolaroid ? 8 : 10,
            }}
          >
            {caption}
          </figcaption>
        )}
      </figure>
    </motion.div>
  );
}
