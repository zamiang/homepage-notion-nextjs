import Link from 'next/link';
import React from 'react';

const Footer = () => (
  <footer className="w-[100vw] ml-[calc(-50vw+50%)] bg-background/85 pt-8 pb-12 px-4 relative z-10">
    <div className="max-w-[680px] mx-auto">
      {/* Subtle divider */}
      <div className="w-16 h-px bg-border/50 mx-auto mb-8" />
      <div className="text-center text-muted-foreground text-sm mb-2">
        <Link
          className="!border-none hover:text-accent transition-colors duration-150"
          href="https://www.instagram.com/zamiang"
        >
          Instagram
        </Link>
        {' · '}
        <Link
          className="!border-none hover:text-accent transition-colors duration-150"
          href="/rss.xml"
        >
          RSS
        </Link>
        {' · '}
        <Link
          className="!border-none hover:text-accent transition-colors duration-150"
          href="https://github.com/zamiang/homepage-notion-nextjs"
        >
          Source
        </Link>
      </div>
      <p className="text-center text-muted-foreground/70 text-xs m-0 bg-transparent">
        {'© '}
        <Link className="!border-none hover:text-accent transition-colors duration-150" href="/">
          Brennan Moore
        </Link>{' '}
        {new Date().getFullYear()}
      </p>
    </div>
  </footer>
);

export default Footer;
