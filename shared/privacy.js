// Strip personal details before anything leaves our server for the AI.
// The AI only needs the job details to score a lead — never who or where exactly.

const EMAIL = /[^\s@]+@[^\s@]+\.[^\s@]+/g;
// 7+ digits with common separators, e.g. 555-0142, (716) 555 0142, +1 716.555.0142
const PHONE = /(\+?1[\s.-]?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}\b/g;
const HOUSE_NUMBER = /\b\d+[A-Za-z]?\b/g;

export function scrubText(text) {
  return String(text || '')
    .replace(EMAIL, '[email removed]')
    .replace(PHONE, '[phone removed]');
}

// "123 Parkside Ave, Buffalo 14214" → "Parkside Ave, Buffalo"
export function scrubArea(area) {
  return scrubText(area)
    .replace(HOUSE_NUMBER, '')
    .replace(/\s+,/g, ',')
    .replace(/\s{2,}/g, ' ')
    .replace(/^[\s,#-]+|[\s,#-]+$/g, '')
    .trim();
}

// Phone shown in the demo dashboard: last 4 only.
export function maskPhone(formatted) {
  const d = String(formatted || '').replace(/\D/g, '');
  return d.length >= 4 ? `(•••) •••-${d.slice(-4)}` : '';
}
