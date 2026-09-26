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

1. Push this folder to a GitHub repo.
2. Netlify → **Add new site → Import an existing project** → pick the repo.
   Build settings come from `netlify.toml` (build `npm run build`, publish `dist`).
3. **Site configuration → Environment variables** → add
   `ANTHROPIC_API_KEY` = your key from console.anthropic.com.
4. Redeploy. The "behind the scenes" card will say **Scored by Claude**.

No key? It still works, scored by the rules only.

### Cost guardrails
- Uses Claude Haiku 4.5 (fast, cheap), max 500 tokens per lead.
- Rate limited to 8 requests per minute per visitor (`netlify/functions/score-lead.mjs`).
- Set a monthly spend limit in the Anthropic console too.

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
