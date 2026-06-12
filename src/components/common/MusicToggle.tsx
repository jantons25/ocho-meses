import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { LOVE } from '../../config/love';

/**
 * Control de música flotante. Intenta iniciar con la primera
 * interacción (los navegadores bloquean el autoplay con sonido).
 */
export function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    const tryPlay = () => {
      audioRef.current?.play().catch(() => undefined);
    };
    window.addEventListener('pointerdown', tryPlay, { once: true });
    return () => window.removeEventListener('pointerdown', tryPlay);
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => undefined);
    else audio.pause();
  };

  if (!available) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src={LOVE.audioSrc}
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setAvailable(false)}
      />
      <motion.button
        onClick={toggle}
        aria-label={playing ? 'Pausar música' : 'Reproducir música'}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.5, duration: 0.6 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'fixed',
          right: 16,
          bottom: 16,
          zIndex: 50,
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: '1px solid var(--rose)',
          background: 'rgba(247, 242, 237, 0.92)',
          backdropFilter: 'blur(6px)',
          color: 'var(--burgundy)',
          fontSize: 20,
          cursor: 'pointer',
          boxShadow: '0 6px 18px rgba(110, 15, 44, 0.25)',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <motion.span
          animate={playing ? { scale: [1, 1.15, 1] } : { scale: 1 }}
          transition={playing ? { repeat: Infinity, duration: 1.2 } : undefined}
        >
          {playing ? '♫' : '♪'}
        </motion.span>
      </motion.button>
    </>
  );
}
