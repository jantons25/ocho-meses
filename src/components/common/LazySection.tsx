import { Suspense } from 'react';
import { useInView } from 'react-intersection-observer';
import type { ReactNode } from 'react';

interface LazySectionProps {
  children: ReactNode;
  /** Altura estimada para evitar saltos de layout antes de montar. */
  minHeight?: string;
}

/**
 * Monta su contenido (componentes React.lazy) solo cuando el usuario
 * se acerca a la sección: el chunk JS no se descarga hasta entonces.
 */
export function LazySection({ children, minHeight = '60vh' }: LazySectionProps) {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '700px 0px' });

  return (
    <div ref={ref} style={{ minHeight: inView ? undefined : minHeight }}>
      {inView && <Suspense fallback={<div style={{ minHeight }} aria-hidden />}>{children}</Suspense>}
    </div>
  );
}
