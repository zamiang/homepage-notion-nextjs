import Layout from '@/components/layout';
import { ThemeProvider } from '@/components/theme-provider';
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
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${serifFont.className} ${sansFont.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Layout>{children}</Layout>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
