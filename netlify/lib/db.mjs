// Server-only helpers for Supabase (database + auth) and Resend (email).
// Uses the SECRET key, so this file must never be imported by the website.

const SB_URL = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').replace(/\/$/, '');
const SB_SECRET = process.env.SUPABASE_SECRET_KEY || '';
const BUSINESS_SLUG = process.env.BUSINESS_SLUG || 'good-hat-demo';

export const dbReady = Boolean(SB_URL && SB_SECRET);

function sbHeaders(extra = {}) {
  const h = { apikey: SB_SECRET, 'Content-Type': 'application/json', ...extra };
  // Legacy service_role keys are JWTs and also go in Authorization; new sb_secret_ keys don't.
  if (SB_SECRET.startsWith('eyJ')) h.Authorization = `Bearer ${SB_SECRET}`;
  return h;
}

async function sb(path, { method = 'GET', body, prefer, timeoutMs = 8000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${SB_URL}${path}`, {
      method,
      signal: controller.signal,
      headers: sbHeaders(prefer ? { Prefer: prefer } : {}),
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Supabase ${method} ${path.split('?')[0]} ${res.status}`);
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } finally {
    clearTimeout(timer);
  }
}

// Who is calling? Returns the Supabase user for a browser session token, or null.
export async function userFromRequest(req) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token || !dbReady) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(`${SB_URL}/auth/v1/user`, {
      signal: controller.signal,
      headers: { apikey: SB_SECRET, Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const user = await res.json();
    return user && user.id ? user : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

let businessCache = null;
export async function getBusiness() {
  if (businessCache) return businessCache;
  const rows = await sb(`/rest/v1/businesses?slug=eq.${encodeURIComponent(BUSINESS_SLUG)}&select=id,name,is_demo,retention_days,alert_policy`);
  if (!rows || !rows.length) throw new Error('Business not found — run supabase/schema.sql');
  businessCache = rows[0];
  return businessCache;
}

export async function insertLead(row) {
  const rows = await sb('/rest/v1/leads?select=id', { method: 'POST', body: row, prefer: 'return=representation' });
  return rows && rows[0] ? rows[0].id : null;
}

export async function deleteExpiredLeads(business) {
  if (!business.retention_days) return;
  const cutoff = new Date(Date.now() - business.retention_days * 86400000).toISOString();
  await sb(`/rest/v1/leads?business_id=eq.${business.id}&created_at=lt.${encodeURIComponent(cutoff)}`, { method: 'DELETE' });
}

export async function setRequestedSlot(leadId, visitorId, slot) {
  const rows = await sb(
    `/rest/v1/leads?id=eq.${encodeURIComponent(leadId)}&visitor_id=eq.${encodeURIComponent(visitorId)}&select=id`,
    { method: 'PATCH', body: { requested_slot: slot }, prefer: 'return=representation' }
  );
  return Boolean(rows && rows.length);
}

// ── Owner alert email (Resend) ──────────────────────────────
export function shouldAlert(business, tier) {
  if (!process.env.RESEND_API_KEY || !process.env.ALERT_EMAIL) return false;
  if (business.alert_policy === 'all') return true;
  if (business.alert_policy === 'hot') return tier === 'HOT';
  return false;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

// No phone, email or address in the alert — just enough to know it's worth opening.
export function buildAlert({ firstName, jobLabel, tier, points, summary, businessName }) {
  const site = (process.env.URL || '').replace(/\/$/, '');
  const link = site ? `${site}/dashboard` : '/dashboard';
  const subject = `New ${tier} lead: ${firstName}, ${jobLabel.toLowerCase()}`;
  const lines = [`${tier} · ${points} points`, summary, `Open the dashboard: ${link}`].filter(Boolean);
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px">
      <p style="margin:0 0 4px;color:#A63D2F;font-weight:700;letter-spacing:.08em">${escapeHtml(businessName.toUpperCase())}</p>
      <h2 style="margin:0 0 12px;color:#1B2A41">${escapeHtml(subject)}</h2>
      <p style="margin:0 0 8px"><strong>${escapeHtml(tier)}</strong> · ${escapeHtml(points)} points</p>
      ${summary ? `<p style="margin:0 0 16px">${escapeHtml(summary)}</p>` : ''}
      <a href="${escapeHtml(link)}" style="display:inline-block;background:#A63D2F;color:#fff;padding:12px 18px;text-decoration:none;font-weight:700">Open the dashboard</a>
      <p style="margin:16px 0 0;color:#666;font-size:12px">Contact details are in the dashboard, not in this email.</p>
    </div>`;
  return { subject, lines, html, text: lines.join('\n') };
}

export async function sendAlert(alert) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      signal: controller.signal,
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.ALERT_FROM || 'Good Hat Leads <onboarding@resend.dev>',
        to: [process.env.ALERT_EMAIL],
        subject: alert.subject,
        text: alert.text,
        html: alert.html,
      }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}`);
    return true;
  } finally {
    clearTimeout(timer);
  }
}
