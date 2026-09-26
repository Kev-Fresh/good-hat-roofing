// DEMO ONLY: leads submitted from this browser, so the owner's dashboard can
// show "your" lead right after you send the quote form.
// Privacy: nothing leaves this browser, the phone is stored masked (last 4),
// email and notes are never stored, and entries expire after 24 hours.
const KEY = 'goodhat.leads.v2';
const TTL_MS = 24 * 60 * 60 * 1000;

try { localStorage.removeItem('goodhat.leads.v1'); } catch { /* old format held full phone numbers */ }

export function loadLeads() {
  try {
    const all = JSON.parse(localStorage.getItem(KEY)) || [];
    const fresh = all.filter((l) => Date.now() - new Date(l.receivedAt).getTime() < TTL_MS);
    if (fresh.length !== all.length) localStorage.setItem(KEY, JSON.stringify(fresh));
    return fresh;
  } catch {
    return [];
  }
}

export function saveLead(lead) {
  try {
    const next = [lead, ...loadLeads()].slice(0, 20);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private mode etc. — the dashboard just won't show it */
  }
}

export function clearLeads() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}
