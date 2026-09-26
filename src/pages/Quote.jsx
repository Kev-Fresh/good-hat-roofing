import { useState } from 'react';
import { Link } from 'react-router-dom';
import business from '../../shared/business.js';
import { qualifyLead, requestSlot } from '../lib/api.js';
import { validateLead, formatPhone } from '../../shared/contact.js';
import { maskPhone } from '../../shared/privacy.js';
import { saveLead } from '../lib/leads.js';
import { ConceptBanner, SiteHeader, PRICE_NOTE } from '../components/SiteChrome.jsx';
import { Arrow } from '../components/Icons.jsx';

const empty = { name: '', phone: '', email: '', area: '', job: null, timeline: null, insurance: null, details: '', website: '' };
const FIELD_ORDER = ['name', 'phone', 'email', 'job'];

const tierStyle = {
  HOT: 'bg-accent text-white',
  WARM: 'bg-brand text-white',
  COLD: 'bg-well text-ink border border-line',
};

function FieldError({ id, message }) {
  if (!message) return null;
  return <p id={id} className="m-0 text-sm font-semibold text-[#8A3B2B]">{message}</p>;
}

function ChipGroup({ field, value, onPick, error }) {
  const group = business.form[field];
  const id = `q-${field}-label`;
  return (
    <div role="group" aria-labelledby={id} className="flex flex-col gap-2.5">
      <div id={id} className="text-[15px] font-semibold">{group.question}</div>
      <FieldError id={`q-${field}-error`} message={error} />
      <div className="flex flex-wrap gap-2">
        {group.options.map((o, i) => {
          const on = value === o.id;
          return (
            <button
              key={o.id}
              id={i === 0 ? `q-${field}-first` : undefined}
              type="button"
              aria-pressed={on}
              aria-describedby={error ? `q-${field}-error` : undefined}
              onClick={() => onPick(o.id)}
              className={`h-12 rounded border-[1.5px] px-5 text-[15px] font-medium transition-colors ${
                on ? 'border-ink bg-ink text-paper' : 'border-line bg-white text-ink hover:border-ink'
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const inputClass =
  'h-13 rounded border-[1.5px] border-line bg-white px-4 text-base text-ink placeholder:text-muted/70 focus:border-brand focus:outline-none';

export default function Quote() {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState('editing'); // editing | sending | done
  const [result, setResult] = useState(null);
  const [slot, setSlot] = useState(null);
  const [errors, setErrors] = useState({});

  const set = (key) => (value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

  function showErrors(found) {
    setErrors(found);
    const first = FIELD_ORDER.find((f) => found[f]);
    if (first) document.getElementById(first === 'job' ? 'q-job-first' : `q-${first}`)?.focus();
  }

  async function submit(e) {
    e.preventDefault();
    const answers = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      area: form.area.trim(),
      details: form.details.trim(),
    };
    const found = validateLead(answers);
    if (Object.keys(found).length) {
      showErrors(found);
      return;
    }
    setErrors({});
    setStatus('sending');
    const res = await qualifyLead(answers);
    if (res.invalid) {
      setStatus('editing');
      showErrors(res.fields || {});
      return;
    }
    setResult(res);
    // With the database connected, the lead lives there. Otherwise keep a
    // short, masked copy in this browser so the demo dashboard can show it.
    if (!res.saved) saveLead({
      id: Date.now(),
      name: answers.name.split(/\s+/)[0], // demo keeps first name only
      phone: maskPhone(answers.phone), // demo keeps last 4 only
      job: res.jobLabel,
      area: answers.area || 'Not given',
      estimate: res.estimate,
      estimateMid: res.estimateMid,
      tier: res.tier,
      points: res.points,
      summary: res.summary,
      receivedAt: new Date().toISOString(),
      source: res.source,
    });
    setStatus('done');
  }

  function pickSlot(s) {
    setSlot(s);
    if (result?.leadId) requestSlot(result.leadId, s);
  }

  function reset() {
    setForm(empty);
    setResult(null);
    setSlot(null);
    setStatus('editing');
  }

  return (
    <div className="min-h-screen bg-paper">
      <ConceptBanner>
        A concept project. Answers go to an AI scorer for the demo and aren't used for anything else.
      </ConceptBanner>
      <SiteHeader minimal />

      <main className="mx-auto grid max-w-[1280px] gap-6 px-5 pb-16 sm:px-10 lg:grid-cols-[minmax(0,760px)_minmax(0,1fr)] lg:gap-8">
        <section className="flex flex-col gap-6 rounded-md border border-line/70 bg-white p-6 sm:p-10" aria-live="polite">
          {status !== 'done' ? (
            <form onSubmit={submit} noValidate className="relative flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="m-0 font-display text-4xl font-extrabold tracking-[-0.02em] text-brand sm:text-5xl">Get a rough range</h1>
                <p className="m-0 text-lg text-muted">Takes about a minute. Most replies come back within a minute.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="q-name" className="text-[15px] font-semibold">Your name</label>
                  <input
                    id="q-name"
                    autoComplete="name"
                    required
                    maxLength={60}
                    value={form.name}
                    onChange={(e) => set('name')(e.target.value)}
                    placeholder="Dana Reyes"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'q-name-error' : undefined}
                    className={`${inputClass} ${errors.name ? 'border-[#8A3B2B]!' : ''}`}
                  />
                  <FieldError id="q-name-error" message={errors.name} />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="q-phone" className="text-[15px] font-semibold">Phone</label>
                  <input
                    id="q-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    required
                    maxLength={20}
                    value={form.phone}
                    onChange={(e) => set('phone')(formatPhone(e.target.value))}
                    placeholder="(716) 555-0142"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'q-phone-error' : 'q-phone-hint'}
                    className={`${inputClass} ${errors.phone ? 'border-[#8A3B2B]!' : ''}`}
                  />
                  {errors.phone ? (
                    <FieldError id="q-phone-error" message={errors.phone} />
                  ) : (
                    <p id="q-phone-hint" className="m-0 text-sm text-muted">Demo tip: any 555 number works.</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="q-email" className="text-[15px] font-semibold">
                    Email
                  </label>
                  <input
                    id="q-email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={120}
                    value={form.email}
                    onChange={(e) => set('email')(e.target.value)}
                    placeholder="you@example.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'q-email-error' : 'q-email-hint'}
                    className={`${inputClass} ${errors.email ? 'border-[#8A3B2B]!' : ''}`}
                  />
                  {errors.email ? (
                    <FieldError id="q-email-error" message={errors.email} />
                  ) : (
                    <p id="q-email-hint" className="m-0 text-sm text-muted">Demo tip: any @example.com address works.</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="q-area" className="text-[15px] font-semibold">Street or neighborhood</label>
                  <input id="q-area" autoComplete="street-address" maxLength={80} value={form.area} onChange={(e) => set('area')(e.target.value)} placeholder="Parkside Ave, Buffalo" className={inputClass} />
                </div>
              </div>


              {/* Honeypot: hidden from people, bots fill it in. */}
              <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
                <label htmlFor="q-website">Leave this empty</label>
                <input id="q-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set('website')(e.target.value)} />
              </div>

              <ChipGroup field="job" value={form.job} onPick={set('job')} error={errors.job} />
              <ChipGroup field="timeline" value={form.timeline} onPick={set('timeline')} />
              <ChipGroup field="insurance" value={form.insurance} onPick={set('insurance')} />

              <div className="flex flex-col gap-2">
                <label htmlFor="q-details" className="text-[15px] font-semibold">
                  Anything else? <span className="font-normal text-muted">(optional)</span>
                </label>
                <textarea
                  id="q-details"
                  rows={3}
                  maxLength={600}
                  value={form.details}
                  onChange={(e) => set('details')(e.target.value)}
                  placeholder="Water stain on the kitchen ceiling after last night's storm…"
                  className="resize-none rounded border-[1.5px] border-line bg-white px-4 py-3.5 text-base leading-snug text-ink placeholder:text-muted/70 focus:border-brand focus:outline-none"
                />
              </div>

              {Object.values(errors).some(Boolean) && (
                <p className="m-0 font-semibold text-[#8A3B2B]" role="alert">A couple things need a look above.</p>
              )}

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="inline-flex h-14 items-center gap-2.5 rounded bg-accent px-8 font-display text-[17px] font-bold text-white hover:bg-brand disabled:opacity-60"
                >
                  {status === 'sending' ? 'Reading your answers…' : 'Send it'}
                </button>
                <span className="text-sm text-muted">
                  No spam. Someone from our team follows up.{' '}
                  <Link to="/privacy" className="font-semibold text-brand underline underline-offset-2 hover:text-ink">How we handle your info</Link>
                </span>
              </div>
            </form>
          ) : (
            <>
              <div className="flex items-center gap-2.5 text-sm text-muted">
                <span className="h-2.5 w-2.5 rounded bg-brand" />
                {business.shortName} replied just now
              </div>
              <h1 className="m-0 font-display text-4xl font-extrabold tracking-[-0.02em] text-brand sm:text-5xl">Here’s a rough range.</h1>
              <div className="rounded-md bg-accent-soft p-6 text-lg leading-relaxed sm:p-7 sm:text-[21px]">
                {result.reply}
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="text-[15px] font-semibold">Request an inspection time</div>
                <div className="flex flex-wrap gap-2.5">
                  {business.inspectionSlots.map((s) => (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={slot === s}
                      onClick={() => pickSlot(s)}
                      className={`h-14 rounded border-[1.5px] px-6 font-semibold ${
                        slot === s ? 'border-brand bg-brand text-paper' : 'border-line bg-white text-ink hover:border-ink'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {slot && <p className="m-0 font-semibold text-brand">Requested {slot}. We'll call you to confirm.</p>}
              </div>
              <p className="m-0 text-sm leading-relaxed text-muted">{PRICE_NOTE}</p>
              <div className="flex-1" />
              <button type="button" onClick={reset} className="h-12 self-start rounded border-[1.5px] border-line px-5 font-semibold hover:border-ink">
                Try another lead
              </button>
            </>
          )}
        </section>

        <aside className="flex flex-col gap-5">
          {status !== 'done' ? (
            <>
              <div className="flex flex-col gap-5 rounded-md bg-brand p-8 text-white">
                <h2 className="m-0 font-display text-2xl font-extrabold">What happens next</h2>
                {['Our assistant reads your answers and shares what similar jobs often cost. It’s not a quote.', 'You request an inspection time, and we confirm it with you.', 'A roofer inspects and gives you a written quote.'].map((t, i) => (
                  <div key={t} className="flex gap-3.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-accent font-semibold text-white">{i + 1}</span>
                    <span className="text-[17px] leading-relaxed text-accent-soft">{t}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2 rounded-md border-[1.5px] border-dashed border-accent p-7">
                <div className="text-[13px] font-semibold uppercase tracking-[0.12em] text-brand">Try the demo</div>
                <p className="m-0 leading-relaxed text-muted">
                  Fill this out like a homeowner, hit send, then flip to the owner's side to see how the AI scored you.
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-4 rounded-md border border-line/70 bg-white p-8">
              <div className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">Behind the scenes · owner's view</div>
              <div className="flex items-center gap-4">
                <span className={`rounded px-5 py-2.5 text-xl font-extrabold tracking-wider ${tierStyle[result.tier]}`}>{result.tier}</span>
                <span className="text-5xl font-semibold tracking-tight">{result.points}</span>
                <span className="text-muted">points</span>
              </div>
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                {result.breakdown.map((b, i) => (
                  <li key={i} className="flex gap-3 border-b border-well pb-2.5">
                    <span className="flex-1">{b.label}</span>
                    <span className="font-semibold text-brand">{b.display}</span>
                  </li>
                ))}
              </ul>
              {result.summary && (
                <p className="m-0 rounded bg-well p-4 text-[15px] leading-relaxed">
                  <strong>Note for {business.ownerName}:</strong> {result.summary}
                </p>
              )}
              {result.alertPreview && (
                <div className="rounded border border-line/70 p-4">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">
                    {result.alertSent ? 'Alert emailed to the owner' : 'Owner alert (sent for HOT leads only)'}
                  </div>
                  <div className="mt-1.5 font-semibold text-brand">{result.alertPreview.subject}</div>
                  <div className="mt-1 text-sm text-muted">No phone, email or address in the alert. Details stay in the dashboard.</div>
                </div>
              )}
              <p className="m-0 text-sm leading-relaxed text-muted">
                Hot is {business.tiers.hot}+, warm is {business.tiers.warm}–{business.tiers.hot - 1}. The owner sets these rules.{' '}
                {result.source === 'ai' ? 'Scored by Claude on top of the rules.' : 'Scored by the rules (AI offline).'}
              </p>
              <Link to="/dashboard" className="inline-flex h-13 items-center gap-2.5 self-start rounded bg-brand px-6 font-semibold text-white hover:bg-accent">
                See the owner's dashboard <Arrow />
              </Link>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
