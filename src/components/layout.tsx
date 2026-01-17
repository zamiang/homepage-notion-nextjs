import Link from 'next/link';
import { ReactNode } from 'react';

import Footer from './footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-screen">
      <header className="relative z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link
                href="/"
                className="flex items-center text-md text-foreground border-none text-sm"
              >
                Brennan Moore
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/#work"
                className="text-foreground text-sm border-none hover:text-accent transition-colors duration-150"
              >
                Work
              </Link>
              <Link
                href="/#writing"
                className="text-foreground text-sm border-none hover:text-accent transition-colors duration-150"
              >
                Writing
              </Link>
              <Link
                href="/#photography"
                className="text-foreground text-sm border-none hover:text-accent transition-colors duration-150"
              >
                Photography
              </Link>
              <Link
                href="/resume.pdf"
                target="_blank"
                rel="noopener"
                className="text-foreground text-sm border-none hover:text-accent transition-colors duration-150"
              >
                Resume
              </Link>
            </div>
          </div>
        </nav>
      </header>
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-0">
        {children}
      </main>
      <Footer />
    </div>
  );
}
