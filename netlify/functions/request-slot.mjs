// POST /api/request-slot  { leadId, slot }
// Lets a visitor request an inspection time on THEIR OWN lead.
// The database update only matches rows where visitor_id = the caller.

import business from '../../shared/business.js';
import { dbReady, userFromRequest, setRequestedSlot } from '../lib/db.mjs';

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function allowedOrigin(req) {
  const origin = req.headers.get('origin');
  if (!origin) return true;
  const allowed = new Set([new URL(req.url).origin]);
  for (const v of [process.env.URL, process.env.DEPLOY_PRIME_URL, process.env.DEPLOY_URL]) {
    if (v) allowed.add(new URL(v).origin);
  }
  return allowed.has(origin);
}

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Use POST' }, 405);
  if (!allowedOrigin(req)) return json({ error: 'Forbidden' }, 403);
  if (!dbReady) return json({ ok: false, reason: 'no-database' });

  let body;
  try {
    const raw = await req.text();
    if (raw.length > 1000) return json({ error: 'Too large' }, 413);
    body = JSON.parse(raw);
  } catch {
    return json({ error: 'Bad JSON' }, 400);
  }

  const leadId = typeof body?.leadId === 'string' && /^[0-9a-f-]{36}$/i.test(body.leadId) ? body.leadId : null;
  const slot = business.inspectionSlots.includes(body?.slot) ? body.slot : null;
  if (!leadId || !slot) return json({ error: 'Bad request' }, 400);

  const user = await userFromRequest(req);
  if (!user) return json({ error: 'Session required' }, 401);

  try {
    const ok = await setRequestedSlot(leadId, user.id, slot);
    return json({ ok });
  } catch (err) {
    console.error('request-slot error:', /^Supabase/.test(err?.message || '') ? err.message : err?.name);
    return json({ ok: false }, 500);
  }
};

export const config = {
  path: '/api/request-slot',
  rateLimit: { windowLimit: 10, windowSize: 60, aggregateBy: ['ip', 'domain'] },
};
