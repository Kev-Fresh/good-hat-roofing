-- OPTIONAL: hourly cleanup of expired leads, even on days with no new leads.
-- (The site also cleans up every time a new lead comes in.)
-- First turn on "pg_cron" under Supabase → Database → Extensions (or Integrations → Cron).

select cron.schedule(
  'delete-expired-leads',
  '17 * * * *',
  $$
    delete from public.leads l
    using public.businesses b
    where l.business_id = b.id
      and b.retention_days is not null
      and l.created_at < now() - make_interval(days => b.retention_days)
  $$
);
