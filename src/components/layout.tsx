import Link from 'next/link';
import { ReactNode } from 'react';
import { ModeToggle } from '@/components/mode-toggle';
import Footer from './footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link
                href="/"
                className="flex items-center text-md text-foreground border-none text-sm"
                style={{ borderStyle: 'none' }}
              >
                Brennan Moore
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex invisible md:visible">
                <Link
                  href="/#writing"
                  className="flex items-center text-md text-foreground text-sm "
                >
                  Writing
                </Link>
              </div>
              <div className="flex invisible md:visible">
                <Link
                  href="/#photography"
                  className="flex items-center text-md text-foreground text-sm"
                >
                  Photography
                </Link>
              </div>
              <ModeToggle />
            </div>
          </div>
        </nav>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">{children}</main>
      <Footer />
    </div>
  );
}
