import type { Metadata } from 'next';

import { Faq } from '@/components/site/Faq';
import { FeaturedWork } from '@/components/site/FeaturedWork';
import { Hero } from '@/components/site/Hero';
import { IndiaCoverage } from '@/components/site/IndiaCoverage';
import { Marquee } from '@/components/site/Marquee';
import { ProblemOutcome } from '@/components/site/ProblemOutcome';
import { ProcessTimeline } from '@/components/site/ProcessTimeline';
import { ServiceCategories } from '@/components/site/ServiceCategories';
import { StatsBand } from '@/components/site/StatsBand';
import { Testimonials } from '@/components/site/Testimonials';
import { WhyUs } from '@/components/site/WhyUs';
import { faqs } from '@/lib/content/home';
import { site } from '@/lib/content/site';
import { categories } from '@/lib/content/services';
import { jsonLd } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: 'Ethixweb India — We run the tech. You run the business.',
  description: site.description,
  alternates: { canonical: '/' },
};

/** FAQPage rich result, generated from the same source as the rendered copy. */
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a },
  })),
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee items={categories.map((c) => c.name)} />
      <ProblemOutcome />
      <ServiceCategories />
      <StatsBand />
      <ProcessTimeline />
      <FeaturedWork />
      <IndiaCoverage />
      <WhyUs />
      <Testimonials />
      <Faq />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema) }}
      />
    </>
  );
}
