-- Give an account owner access to a business's leads.
-- 1) Supabase → Authentication → Users → Add user → Create new user
--    (your email + a strong password, check "Auto Confirm User").
-- 2) Put that email below and run this in SQL Editor.
-- 3) Sign in at /login on the site. It will walk you through
--    setting up your authenticator app (required to see leads).

insert into public.business_members (business_id, user_id, role)
select b.id, u.id, 'owner'
from public.businesses b
join auth.users u on u.email = 'YOUR-EMAIL@example.com'   -- ← change this
where b.slug = 'good-hat-demo'
on conflict do nothing;
