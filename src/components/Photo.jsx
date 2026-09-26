import { useState } from 'react';

// Shows the photo if it exists; otherwise renders the fallback (a drawing),
// so a missing file never shows up as a broken image.
export default function Photo({ src, alt, className = '', children }) {
  const [ok, setOk] = useState(Boolean(src));
  if (!ok) return children;
  return <img src={src} alt={alt} loading="lazy" onError={() => setOk(false)} className={`h-full w-full object-cover ${className}`} />;
}
