const withPlugins = require('next-compose-plugins');
const { createSecureHeaders } = require('next-secure-headers');
const withFonts = require('next-fonts');

const nextConfig = {
  webpack5: true,
  eslint: {
    ignoreDuringBuilds: true,
  },

  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
      {
        source: '/rss.xml',
        destination: '/api/rss',
      },
    ];
  },

  images: {
    domains: ['s3.us-west-2.amazonaws.com'],
    minimumCacheTTL: 31536000,
    maxAge: 31536000,
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          ...createSecureHeaders({
            contentSecurityPolicy: {
              directives: {
                defaultSrc: "'self'",
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: [
                  "'self'",
                  'data:',
                  'https://zamiang.imgix.net',
                  'https://www.googletagmanager.com',
                  'http://www.googletagmanager.com',
                  'https://s3.us-west-2.amazonaws.com',
                  'https://cdn-images-1.medium.com',
                  'https://vitals.vercel-insights.com',
                ],
                fontSrc: ["'self'"],
                scriptSrc: [
                  "'self'",
                  "'unsafe-eval'",
                  "'unsafe-inline'",
                  'https://www.googletagmanager.com',
                  'http://www.googletagmanager.com',
                  'https://platform.twitter.com',
                  'https://vitals.vercel-insights.com',
                ],
                frameSrc: ['https://platform.twitter.com/', 'https://vitals.vercel-insights.com'],
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

module.exports = withPlugins(
  [
    [
      withFonts,
      {
        reactStrictMode: true,
        poweredByHeader: false,
      },
    ],
  ],
  nextConfig,
);
