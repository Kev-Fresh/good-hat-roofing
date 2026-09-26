import { Link } from 'react-router-dom';
import business from '../../shared/business.js';
import { ConceptBanner, SiteHeader, SiteFooter } from '../components/SiteChrome.jsx';
import Photo from '../components/Photo.jsx';
import { Clock, Tag, Home as HomeIcon, Pin, Check, ServiceIcon, Arrow } from '../components/Icons.jsx';

// Drawings used until real photos are added to public/photos/.
function HeroDrawing() {
  return (
    <svg viewBox="0 0 1440 620" preserveAspectRatio="xMaxYMax slice" aria-hidden="true" className="h-full w-full">
      <rect width="1440" height="620" fill="#2B3E5E" />
      <g fill="#223249">
        <path d="M640 620 V360 L780 250 L920 360 V620 Z" />
        <path d="M880 620 V320 L1040 190 L1200 320 V620 Z" />
        <path d="M1160 620 V380 L1280 290 L1400 380 V620 Z" />
      </g>
      <g fill="#33496C">
        <rect x="960" y="370" width="44" height="60" />
        <rect x="1080" y="370" width="44" height="60" />
        <rect x="720" y="400" width="36" height="50" />
      </g>
    </svg>
  );
}

function HouseDrawing({ snow = false }) {
  return (
    <svg viewBox="0 0 640 440" preserveAspectRatio="xMidYMax slice" aria-hidden="true" className="h-full w-full">
      <rect width="640" height="440" fill={snow ? '#2B3E5E' : 'var(--gh-accent-soft)'} />
      <rect y="370" width="640" height="70" fill={snow ? '#F3F5F9' : '#D9DFE8'} />
      <path d="M170 370 V230 L320 110 L470 230 V370 Z" fill={snow ? '#E7EBF2' : '#FFFFFF'} />
      <path d="M140 246 L320 98 L500 246" fill="none" stroke="var(--gh-brand)" strokeWidth="26" />
      <path d="M400 164 L500 246" fill="none" stroke="var(--gh-accent)" strokeWidth="26" />
      {snow && <path d="M150 240 L320 102 L490 240" fill="none" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />}
      <rect x="210" y="270" width="56" height="60" fill="var(--gh-brand)" />
      <rect x="374" y="270" width="56" height="60" fill="var(--gh-brand)" />
      <rect x="296" y="296" width="48" height="74" fill="var(--gh-accent)" />
    </svg>
  );
}

const perks = [
  { icon: <Clock />, title: 'Any hour', body: 'Quick replies, day or night' },
  { icon: <Tag />, title: 'Range first', body: 'Before anyone visits' },
  { icon: <HomeIcon />, title: 'Homes only', body: 'Residential roofing' },
  { icon: <Pin />, title: business.region, body: `${business.city.split(',')[0]} and nearby towns` },
];

const steps = [
  { title: "Tell us what's up", body: 'A few quick questions about your roof. Add details if you have them.' },
  { title: 'Get a rough range', body: 'Our assistant usually replies within a minute with what similar jobs often cost and open inspection times. Not a quote.' },
  { title: 'We come take a look', body: 'Once we confirm a time, a roofer inspects and gives you a written quote. No pressure.' },
];

const checklist = [...business.services.map((s) => s.title), 'Insurance walk-through'].slice(0, 6);

const Eyebrow = ({ children, light }) => (
  <div className={`font-display text-sm font-bold tracking-[0.14em] ${light ? 'text-accent-bright' : 'text-accent'}`}>{children}</div>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-paper">
      <ConceptBanner />
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-brand">
          <div className="absolute inset-0">
            <Photo src={business.photos.hero} alt="">
              <HeroDrawing />
            </Photo>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#101A2B]/95 via-[#101A2B]/65 to-[#101A2B]/15" />
          <div className="relative mx-auto flex min-h-[520px] max-w-[1280px] flex-col justify-center gap-6 px-5 py-16 text-white sm:px-10 lg:min-h-[600px]">
            <h1 className="anim-rise m-0 max-w-[720px] font-display text-5xl font-extrabold leading-[1.02] tracking-[-0.015em] sm:text-7xl">
              Every house deserves a <span className="text-accent-bright">good hat.</span>
            </h1>
            <p className="anim-rise m-0 max-w-[560px] text-lg leading-relaxed text-white/85 sm:text-xl" style={{ '--d': '120ms' }}>
              Replacements, leaks and storm repair for {business.city.split(',')[0]}-area homes. Tell us what's going on and see a rough price range, usually in under a minute.
            </p>
            <div className="anim-rise flex flex-wrap gap-3" style={{ '--d': '240ms' }}>
              <Link to="/quote" className="press inline-flex h-14 items-center gap-2.5 rounded bg-accent px-7 font-display text-[17px] font-bold text-white hover:bg-white hover:text-brand">
                See a rough range <Arrow />
              </Link>
              <Link to="/#services" className="press inline-flex h-14 items-center rounded border-2 border-white px-7 font-display text-[17px] font-bold text-white hover:bg-white hover:text-brand">
                Our services
              </Link>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="mx-auto grid max-w-[1280px] items-center gap-12 px-5 py-20 sm:px-10 lg:grid-cols-[520px_minmax(0,1fr)] lg:gap-20 lg:py-28">
          <div className="relative h-[340px] border-l-[14px] border-accent sm:h-[420px]">
            <Photo src={business.photos.about} alt="A finished shingle roof">
              <HouseDrawing />
            </Photo>
          </div>
          <div className="flex flex-col gap-5">
            <Eyebrow>ABOUT US</Eyebrow>
            <h2 className="m-0 font-display text-4xl font-extrabold leading-tight text-brand sm:text-5xl">
              Straight answers for {business.city.split(',')[0]} roofs.
            </h2>
            <p className="m-0 text-lg leading-relaxed text-ink/80">
              We work on homes, not office parks. You'll get a rough range up front, a real person on the phone, and a written quote after we've actually looked at your roof.
            </p>
            <ul className="m-0 grid list-none gap-x-6 gap-y-3.5 p-0 text-[17px] font-medium sm:grid-cols-2">
              {checklist.map((c) => (
                <li key={c} className="flex items-center gap-2.5"><Check />{c}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Quick facts */}
        <section aria-label="Why us" className="bg-accent-soft">
          <div className="mx-auto grid max-w-[1280px] gap-6 px-5 py-8 sm:grid-cols-2 sm:px-10 lg:grid-cols-4 lg:gap-0">
            {perks.map((p, i) => (
              <div key={p.title} className={`flex items-center gap-4 lg:px-6 ${i < perks.length - 1 ? 'lg:border-r lg:border-line' : ''} ${i === 0 ? 'lg:pl-0' : ''}`}>
                <span className="text-accent [&>svg]:h-10 [&>svg]:w-10">{p.icon}</span>
                <div>
                  <div className="font-display text-[22px] font-extrabold text-brand">{p.title}</div>
                  <div className="text-[15px] text-ink/75">{p.body}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Winter split */}
        <section className="grid lg:grid-cols-2">
          <div className="relative h-[320px] bg-brand lg:h-auto lg:min-h-[480px]">
            <Photo src={business.photos.winter} alt="A snowy roofline">
              <HouseDrawing snow />
            </Photo>
          </div>
          <div className="flex flex-col justify-center gap-5 bg-brand px-5 py-14 text-white sm:px-10 lg:px-20">
            <h2 className="m-0 font-display text-4xl font-extrabold leading-tight">Built for Buffalo winters.</h2>
            <p className="m-0 max-w-[520px] text-lg leading-relaxed text-white/80">
              Heavy snow, ice dams and freeze-thaw are what we plan around. We'll tell you what your roof needs and what it doesn't.
            </p>
            <Link to="/#how" className="press inline-flex h-13 items-center self-start rounded bg-accent px-6 font-display font-bold text-white hover:bg-white hover:text-brand">
              How it works
            </Link>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="mx-auto max-w-[1280px] scroll-mt-6 px-5 pt-24 sm:px-10">
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:gap-16">
            <div className="flex flex-1 flex-col gap-2.5">
              <Eyebrow>OUR SERVICES</Eyebrow>
              <h2 className="m-0 font-display text-4xl font-extrabold text-brand sm:text-5xl">Everything that keeps water out</h2>
            </div>
            <p className="m-0 max-w-[420px] text-[17px] leading-relaxed text-ink/80">
              Residential roofing across most of {business.region}, from a single leak to a full tear-off.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            {business.services.map((s) => (
              <div key={s.title} className="lift flex flex-col items-center gap-3.5 rounded-md border border-line/70 bg-white px-4 pb-7 pt-8 text-center">
                <span className="text-brand"><ServiceIcon name={s.icon} /></span>
                <h3 className="m-0 font-display text-lg font-bold text-brand">{s.title}</h3>
                <span className="h-[3px] w-8 bg-accent" />
                <p className="m-0 text-sm leading-snug text-ink/70">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="mx-auto max-w-[1280px] scroll-mt-6 px-5 pt-24 sm:px-10">
          <div className="mb-10 flex flex-col gap-2.5">
            <Eyebrow>HOW IT WORKS</Eyebrow>
            <h2 className="m-0 font-display text-4xl font-extrabold text-brand sm:text-5xl">Three steps, no pressure</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="flex gap-5 border-t-4 border-brand pt-6">
                <div className="font-display text-7xl font-extrabold leading-[0.8] text-accent">{i + 1}</div>
                <div className="flex flex-col gap-2">
                  <h3 className="m-0 font-display text-2xl font-extrabold text-brand">{s.title}</h3>
                  <p className="m-0 text-[17px] leading-relaxed text-ink/80">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Where we work */}
        <section id="area" className="mx-auto max-w-[1280px] scroll-mt-6 px-5 pt-24 sm:px-10">
          <div className="flex flex-col gap-8 rounded-md border border-line/70 p-8 sm:p-10 lg:flex-row lg:items-center lg:gap-16">
            <div className="flex flex-col gap-3 lg:w-[380px]">
              <Eyebrow>WHERE WE WORK</Eyebrow>
              <h2 className="m-0 font-display text-4xl font-extrabold text-brand">Most of {business.region}</h2>
              <p className="m-0 text-ink/75">Not sure if you're covered? Ask in the quote form.</p>
            </div>
            <div className="flex flex-1 flex-wrap gap-2.5">
              {business.serviceArea.map((t) => (
                <span key={t} className="rounded border border-line/70 bg-accent-soft px-4 py-2 font-medium">{t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-[1280px] px-5 pt-24 sm:px-10">
          <div className="flex flex-col gap-6 rounded-md bg-accent px-8 py-10 text-white lg:flex-row lg:items-center lg:gap-10 lg:px-14">
            <div className="flex flex-1 flex-col gap-2">
              <h2 className="m-0 font-display text-3xl font-extrabold leading-tight sm:text-4xl">Roof acting up? Start with a rough range.</h2>
              <p className="m-0 text-white/85">Takes about a minute. Not a quote, just a starting point.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/quote" className="press inline-flex h-14 items-center rounded bg-white px-7 font-display font-extrabold text-brand hover:bg-brand hover:text-white">
                Request a quote
              </Link>
              <a href={`tel:${business.phone.replace(/\D/g, '')}`} className="press inline-flex h-14 items-center rounded border-2 border-white px-7 font-display font-bold text-white no-underline hover:bg-white hover:text-brand">
                {business.phone}
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
