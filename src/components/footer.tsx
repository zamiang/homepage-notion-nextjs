import Link from 'next/link';
import React from 'react';

const Footer = () => (
  <footer className="border-t p-4 border-border">
    <div className="text-center text-muted-foreground">
      <Link href="https://www.instagram.com/zamiang">Instagram</Link>
      {' · '}
      <Link href="/rss.xml">RSS</Link>
      {' · '}
      <Link href="https://github.com/zamiang/homepage-notion-nextjs">Source</Link>
    </div>
    <p className="text-center text-muted-foreground">
      {'Copyright © '}
      <Link href="/" style={{ margin: 0 }}>
        Brennan Moore
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </p>
  </footer>
);

export default Footer;
