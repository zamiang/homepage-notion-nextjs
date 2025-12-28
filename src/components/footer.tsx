import Link from 'next/link';
import React from 'react';

const Footer = () => (
  <footer className="border-t p-4 border-border">
    <div className="text-center text-muted-foreground text-sm">
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
    <p className="text-center text-muted-foreground text-sm">
      {'Copyright © '}
      <Link className="!border-none hover:text-accent transition-colors duration-150" href="/">
        Brennan Moore
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </p>
  </footer>
);

export default Footer;
