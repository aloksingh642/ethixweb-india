export type ServiceCategorySlug =
  | 'website'
  | 'ai'
  | 'growth'
  | 'data'
  | 'accessibility'
  | 'support';

export type ServiceCategory = {
  slug: ServiceCategorySlug;
  name: string;
  blurb: string;
  /** Short line for the home page category cards. */
  cardLine: string;
  index: string;
};

export type Service = {
  slug: string;
  name: string;
  category: ServiceCategorySlug;
  /** One-line promise shown in cards, meta descriptions and list views. */
  tagline: string;
  /** 2–3 sentence overview used at the top of the detail page. */
  summary: string;
  /** What you actually receive. */
  deliverables: string[];
  /** Measurable outcomes — kept specific, not vague. */
  outcomes: { label: string; detail: string }[];
  /** INR pricing, India market rates. */
  priceFrom: string;
  priceNote: string;
  timeline: string;
  /** India-specific proof point. */
  indiaNote: string;
  /** Hinglish/India-market keywords for the "best for" line. */
  bestFor: string;
  faqs: { q: string; a: string }[];
};

export const categories: ServiceCategory[] = [
  {
    slug: 'website',
    name: 'Website',
    blurb: 'Fast, premium websites and stores built for Indian buying behaviour.',
    cardLine: 'Redesigns, headless builds, landing pages and ongoing maintenance.',
    index: '01',
  },
  {
    slug: 'ai',
    name: 'AI',
    blurb: 'Agents that answer, qualify and book in Hindi, English and Hinglish.',
    cardLine: 'Voice agents, WhatsApp automation and workflow copilots.',
    index: '02',
  },
  {
    slug: 'growth',
    name: 'Growth',
    blurb: 'SEO, ads and lifecycle working as one accountable engine.',
    cardLine: 'SEO, Google & Meta ads, content, email and local search.',
    index: '03',
  },
  {
    slug: 'data',
    name: 'Data',
    blurb: 'Clean tracking, live dashboards and honest monthly reporting.',
    cardLine: 'Analytics, dashboards and conversion experimentation.',
    index: '04',
  },
  {
    slug: 'accessibility',
    name: 'Accessibility',
    blurb: 'Inclusive builds reviewed against WCAG 2.2 and the RPwD Act.',
    cardLine: 'Audits, remediation and ongoing conformance testing.',
    index: '05',
  },
  {
    slug: 'support',
    name: 'Support',
    blurb: 'A real team on call in IST — not a ticket queue in another timezone.',
    cardLine: 'Support desk, content updates and API maintenance.',
    index: '06',
  },
];

export const services: Service[] = [
  /* ─────────────────────────── WEBSITE ─────────────────────────── */
  {
    slug: 'website-design-development',
    name: 'Website Design & Development',
    category: 'website',
    tagline: 'Premium sites that load in under a second on Indian 4G.',
    summary:
      'We design and build websites that work on a ₹9,000 Android phone over Jio 4G, not just on a MacBook over fibre. Every build ships with Core Web Vitals budgets, a CMS your team can actually edit, and conversion paths mapped to how Indian buyers research — heavy on mobile, trust signals and WhatsApp.',
    deliverables: [
      'Positioning workshop and message hierarchy',
      'Responsive UI design system (Figma) with mobile-first breakpoints',
      'Next.js build with static rendering and image optimisation',
      'CMS or MDX content model your marketing team can edit',
      'Analytics, Search Console and conversion tracking wired up',
      'Core Web Vitals budget: LCP < 2.0s on 4G, CLS < 0.05',
      '30-day post-launch hypercare',
    ],
    outcomes: [
      { label: '0.9s', detail: 'Median LCP on mobile 4G across 2025 builds' },
      { label: '95+', detail: 'Average Google PageSpeed mobile score at handover' },
      { label: '2.1×', detail: 'Typical lift in enquiry rate after relaunch' },
    ],
    priceFrom: '₹85,000',
    priceNote: 'one-time for a 8–12 page marketing site. EMI options available.',
    timeline: '4–6 weeks',
    indiaNote:
      'Built and tested on real mid-range Android devices and Jio/Airtel 4G, because 78% of Indian web traffic is mobile.',
    bestFor: 'Professional services, healthcare, real estate, manufacturing and D2C brands.',
    faqs: [
      {
        q: 'Do you work with businesses outside metro cities?',
        a: 'Yes. Most of our India clients are in Jaipur, Ahmedabad, Indore, Kochi and Coimbatore as much as Bengaluru and Mumbai. Everything runs remotely with weekly IST calls.',
      },
      {
        q: 'Can you migrate our existing site without losing rankings?',
        a: 'That is standard scope. We map every indexed URL, set 301 redirects, carry metadata across, submit sitemaps and monitor Search Console daily for 30 days after launch.',
      },
      {
        q: 'Who owns the code and domain?',
        a: 'You do, from day one. Repo, hosting, analytics and domain accounts are all in your name. We hand over credentials at kickoff, not at the end.',
      },
    ],
  },
  {
    slug: 'ecommerce-development',
    name: 'Ecommerce Development',
    category: 'website',
    tagline: 'Stores built for COD, UPI and prepaid — in that order of complexity.',
    summary:
      'Indian ecommerce is not US ecommerce. We build for cash-on-delivery risk, RTO reduction, UPI-first checkout, pin-code serviceability and GST-correct invoicing — on Shopify, WooCommerce or a headless stack when catalogues get large.',
    deliverables: [
      'Catalogue architecture and filter strategy',
      'Shopify or WooCommerce build (headless Next.js for 5,000+ SKUs)',
      'Razorpay / PayU / Cashfree with UPI, cards, netbanking and COD',
      'Pin-code serviceability and shipping partner integration',
      'RTO reduction: COD verification, address validation, order confirmation calls',
      'GST-compliant invoicing and returns workflow',
      'Speed budget: sub-2s product pages on 4G',
    ],
    outcomes: [
      { label: '−34%', detail: 'Average RTO reduction after COD verification flows' },
      { label: '2.6×', detail: 'Checkout conversion improvement on rebuilt stores' },
      { label: '41%', detail: 'Share of prepaid orders after UPI-first checkout' },
    ],
    priceFrom: '₹1,50,000',
    priceNote: 'one-time for a full store build. Ongoing growth retainer priced separately.',
    timeline: '6–10 weeks',
    indiaNote:
      'UPI, COD and RTO are first-class requirements, not afterthoughts. We size every store around them.',
    bestFor: 'D2C brands, manufacturers going direct, and retailers moving online.',
    faqs: [
      {
        q: 'Shopify or WooCommerce?',
        a: 'Shopify for speed to market and reliability. WooCommerce when you need deep customization or already run WordPress. Headless Next.js when the catalogue exceeds roughly 5,000 SKUs.',
      },
      {
        q: 'How do you handle GST invoicing?',
        a: 'We integrate a GST-ready invoicing layer (or your existing Tally/billing stack) so every order produces a compliant tax invoice with correct HSN and place-of-supply logic.',
      },
      {
        q: 'Can you reduce our RTO?',
        a: 'Usually yes. The combination of address validation, COD order confirmation over WhatsApp and prepaid incentives typically cuts RTO by a quarter to a half.',
      },
    ],
  },
  {
    slug: 'landing-pages-cro',
    name: 'Landing Pages & CRO',
    category: 'website',
    tagline: 'Campaign pages that turn ad spend into qualified enquiries.',
    summary:
      'A ₹40,000/month Google Ads budget on a generic homepage is money on fire. We build fast, single-intent landing pages per campaign and cluster, matched to the ad, the keyword and the city — then test them properly.',
    deliverables: [
      'Message-match audit against live ad groups and keywords',
      'Mobile-first page design with a single conversion goal',
      'Build on your stack or as standalone Next.js pages',
      'Form → CRM/WhatsApp routing with instant lead notification',
      'A/B test plan and statistical readouts',
      'Heatmap and scroll analysis (Microsoft Clarity)',
    ],
    outcomes: [
      { label: '+68%', detail: 'Median lift in landing page conversion rate' },
      { label: '−29%', detail: 'Typical drop in cost per qualified lead' },
      { label: '< 1s', detail: 'Page load target so Quality Score improves' },
    ],
    priceFrom: '₹28,000',
    priceNote: 'per page, including design, build, tracking and one test cycle.',
    timeline: '1–2 weeks per page',
    indiaNote:
      'Pages are localised by city and language where it matters — a Mumbai page and a Jaipur page should not say the same thing.',
    bestFor: 'Businesses running Google or Meta ads that are not converting.',
    faqs: [
      {
        q: 'Can you build on our existing WordPress site?',
        a: 'Yes. We can ship standalone Next.js pages on a subdomain, or build inside WordPress with a lean template. We recommend whichever loads faster in your setup.',
      },
      {
        q: 'How many tests do you run?',
        a: 'One meaningful test at a time per page, run to statistical significance. We would rather give you one true answer than five noisy ones.',
      },
      {
        q: 'What do you need from us to start?',
        a: 'Access to your ad account or a list of active campaigns, your CRM or inbox, and 45 minutes with whoever knows the customer best.',
      },
    ],
  },
  {
    slug: 'website-maintenance',
    name: 'Website Maintenance & Care',
    category: 'website',
    tagline: 'Updates, uptime, backups and security — handled in IST.',
    summary:
      'The site is never "done". Our care plans keep it fast, patched, backed up and monitored, with a real person in India who replies during Indian business hours instead of a ticket that waits twelve hours for another timezone to wake up.',
    deliverables: [
      'Core, plugin and dependency patching with staging verification',
      'Daily offsite backups with quarterly restore drills',
      'Uptime monitoring with alerting to WhatsApp and email',
      'Performance regression checks after every release',
      'Security scanning, WAF tuning and malware clean-up',
      'Monthly report: uptime, speed, traffic, fixes shipped',
    ],
    outcomes: [
      { label: '99.9%', detail: 'Uptime across care-plan sites in 2025' },
      { label: '< 1h', detail: 'Median first response, 9:30–19:00 IST' },
      { label: '0', detail: 'Unpatched critical vulnerabilities at quarter end' },
    ],
    priceFrom: '₹9,500',
    priceNote: 'per month. Scales with traffic, stack complexity and SLA.',
    timeline: 'Starts within 48 hours',
    indiaNote:
      'Support runs 9:30–19:00 IST with on-call cover on Saturdays and during festival sales periods.',
    bestFor: 'Any business whose site is revenue-critical and nobody internally owns.',
    faqs: [
      {
        q: 'Do you work on sites you did not build?',
        a: 'Yes, after a short technical audit. If the codebase is too fragile to maintain safely we will tell you honestly and quote a rebuild instead.',
      },
      {
        q: 'What is not included?',
        a: 'New feature development and design work are quoted separately. Care covers keeping what exists fast, safe and current.',
      },
      {
        q: 'Can you cover weekends?',
        a: 'Standard cover is Monday to Saturday. Extended and 24×7 cover is available for ecommerce and booking-led businesses.',
      },
    ],
  },

  /* ───────────────────────────── AI ───────────────────────────── */
  {
    slug: 'ai-voice-receptionist',
    name: 'AI Voice Receptionist',
    category: 'ai',
    tagline: 'Every missed call answered, qualified and booked — in Hindi or English.',
    summary:
      'Indian businesses lose an enormous number of enquiries to calls that ring out during peak hours, lunch, or after 8pm. Our voice agent picks up in under two seconds, speaks Hindi, English or natural Hinglish, qualifies the caller, books the slot and sends a WhatsApp confirmation — then hands warm leads to your team.',
    deliverables: [
      'Voice agent tuned to your scripts, services and pricing',
      'Hindi, English and Hinglish language handling',
      'Calendar and CRM integration for real-time booking',
      'WhatsApp/SMS confirmation and reminder sequences',
      'Call recording, transcripts and sentiment tagging',
      'Full human handoff with context transfer',
      'Weekly missed-call and conversion reporting',
    ],
    outcomes: [
      { label: '< 2s', detail: 'Time to first response, 24 hours a day' },
      { label: '−71%', detail: 'Missed-call rate for a 14-location clinic chain' },
      { label: '+38%', detail: 'Booked appointments in the first 90 days' },
    ],
    priceFrom: '₹22,000',
    priceNote: 'per month, including telephony minutes up to 1,500 calls.',
    timeline: '2–3 weeks to launch',
    indiaNote:
      'Trained on Indian accents, code-switching and the way people actually ask for things on the phone here.',
    bestFor: 'Clinics, salons, real estate, education, home services and automotive.',
    faqs: [
      {
        q: 'Will callers know it is AI?',
        a: 'We disclose it at the start of the call. It is the right thing to do, and in our experience callers care far more about getting an answer than about who answers.',
      },
      {
        q: 'Can it transfer to a human?',
        a: 'Yes, any time — on request, on a keyword, or when the agent hits a question it is not confident about. The human sees the transcript before they pick up.',
      },
      {
        q: 'How is caller data handled?',
        a: 'Data is stored on Indian-region infrastructure where possible and handled in line with the DPDP Act 2023. Recordings are retained for 90 days by default.',
      },
    ],
  },
  {
    slug: 'whatsapp-business-automation',
    name: 'WhatsApp Business Automation',
    category: 'ai',
    tagline: 'The channel Indian customers actually reply on.',
    summary:
      'WhatsApp is where Indian business conversations happen. We build official WhatsApp Business API flows for abandoned carts, order updates, appointment reminders, payment links, lead qualification and festive campaigns — with real opt-in management and template approval handled for you.',
    deliverables: [
      'WhatsApp Business API onboarding and template approvals',
      'Broadcast, drip and event-triggered journeys',
      'Payment link, catalogue and order status flows',
      'Opt-in/opt-out management and consent logging',
      'Shared team inbox with assignment and SLAs',
      'Integration with Shopify, Razorpay, Zoho or your CRM',
    ],
    outcomes: [
      { label: '68%', detail: 'Typical WhatsApp open rate vs ~20% for email' },
      { label: '3.4×', detail: 'Reply rate versus SMS on the same list' },
      { label: '−22%', detail: 'No-show rate with WhatsApp reminders' },
    ],
    priceFrom: '₹16,000',
    priceNote: 'per month. Meta conversation charges billed at cost, with no markup.',
    timeline: '2–4 weeks',
    indiaNote:
      'Templates are written for Indian festive and regional calendars — Diwali, Onam, Durga Puja, Eid, regional new years.',
    bestFor: 'D2C, healthcare, education, real estate and any high-consideration purchase.',
    faqs: [
      {
        q: 'Do we need the WhatsApp Business API?',
        a: 'For anything beyond manual one-to-one messaging, yes. We handle the Meta verification, blue tick application and template submissions end to end.',
      },
      {
        q: 'What does Meta charge?',
        a: 'Meta bills per conversation in INR. We pass that through at cost and show it as a separate line on your invoice so you always know what is ours and what is theirs.',
      },
      {
        q: 'Can we keep using the free WhatsApp Business app?',
        a: 'You can, but the API and the app cannot share one number. Most teams move the number to the API and use the shared team inbox we set up.',
      },
    ],
  },
  {
    slug: 'ai-chat-assistant',
    name: 'AI Website Chat Assistant',
    category: 'ai',
    tagline: 'Answers questions at 11pm and books the meeting anyway.',
    summary:
      'A chat assistant trained on your own content — services, pricing, locations, FAQs — that answers accurately, admits when it does not know, and routes to WhatsApp or a human the moment the conversation is worth money.',
    deliverables: [
      'Retrieval setup on your site content, PDFs and pricing',
      'Guardrails, escalation rules and refusal behaviour',
      'Lead capture with qualification questions',
      'WhatsApp and CRM handoff',
      'Widget design matched to your brand',
      'Monthly accuracy review against real transcripts',
    ],
    outcomes: [
      { label: '24×7', detail: 'Coverage without night-shift headcount' },
      { label: '+43%', detail: 'Enquiry capture from out-of-hours traffic' },
      { label: '< 3s', detail: 'Median first response time' },
    ],
    priceFrom: '₹14,000',
    priceNote: 'per month, up to 5,000 conversations. Setup from ₹35,000.',
    timeline: '1–2 weeks',
    indiaNote:
      'Handles Hinglish queries and romanised Hindi — "mujhe 2bhk ka rate batao" should work as well as the English version.',
    bestFor: 'Businesses with a lot of repeat pre-sales questions.',
    faqs: [
      {
        q: 'Will it make things up?',
        a: 'It is grounded on your content and instructed to escalate rather than guess. Every answer is logged so we can review accuracy monthly and fix gaps in the source material.',
      },
      {
        q: 'Does it replace our support team?',
        a: 'No. It handles the repetitive 60% and hands the valuable 40% to your people with full context.',
      },
      {
        q: 'Can it take bookings?',
        a: 'Yes, if your calendar has an API. Google Calendar, Cal.com, Zoho and most Indian scheduling tools integrate cleanly.',
      },
    ],
  },
  {
    slug: 'workflow-automation',
    name: 'Workflow Automation & Copilots',
    category: 'ai',
    tagline: 'Kill the copy-paste work your team does 400 times a month.',
    summary:
      'Most Indian SMEs run on Excel, WhatsApp and memory. We map where the hours actually go, then build the automation and internal tools that remove the manual steps — document processing, approvals, data syncs and the small internal apps nobody wants to build.',
    deliverables: [
      'Process discovery and time-and-motion mapping',
      'Automation build on n8n, Make or custom Node services',
      'Document extraction (invoices, KYC, purchase orders) into structured data',
      'Internal copilots and small web apps for your team',
      'Error handling, retry logic, alerting and runbooks',
      'Documentation and handover training',
    ],
    outcomes: [
      { label: '18h', detail: 'Median weekly hours returned to a 10-person ops team' },
      { label: '−92%', detail: 'Manual data-entry errors after go-live' },
      { label: '4 mo', detail: 'Typical payback period on automation build cost' },
    ],
    priceFrom: '₹45,000',
    priceNote: 'per project. Retainers from ₹25,000/month for ongoing automation.',
    timeline: '3–6 weeks',
    indiaNote:
      'We work with the tools Indian teams already use — Tally, Zoho, WhatsApp, Google Sheets — not just enterprise SaaS nobody has licences for.',
    bestFor: 'Operations-heavy teams: logistics, healthcare, manufacturing, finance and services.',
    faqs: [
      {
        q: 'We use Tally and Excel. Is that a problem?',
        a: 'Not at all. A large part of our automation work starts exactly there. Where there is no API, we build a reliable bridge rather than forcing a migration.',
      },
      {
        q: 'Who maintains it when something breaks?',
        a: 'We do, under a support retainer, or your team does with the runbooks we hand over. Either way you get alerting before your users notice a problem.',
      },
      {
        q: 'Do we need to change how we work?',
        a: 'Ideally a little, and we will tell you honestly where the bottleneck is cultural rather than technical. Automating a broken process just makes it fail faster.',
      },
    ],
  },

  /* ─────────────────────────── GROWTH ─────────────────────────── */
  {
    slug: 'seo-india',
    name: 'SEO for Indian Search',
    category: 'growth',
    tagline: 'Rank where your buyer is searching, in the words they use.',
    summary:
      'Indian search behaviour is mobile-first, voice-influenced and increasingly AI-summarised. We build technical foundations, content systems and authority that hold up across Google, and increasingly inside AI Overviews and LLM answers.',
    deliverables: [
      'Technical SEO audit: crawl, indexation, Core Web Vitals, schema',
      'Keyword research mapped to Indian intent and Hinglish queries',
      'Content system: briefs, production calendar, internal linking',
      'On-page optimisation and structured data (LocalBusiness, Product, FAQ)',
      'Digital PR and ethical link acquisition',
      'Monthly reporting tied to enquiries, not just rankings',
    ],
    outcomes: [
      { label: '3.4×', detail: 'Organic enquiry growth for a Surat textile exporter' },
      { label: '6 mo', detail: 'Typical time to meaningful compounding movement' },
      { label: '100%', detail: 'Reporting tied to leads, not vanity rankings' },
    ],
    priceFrom: '₹35,000',
    priceNote: 'per month. Minimum engagement 6 months.',
    timeline: 'Ongoing, first movements in 8–12 weeks',
    indiaNote:
      'We optimise for "near me", voice queries and regional-language variants — three things generic international SEO playbooks ignore.',
    bestFor: 'Businesses that want durable demand instead of renting it from ads.',
    faqs: [
      {
        q: 'How long before we see results?',
        a: 'Technical fixes move the needle within weeks. Compounding content and authority growth takes four to six months. We report leading indicators monthly so you are never guessing.',
      },
      {
        q: 'Do you guarantee rankings?',
        a: 'No, and be careful of anyone who does. We guarantee the work, the reporting and the technical quality — the algorithm is not ours to promise.',
      },
      {
        q: 'Do you cover regional languages?',
        a: 'Yes. We can build and optimise Hindi content, with Marathi, Tamil, Telugu, Bengali and Gujarati available through our language partners.',
      },
    ],
  },
  {
    slug: 'local-seo-google-business',
    name: 'Local SEO & Google Business Profile',
    category: 'growth',
    tagline: 'Own the map pack for every city you actually serve.',
    summary:
      'For clinics, stores, gyms, restaurants and service businesses, the Google map pack beats the blue links. We optimise and defend every location across India — including the review and profile-spam problems that are unusually aggressive in Indian local search.',
    deliverables: [
      'Google Business Profile setup, verification and optimisation at scale',
      'NAP consistency and citation building across Indian directories',
      'City and locality landing pages with LocalBusiness schema',
      'Review generation programme and response playbooks',
      'Profile spam monitoring and competitor infringement reports',
      'Monthly local ranking and call-tracking report',
    ],
    outcomes: [
      { label: '2.8×', detail: 'Increase in map-pack impressions within 90 days' },
      { label: '+61%', detail: 'Direction requests and "call now" taps' },
      { label: '4.7★', detail: 'Average client rating after 6 months of review work' },
    ],
    priceFrom: '₹18,000',
    priceNote: 'per month for up to 3 locations. Volume pricing beyond that.',
    timeline: 'Ongoing, first results in 4–8 weeks',
    indiaNote:
      'We handle the specific realities of Indian local search: duplicate listings, competitor keyword-stuffed names, and fake review attacks.',
    bestFor: 'Multi-location retail, healthcare, hospitality, fitness and home services.',
    faqs: [
      {
        q: 'Our competitors are stuffing keywords into their business names. Can you stop it?',
        a: 'We file structured redressal requests with evidence and follow up. It is not instant, but we win a meaningful share of these cases.',
      },
      {
        q: 'We have 40 locations. Can you handle that?',
        a: 'Yes. We work through bulk location management with templated but locally differentiated content per city.',
      },
      {
        q: 'Do you generate reviews for us?',
        a: 'We build the request flow and train your team. We never buy or fabricate reviews — it violates Google policy and puts your listing at risk.',
      },
    ],
  },
  {
    slug: 'google-ads-management',
    name: 'Google Ads Management',
    category: 'growth',
    tagline: 'Stop paying for junk leads. Start measuring cost per sale.',
    summary:
      'Most Indian ad accounts leak money through broad match, no negative keyword discipline, and no connection between the click and what happened in the CRM. We rebuild the account around qualified outcomes and report on revenue, not clicks.',
    deliverables: [
      'Account restructure around intent clusters and city targeting',
      'Negative keyword and search-term governance',
      'Conversion tracking including offline conversion import',
      'Landing page alignment for every ad group',
      'Bid strategy and budget pacing, reviewed weekly',
      'Call tracking and quality scoring of every lead',
    ],
    outcomes: [
      { label: '−44%', detail: 'Cost per qualified lead for a Jaipur developer' },
      { label: '2.3×', detail: 'Return on ad spend after account rebuild' },
      { label: '92%', detail: 'Invalid-click and junk-lead filtering rate' },
    ],
    priceFrom: '₹25,000',
    priceNote: 'per month, or 12% of ad spend above ₹5 lakh/month.',
    timeline: 'Setup in 2 weeks, optimisation ongoing',
    indiaNote:
      'Budgets planned around the Indian festive calendar — Diwali, wedding season, sale events and regional peaks.',
    bestFor: 'Businesses spending ₹50,000+/month on search and performance ads.',
    faqs: [
      {
        q: 'What ad spend does this make sense for?',
        a: 'Below roughly ₹50,000 a month the management fee is a large fraction of the media. We will tell you honestly if you are better off spending on SEO or a single well-built landing page first.',
      },
      {
        q: 'Do we keep the account?',
        a: 'Always. It is your account, your history and your data. We work inside it with manager access.',
      },
      {
        q: 'How do you stop junk leads?',
        a: 'Tighter match types, aggressive negative lists, form friction calibrated to intent, call tracking, and offline conversion import so the algorithm optimises toward real sales.',
      },
    ],
  },
  {
    slug: 'meta-instagram-ads',
    name: 'Meta & Instagram Ads',
    category: 'growth',
    tagline: 'Creative that stops the scroll, measured like performance media.',
    summary:
      'Meta in India is a creative game with a performance discipline. We run a structured creative testing system, build audience and catalogue setups that survive signal loss, and connect every rupee back to revenue.',
    deliverables: [
      'Creative testing system: concepts, hooks, formats, refresh cadence',
      'Catalogue and Advantage+ setup for ecommerce',
      'Audience architecture and exclusions',
      'Server-side Conversions API implementation',
      'Scale-and-guardrail budget rules',
      'Weekly creative performance readout',
    ],
    outcomes: [
      { label: '3.1×', detail: 'Average blended ROAS on ecommerce accounts' },
      { label: '−37%', detail: 'Cost per acquisition after creative systemisation' },
      { label: '24', detail: 'New creative variants tested per month' },
    ],
    priceFrom: '₹22,000',
    priceNote: 'per month, or 12% of ad spend above ₹5 lakh/month.',
    timeline: 'Setup in 2 weeks, optimisation ongoing',
    indiaNote:
      'Creative calendars built around Diwali, Holi, Eid, Onam, Pujo, Independence Day and regional new years.',
    bestFor: 'D2C brands, education, real estate, events and local services.',
    faqs: [
      {
        q: 'Can you produce the creative?',
        a: 'Yes, in-house. Static, video, UGC-style and Reels formats. We can also work with your existing designers and simply run the testing system.',
      },
      {
        q: 'How do you handle iOS signal loss?',
        a: 'Server-side Conversions API, plus modelled conversions and a blended MER read on top of platform attribution.',
      },
      {
        q: 'What if our product is not visual?',
        a: 'Then we lean on outcome-led creative and lead forms with hard qualification, and we will tell you if Meta is the wrong channel for you.',
      },
    ],
  },
  {
    slug: 'content-marketing',
    name: 'Content Marketing & Copywriting',
    category: 'growth',
    tagline: 'Content that answers the question and closes the sale.',
    summary:
      'We write content that ranks, reads well and moves a buyer forward — service pages, comparisons, guides, case studies and thought leadership, produced on a calendar your team can sustain.',
    deliverables: [
      'Content strategy mapped to the buying journey',
      'SEO briefs with search intent and internal linking',
      'Long-form articles, service pages and comparison pieces',
      'Case study interviews and writing',
      'Website and campaign copy',
      'Editorial calendar and monthly publishing cadence',
    ],
    outcomes: [
      { label: '8–12', detail: 'Pieces published per month on a standard retainer' },
      { label: '+145%', detail: 'Organic traffic growth over 12 months' },
      { label: '100%', detail: 'Human-written, human-edited, no AI slop' },
    ],
    priceFrom: '₹30,000',
    priceNote: 'per month for 8 pieces. Ad-hoc copywriting from ₹4,000 per piece.',
    timeline: 'First pieces in 2–3 weeks',
    indiaNote:
      'Writers who understand Indian business context, and regional-language adaptation when your audience needs it.',
    bestFor: 'B2B, healthcare, finance, education and considered consumer purchases.',
    faqs: [
      {
        q: 'Do you use AI to write?',
        a: 'For research and outlining, yes. Every published piece is written and edited by a human who understands your market. You will never receive unedited generated copy.',
      },
      {
        q: 'Who approves content?',
        a: 'You do, before publication. We send outlines first so you are not reviewing finished drafts that went the wrong way.',
      },
      {
        q: 'Can you interview our customers for case studies?',
        a: 'Yes, and it produces the best-performing content we ship. We handle outreach, interviewing, writing and approval.',
      },
    ],
  },
  {
    slug: 'email-sms-lifecycle',
    name: 'Email, SMS & CRM Lifecycle',
    category: 'growth',
    tagline: 'Follow up properly, and the same leads convert twice as often.',
    summary:
      'Most Indian businesses collect leads and then lose them. We build the nurture layer — email, SMS, WhatsApp and CRM sequences with deliverability, DLT registration for Indian SMS and proper segmentation.',
    deliverables: [
      'Lifecycle map: welcome, nurture, abandon, win-back, referral',
      'Email template system and deliverability setup (SPF, DKIM, DMARC)',
      'Indian SMS with DLT template registration handled',
      'CRM pipeline stages, scoring and task automation',
      'Segmentation by source, city, value and behaviour',
      'Monthly lifecycle performance report',
    ],
    outcomes: [
      { label: '+52%', detail: 'Lead-to-customer conversion with nurture in place' },
      { label: '38%', detail: 'Average email open rate on Indian B2B lists' },
      { label: '−31%', detail: 'Sales-cycle length with stage automation' },
    ],
    priceFrom: '₹20,000',
    priceNote: 'per month. Platform licences billed at cost.',
    timeline: '3–4 weeks to first sequences live',
    indiaNote:
      'We handle TRAI DLT registration for SMS so your transactional messages actually get delivered.',
    bestFor: 'Businesses with a sales team, a CRM nobody uses, or a stale database.',
    faqs: [
      {
        q: 'Which CRM do you recommend?',
        a: 'Zoho for most Indian businesses on value for money. HubSpot or GoHighLevel where the sales process is more complex. We work with whatever you already have.',
      },
      {
        q: 'Do you handle DLT registration?',
        a: 'Yes. It is a genuinely painful process and we include it, because SMS does not deliver in India without it.',
      },
      {
        q: 'Our database is old. Worth reviving?',
        a: 'Often yes, with a careful re-permission campaign. We will test a segment first before committing your whole list.',
      },
    ],
  },

  /* ──────────────────────────── DATA ──────────────────────────── */
  {
    slug: 'analytics-ga4-setup',
    name: 'Analytics & GA4 Setup',
    category: 'data',
    tagline: 'Trustworthy numbers, so decisions stop being guesses.',
    summary:
      'If you cannot attribute revenue to a channel, every marketing conversation is an argument. We implement GA4, server-side tagging and consent-aware tracking so you can see cost per acquisition by channel, city and campaign — and actually believe it.',
    deliverables: [
      'Measurement plan: events, conversions, parameters',
      'GA4 property, data streams and enhanced measurement',
      'Google Tag Manager container with versioned governance',
      'Server-side tagging where consent rules require it',
      'Consent Mode v2 and cookie banner integration',
      'Cross-domain, call and offline conversion tracking',
      'Looker Studio dashboards and documentation',
    ],
    outcomes: [
      { label: '100%', detail: 'Conversion paths attributed to a source' },
      { label: '−48%', detail: 'Reporting discrepancies after cleanup' },
      { label: '1', detail: 'Source of truth, agreed by marketing and sales' },
    ],
    priceFrom: '₹38,000',
    priceNote: 'one-time implementation. Add ₹12,000/month for managed QA.',
    timeline: '2–3 weeks',
    indiaNote:
      'Consent handling designed with DPDP Act 2023 obligations in mind, not just EU GDPR templates.',
    bestFor: 'Any business spending on marketing without reliable attribution.',
    faqs: [
      {
        q: 'We already have GA4. Why pay?',
        a: 'Default GA4 tells you sessions, not outcomes. Most accounts we audit have broken conversion definitions and double-counted revenue. We fix the definitions before we touch the dashboards.',
      },
      {
        q: 'What about data privacy?',
        a: 'Consent Mode v2, IP handling configured for India, and no PII sent to analytics properties. We document everything so you can answer a customer or regulator confidently.',
      },
      {
        q: 'Can you track phone calls?',
        a: 'Yes, with dynamic number insertion and call outcome tagging, so you can separate genuine enquiries from spam calls.',
      },
    ],
  },
  {
    slug: 'dashboards-reporting',
    name: 'Dashboards & Monthly Reporting',
    category: 'data',
    tagline: 'One page that answers "is this working?" in ten seconds.',
    summary:
      'We consolidate ads, search, CRM, calls and revenue into dashboards built for founders and CXOs — not analysts. Every month you get the numbers and a written interpretation of what changed and what we are doing next.',
    deliverables: [
      'Metrics definition workshop and single source of truth',
      'Looker Studio or Metabase dashboards per audience',
      'Automated data pipelines with freshness monitoring',
      'Board-ready monthly report pack',
      'Written commentary: what changed, why, what next',
      'Alerting on metric thresholds',
    ],
    outcomes: [
      { label: '1 page', detail: 'The whole business, readable in ten seconds' },
      { label: '4 hrs', detail: 'Monthly reporting time returned to your team' },
      { label: '100%', detail: 'Reports delivered by the 3rd working day' },
    ],
    priceFrom: '₹24,000',
    priceNote: 'per month including the monthly written report.',
    timeline: '3–4 weeks to first dashboard',
    indiaNote:
      'Reports structured for Indian board and investor formats, including GST-exclusive revenue views.',
    bestFor: 'Founders, CMOs and CXOs drowning in spreadsheets.',
    faqs: [
      {
        q: 'Which tools do you use?',
        a: 'Looker Studio for most teams, Metabase or Power BI when you need a warehouse. We recommend the cheapest thing that answers the question.',
      },
      {
        q: 'Do we need a data warehouse?',
        a: 'Only when sources get numerous or history matters. We will not sell you BigQuery to build three charts.',
      },
      {
        q: 'Can finance use it too?',
        a: 'Yes. We reconcile marketing numbers against GST returns and bank settlements so finance and marketing stop disagreeing.',
      },
    ],
  },
  {
    slug: 'conversion-rate-optimisation',
    name: 'CRO & A/B Testing',
    category: 'data',
    tagline: 'Get more from the traffic you are already paying for.',
    summary:
      'Most Indian websites convert at a fraction of what they should. We find where people hesitate — through analytics, session replay, heatmaps and user testing — then fix it with prioritised, properly-run experiments.',
    deliverables: [
      'Funnel analysis and drop-off quantification',
      'Session replay and heatmap review',
      'Qualitative research: user tests and surveys',
      'Prioritised hypothesis backlog (ICE scoring)',
      'A/B and multivariate test build and execution',
      'Statistical readout with clear ship/kill decisions',
    ],
    outcomes: [
      { label: '+47%', detail: 'Median conversion lift over 6 months' },
      { label: '₹0', detail: 'Extra ad spend required for that lift' },
      { label: '95%', detail: 'Tests run to statistical significance' },
    ],
    priceFrom: '₹28,000',
    priceNote: 'per month. Requires 5,000+ monthly visits to test reliably.',
    timeline: 'Ongoing, first tests live in 3 weeks',
    indiaNote:
      'Trust signals tested specifically for Indian buyers: GST number, address, real photos, COD availability, return policy.',
    bestFor: 'Sites with real traffic and an underperforming conversion rate.',
    faqs: [
      {
        q: 'Our traffic is low. Can we still test?',
        a: 'Below about 5,000 visits a month, tests take too long to be conclusive. We would start with usability fixes and qualitative research instead.',
      },
      {
        q: 'How long is a test?',
        a: 'Two to four weeks typically. We never call a result early just to show a win.',
      },
      {
        q: 'Do you need developer access?',
        a: 'Yes, to deploy variants. If you do not have a developer, we can ship tests as part of a maintenance retainer.',
      },
    ],
  },

  /* ──────────────────────── ACCESSIBILITY ─────────────────────── */
  {
    slug: 'accessibility-audit',
    name: 'Accessibility Audit (WCAG 2.2)',
    category: 'accessibility',
    tagline: 'Know exactly where you stand, and what it would take to fix.',
    summary:
      'Indian law — the Rights of Persons with Disabilities Act 2016 and the RPwD Rules — requires digital accessibility. We audit against WCAG 2.2 Level AA with automated tooling plus genuine manual testing including screen readers, and give you a prioritised, costed remediation plan.',
    deliverables: [
      'Automated scan across templates (axe-core, Lighthouse)',
      'Manual audit: keyboard-only, NVDA/VoiceOver, zoom to 200%, contrast',
      'Mobile accessibility testing on Android TalkBack',
      'Issue register with severity, WCAG criterion and effort estimate',
      'Prioritised remediation roadmap',
      'Accessibility conformance report and VPAT-ready documentation',
      'Walkthrough call with your design and engineering teams',
    ],
    outcomes: [
      { label: '200+', detail: 'Checks per audit across automated and manual criteria' },
      { label: 'AA', detail: 'Target conformance level (WCAG 2.2)' },
      { label: '1', detail: 'Costed roadmap you can hand to any developer' },
    ],
    priceFrom: '₹42,000',
    priceNote: 'one-time for a site up to 25 templates.',
    timeline: '2–3 weeks',
    indiaNote:
      'Mapped to RPwD Act obligations and the GIGW 3.0 guidelines used by Indian government and PSU digital properties.',
    bestFor: 'Enterprises, PSUs, education, healthcare, BFSI and any tender-bound organisation.',
    faqs: [
      {
        q: 'Is this a legal requirement in India?',
        a: 'Yes for many organisations. The RPwD Act 2016 and the 2017 Rules set accessibility obligations, and GIGW 3.0 applies to government and PSU digital properties. We map findings to those obligations.',
      },
      {
        q: 'Is an automated scan enough?',
        a: 'No. Automated tools catch roughly a third of real issues. Screen reader and keyboard testing is where the serious barriers surface.',
      },
      {
        q: 'Can you audit an app, not just a website?',
        a: 'Yes, native iOS and Android against WCAG and platform guidance.',
      },
    ],
  },
  {
    slug: 'accessibility-remediation',
    name: 'Accessibility Remediation',
    category: 'accessibility',
    tagline: 'Actually fix it, and keep it fixed.',
    summary:
      'Audit reports do not make a site accessible — engineering does. We implement the fixes: semantic markup, keyboard navigation, focus management, contrast, accessible forms, ARIA done properly, and CI checks so regressions do not creep back in.',
    deliverables: [
      'Remediation implementation against the audit issue register',
      'Semantic HTML refactor and correct ARIA usage',
      'Keyboard navigation and visible focus states',
      'Accessible forms with error handling and live regions',
      'Colour contrast correction to 4.5:1 minimum',
      'Automated accessibility tests in CI (axe-core / Pa11y)',
      'Re-test and updated conformance report',
    ],
    outcomes: [
      { label: 'AA', detail: 'Target conformance achieved and verified' },
      { label: '0', detail: 'Known critical barriers at handover' },
      { label: 'CI', detail: 'Automated checks prevent regressions' },
    ],
    priceFrom: '₹60,000',
    priceNote: 'project pricing based on issue register size.',
    timeline: '4–8 weeks',
    indiaNote:
      'Inclusive design is also commercial: better accessibility measurably lifts conversion on mobile for every user, not only users with disabilities.',
    bestFor: 'Organisations with an audit in hand and no capacity to execute it.',
    faqs: [
      {
        q: 'Will remediation change how the site looks?',
        a: 'Rarely. Most fixes are structural — markup, focus order, labels, contrast. Where a visual change is needed we show you before shipping.',
      },
      {
        q: 'Can you work with our developers?',
        a: 'Yes. We can implement directly, or produce tickets and pair with your team. Many clients prefer the hybrid: we do the hard first pass, they maintain it.',
      },
      {
        q: 'How do you stop regressions?',
        a: 'Automated axe-core checks in your CI pipeline, plus a lightweight manual checklist in your definition of done.',
      },
    ],
  },

  /* ─────────────────────────── SUPPORT ────────────────────────── */
  {
    slug: 'dedicated-support-desk',
    name: 'Dedicated Support Desk',
    category: 'support',
    tagline: 'A named human who knows your business, on call in IST.',
    summary:
      'Not a shared inbox in another timezone. You get a named support engineer, documented response SLAs, and escalation paths that work during Indian business hours — including Saturday cover and extended cover for peak trading periods.',
    deliverables: [
      'Named support engineer and backup',
      'Response SLAs: 1 hour (critical), 4 hours (high), 1 day (normal)',
      'Shared Slack/WhatsApp channel plus ticketing',
      'Monthly support review and trend analysis',
      'Runbooks and knowledge base maintained',
      'Escalation path to senior engineering',
    ],
    outcomes: [
      { label: '47 min', detail: 'Median first response, 9:30–19:00 IST' },
      { label: '94%', detail: 'Tickets resolved within SLA' },
      { label: '4.8★', detail: 'Average client satisfaction on support' },
    ],
    priceFrom: '₹18,000',
    priceNote: 'per month for 10 hours. Additional hours at ₹1,600/hour.',
    timeline: 'Starts in 48 hours',
    indiaNote:
      'Support hours are Indian business hours, with on-call cover during Diwali, festive sales and end-of-quarter peaks.',
    bestFor: 'Businesses without in-house technical capacity.',
    faqs: [
      {
        q: 'What counts as critical?',
        a: 'Site down, checkout broken, security incident, or data loss risk. Everything else is high or normal, and we agree the definition with you at kickoff.',
      },
      {
        q: 'Can you cover our festive sale weekend?',
        a: 'Yes, with advance notice. We staff up for Diwali, Big Billion Day and similar peaks for ecommerce clients.',
      },
      {
        q: 'Do unused hours roll over?',
        a: 'Up to 50% of the month, capped at one month. We would rather you used them.',
      },
    ],
  },
  {
    slug: 'content-update-service',
    name: 'Content & Update Service',
    category: 'support',
    tagline: 'Send the change on WhatsApp. It ships today.',
    summary:
      'New team member, a new offer, a Festive banner, a price change — most website updates are small and urgent. Send them over and we ship them the same working day, with quality checks so nothing breaks.',
    deliverables: [
      'Unlimited small content edits within monthly hours',
      'Image optimisation and alt text',
      'New pages from existing templates',
      'Banner and campaign asset placement',
      'SEO checks on every updated page',
      'Staging preview before publish',
    ],
    outcomes: [
      { label: '< 8h', detail: 'Median turnaround on standard edits' },
      { label: '100%', detail: 'Edits checked on staging before publishing' },
      { label: '0', detail: 'Broken links introduced by content edits' },
    ],
    priceFrom: '₹12,000',
    priceNote: 'per month for 8 hours. Additional hours at ₹1,400/hour.',
    timeline: 'Starts in 48 hours',
    indiaNote:
      'Requests accepted in Hindi or English, over WhatsApp, email or a shared sheet — whichever your team will actually use.',
    bestFor: 'Marketing teams blocked by a slow internal dev queue.',
    faqs: [
      {
        q: 'What is a "small edit"?',
        a: 'Text, images, links, metadata and new pages from existing templates. New functionality or design work is quoted separately.',
      },
      {
        q: 'How do we send requests?',
        a: 'Whatever your team already uses — WhatsApp, email, a shared sheet or your ticketing tool. We adapt to you, not the reverse.',
      },
      {
        q: 'Can you work in Hindi?',
        a: 'Yes. We handle Hindi content updates and can coordinate regional-language updates through our language partners.',
      },
    ],
  },
  {
    slug: 'api-integration-maintenance',
    name: 'API & Integration Maintenance',
    category: 'support',
    tagline: 'Your integrations keep working when the APIs change.',
    summary:
      'Payment gateways revise APIs. Meta changes rate limits. Shipping partners deprecate endpoints. We monitor every integration, patch breaking changes before they hurt, and own the alerting so you find out from us and not from a customer.',
    deliverables: [
      'Integration inventory with dependency mapping',
      'Uptime and error-rate monitoring per integration',
      'API version deprecation tracking',
      'Breaking-change patching with staging verification',
      'Retry, backoff and dead-letter handling',
      'Monthly integration health report',
    ],
    outcomes: [
      { label: '0', detail: 'Unplanned integration outages in 2025 client base' },
      { label: '30d', detail: 'Average warning before a deprecation hits' },
      { label: '99.95%', detail: 'Integration uptime under management' },
    ],
    priceFrom: '₹26,000',
    priceNote: 'per month for up to 6 integrations.',
    timeline: 'Onboarding in 1 week',
    indiaNote:
      'Active monitoring of Indian providers — Razorpay, PayU, Cashfree, Delhivery, Shiprocket, Zoho and the Meta WhatsApp API.',
    bestFor: 'Businesses whose revenue depends on systems talking to each other.',
    faqs: [
      {
        q: 'Which providers do you cover?',
        a: 'Any HTTP-based integration. We actively track Razorpay, PayU, Cashfree, Shiprocket, Delhivery, Zoho, Tally, Meta WhatsApp and the major Indian and global SaaS APIs.',
      },
      {
        q: 'Do you build new integrations too?',
        a: 'Yes, quoted per project. Maintenance keeps them alive; build scope adds them.',
      },
      {
        q: 'What happens when something breaks at 2am?',
        a: 'Alerting escalates to on-call. Critical-incident response is included; extended 24×7 cover is available as an add-on.',
      },
    ],
  },
];

/* ─────────────────────────── helpers ─────────────────────────── */

export function getCategory(slug: ServiceCategorySlug): ServiceCategory {
  const found = categories.find((c) => c.slug === slug);
  if (!found) throw new Error(`Unknown service category: ${slug}`);
  return found;
}

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function servicesByCategory(slug: ServiceCategorySlug): Service[] {
  return services.filter((s) => s.category === slug);
}

export const serviceCount = services.length;
