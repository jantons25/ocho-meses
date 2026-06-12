import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Reveal } from '../common/Reveal';
import { Divider } from '../common/Divider';
import { MEMORIES } from '../../data/memories';

const SWIPE_THRESHOLD = 60;

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 280 : -280, opacity: 0, rotate: dir > 0 ? 4 : -4 }),
  center: { x: 0, opacity: 1, rotate: 0 },
  exit: (dir: number) => ({ x: dir > 0 ? -280 : 280, opacity: 0, rotate: dir > 0 ? -4 : 4 }),
};

/** Carrusel tipo álbum: fotos, videos y mensajes especiales. */
export default function MemoriesSection() {
  const [[index, direction], setPage] = useState<[number, number]>([0, 0]);
  const memory = MEMORIES[index];

  const paginate = (dir: number) => {
    setPage([(index + dir + MEMORIES.length) % MEMORIES.length, dir]);
  };

  return (
    <section aria-label="Recuerdos destacados">
      <Reveal>
        <p className="section-kicker">Para no olvidar jamás</p>
        <h2 className="script-title">Recuerdos destacados</h2>
        <Divider />
      </Reveal>

      <Reveal delay={0.1}>
        <div style={{ position: 'relative', minHeight: 430, marginTop: '1rem' }}>
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.article
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 240, damping: 28 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={(_, info) => {
                if (info.offset.x < -SWIPE_THRESHOLD) paginate(1);
                else if (info.offset.x > SWIPE_THRESHOLD) paginate(-1);
              }}
              style={{
                background: '#fffdf9',
                borderRadius: 16,
                padding: '1.1rem 1.1rem 1.5rem',
                boxShadow: '0 16px 38px rgba(110, 15, 44, 0.16)',
                border: '1px solid rgba(198, 138, 155, 0.35)',
                cursor: 'grab',
                touchAction: 'pan-y',
              }}
            >
              {memory.type === 'message' ? (
                <div
                  style={{
                    aspectRatio: '4 / 3',
                    display: 'grid',
                    placeItems: 'center',
                    background:
                      'radial-gradient(circle at 50% 30%, rgba(232, 200, 209, 0.5), transparent 70%)',
                    borderRadius: 10,
                    padding: '1.4rem',
                  }}
                >
                  <span style={{ fontSize: '2rem', color: 'var(--burgundy)' }} aria-hidden>
                    ❝
                  </span>
                </div>
              ) : memory.type === 'video' && memory.videoSrc ? (
                <video
                  src={memory.videoSrc}
                  poster={memory.src}
                  controls
                  playsInline
                  preload="none"
                  style={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', borderRadius: 10, background: 'var(--paper-alt)' }}
                />
              ) : (
                <img
                  src={memory.src}
                  alt={memory.title}
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', borderRadius: 10 }}
                />
              )}

              <h3
                style={{
                  fontFamily: 'var(--font-hand)',
                  fontWeight: 600,
                  fontSize: '1.4rem',
                  color: 'var(--burgundy)',
                  margin: '0.9rem 0 0.4rem',
                  textAlign: 'center',
                }}
              >
                {memory.title}
              </h3>
              <p
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 300,
                  lineHeight: 1.7,
                  textAlign: 'center',
                  color: 'rgba(74, 37, 48, 0.85)',
                }}
              >
                {memory.text}
              </p>
            </motion.article>
          </AnimatePresence>
        </div>

        {/* Controles */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.2rem',
            marginTop: '1.2rem',
          }}
        >
          <CarouselButton label="Recuerdo anterior" onClick={() => paginate(-1)}>
            ‹
          </CarouselButton>
          <div style={{ display: 'flex', gap: 8 }} role="tablist" aria-label="Recuerdos">
            {MEMORIES.map((m, i) => (
              <button
                key={m.title}
                role="tab"
                aria-selected={i === index}
                aria-label={m.title}
                onClick={() => setPage([i, i > index ? 1 : -1])}
                style={{
                  width: i === index ? 22 : 8,
                  height: 8,
                  borderRadius: 99,
                  border: 'none',
                  background: i === index ? 'var(--burgundy)' : 'var(--rose-light)',
                  transition: 'all 0.35s ease',
                  cursor: 'pointer',
                  padding: 0,
                }}
              />
            ))}
          </div>
          <CarouselButton label="Siguiente recuerdo" onClick={() => paginate(1)}>
            ›
          </CarouselButton>
        </div>
      </Reveal>
    </section>
  );
}

function CarouselButton({
  children,
  label,
  onClick,
}: {
  children: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        border: '1px solid var(--rose)',
        background: 'rgba(255, 253, 249, 0.9)',
        color: 'var(--burgundy)',
        fontSize: 22,
        lineHeight: 1,
        cursor: 'pointer',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      {children}
    </button>
  );
}
