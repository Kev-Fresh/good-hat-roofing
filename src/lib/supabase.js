import { createClient } from '@supabase/supabase-js';

// These two values are public by design (safe in the browser).
// The database's row-level security rules decide what each session can see.
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = url && key ? createClient(url, key) : null;

// Visitors get a quiet anonymous session so the database can tie their
// test leads to them, and only them.
export async function ensureSession() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  if (data.session) return data.session;
  const { data: anon, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return anon.session;
}

// Is the current session a 2-step-verified owner of this business?
export async function ownerMembership() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  if (!user || user.is_anonymous) return null;
  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal?.currentLevel !== 'aal2') return { needsMfa: true };
  const { data: rows } = await supabase.from('business_members').select('business_id, role').eq('user_id', user.id).limit(1);
  if (!rows || !rows.length) return { notMember: true, email: user.email };
  return { businessId: rows[0].business_id, role: rows[0].role, email: user.email };
}
