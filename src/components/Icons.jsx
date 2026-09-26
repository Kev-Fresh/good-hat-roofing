const base = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

export const Arrow = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="2.2" {...base}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const Clock = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" strokeWidth="2" {...base}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
export const Tag = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" strokeWidth="2" {...base}><path d="M7 3h10v18l-5-3-5 3z" /></svg>
);
export const Snow = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" strokeWidth="2" {...base}><path d="M12 2v20M4.9 7l14.2 10M4.9 17L19.1 7" /></svg>
);
export const Grid = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" strokeWidth="1.8" {...base}><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></svg>
);
export const Inbox = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" strokeWidth="1.8" {...base}><path d="M3 13h5l2 3h4l2-3h5" /><path d="M5 5h14l2 8v6H3v-6z" /></svg>
);
export const Calendar = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" strokeWidth="1.8" {...base}><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
);
export const Bars = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" strokeWidth="1.8" {...base}><path d="M5 20V11M12 20V4M19 20v-6" /></svg>
);
export const Home = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" strokeWidth="1.8" {...base}><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /></svg>
);
export const Bell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.8" {...base}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" /></svg>
);
export const Roof = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" strokeWidth="2.2" {...base}><path d="M4 12 L12 5 L20 12" /><path d="M8 19h8" /></svg>
);

const svc = { width: 44, height: 44, viewBox: '0 0 24 24', strokeWidth: 1.5, ...base };
export const ServiceIcon = ({ name }) => {
  switch (name) {
    case 'house':
      return <svg {...svc}><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-5h4v5" /></svg>;
    case 'drop':
      return <svg {...svc}><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" /></svg>;
    case 'storm':
      return <svg {...svc}><path d="M17 16a4 4 0 0 0 0-8 6 6 0 0 0-11.6 1.5A3.5 3.5 0 0 0 6 16" /><path d="M12 13l-2 4h4l-2 4" /></svg>;
    case 'snow':
      return <svg {...svc}><path d="M12 2v20M4.9 7l14.2 10M4.9 17L19.1 7" /><path d="M9 3l3 2 3-2M9 21l3-2 3 2" /></svg>;
    case 'gutter':
      return <svg {...svc}><path d="M3 7h18v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M8 12v3M16 12v6M12 12v2" /></svg>;
    case 'search':
      return <svg {...svc}><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></svg>;
    default:
      return null;
  }
};
export const Phone = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth="2" {...base}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>
);
export const Pin = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" strokeWidth="1.6" {...base}><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
);
export const Check = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="var(--gh-accent)" /><path d="M7 12.5l3 3 7-7" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
