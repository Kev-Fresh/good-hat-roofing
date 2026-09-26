# Good Hat Roofing — AI lead qualifier (concept project)

A fictional Buffalo roofer's website with a quote form that an AI scores
HOT / WARM / COLD, plus the owner's dashboard where the lead shows up.

- `/` — customer website
- `/quote` — quote form → instant reply + "behind the scenes" score
- `/dashboard` — owner's view (your test leads appear at the top, marked **You**)

## Run it on your computer

```bash
npm install
npm run dev          # site at http://localhost:3002
```

`npm run dev` doesn't run the AI function, so leads get scored by the rules
alone. To run the AI locally too:

```bash
npm install -g netlify-cli
netlify dev          # site + function at http://localhost:8888
```

Put your key in a `.env` file (copy `.env.example`) for `netlify dev`.

## Deploy to Netlify

The site deploys from GitHub. Push to `main` and Netlify rebuilds.

### Environment variables (Netlify → Site configuration → Environment variables)

| Variable | What | Secret? |
|---|---|---|
| `ANTHROPIC_API_KEY` | Claude API key | Yes |
| `VITE_SUPABASE_URL` | Supabase project URL | No |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key | No |
| `SUPABASE_SECRET_KEY` | Supabase secret (service_role) key, server only | **Yes** |
| `RESEND_API_KEY` | Resend key with Sending access | Yes |
| `ALERT_EMAIL` | Where owner alerts go | No |
| `BUSINESS_SLUG` | Optional. Defaults to `good-hat-demo` | No |

`VITE_` values are baked in at build time, so redeploy after changing them.

### One-time Supabase setup

1. **SQL Editor → New query**, paste `supabase/schema.sql`, Run.
2. **Authentication → Sign In / Providers:** allow anonymous sign-ins. Make sure MFA (TOTP) is enabled.
3. **Authentication → Users → Add user:** your email + a strong password, auto-confirm.
4. **SQL Editor:** paste `supabase/add-owner.sql`, put your email in it, Run.
5. Visit `/login`, sign in, scan the QR code with an authenticator app.
6. Optional: `supabase/optional-cleanup-cron.sql` for hourly cleanup.

Without the Supabase variables the site still works: leads are scored but not saved, and the demo dashboard uses a short, masked copy in the visitor's browser.

### Cost guardrails
- Claude Haiku 4.5, max 500 tokens per lead; set a monthly spend limit in the Claude Console.
- 8 leads per minute per visitor (`score-lead.mjs`), 10 time requests per minute (`request-slot.mjs`).
- Supabase and Resend free tiers cover demo traffic.

## Make it a different business

Everything business-specific is in **`shared/business.js`**:

| What | Where in the file |
|---|---|
| Name, tagline, phone, owner name | top |
| Brand colors (whole site + dashboard re-skin) | `colors` |
| Towns served, services, inspection times | `serviceArea`, `services`, `inspectionSlots` |
| Form questions, points per answer, price guide | `form` |
| Hot / warm cutoffs | `tiers` |
| Extra things the AI should watch for in the notes | `aiGuidance` |

Swap the logo initials with `monogram`. Credits in the footer: `credits`
(`builtBy` is still `[Studio Name]` — fill it in once the name is locked).

## How the scoring works

1. The owner's fixed rules add up points from the form answers.
2. Claude reads the free-text notes and can add up to two adjustments
   (±20 max each) for things the rules missed, like "the adjuster already
   approved it." It also writes the customer reply and a note for the owner.
3. If Claude is unavailable, step 1 alone decides, so the demo never breaks.

The dashboard's sample leads are made-up demo data.
