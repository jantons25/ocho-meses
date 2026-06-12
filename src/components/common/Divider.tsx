/** Separador orgánico dibujado a mano: línea con corazón central. */
export function Divider() {
  return (
    <div className="divider-wrap" aria-hidden>
      <svg width="180" height="26" viewBox="0 0 180 26" fill="none">
        <path
          d="M4 14 C 30 8, 52 18, 74 13"
          stroke="var(--rose)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M90 19 C 84 14, 80 9.5, 83.5 6.5 C 86 4.4, 89 5.6, 90 8 C 91 5.6, 94 4.4, 96.5 6.5 C 100 9.5, 96 14, 90 19 Z"
          fill="var(--burgundy)"
        />
        <path
          d="M106 13 C 128 18, 150 8, 176 14"
          stroke="var(--rose)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
