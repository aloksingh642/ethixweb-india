export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  city: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      'We stopped losing patients because the phone rang out. The agent picks up in Hindi, books the slot, and my front desk only handles the complicated cases now.',
    author: 'Dr. Ananya Rathore',
    role: 'Medical Director, Meraki Clinics',
    city: 'Jaipur',
  },
  {
    quote:
      'Same ad budget, fewer junk calls, and the team finally knows which campaigns bring real buyers to the site. Cost per qualified lead came down 44%.',
    author: 'Rohit Satyam',
    role: 'Director, Satyam Buildcon',
    city: 'Jaipur',
  },
  {
    quote:
      'Our old store took six seconds to load on a phone. It now loads in under a second and a half, and prepaid orders went up by forty percent.',
    author: 'Meera Iyer',
    role: 'Founder, Bharat Bazaar',
    city: 'Ahmedabad',
  },
  {
    quote:
      'Enquiries used to sit in an inbox overnight. Counsellors now reply in about eleven minutes, and our admissions team stopped fighting over six different spreadsheets.',
    author: 'Vikram Nair',
    role: 'COO, Pragati Skills',
    city: 'Bengaluru',
  },
  {
    quote:
      'I have worked with three agencies before. This is the first one that sends a report I can actually read, with numbers my finance team agrees with.',
    author: 'Suresh Patel',
    role: 'Partner, Kaveri Textiles',
    city: 'Surat',
  },
];

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: 'How much does a website cost in India?',
    a: 'A proper marketing site starts at ₹85,000 and a full ecommerce build at ₹1,50,000. Retainers for SEO, ads and support start around ₹18,000 a month. Every project is fixed-price and quoted in writing before we start — no hourly surprises.',
  },
  {
    q: 'Do you work with businesses outside the metro cities?',
    a: 'Most of our clients are in Jaipur, Ahmedabad, Indore, Kochi, Coimbatore and Surat as much as Bengaluru and Mumbai. Everything runs remotely with weekly video calls in IST, and we travel for kickoff when it matters.',
  },
  {
    q: 'How do payments work?',
    a: 'UPI, NEFT, IMPS and cards. Every invoice is a proper GST tax invoice with our GSTIN, and for projects above ₹1 lakh we usually split into milestone payments rather than asking for everything up front.',
  },
  {
    q: 'Can you build for Hindi-speaking customers?',
    a: 'Yes. We build Hindi content, and our AI voice and chat agents handle Hindi, English and natural Hinglish — including romanised Hindi, which is how most people actually type. Marathi, Tamil, Telugu, Bengali and Gujarati are available through our language partners.',
  },
  {
    q: 'Who owns the code, the domain and the data?',
    a: 'You do, from day one. The repository, hosting, analytics and ad accounts are all in your name. If you decide to leave, you take everything with you and we hand over documentation. That is the whole point of working this way.',
  },
  {
    q: 'We already have a developer or an agency. Can you still help?',
    a: 'Often. We are happy to work alongside an existing team on a specific piece — an audit, an AI receptionist, a measurement rebuild — without asking you to move everything. We will tell you honestly if we think the setup is fine as it is.',
  },
  {
    q: 'How quickly can you start?',
    a: 'Discovery calls happen within a day or two. Most projects start within two weeks of the proposal being signed, and support retainers can begin within 48 hours.',
  },
];
