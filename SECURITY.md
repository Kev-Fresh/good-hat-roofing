# Security & privacy

## What this demo already does

| Risk | Protection | Where |
|---|---|---|
| Personal info sent to the AI | Name, phone, email and house number are never sent. Notes are scrubbed of phone numbers and emails first. | `netlify/functions/score-lead.mjs`, `shared/privacy.js` |
| Personal info in logs | The function logs only the error type, never what someone typed. | `score-lead.mjs` |
| API key exposure | Key lives only in Netlify environment variables, used only server-side. `.env` is git-ignored. | `.env.example`, `.gitignore` |
| Fake or broken leads | Name, valid US phone and valid email required, checked in the browser **and** on the server. | `shared/contact.js` |
| Spam bots | Hidden honeypot field; bots that fill it get a normal-looking reply but no AI call and nothing saved. | `Quote.jsx`, `score-lead.mjs` |
| Other sites calling the function | Browser requests from other origins get 403. | `score-lead.mjs` |
| Abuse / API bill | 8 requests per minute per visitor, 4 KB max request, 500-token cap per AI call. | `score-lead.mjs` |
| Prompt injection in notes | Notes are wrapped and marked as data; AI adjustments are capped (±20, max 2) and the rules score can't be overridden. | `score-lead.mjs` |
| Script injection (XSS) | React escapes all text, AI replies render as plain text, strict Content-Security-Policy blocks outside scripts. | `netlify.toml` |
| Clickjacking, sniffing, downgrade | `X-Frame-Options`, `frame-ancestors 'none'`, `nosniff`, HSTS, tight `Permissions-Policy`. | `netlify.toml` |
| Who can see leads | Row-level security in the database: owners see their business's leads only after signing in **with 2-step verification**; demo visitors see only the leads they sent. Browsers can never insert or delete leads. | `supabase/schema.sql` |
| Secret database key | `SUPABASE_SECRET_KEY` lives only in Netlify and is used only by server functions. The browser gets the public publishable key, which the database rules restrict. | `netlify/lib/db.mjs` |
| Owner accounts | Created by hand in Supabase (no public sign-up to the dashboard), then 2-step setup is forced on first sign-in. | `src/pages/Login.jsx`, `supabase/add-owner.sql` |
| Owner alert emails | Sent only for HOT leads (demo policy). Contain first name, job type, score and a dashboard link. No phone, email or address. | `netlify/lib/db.mjs` |
| Demo data retention | Demo leads are deleted after 7 days (cleanup on every new lead, plus optional hourly job). | `score-lead.mjs`, `supabase/optional-cleanup-cron.sql` |
| Texting rules | No customer texting in version 1. Customers get the reply on screen and a phone call back. | `Quote.jsx` |

Known limit: free-text notes can still contain names or other details a person chooses to type. They're scrubbed for phone numbers and emails only.

## Before a real client goes live (client-ready build)

- [x] **Database with row-level security.** Only 2-step-verified members read a business's leads. The browser never holds the secret key.
- [x] **Owner login with 2-factor auth** on the dashboard.
- [x] **Save leads only from the server function**, never directly from the browser.
- [x] **Owner alerts by email, with no private details.**
- [ ] **Per-client settings:** its own row in `businesses` (retention, alert policy), its own owner accounts, its own sending domain in Resend.
- [ ] **Retention rule agreed with the client** (e.g. 12 months) set in `retention_days`. Delete on request.
- [ ] **Turn on CAPTCHA** for anonymous sign-ins in Supabase if the site sees bot traffic.
- [ ] **Real privacy policy** with the client's business name and a real contact inbox (`privacyContact` in `shared/business.js`).
- [ ] **Customer texting stays off** unless it's sold as a separate add-on. If added later: attorney-reviewed consent wording, carrier registration, a provider that handles STOP automatically, and a consent timestamp saved with each lead.
- [ ] **Review the AI provider's data terms** with the client, and set a monthly spend limit on the API key.
- [ ] **Separate API keys per client**, rotated if anyone leaves or a key is exposed.
- [ ] **Backups** turned on, and one test restore done.
- [ ] Run `npm audit` before each deploy.
