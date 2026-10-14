export type CaseStudy = {
  slug: string;
  client: string;
  industry: string;
  city: string;
  headline: string;
  summary: string;
  challenge: string;
  approach: string[];
  results: { value: string; label: string }[];
  services: string[];
  quote?: { text: string; author: string; role: string };
  accent: 'brand' | 'saffron' | 'jade' | 'ink';
  featured: boolean;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'meraki-clinics',
    client: 'Meraki Clinics',
    industry: 'Healthcare',
    city: 'Jaipur · 14 locations',
    headline: '71% fewer missed calls across 14 clinics',
    summary:
      'A multi-speciality clinic chain was losing appointment calls every day during peak hours. We put an AI receptionist in front of every number and rebuilt the booking flow.',
    challenge:
      'Front-desk staff at 14 locations could not keep up with call volume between 10am and 1pm. Roughly a third of calls went unanswered, and there was no reliable way to know how many turned into patients who simply booked elsewhere.',
    approach: [
      'Call analytics across all 14 numbers to quantify the real loss per location',
      'AI voice receptionist in Hindi, English and Hinglish, with instant human transfer',
      'Real-time calendar integration so the agent books actual available slots',
      'WhatsApp confirmation and reminders 24 hours and 2 hours before each appointment',
      'Unified dashboard showing missed calls, bookings and no-shows per clinic',
    ],
    results: [
      { value: '−71%', label: 'Missed call rate' },
      { value: '+38%', label: 'Appointments booked' },
      { value: '−22%', label: 'Patient no-shows' },
      { value: '< 2s', label: 'Time to answer' },
    ],
    services: ['AI voice receptionist', 'WhatsApp automation', 'Dashboards & reporting'],
    quote: {
      text: 'We stopped losing patients because the phone rang out. The agent picks up in Hindi, books the slot, and my front desk only handles the complex cases now.',
      author: 'Dr. Ananya Rathore',
      role: 'Medical Director, Meraki Clinics',
    },
    accent: 'brand',
    featured: true,
  },
  {
    slug: 'satyam-buildcon',
    client: 'Satyam Buildcon',
    industry: 'Real Estate',
    city: 'Jaipur',
    headline: 'Cost per qualified lead down 44%',
    summary:
      'A residential developer was generating plenty of enquiries and almost no site visits. We rebuilt the funnel from ad group to site-visit confirmation.',
    challenge:
      'Google Ads was producing a high volume of low-intent form fills. The sales team was spending its day calling people who had no budget, no timeline, or were just checking prices. Nobody could tell which campaign produced actual site visits.',
    approach: [
      'Rebuilt the account around intent clusters and city-plus-locality targeting',
      'Built locality-specific landing pages matched to each ad group',
      'Added budget and timeline qualification to the form, with hard routing rules',
      'Call tracking with outcome tagging on every enquiry',
      'Offline conversion import so Google optimised toward site visits, not form fills',
    ],
    results: [
      { value: '−44%', label: 'Cost per qualified lead' },
      { value: '+62%', label: 'Site visits booked' },
      { value: '2.3×', label: 'Return on ad spend' },
      { value: '18 hrs', label: 'Sales time saved weekly' },
    ],
    services: ['Google Ads', 'Landing pages & CRO', 'Analytics & GA4'],
    quote: {
      text: 'Same budget, fewer junk calls, and the team finally knows which campaigns bring real buyers to the site.',
      author: 'Rohit Satyam',
      role: 'Director, Satyam Buildcon',
    },
    accent: 'saffron',
    featured: true,
  },
  {
    slug: 'bharat-bazaar',
    client: 'Bharat Bazaar',
    industry: 'D2C Grocery',
    city: 'Ahmedabad',
    headline: 'Checkout conversion from 0.9% to 2.6%',
    summary:
      'A regional grocery brand with strong repeat purchase but a store that fell over on mobile. We rebuilt it around UPI, COD and pin-code reality.',
    challenge:
      'Nearly all traffic was mobile and most of it was on mid-range Android. Product pages took over six seconds to load, checkout assumed a credit card, and RTO on cash-on-delivery orders was running at 19%.',
    approach: [
      'Headless Next.js rebuild with a sub-2-second budget on 4G',
      'UPI-first checkout with Razorpay, plus COD with verification',
      'Pin-code serviceability checks before checkout, not after',
      'Address validation and WhatsApp order confirmation to cut RTO',
      'Catalogue restructure and search relevance tuning',
    ],
    results: [
      { value: '2.6%', label: 'Checkout conversion (was 0.9%)' },
      { value: '−34%', label: 'Return-to-origin rate' },
      { value: '1.4s', label: 'Mobile load time (was 6.2s)' },
      { value: '+41%', label: 'Share of prepaid orders' },
    ],
    services: ['Ecommerce development', 'CRO', 'WhatsApp automation'],
    accent: 'jade',
    featured: true,
  },
  {
    slug: 'kaveri-textiles',
    client: 'Kaveri Textiles',
    industry: 'Manufacturing & Exports',
    city: 'Surat',
    headline: 'Organic export enquiries up 3.4×',
    summary:
      'A third-generation textile manufacturer invisible in search, competing against aggregator marketplaces for the same export enquiries.',
    challenge:
      'The business had deep capability and no digital presence to show for it. Buyers searching for specific fabric specifications, MOQs and certifications found trading portals instead. The existing site was a five-page brochure from 2016 that had never been indexed properly.',
    approach: [
      'Technical SEO rebuild: crawl fixes, schema, Core Web Vitals to 95+',
      'Specification-led content architecture built around how buyers actually search',
      'Product and certification pages with structured data',
      'Digital PR in trade publications to build real authority',
      'Enquiry tracking so we could prove which pages produced RFQs',
    ],
    results: [
      { value: '3.4×', label: 'Organic enquiries' },
      { value: '11', label: 'New export markets' },
      { value: '95+', label: 'PageSpeed mobile score' },
      { value: '6 mo', label: 'Time to compounding growth' },
    ],
    services: ['SEO for Indian Search', 'Website design & development', 'Dashboards & reporting'],
    accent: 'ink',
    featured: false,
  },
  {
    slug: 'pragati-skills',
    client: 'Pragati Skills',
    industry: 'Education',
    city: 'Bengaluru',
    headline: 'Counsellor response time: 9 hours to 11 minutes',
    summary:
      'A skilling institute losing admissions to faster competitors because enquiries sat in a shared inbox overnight.',
    challenge:
      'Leads arrived from six channels into three different inboxes. Counsellors picked them up the next morning, by which time the student had already spoken to two other institutes. Nobody could see which channel produced students who actually enrolled.',
    approach: [
      'Consolidated all enquiry sources into one Zoho CRM pipeline',
      'WhatsApp chatbot for instant qualification, in English, Hindi and Kannada',
      'Automated counsellor assignment with response SLAs and escalation',
      'Lifecycle nurture: drip sequences for the 60-day decision window',
      'Attribution dashboards connecting channel to actual enrolments',
    ],
    results: [
      { value: '11 min', label: 'Median response (was 9 hrs)' },
      { value: '+52%', label: 'Lead-to-enrolment rate' },
      { value: '−31%', label: 'Admissions cycle length' },
      { value: '6→1', label: 'Inboxes consolidated' },
    ],
    services: ['WhatsApp automation', 'Email, SMS & CRM lifecycle', 'Dashboards & reporting'],
    accent: 'brand',
    featured: false,
  },
  {
    slug: 'fintrust-credit',
    client: 'FinTrust Credit',
    industry: 'BFSI',
    city: 'Mumbai',
    headline: 'A lending journey that passes audit and converts',
    summary:
      'An NBFC whose digital application flow was both slow and non-compliant. We rebuilt it to satisfy the regulator and the customer at the same time.',
    challenge:
      'The application funnel dropped 74% of users before completion, and the internal compliance team had flagged accessibility and consent gaps. Any fix had to survive an RBI-facing audit while improving completion.',
    approach: [
      'Funnel analysis to find the four steps causing most abandonment',
      'Rebuilt forms with progressive disclosure, autosave and clear error recovery',
      'WCAG 2.2 AA remediation, verified with screen readers and keyboard-only testing',
      'DPDP Act 2023 consent flows with proper logging and retention rules',
      'Automated accessibility and consent checks wired into CI',
    ],
    results: [
      { value: '+47%', label: 'Application completion' },
      { value: 'AA', label: 'WCAG 2.2 conformance' },
      { value: '0', label: 'Critical audit findings' },
      { value: '2.1×', label: 'Qualified applications' },
    ],
    services: ['Accessibility remediation', 'CRO', 'Web application development'],
    accent: 'jade',
    featured: false,
  },
];

export const featuredCaseStudies = caseStudies.filter((c) => c.featured);
export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);
