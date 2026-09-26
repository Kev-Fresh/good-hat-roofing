// ─────────────────────────────────────────────────────────────
// THE TEMPLATE FILE.
// Everything that makes this "Good Hat Roofing" lives here.
// For a new client: swap the brand, the form questions, and the
// scoring rules below. The pages and the AI function read from this.
// ─────────────────────────────────────────────────────────────

const business = {
  name: 'Good Hat Roofing',
  shortName: 'good hat',
  monogram: 'gh',
  tagline: 'Every house deserves a good hat.',
  city: 'Buffalo, NY',
  region: 'Erie County',
  phone: '(716) 555-0142', // 555 = fictional on purpose
  ownerName: 'Mike',
  privacyContact: '[privacy contact email]', // swap in a real inbox before launch
  privacyUpdated: 'September 25, 2026',

  // Credits shown on the site. Swap in the studio name once it's locked.
  credits: {
    builtBy: '[Studio Name]',
    filmedBy: 'Freshr Studios',
  },

  // Brand colors. Change these and the whole site + dashboard re-skins.
  colors: {
    brand: '#1B2A41', // navy — header bar, headings, dark panels
    accent: '#A63D2F', // brick red — main buttons, HOT leads, highlights (white text on it)
    accentBright: '#E0604F', // lighter red for text on dark backgrounds
    accentSoft: '#EEF1F5', // pale blue-gray — soft panels and strips
    ink: '#1A1F2B', // body text
    paper: '#FFFFFF', // page background
  },

  // Drop photos in public/photos/ with these names. Missing ones fall back
  // to a drawing, so the site never shows a broken image.
  photos: {
    hero: '/photos/hero.jpg', // roofer at work, from behind or far away
    about: '/photos/about.jpg', // finished shingle roof on a house
    winter: '/photos/winter.jpg', // snowy roofline or icicles
  },

  serviceArea: [
    'Buffalo', 'Kenmore', 'Tonawanda', 'Cheektowaga', 'Amherst',
    'West Seneca', 'Lackawanna', 'Hamburg', 'Orchard Park',
  ],

  services: [
    { icon: 'house', title: 'Full replacement', body: 'Tear-off to new shingles. Most homes take one to two days.' },
    { icon: 'drop', title: 'Leak repair', body: 'Find the source, patch it, then fix it properly.' },
    { icon: 'storm', title: 'Storm damage', body: 'We can walk you through the insurance process.' },
    { icon: 'snow', title: 'Ice dams', body: 'Help stop ice backup before it reaches your ceiling.' },
    { icon: 'gutter', title: 'Gutters', body: 'Clear, repair or replace so water goes where it should.' },
    { icon: 'search', title: 'Inspections', body: "Buying, selling, or worried. You'll get an honest read." },
  ],

  // Inspection times the assistant offers.
  inspectionSlots: ['Tue 9:30 AM', 'Thu 1:00 PM'],

  // ── The quote form ─────────────────────────────────────────
  // Each answer carries the points the owner gave it.
  // estLow/estHigh = the owner's ballpark price guide.
  form: {
    job: {
      question: "What's going on?",
      options: [
        { id: 'leak', label: 'Active leak', points: 30, estLow: 1500, estHigh: 4000, phrase: 'leak repair' },
        { id: 'storm', label: 'Storm damage', points: 30, estLow: 3000, estHigh: 12000, phrase: 'storm damage' },
        { id: 'full', label: 'Full replacement', points: 20, estLow: 11000, estHigh: 14000, phrase: 'full replacement' },
        { id: 'repair', label: 'Small repair', points: 0, estLow: 600, estHigh: 2000, phrase: 'small repair' },
        { id: 'check', label: 'Just a price check', points: -10, estLow: 10000, estHigh: 14000, phrase: 'full roof replacement' },
      ],
    },
    timeline: {
      question: 'When do you need it done?',
      options: [
        { id: 'asap', label: 'ASAP', points: 15 },
        { id: 'month', label: 'Within a month', points: 15 },
        { id: 'months', label: 'Next few months', points: 5 },
        { id: 'plan', label: 'Just planning', points: -10 },
      ],
    },
    insurance: {
      question: 'Is insurance involved?',
      options: [
        { id: 'yes', label: 'Yes, claim approved', points: 25 },
        { id: 'filing', label: 'Filing a claim', points: 10 },
        { id: 'no', label: 'No', points: 0 },
      ],
    },
  },

  // Score cutoffs.
  tiers: { hot: 60, warm: 30 },

  // Extra judgment calls the AI is allowed to make from the free-text box.
  aiGuidance: [
    'Water actively coming inside, or a ceiling stain after a storm, is urgent.',
    'Mentions of an insurance adjuster approving the claim count as claim approved.',
    'Rentals, flips and multi-unit properties are good repeat-business signals.',
    'Addresses clearly outside Erie County should be flagged as out of area.',
    '"Just curious", "no budget yet" or "maybe next year" lower urgency.',
  ],
};

export default business;
