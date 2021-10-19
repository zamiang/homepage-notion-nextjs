const withPlugins = require('next-compose-plugins');
const { createSecureHeaders } = require('next-secure-headers');
const withFonts = require('next-fonts');

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['s3.us-west-2.amazonaws.com', 'cdn-images-1.medium.com'],
  },
  webpack5: true,

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

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: createSecureHeaders({
          contentSecurityPolicy: {
            directives: {
              defaultSrc: "'self'",
              styleSrc: ["'self'", "'unsafe-inline'"],
              imgSrc: [
                "'self'",
                'data:',
                'https://www.googletagmanager.com',
                'https://s3.us-west-2.amazonaws.com',
                'https://cdn-images-1.medium.com',
              ],
              fontSrc: ["'self'"],
              scriptSrc: [
                "'self'",
                "'unsafe-eval'",
                "'unsafe-inline'",
                'https://www.googletagmanager.com',
                'https://platform.twitter.com',
              ],
              frameSrc: ['https://platform.twitter.com/'],
              connectSrc: [
                "'self'",
                'https://www.googleapis.com',
                'https://www.google-analytics.com',
              ],
            },
          },
          forceHTTPSRedirect: true,
          referrerPolicy: 'same-origin',
          xssProtection: 'block-rendering',
        }),
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
