import business from '../../shared/business.js';

// Roof-over-house mark. Navy house, red roof edge.
export function LogoMark({ size = 48, onDark = false, title }) {
  const house = onDark ? '#FFFFFF' : 'var(--gh-brand)';
  const door = onDark ? 'var(--gh-brand)' : 'var(--gh-paper)';
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 76 53" role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <path d="M4 30 L38 6 L72 30" fill="none" stroke={house} strokeWidth="8" strokeLinejoin="miter" />
      <path d="M46 12 L72 30" fill="none" stroke="var(--gh-accent)" strokeWidth="8" />
      <rect x="18" y="30" width="40" height="20" fill={house} />
      <rect x="33" y="36" width="10" height="14" fill={door} />
    </svg>
  );
}

export function Wordmark({ onDark = false, compact = false }) {
  const [top, ...rest] = business.name.toUpperCase().split(' ');
  const line1 = compact ? business.shortName.toUpperCase() : business.name.toUpperCase().replace(/\s*ROOFING$/, '');
  const line2 = rest.length ? rest[rest.length - 1] : '';
  return (
    <span className="flex flex-col items-center leading-none">
      <span className={`whitespace-nowrap font-display text-2xl font-extrabold tracking-[0.01em] sm:text-[28px] ${onDark ? 'text-white' : 'text-brand'}`}>
        {line1 || top}
      </span>
      {line2 && (
        <span className="mt-1 flex items-center gap-2 font-display text-[11px] font-bold tracking-[0.32em] text-accent sm:text-xs">
          <span className="h-0.5 w-4 bg-accent" />
          {line2}
          <span className="h-0.5 w-4 bg-accent" />
        </span>
      )}
    </span>
  );
}
