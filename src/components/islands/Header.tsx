/**
 * Header Component (React Island)
 * Uses React state for mobile menu toggle
 *
 * iOS Safari Compatibility Notes:
 * - Uses onTouchEnd in addition to onClick for reliable touch handling
 * - Empty onTouchStart handler "wakes up" iOS Safari's event system
 * - cursor-pointer and touch-manipulation CSS for proper touch behavior
 * - client:load hydration directive for immediate interactivity
 */
import { useCallback, useState } from 'react';

interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

const navLinks: NavLink[] = [
  { href: '/#work', label: 'Work' },
  { href: '/#writing', label: 'Writing' },
  { href: '/#photography', label: 'Photography' },
  { href: '/resume.pdf', label: 'Resume', external: true },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Use callback to ensure stable reference and prevent iOS Safari issues
  const toggleMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  return (
    <header className="relative z-50">
      <nav aria-label="Main navigation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="text-foreground border-none text-sm">
              Brennan Moore
            </a>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-foreground text-sm border-none hover:text-accent transition-colors duration-150 inline-flex items-center gap-1"
                {...(link.external ? { target: '_blank', rel: 'noopener' } : {})}
              >
                {link.label}
                {link.external && (
                  <svg
                    className="w-3 h-3 opacity-50"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                    />
                  </svg>
                )}
              </a>
            ))}
          </div>

          {/* Mobile menu button
              iOS Safari requires multiple event handlers for reliable touch:
              - onTouchStart (empty) "wakes up" the event system
              - onTouchEnd handles the actual interaction
              - onClick provides fallback for non-touch and accessibility
              - role="button" explicitly declares clickable for iOS
              - Inline styles ensure properties apply even before CSS loads */}
          <button
            type="button"
            role="button"
            tabIndex={0}
            className="md:hidden flex items-center justify-center w-11 h-11 -mr-2.5 text-foreground hover:text-accent transition-colors duration-150 border-none bg-transparent touch-manipulation cursor-pointer select-none"
            style={{
              WebkitTapHighlightColor: 'transparent',
              WebkitAppearance: 'none',
              WebkitUserSelect: 'none',
            }}
            onClick={toggleMenu}
            onTouchStart={() => {
              /* Empty handler required for iOS Safari - "wakes up" touch events */
            }}
            onTouchEnd={(e) => {
              // Prevent ghost click on iOS Safari
              e.preventDefault();
              toggleMenu();
            }}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
            {mobileMenuOpen ? (
              // X icon
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu - no role="menu" needed, semantic nav is sufficient */}
        {mobileMenuOpen && (
          <nav
            id="mobile-menu"
            aria-label="Mobile navigation"
            className="md:hidden py-4 border-t border-border/50"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-foreground text-base py-2 border-none hover:text-accent transition-colors duration-150 inline-flex items-center gap-1"
                  onClick={() => setMobileMenuOpen(false)}
                  {...(link.external ? { target: '_blank', rel: 'noopener' } : {})}
                >
                  {link.label}
                  {link.external && (
                    <svg
                      className="w-3.5 h-3.5 opacity-50"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                      />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </nav>
        )}
      </nav>
    </header>
  );
}
