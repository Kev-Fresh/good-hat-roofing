import business from '../../shared/business.js';
import { ConceptBanner, SiteHeader, SiteFooter } from '../components/SiteChrome.jsx';

const sections = [
  {
    title: 'What the quote form asks for',
    body: [
      'Your name, a phone number, an email address, your street or neighborhood, what’s going on with your roof, your timeline, whether insurance is involved, and any notes you add.',
    ],
  },
  {
    title: 'What happens to it in this demo',
    body: [
      'Your answers go to our server so the lead can be scored and a reply written. Nothing is saved there.',
      'To score the lead we use Claude, an AI model made by Anthropic. The AI only sees your job answers, your neighborhood without a house number, and your notes with any phone numbers or emails removed. It never sees your name, phone number, email, or street address.',
      'So the demo owner dashboard can show your test lead, your own browser keeps a short copy with only the last 4 digits of your phone number. Your email and notes are not kept. That copy deletes itself after 24 hours, and you can clear it any time from the dashboard.',
    ],
  },
  {
    title: 'How we contact you',
    body: [
      'Someone from our team calls you back about your request. We don’t send text messages, and we never use your number for marketing.',
    ],
  },
  {
    title: 'What we don’t do',
    body: [
      'We don’t sell your information or share it with anyone for marketing. We don’t use it for anything other than your roofing request.',
    ],
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-paper">
      <ConceptBanner />
      <SiteHeader />
      <main className="mx-auto max-w-[760px] px-5 pb-8 pt-6 sm:px-10">
        <h1 className="m-0 text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">Privacy</h1>
        <p className="mt-3 text-muted">Last updated {business.privacyUpdated}</p>
        <p className="mt-6 rounded-2xl bg-accent-soft p-5 leading-relaxed">
          This is a concept project. {business.name} is a fictional company, so please don’t enter real personal details. Any 555 phone number works.
        </p>
        {sections.map((s) => (
          <section key={s.title} className="mt-10">
            <h2 className="m-0 text-2xl font-semibold">{s.title}</h2>
            {s.body.map((p) => (
              <p key={p} className="mb-0 mt-3 text-[17px] leading-relaxed text-ink/85">{p}</p>
            ))}
          </section>
        ))}
        <section className="mt-10">
          <h2 className="m-0 text-2xl font-semibold">Questions</h2>
          <p className="mb-0 mt-3 text-[17px] leading-relaxed text-ink/85">Reach us at {business.privacyContact}.</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
