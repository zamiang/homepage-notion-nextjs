import Header from '@/components/islands/Header';
import { fireEvent, render, screen } from '@testing-library/react';

describe('Header', () => {
  describe('basic rendering', () => {
    it('should render header element', () => {
      render(<Header />);
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('should render main navigation', () => {
      render(<Header />);
      const nav = screen.getByRole('navigation', { name: 'Main navigation' });
      expect(nav).toBeInTheDocument();
    });

    it('should render site name link', () => {
      render(<Header />);
      const homeLink = screen.getByRole('link', { name: 'Brennan Moore' });
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute('href', '/');
    });
  });

  describe('desktop navigation', () => {
    it('should render all navigation links', () => {
      render(<Header />);
      expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('href', '/#work');
      expect(screen.getByRole('link', { name: 'Writing' })).toHaveAttribute('href', '/#writing');
      expect(screen.getByRole('link', { name: 'Photography' })).toHaveAttribute(
        'href',
        '/#photography',
      );
    });

    it('should render external link with proper attributes', () => {
      render(<Header />);
      const resumeLinks = screen.getAllByRole('link', { name: /Resume/ });
      // There are two resume links (desktop and potentially mobile), check the first
      const resumeLink = resumeLinks[0];
      expect(resumeLink).toHaveAttribute('href', '/resume.pdf');
      expect(resumeLink).toHaveAttribute('target', '_blank');
      expect(resumeLink).toHaveAttribute('rel', 'noopener');
    });
  });

  describe('mobile menu button', () => {
    it('should render mobile menu button', () => {
      render(<Header />);
      const button = screen.getByRole('button', { name: 'Open menu' });
      expect(button).toBeInTheDocument();
    });

    it('should have correct initial aria attributes', () => {
      render(<Header />);
      const button = screen.getByRole('button', { name: 'Open menu' });
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(button).toHaveAttribute('aria-controls', 'mobile-menu');
    });

    it('should have touch-manipulation class for better tap responsiveness', () => {
      render(<Header />);
      const button = screen.getByRole('button', { name: 'Open menu' });
      expect(button).toHaveClass('touch-manipulation');
    });

    it('should have cursor-pointer for iOS Safari compatibility', () => {
      render(<Header />);
      const button = screen.getByRole('button', { name: 'Open menu' });
      expect(button).toHaveClass('cursor-pointer');
    });

    it('should meet minimum touch target size (44x44px)', () => {
      render(<Header />);
      const button = screen.getByRole('button', { name: 'Open menu' });
      // w-11 = 44px, h-11 = 44px in Tailwind
      expect(button).toHaveClass('w-11');
      expect(button).toHaveClass('h-11');
    });
  });

  describe('mobile menu toggle', () => {
    it('should open menu when button is clicked', () => {
      render(<Header />);
      const button = screen.getByRole('button', { name: 'Open menu' });

      fireEvent.click(button);

      // Button should now show close state
      expect(screen.getByRole('button', { name: 'Close menu' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
    });

    it('should show mobile navigation when menu is open', () => {
      render(<Header />);
      const button = screen.getByRole('button', { name: 'Open menu' });

      fireEvent.click(button);

      const mobileNav = screen.getByRole('navigation', { name: 'Mobile navigation' });
      expect(mobileNav).toBeInTheDocument();
      expect(mobileNav).toHaveAttribute('id', 'mobile-menu');
    });

    it('should close menu when button is clicked again', () => {
      render(<Header />);
      const openButton = screen.getByRole('button', { name: 'Open menu' });

      // Open menu
      fireEvent.click(openButton);
      expect(screen.getByRole('button', { name: 'Close menu' })).toBeInTheDocument();

      // Close menu
      const closeButton = screen.getByRole('button', { name: 'Close menu' });
      fireEvent.click(closeButton);

      expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
      expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).not.toBeInTheDocument();
    });

    it('should close menu when navigation link is clicked', () => {
      render(<Header />);
      const button = screen.getByRole('button', { name: 'Open menu' });

      // Open menu
      fireEvent.click(button);

      // Click a link in the mobile menu
      const mobileNav = screen.getByRole('navigation', { name: 'Mobile navigation' });
      const workLink = mobileNav.querySelector('a[href="/#work"]');
      expect(workLink).toBeInTheDocument();

      fireEvent.click(workLink!);

      // Menu should close
      expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
      expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper aria-label on main navigation', () => {
      render(<Header />);
      const nav = screen.getByRole('navigation', { name: 'Main navigation' });
      expect(nav).toHaveAttribute('aria-label', 'Main navigation');
    });

    it('should have proper aria-label on mobile navigation when open', () => {
      render(<Header />);
      fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

      const mobileNav = screen.getByRole('navigation', { name: 'Mobile navigation' });
      expect(mobileNav).toHaveAttribute('aria-label', 'Mobile navigation');
    });

    it('should have sr-only text in menu button', () => {
      const { container } = render(<Header />);
      const srOnlyText = container.querySelector('.sr-only');
      expect(srOnlyText).toBeInTheDocument();
      expect(srOnlyText).toHaveTextContent('Open menu');
    });

    it('should update sr-only text when menu is open', () => {
      const { container } = render(<Header />);
      fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

      const srOnlyText = container.querySelector('.sr-only');
      expect(srOnlyText).toHaveTextContent('Close menu');
    });

    it('should have aria-hidden on decorative icons', () => {
      render(<Header />);
      const button = screen.getByRole('button', { name: 'Open menu' });
      const icon = button.querySelector('svg');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('mobile menu content', () => {
    it('should render all navigation links in mobile menu', () => {
      render(<Header />);
      fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

      const mobileNav = screen.getByRole('navigation', { name: 'Mobile navigation' });
      expect(mobileNav.querySelector('a[href="/#work"]')).toBeInTheDocument();
      expect(mobileNav.querySelector('a[href="/#writing"]')).toBeInTheDocument();
      expect(mobileNav.querySelector('a[href="/#photography"]')).toBeInTheDocument();
      expect(mobileNav.querySelector('a[href="/resume.pdf"]')).toBeInTheDocument();
    });

    it('should have external link attributes on resume in mobile menu', () => {
      render(<Header />);
      fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

      const mobileNav = screen.getByRole('navigation', { name: 'Mobile navigation' });
      const resumeLink = mobileNav.querySelector('a[href="/resume.pdf"]');
      expect(resumeLink).toHaveAttribute('target', '_blank');
      expect(resumeLink).toHaveAttribute('rel', 'noopener');
    });
  });
});
