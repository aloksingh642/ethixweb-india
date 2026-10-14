import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Instrument_Serif } from 'next/font/google';

import './globals.css';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { site, siteUrl } from '@/lib/content/site';
import { jsonLd } from '@/lib/jsonld';

/**
 * Both faces are self-hosted by next/font at build time, so there is no
 * render-blocking request to Google and no layout shift on swap.
 * Plus Jakarta Sans carries the UI; Instrument Serif italic is the accent face
 * used for one or two words per section — never for body copy.
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
  preload: true,
});

const instrument = Instrument_Serif({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument',
  weight: '400',
  // Italic only. Every use of this face on the site is italic, and shipping the
  // upright face as well pulled an extra ~15 kB woff2 that no page rendered.
  style: ['italic'],
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: 'Ethixweb India — We run the tech. You run the business.',
    template: '%s · Ethixweb India',
  },
  description: site.description,
  applicationName: 'Ethixweb India',
  keywords: [
    'digital operations India',
    'website design Jaipur',
    'AI receptionist India',
    'WhatsApp business automation India',
    'SEO India',
    'Google Ads agency India',
    'Next.js development India',
  ],
  authors: [{ name: site.legalName, url: siteUrl() }],
  alternates: { canonical: '/' },
  icons: {
    icon: [
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl(),
    siteName: 'Ethixweb India',
    title: 'Ethixweb India — We run the tech. You run the business.',
    description: site.description,
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Ethixweb India — digital operations for Indian businesses',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ethixweb India — We run the tech. You run the business.',
    description: site.description,
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export const viewport: Viewport = {
  themeColor: '#D13A40',
  width: 'device-width',
  initialScale: 1,
  // Never block zoom — it is an accessibility requirement, not a preference.
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${jakarta.variable} ${instrument.variable}`}>
      <head>
        {/*
          Inlined and synchronous: adds the class that arms the reveal
          animations. Because the CSS hides [data-reveal] only when this class
          is present, content stays visible with JS disabled — and Lighthouse
          never screenshots permanently-invisible text.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js-reveal')`,
          }}
        />
      </head>
      <body className="min-h-dvh antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(organizationSchema) }}
        />
      </body>
    </html>
  );
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Ethixweb India',
  legalName: site.legalName,
  url: siteUrl(),
  description: site.description,
  telephone: '+91-98290-12345',
  email: 'hello@ethixweb.in',
  priceRange: '₹₹',
  currenciesAccepted: 'INR',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '3rd Floor, City Mall Annexe, Bhagwan Das Road, C-Scheme',
    addressLocality: 'Jaipur',
    addressRegion: 'Rajasthan',
    postalCode: '302001',
    addressCountry: 'IN',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 26.9124, longitude: 75.7873 },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:30',
      closes: '19:00',
    },
  ],
  areaServed: { '@type': 'Country', name: 'India' },
};
