/** @type {import('next').NextConfig} */
/**
 * Deliberately no Content-Security-Policy here.
 *
 * The App Router bootstraps itself with inline scripts, so a policy that keeps
 * the site working needs 'unsafe-inline' in script-src — which is precisely
 * what Lighthouse's `csp-xss` audit fails on. Shipping a CSP that only *looks*
 * strict would be worse than shipping none: this site loads zero third-party
 * scripts, zero external fonts and zero trackers, so the XSS surface a CSP
 * exists to contain is already near-zero by construction.
 *
 * If a CSP is required later, do it properly with a per-request nonce injected
 * in middleware — not with 'unsafe-inline'.
 */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // Only meaningful once deployed on HTTPS; harmless on localhost.
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains',
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Console noise in production is a PageSpeed / polish smell. Keep errors.
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  // The dev server runs behind a proxied preview host; without this, Next
  // logs a cross-origin warning on every HMR asset request.
  allowedDevOrigins: ['localhost:3000', '*.e2b.app', '*.vercel.app'],
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      {
        source: '/api/:path*',
        headers: [
          ...securityHeaders,
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
        ],
      },
    ];
  },
};

export default nextConfig;
