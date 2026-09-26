import { Link } from 'react-router-dom';
import business from '../../shared/business.js';
import { LogoMark, Wordmark } from './Logo.jsx';
import { Phone } from './Icons.jsx';

export const PRICE_NOTE =
  'Price ranges on this site show what similar jobs often cost. They are not quotes or estimates for your home. Pricing is set only after an in-person inspection.';

const tel = `tel:${business.phone.replace(/\D/g, '')}`;

export function ConceptBanner({ children }) {
  return (
    <div className="bg-accent-soft px-4 py-2 text-center text-[13px] text-ink/80">
      {children || (
        <>
          A concept project. {business.name} is a fictional company.{' '}
          <Link to="/dashboard" className="font-semibold text-brand underline underline-offset-2 hover:text-accent">
            See the owner's side
          </Link>
        </>
      )}
    </div>
  );
}

export function SiteHeader({ minimal = false }) {
  return (
    <header>
      <div className="mx-auto flex h-20 max-w-[1280px] items-center gap-4 px-5 sm:h-24 sm:px-10">
        <Link to="/" className="flex items-center gap-3 no-underline" aria-label={`${business.name} home`}>
          <span className="[&>svg]:h-9 [&>svg]:w-auto sm:[&>svg]:h-[45px]"><LogoMark size={64} /></span>
          <Wordmark />
        </Link>
        <div className="flex-1" />
        {minimal ? (
          <Link to="/" className="font-semibold text-brand hover:text-accent">Back to home</Link>
        ) : (
          <Link to="/quote" className="press inline-flex h-12 shrink-0 items-center rounded bg-accent px-4 font-display font-bold text-white hover:bg-brand sm:px-6">
            <span className="sm:hidden">Get a quote</span>
            <span className="hidden sm:inline">Request a quote</span>
          </Link>
        )}
      </div>
      {!minimal && (
        <nav aria-label="Main" className="bg-brand text-white">
          <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-8 px-5 font-semibold sm:px-10">
            <div className="hidden gap-8 md:flex">
              <Link to="/" className="text-white hover:text-accent-bright">Home</Link>
              <Link to="/#services" className="text-white hover:text-accent-bright">Services</Link>
              <Link to="/#how" className="text-white hover:text-accent-bright">How it works</Link>
              <Link to="/#area" className="text-white hover:text-accent-bright">Where we work</Link>
            </div>
            <div className="flex-1" />
            <a href={tel} className="flex items-center gap-3 text-white no-underline hover:text-accent-bright">
              <span className="flex h-10 w-10 items-center justify-center rounded bg-accent text-white"><Phone /></span>
              <span className="flex flex-col leading-tight">
                <span className="text-xs font-medium text-white/75">Leak right now? Call us</span>
                <span className="font-display text-lg font-extrabold">{business.phone}</span>
              </span>
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-brand text-white/75">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-5 py-8 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-6 sm:px-10">
        <span className="font-display text-xl font-extrabold text-white">{business.name.toUpperCase()}</span>
        <span className="sm:flex-1">{business.city} · {business.phone}</span>
        <span>
          Concept project · Built by {business.credits.builtBy} · Filmed by {business.credits.filmedBy}
        </span>
        <p className="m-0 basis-full text-xs leading-relaxed text-white/65">
          {PRICE_NOTE}{' '}
          <Link to="/privacy" className="font-semibold text-white underline underline-offset-2 hover:text-accent-bright">Privacy</Link>
        </p>
      </div>
    </footer>
  );
}
