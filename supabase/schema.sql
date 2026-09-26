-- ─────────────────────────────────────────────────────────────
-- Lead system database. Run once in Supabase → SQL Editor → New query.
-- Safe to re-run: it skips anything that already exists.
-- ─────────────────────────────────────────────────────────────

-- Each client business (the demo is just one of them).
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  is_demo boolean not null default false,
  retention_days integer,                -- null = keep until deleted
  alert_policy text not null default 'hot' check (alert_policy in ('all', 'hot', 'none')),
  created_at timestamptz not null default now()
);

-- Who can see a business's leads (owners, staff).
create table if not exists public.business_members (
  business_id uuid not null references public.businesses (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'staff')),
  created_at timestamptz not null default now(),
  primary key (business_id, user_id)
);

-- The leads themselves. Only the server (secret key) ever inserts.
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  visitor_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text not null,
  area text,
  job text,
  timeline text,
  insurance text,
  details text,
  job_label text,
  tier text not null check (tier in ('HOT', 'WARM', 'COLD')),
  points integer not null,
  breakdown jsonb not null default '[]'::jsonb,
  estimate text,
  estimate_mid integer,
  summary text,
  reply text,
  source text,
  requested_slot text,
  status text not null default 'new' check (status in ('new', 'contacted', 'booked', 'closed'))
);
create index if not exists leads_business_created_idx on public.leads (business_id, created_at desc);
create index if not exists leads_visitor_idx on public.leads (visitor_id);

-- ── Row-level security: the database itself enforces who sees what ──
alter table public.businesses enable row level security;
alter table public.business_members enable row level security;
alter table public.leads enable row level security;

-- A member only counts if they signed in WITH 2-step verification (aal2).
create or replace function public.is_member(b uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(auth.jwt() ->> 'aal', '') = 'aal2'
     and exists (
       select 1 from public.business_members m
       where m.business_id = b and m.user_id = auth.uid()
     );
$$;

drop policy if exists "members read their business" on public.businesses;
create policy "members read their business" on public.businesses
  for select to authenticated using (public.is_member(id));

drop policy if exists "members read own membership" on public.business_members;
create policy "members read own membership" on public.business_members
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "members read leads" on public.leads;
create policy "members read leads" on public.leads
  for select to authenticated using (public.is_member(business_id));

drop policy if exists "visitors read own leads" on public.leads;
create policy "visitors read own leads" on public.leads
  for select to authenticated using (visitor_id = auth.uid());

drop policy if exists "members update leads" on public.leads;
create policy "members update leads" on public.leads
  for update to authenticated
  using (public.is_member(business_id))
  with check (public.is_member(business_id));

-- No insert/delete policies on purpose: browsers can't create or delete leads.
revoke all on public.leads, public.businesses, public.business_members from anon;

-- Live updates on the owner dashboard (still filtered by the rules above).
do $$
begin
  alter publication supabase_realtime add table public.leads;
exception when duplicate_object then null;
end $$;

-- ── The Good Hat demo business: keeps leads 7 days, alerts on HOT only ──
insert into public.businesses (slug, name, is_demo, retention_days, alert_policy)
values ('good-hat-demo', 'Good Hat Roofing (demo)', true, 7, 'hot')
on conflict (slug) do nothing;
