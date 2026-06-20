import { memo, useCallback, useMemo, useState } from 'react';
import { Reveal } from '../common/Reveal';
import { Divider } from '../common/Divider';
import {
  TRAVEL_REGIONS,
  TRAVEL_MAP_WIDTH,
  TRAVEL_MAP_HEIGHT,
  type TravelRegion,
} from '../../data/travelMap';

interface TravelMapSectionProps {
  /** Subtítulo de la placa inferior (configurable). */
  subtitle?: string;
  /** Punto de extensión para futuras funcionalidades (sin lógica de negocio). */
  onRegionClick?: (region: TravelRegion) => void;
}

/**
 * Mapa decorativo del Perú: cada departamento es una pieza interactiva al
 * estilo de una marquetería de madera. Las regiones con `imagen` muestran la
 * foto recortada dentro de su silueta exacta; el resto muestra solo su nombre.
 *
 * Rinde como una extensión nativa del sitio: usa las mismas variables de color,
 * tipografías y patrones (Reveal, Divider, .section-*) que el resto de la web.
 */
export default function TravelMapSection({
  subtitle = 'Cada lugar del Perú, un recuerdo nuestro',
  onRegionClick,
}: TravelMapSectionProps) {
  // Región "al frente" en hover/foco — solo reordena el pintado para que la
  // pieza elevada quede por encima de sus vecinas. No re-renderiza las piezas.
  const [active, setActive] = useState<string | null>(null);

  const handleSelect = useCallback(
    (region: TravelRegion) => {
      onRegionClick?.(region);
    },
    [onRegionClick],
  );

  // Lleva la región activa al final del orden de pintado (queda al frente).
  const ordered = useMemo(() => {
    if (!active) return TRAVEL_REGIONS;
    const rest = TRAVEL_REGIONS.filter((r) => r.id !== active);
    const top = TRAVEL_REGIONS.find((r) => r.id === active);
    return top ? [...rest, top] : TRAVEL_REGIONS;
  }, [active]);

  return (
    <section aria-label="Mapa de nuestras aventuras por el Perú">
      <Reveal>
        <p className="section-kicker">Nuestro mapa</p>
        <h2 className="script-title">Nuestras Aventuras</h2>
        <Divider />
        <p className="section-sub">
          Cada región que pisamos juntos guarda un recuerdo. Toca una para revivirlo.
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="tm-stage">
          <TravelDecorations />

          <svg
            className="tm-map"
            viewBox={`0 0 ${TRAVEL_MAP_WIDTH} ${TRAVEL_MAP_HEIGHT}`}
            role="group"
            aria-label="Mapa del Perú dividido por regiones"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="tm-board" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--paper)" />
                <stop offset="100%" stopColor="var(--paper-alt)" />
              </linearGradient>
              {/* clip por región: la foto nunca se sale de su silueta */}
              {TRAVEL_REGIONS.filter((r) => r.imagen).map((r) => (
                <clipPath key={r.id} id={`tm-clip-${r.id}`}>
                  <path d={r.d} />
                </clipPath>
              ))}
            </defs>

            {/* tablero de fondo (la "madera") */}
            <rect
              x="0"
              y="0"
              width={TRAVEL_MAP_WIDTH}
              height={TRAVEL_MAP_HEIGHT}
              rx="28"
              fill="url(#tm-board)"
            />

            {ordered.map((region) => (
              <Region
                key={region.id}
                region={region}
                onSelect={handleSelect}
                onActivate={setActive}
              />
            ))}
          </svg>

          <div className="tm-plaque" aria-hidden="false">
            <span className="tm-plaque-title">Nuestras Aventuras</span>
            <span className="tm-plaque-sub">{subtitle}</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */

interface RegionProps {
  region: TravelRegion;
  onSelect: (region: TravelRegion) => void;
  onActivate: (id: string | null) => void;
}

/** Una pieza del mapa: silueta + (foto recortada) + nombre. Memoizada. */
const Region = memo(function Region({ region, onSelect, onActivate }: RegionProps) {
  const { id, nombre, imagen, d, cx, cy, bx, by, bw } = region;
  const hasImage = Boolean(imagen);

  const select = useCallback(() => onSelect(region), [onSelect, region]);
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(region);
      }
    },
    [onSelect, region],
  );

  // Con foto: nombre arriba (pequeño, alto contraste). Sin foto: al centro.
  const labelX = hasImage ? bx + bw / 2 : cx;
  const labelY = hasImage ? by + 24 : cy;

  return (
    <g
      className="tm-region"
      role="button"
      tabIndex={0}
      aria-label={hasImage ? `${nombre} (con foto)` : nombre}
      onClick={select}
      onKeyDown={onKeyDown}
      onMouseEnter={() => onActivate(id)}
      onMouseLeave={() => onActivate(null)}
      onFocus={() => onActivate(id)}
      onBlur={() => onActivate(null)}
    >
      {/* base de la pieza (también el "marco" visible bajo la foto) */}
      <path className="tm-region-shape" d={d} />

      {hasImage && (
        <image
          href={imagen}
          x={bx}
          y={by}
          width={bw}
          height={region.bh}
          clipPath={`url(#tm-clip-${id})`}
          preserveAspectRatio="xMidYMid slice"
          {...({ loading: 'lazy' } as Record<string, string>)}
        >
          <title>{nombre}</title>
        </image>
      )}

      {/* contorno siempre visible por encima de la foto */}
      <path className="tm-region-outline" d={d} />

      <text
        className={hasImage ? 'tm-label tm-label-over' : 'tm-label'}
        x={labelX}
        y={labelY}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {nombre}
      </text>
    </g>
  );
});

/* ------------------------------------------------------------------ */

/** Elementos decorativos (avión, palmera, maleta, brújula) tipo grabado. */
function TravelDecorations() {
  return (
    <div className="tm-decorations" aria-hidden="true">
      <svg className="tm-deco tm-deco-palm" viewBox="0 0 48 48" fill="none">
        <path
          d="M24 44V22"
          stroke="var(--gold)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M24 22C24 22 16 14 6 16M24 22C24 22 32 14 42 16M24 22C24 22 18 11 22 4M24 22C24 22 30 12 33 6M24 22C24 22 14 20 9 26M24 22c0 0 10 -2 15 4"
          stroke="var(--rose)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>

      <svg className="tm-deco tm-deco-plane" viewBox="0 0 48 48" fill="none">
        <path
          d="M44 14 L8 24 L18 27 L22 38 L27 29 L40 33 Z"
          stroke="var(--rose)"
          strokeWidth="1.6"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      <svg className="tm-deco tm-deco-bag" viewBox="0 0 48 48" fill="none">
        <rect
          x="10"
          y="16"
          width="28"
          height="24"
          rx="4"
          stroke="var(--gold)"
          strokeWidth="1.8"
        />
        <path
          d="M19 16v-4a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v4M24 16v24"
          stroke="var(--gold)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>

      <svg className="tm-deco tm-deco-compass" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="18" stroke="var(--rose)" strokeWidth="1.6" />
        <path
          d="M24 24 L31 17 L26 26 L17 31 Z"
          fill="var(--burgundy)"
          opacity="0.65"
        />
      </svg>
    </div>
  );
}
