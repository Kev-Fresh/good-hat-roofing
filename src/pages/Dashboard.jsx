import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import business from '../../shared/business.js';
import { money, firstName } from '../../shared/scoring.js';
import { loadLeads, clearLeads } from '../lib/leads.js';
import useCountUp from '../lib/useCountUp.js';
import { LogoMark } from '../components/Logo.jsx';
import { Grid, Inbox, Calendar, Bars, Home as HomeIcon, Bell, Roof } from '../components/Icons.jsx';

// Demo data so the dashboard isn't empty. Fictional people and jobs.
const SAMPLE_LEADS = [
  { id: 's1', name: 'Dana Reyes', phone: '(716) 555-0101', job: 'Kitchen leak, full replace', area: 'Parkside', estimate: '$11,000–14,000', time: '6:12 AM', tier: 'HOT' },
  { id: 's2', name: 'Marcus Hill', phone: '(716) 555-0102', job: 'Storm damage, claim approved', area: 'South Buffalo', estimate: '$9,000–12,000', time: '5:40 AM', tier: 'HOT' },
  { id: 's3', name: 'Priya Nair', phone: '(716) 555-0103', job: 'Tear-off, 22-yr-old roof', area: 'Kenmore', estimate: '$13,000–16,000', time: '1:05 AM', tier: 'HOT' },
  { id: 's4', name: 'Jordan Pike', phone: '(716) 555-0104', job: 'Skylight leak', area: 'Elmwood Village', estimate: '$1,200–2,000', time: 'Yesterday', tier: 'WARM' },
  { id: 's5', name: 'Tom Kowalski', phone: '(716) 555-0105', job: 'Chimney flashing repair', area: 'Cheektowaga', estimate: '$1,000–1,500', time: 'Yesterday', tier: 'WARM' },
  { id: 's6', name: 'Aisha Brooks', phone: '(716) 555-0106', job: 'Ice dam damage at eaves', area: 'North Buffalo', estimate: '$2,000–3,500', time: 'Yesterday', tier: 'WARM' },
  { id: 's7', name: 'Greg Szymanski', phone: '(716) 555-0107', job: 'Price check, maybe spring', area: 'Hamburg', estimate: '$10,000–13,000', time: 'Tue', tier: 'COLD' },
  { id: 's8', name: 'Lena Ortiz', phone: '(716) 555-0108', job: 'Shed roof patch', area: 'Tonawanda', estimate: '$600–900', time: 'Tue', tier: 'COLD' },
];
const BASE = { total: 24, HOT: 6, WARM: 11, COLD: 7, pipeline: 86400 };
const FILTERS = ['ALL', 'HOT', 'WARM', 'COLD'];

const pill = {
  HOT: 'bg-accent text-white',
  WARM: 'bg-brand text-white',
  COLD: 'bg-well text-ink border border-line',
};
const tierWord = { HOT: 'Hot', WARM: 'Warm', COLD: 'Cold' };

function timeLabel(iso) {
  const d = new Date(iso);
  const mins = Math.round((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}

const navItems = [
  { label: 'Dashboard', icon: <Grid />, active: true },
  { label: 'Leads inbox', icon: <Inbox /> },
  { label: 'Inspections calendar', icon: <Calendar /> },
  { label: 'Reports', icon: <Bars /> },
];

// Stagger helper: sets the CSS delay the .anim-* classes read.
const delay = (ms) => ({ '--d': `${ms}ms` });

export default function Dashboard() {
  const [filter, setFilter] = useState('ALL');
  const [mine, setMine] = useState(() => loadLeads());

  const leads = useMemo(() => {
    const yours = mine.map((l) => ({ ...l, time: timeLabel(l.receivedAt), yours: true }));
    return [...yours, ...SAMPLE_LEADS];
  }, [mine]);

  const counts = useMemo(() => {
    const c = { ...BASE };
    mine.forEach((l) => {
      c.total += 1;
      c[l.tier] += 1;
      c.pipeline += l.estimateMid || 0;
    });
    return c;
  }, [mine]);

  const shown = filter === 'ALL' ? leads : leads.filter((l) => l.tier === filter);
  const latest = mine[0];
  const hotOvernight = 3 + mine.filter((l) => l.tier === 'HOT').length;
  const filterIndex = FILTERS.indexOf(filter);

  const rules = [...business.form.job.options, ...business.form.timeline.options, ...business.form.insurance.options]
    .filter((o) => o.points !== 0)
    .sort((a, b) => b.points - a.points);
  const maxPts = Math.max(...rules.map((r) => Math.abs(r.points)));

  return (
    <div className="min-h-screen bg-canvas p-3 sm:p-6">
      <div className="mx-auto flex max-w-[1440px] gap-6">
        <nav aria-label="Dashboard" className="anim-rise sticky top-6 hidden h-[calc(100vh-48px)] w-20 shrink-0 flex-col items-center gap-3 rounded-[28px] bg-white py-4 md:flex">
          <Link to="/" aria-label={`${business.name} website`} className="press block hover:rotate-[-4deg]"><LogoMark size={48} /></Link>
          <div className="h-3" />
          {navItems.map((n, i) => (
            <button
              key={n.label}
              type="button"
              aria-label={n.label}
              aria-current={n.active ? 'page' : undefined}
              style={delay(120 + i * 60)}
              className={`anim-pop press flex h-12 w-12 items-center justify-center rounded-2xl ${n.active ? 'bg-ink text-paper' : 'text-muted hover:bg-well hover:text-ink'}`}
            >
              {n.icon}
            </button>
          ))}
          <div className="flex-1" />
          <Link to="/" aria-label="Back to the website" className="press flex h-12 w-12 items-center justify-center rounded-2xl text-muted hover:bg-well hover:text-ink"><HomeIcon /></Link>
          <div aria-label={`${business.ownerName}, owner`} className="flex h-11 w-11 items-center justify-center rounded-full bg-accent font-semibold text-white">
            {business.ownerName[0]}
          </div>
        </nav>

        <main className="flex min-w-0 flex-1 flex-col gap-5">
          <div className="anim-rise flex items-center gap-2 rounded-2xl bg-ink px-4 py-2.5 text-sm text-accent-soft">
            <span className="flex-1">Owner's view of a concept project. The top rows are leads you sent from this browser.</span>
            <Link to="/quote" className="font-semibold text-paper underline underline-offset-2 hover:text-accent">Send a test lead</Link>
          </div>

          <header className="anim-rise flex flex-wrap items-center gap-4" style={delay(60)}>
            <div className="flex min-w-[260px] flex-1 flex-col gap-1">
              <h1 className="m-0 text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-4xl">
                {greeting()}, {business.ownerName}.{' '}
                <span className="font-medium text-muted">{hotOvernight} hot leads came in overnight.</span>
              </h1>
              <div className="text-[15px] text-muted">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} · {business.name} · {business.city}
              </div>
            </div>
            <button type="button" aria-label={mine.length ? 'Notifications, new lead' : 'Notifications'} className="press lift relative flex h-13 w-13 items-center justify-center rounded-full bg-white">
              <Bell />
              {mine.length > 0 && (
                <span className="absolute right-3.5 top-3.5 flex h-2.5 w-2.5">
                  <span className="ping absolute inline-flex h-full w-full rounded-full bg-brand" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand" />
                </span>
              )}
            </button>
          </header>

          <section aria-label="This week" className="grid grid-cols-2 gap-4 xl:grid-cols-4 xl:gap-5">
            <Stat d={120} label="New leads this week" value={counts.total} chip={`+${5 + mine.length} vs last wk`} />
            <Stat d={180} label="Avg first reply" value={42} unit="sec" />
            <Stat d={240} label="Inspection requests" value={9} unit="4 via the assistant" />
            <Pipeline d={300} value={counts.pipeline} />
          </section>

          <section className="grid gap-5 xl:grid-cols-[540px_minmax(0,1fr)]">
            <div aria-label="Assistant" className="anim-rise lift flex flex-col gap-4 rounded-[28px] bg-accent-soft p-6" style={delay(340)}>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white"><Roof /></div>
                <div className="font-semibold">{business.shortName} assistant</div>
                <div className="flex-1" />
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="ping absolute inline-flex h-full w-full rounded-full bg-brand" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
                </span>
                <div className="text-[13px] text-brand">{latest ? `Updated ${timeLabel(latest.receivedAt).toLowerCase()}` : 'Updated 6:14 AM'}</div>
              </div>
              <p className="anim-rise m-0 text-xl leading-snug tracking-[-0.01em] sm:text-[22px]" style={delay(560)}>
                {latest ? (
                  <>
                    New {tierWord[latest.tier].toLowerCase()} lead from <strong>{firstName(latest.name)}</strong>. {latest.summary}
                  </>
                ) : (
                  <>
                    Start with <strong>Dana on Parkside Ave</strong>. Active leak over the kitchen, and her adjuster already approved the claim. I shared the Tuesday and Thursday openings. She hasn't picked one yet.
                  </>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                <button type="button" style={delay(700)} className="anim-pop press h-11 rounded-full bg-ink px-4.5 text-sm font-semibold text-paper hover:bg-brand">Book {business.inspectionSlots[0]}</button>
                <button type="button" style={delay(760)} className="anim-pop press h-11 rounded-full bg-white px-4.5 text-sm font-medium hover:bg-paper">Open lead</button>
                <button type="button" style={delay(820)} className="anim-pop press h-11 rounded-full bg-white px-4.5 text-sm font-medium hover:bg-paper">Draft a reply</button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
              <TierBlock d={400} active={filter === 'HOT'} className="bg-accent text-white" label="Hot" count={counts.HOT} body="Urgent, in your service area, and a fit for your minimum job." cta="Call these first" ctaClass="bg-paper text-ink hover:bg-white" onClick={() => setFilter('HOT')} subClass="text-white/85" />
              <TierBlock d={460} active={filter === 'WARM'} className="bg-brand text-white" label="Warm" count={counts.WARM} body="Real jobs, smaller or less urgent. The agent follows up." cta="Review" ctaClass="bg-white text-brand hover:bg-accent-soft" onClick={() => setFilter('WARM')} subClass="text-white/80" />
              <TierBlock d={520} active={filter === 'COLD'} className="bg-white text-ink" label="Cold" count={counts.COLD} body="Price checks, out of area, or no timeline. Kept on file." cta="View all" ctaClass="border border-line bg-white text-ink hover:border-ink" onClick={() => setFilter('COLD')} subClass="text-muted" />
            </div>
          </section>

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div aria-label="Latest leads" className="anim-rise flex min-w-0 flex-col gap-3.5 rounded-[28px] bg-white p-5 sm:p-6" style={delay(580)}>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="m-0 flex-1 text-xl font-semibold">Latest leads</h2>
                <div role="group" aria-label="Filter by score" className="relative grid grid-cols-4 rounded-full bg-well p-1">
                  <span
                    aria-hidden="true"
                    className="absolute bottom-1 left-1 top-1 rounded-full bg-ink transition-transform duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)]"
                    style={{ width: 'calc((100% - 8px) / 4)', transform: `translateX(${filterIndex * 100}%)` }}
                  />
                  {FILTERS.map((f) => (
                    <button
                      key={f}
                      type="button"
                      aria-pressed={filter === f}
                      onClick={() => setFilter(f)}
                      className={`press relative z-10 h-9 w-[4.5rem] rounded-full text-sm font-semibold ${filter === f ? 'text-paper' : 'text-ink hover:text-brand'}`}
                    >
                      {f === 'ALL' ? 'All' : tierWord[f]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-separate border-spacing-y-0.5 text-left text-[15px]">
                  <thead>
                    <tr className="text-[13px] text-muted">
                      <th className="px-3 pb-2 font-normal">Customer</th>
                      <th className="px-3 pb-2 font-normal">Contact</th>
                      <th className="px-3 pb-2 font-normal">Job</th>
                      <th className="px-3 pb-2 font-normal">Area</th>
                      <th className="px-3 pb-2 font-normal">Ballpark</th>
                      <th className="px-3 pb-2 font-normal">Received</th>
                      <th className="px-3 pb-2 font-normal">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shown.map((l, i) => (
                      <tr
                        key={`${filter}-${l.id}`}
                        style={delay((filter === 'ALL' ? 650 : 0) + i * 40)}
                        className={`anim-row group cursor-default transition-colors duration-200 ${l.yours ? 'bg-accent-soft' : i % 2 === 0 ? 'bg-well' : ''} hover:bg-accent-soft/70`}
                      >
                        <td className="whitespace-nowrap rounded-l-xl px-3 py-3 font-semibold">
                          {l.name}
                          {l.yours && <span className={`ml-2 inline-block rounded-full bg-ink px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-paper ${i === 0 ? 'anim-glow' : ''}`}>You</span>}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3">
                          {(l.phone || '').replace(/\D/g, '').length === 10 ? (
                            <a href={`tel:${l.phone.replace(/\D/g, '')}`} className="text-ink no-underline hover:text-brand hover:underline">{l.phone}</a>
                          ) : (
                            <span title="Masked in the demo">{l.phone}</span>
                          )}
                        </td>
                        <td className="px-3 py-3">{l.job}</td>
                        <td className="px-3 py-3 text-muted">{l.area}</td>
                        <td className="whitespace-nowrap px-3 py-3 font-medium">{l.estimate}</td>
                        <td className="whitespace-nowrap px-3 py-3 text-muted">{l.time}</td>
                        <td className="rounded-r-xl px-3 py-3">
                          <span className={`inline-block rounded-full px-3 py-1 text-[13px] font-semibold transition-transform duration-200 group-hover:scale-105 ${pill[l.tier]}`}>
                            {tierWord[l.tier]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {mine.length > 0 && (
                <button type="button" onClick={() => { clearLeads(); setMine([]); }} className="press self-start text-sm font-semibold text-brand underline underline-offset-2 hover:text-ink">
                  Clear my test leads
                </button>
              )}
            </div>

            <div aria-label="Scoring rules" className="anim-rise flex flex-col gap-3.5 rounded-[28px] bg-white p-6" style={delay(640)}>
              <h2 className="m-0 text-xl font-semibold">Your scoring rules</h2>
              <p className="m-0 text-sm leading-snug text-muted">What makes a lead hot for {business.shortName}. The AI also reads the notes for signals like an approved claim.</p>
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {rules.map((o, i) => (
                  <li key={o.id + o.label} className="flex flex-col gap-1.5">
                    <div className="flex gap-2.5">
                      <span className="flex-1">{o.label}</span>
                      <span className={`font-semibold ${o.points > 0 ? 'text-brand' : 'text-accent'}`}>
                        {o.points > 0 ? `+${o.points}` : `−${Math.abs(o.points)}`}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-well" aria-hidden="true">
                      <div
                        className={`anim-grow h-full rounded-full ${o.points > 0 ? 'bg-brand' : 'bg-accent-bright'}`}
                        style={{ width: `${(Math.abs(o.points) / maxPts) * 100}%`, ...delay(800 + i * 50) }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex-1" />
              <div className="flex flex-wrap gap-1.5 text-[13px]">
                <span className="rounded-lg bg-accent px-2.5 py-1 text-white">Hot {business.tiers.hot}+</span>
                <span className="rounded-lg bg-brand px-2.5 py-1 text-white">Warm {business.tiers.warm}–{business.tiers.hot - 1}</span>
                <span className="rounded-lg bg-well px-2.5 py-1">Cold under {business.tiers.warm}</span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function Stat({ d, label, value, unit, chip }) {
  const n = useCountUp(value, { delay: d + 150 });
  return (
    <div className="anim-rise lift flex flex-col justify-between gap-3 rounded-3xl bg-white p-5 sm:px-6" style={delay(d)}>
      <div className="text-sm text-muted">{label}</div>
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="text-3xl font-semibold tabular-nums tracking-tight sm:text-4xl">{n}</span>
        {unit && <span className="text-sm text-muted">{unit}</span>}
        {chip && <span className="anim-pop rounded-full bg-accent-soft px-2.5 py-0.5 text-[13px] font-semibold text-brand" style={delay(d + 700)}>{chip}</span>}
      </div>
    </div>
  );
}

function Pipeline({ d, value }) {
  const n = useCountUp(value, { delay: d + 150, duration: 1200 });
  return (
    <div className="anim-rise lift flex flex-col justify-between gap-3 rounded-3xl bg-brand p-5 text-paper sm:px-6" style={delay(d)}>
      <div className="text-sm text-accent-soft">Open pipeline</div>
      <div className="text-3xl font-semibold tabular-nums tracking-tight sm:text-4xl">{money(n)}</div>
    </div>
  );
}

function TierBlock({ d, active, className, label, count, body, cta, ctaClass, onClick, subClass }) {
  const n = useCountUp(count, { delay: d + 200 });
  return (
    <div
      className={`anim-rise lift flex flex-col gap-2 rounded-[28px] p-6 ${className} ${active ? 'ring-4 ring-ink/80 ring-offset-2 ring-offset-canvas' : ''}`}
      style={delay(d)}
    >
      <div className="text-[13px] font-semibold uppercase tracking-[0.12em]">{label}</div>
      <div className="text-6xl font-semibold tabular-nums leading-none tracking-[-0.04em]">{n}</div>
      <div className={`text-[15px] leading-snug ${subClass}`}>{body}</div>
      <div className="flex-1" />
      <button type="button" onClick={onClick} aria-pressed={active} className={`press mt-2 h-11 rounded-full text-sm font-semibold ${ctaClass}`}>{cta}</button>
    </div>
  );
}
