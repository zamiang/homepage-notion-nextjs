import Link from 'next/link';
import React from 'react';

const Footer = () => (
  <footer
    className="w-[100vw] ml-[calc(-50vw+50%)] bg-background/85 pt-8 pb-12 px-4 relative z-10"
    role="contentinfo"
  >
    <div className="max-w-[680px] mx-auto">
      {/* Subtle divider */}
      <div className="w-16 h-px bg-border/50 mx-auto mb-8" aria-hidden="true" />
      {/* Navigation links with 44px minimum touch targets */}
      <nav aria-label="Footer navigation" className="text-center mb-4">
        <ul className="flex justify-center items-center gap-1 list-none m-0 p-0">
          <li>
            <Link
              className="!border-none hover:text-accent transition-colors duration-150 text-muted-foreground text-sm px-3 py-2 inline-block min-h-[44px] flex items-center"
              href="https://www.instagram.com/zamiang"
            >
              Instagram
            </Link>
          </li>
          <li aria-hidden="true" className="text-muted-foreground/50">
            ·
          </li>
          <li>
            <Link
              className="!border-none hover:text-accent transition-colors duration-150 text-muted-foreground text-sm px-3 py-2 inline-block min-h-[44px] flex items-center"
              href="/rss.xml"
            >
              RSS
            </Link>
          </li>
          <li aria-hidden="true" className="text-muted-foreground/50">
            ·
          </li>
          <li>
            <Link
              className="!border-none hover:text-accent transition-colors duration-150 text-muted-foreground text-sm px-3 py-2 inline-block min-h-[44px] flex items-center"
              href="https://github.com/zamiang/homepage-notion-nextjs"
            >
              Source
            </Link>
          </li>
        </ul>
      </nav>
      <p className="text-center text-muted-foreground/70 text-xs m-0 bg-transparent">
        {'© '}
        <Link
          className="!border-none hover:text-accent transition-colors duration-150 py-1"
          href="/"
        >
          Brennan Moore
        </Link>{' '}
        {new Date().getFullYear()}
      </p>
    </div>
  </footer>
);

export default Footer;
