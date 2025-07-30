import { NextConfig } from 'next';

const { createSecureHeaders } = require('next-secure-headers');

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    minimumCacheTTL: 2678400, // Cache for 30 days
  },
  reactStrictMode: true,
  poweredByHeader: false,

  async redirects() {
    return [
      {
        source: '/post/debugging-a-live-saturn-v',
        destination: '/writing/debugging-a-live-saturn-v',
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          ...createSecureHeaders({
            contentSecurityPolicy: {
              directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", 'data:', 'https://vitals.vercel-insights.com'],
                fontSrc: ["'self'"],
                scriptSrc: [
                  "'self'",
                  "'unsafe-eval'",
                  "'unsafe-inline'",
                  'https://va.vercel-scripts.com',
                  'https://vitals.vercel-insights.com',
                ],
                frameSrc: ['https://vitals.vercel-insights.com'],
                connectSrc: ["'self'", 'https://vitals.vercel-insights.com'],
              },
            },
            forceHTTPSRedirect: true,
            referrerPolicy: 'same-origin',
            xssProtection: 'block-rendering',
          }),
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
