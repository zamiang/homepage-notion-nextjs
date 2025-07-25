const { createSecureHeaders } = require('next-secure-headers');

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  poweredByHeader: false,

  async redirects() {
    return [
      {
        source: '/post/why-i-don-t-do-live-coding-interviews',
        destination: '/', // todo
        permanent: true,
      },
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
                imgSrc: [
                  "'self'",
                  'data:',
                  'https://www.googletagmanager.com',
                  'https://vitals.vercel-insights.com',
                ],
                fontSrc: ["'self'"],
                scriptSrc: [
                  "'self'",
                  "'unsafe-eval'",
                  "'unsafe-inline'",
                  'https://www.googletagmanager.com',
                  'https://vitals.vercel-insights.com',
                ],
                frameSrc: ['https://vitals.vercel-insights.com'],
                connectSrc: [
                  "'self'",
                  'https://www.googleapis.com',
                  'https://www.google-analytics.com',
                  'https://vitals.vercel-insights.com',
                ],
              },
            },
            forceHTTPSRedirect: true,
            referrerPolicy: 'same-origin',
            xssProtection: 'block-rendering',
          }),
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=86400, stale-if-error=259200',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
