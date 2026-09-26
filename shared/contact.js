// Contact-field checks, shared by the form (instant feedback) and the
// server function (the real gate — never trust the browser alone).

export function phoneDigits(value) {
  let d = String(value || '').replace(/\D/g, '');
  if (d.length === 11 && d.startsWith('1')) d = d.slice(1);
  return d;
}

// US/Canada numbers: 10 digits, area code and exchange can't start with 0 or 1.
export function isValidPhone(value) {
  return /^[2-9]\d{2}[2-9]\d{6}$/.test(phoneDigits(value));
}

export function formatPhone(value) {
  const d = phoneDigits(value).slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value || '').trim());
}

// Returns { field: message } for anything that needs fixing. Empty = good to go.
export function validateLead(answers) {
  const errors = {};
  if (!String(answers.name || '').trim()) errors.name = 'Add your name so we know who to ask for.';
  if (!String(answers.phone || '').trim()) errors.phone = 'Add a phone number so we can reach you.';
  else if (!isValidPhone(answers.phone)) errors.phone = 'That doesn’t look like a full US phone number.';
  if (!String(answers.email || '').trim()) errors.email = 'Add an email so we can send you details.';
  else if (!isValidEmail(answers.email)) errors.email = 'That email doesn’t look quite right.';
  if (!answers.job) errors.job = 'Pick what’s going on so we can share a range.';
  return errors;
}
