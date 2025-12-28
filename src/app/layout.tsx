import FloatingParticles from '@/components/floating-particles';
import Layout from '@/components/layout';
import { config } from '@/lib/config';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { EB_Garamond, Lato } from 'next/font/google';

import './globals.css';

const serifFont = EB_Garamond({ subsets: ['latin'] });
const sansFont = Lato({ subsets: ['latin'], weight: '400' });

const siteUrl = config.site.url;
const title = config.site.title;
const description = config.site.description;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s | Brennan Moore`,
  },
  description: description,
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: 'Brennan Moore',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `/about.jpg`,
        alt: 'Brennan Moore portrait',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [
      {
        url: `/about.jpg`,
        alt: 'Brennan Moore portrait',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: `/site.webmanifest`,
  alternates: {
    types: {
      'application/rss+xml': `${siteUrl}/rss.xml`,
      'application/feed+json': `${siteUrl}/feed.json`,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#f9f6f0',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${serifFont.className} ${sansFont.className} bg-background`}>
        <FloatingParticles />
        <Layout>{children}</Layout>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
