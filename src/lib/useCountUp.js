import { useEffect, useRef, useState } from 'react';

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Animates a number from where it was to `target` (from 0 on first load).
export default function useCountUp(target, { duration = 900, delay = 0 } = {}) {
  const [value, setValue] = useState(() => (reduced() ? target : 0));
  const from = useRef(reduced() ? target : 0);

  useEffect(() => {
    if (reduced()) {
      setValue(target);
      from.current = target;
      return;
    }
    let raf;
    let start;
    const startValue = from.current;
    const timer = setTimeout(() => {
      const step = (t) => {
        if (start === undefined) start = t;
        const p = Math.min(1, (t - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(startValue + (target - startValue) * eased);
        if (p < 1) raf = requestAnimationFrame(step);
        else from.current = target;
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [target, duration, delay]);

  return Math.round(value);
}
