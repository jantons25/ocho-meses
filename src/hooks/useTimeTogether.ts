import { useEffect, useState } from 'react';

export interface TimeTogether {
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function computeTime(start: Date, now: Date): TimeTogether {
  // Meses calendario completos transcurridos
  let months =
    (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  let anchor = new Date(start);
  anchor.setMonth(start.getMonth() + months);
  if (anchor > now) {
    months -= 1;
    anchor = new Date(start);
    anchor.setMonth(start.getMonth() + months);
  }

  let diff = Math.max(0, now.getTime() - anchor.getTime());
  const days = Math.floor(diff / 86_400_000);
  diff -= days * 86_400_000;
  const hours = Math.floor(diff / 3_600_000);
  diff -= hours * 3_600_000;
  const minutes = Math.floor(diff / 60_000);
  const seconds = Math.floor((diff - minutes * 60_000) / 1000);

  return { months: Math.max(0, months), days, hours, minutes, seconds };
}

/** Tiempo juntos en vivo, actualizado cada segundo. */
export function useTimeTogether(start: Date): TimeTogether {
  const [time, setTime] = useState(() => computeTime(start, new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(computeTime(start, new Date())), 1000);
    return () => clearInterval(id);
  }, [start]);

  return time;
}
