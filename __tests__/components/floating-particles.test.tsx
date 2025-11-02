import FloatingParticles from '@/components/floating-particles';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FloatingParticles', () => {
  beforeEach(() => {
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });

    // Mock scrollY
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    });

    // Mock requestAnimationFrame - don't call callback to avoid infinite loop
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1);

    // Mock cancelAnimationFrame
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  it('should render without crashing', () => {
    const { container } = render(<FloatingParticles />);
    const particleContainer = container.querySelector('[aria-hidden="true"]');
    expect(particleContainer).toBeInTheDocument();
  });

  it('should have correct container classes', () => {
    const { container } = render(<FloatingParticles />);
    const particleContainer = container.querySelector('[aria-hidden="true"]');
    expect(particleContainer).toHaveClass('pointer-events-none');
    expect(particleContainer).toHaveClass('fixed');
    expect(particleContainer).toHaveClass('inset-0');
    expect(particleContainer).toHaveClass('z-0');
    expect(particleContainer).toHaveClass('overflow-hidden');
  });

  it('should have aria-hidden attribute', () => {
    const { container } = render(<FloatingParticles />);
    const particleContainer = container.querySelector('[aria-hidden="true"]');
    expect(particleContainer).toHaveAttribute('aria-hidden', 'true');
  });

  it('should render SVG element', () => {
    const { container } = render(<FloatingParticles />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('absolute');
    expect(svg).toHaveClass('inset-0');
    expect(svg).toHaveClass('size-full');
  });

  it('should initialize particles on mount', () => {
    const { container } = render(<FloatingParticles />);

    // Wait for particles to be initialized (after useEffect)
    // Check for circle elements
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBeGreaterThan(0);
  });

  it('should create shared blur filter for all particles', () => {
    const { container } = render(<FloatingParticles />);

    const filters = container.querySelectorAll('filter');

    // Should have single shared blur filter for performance
    expect(filters.length).toBe(1);
    expect(filters[0].id).toBe('particle-blur');
  });

  it('should apply blur filters to particles', () => {
    const { container } = render(<FloatingParticles />);

    const circles = container.querySelectorAll('circle');
    circles.forEach((circle) => {
      const style = circle.getAttribute('style');
      expect(style).toContain('url(#particle-blur)');
    });
  });

  it('should set opacity for each particle', () => {
    const { container } = render(<FloatingParticles />);

    const circles = container.querySelectorAll('circle');
    circles.forEach((circle) => {
      const style = circle.getAttribute('style');
      expect(style).toContain('opacity:');
    });
  });

  it('should position particles with transform', () => {
    const { container } = render(<FloatingParticles />);

    const circles = container.querySelectorAll('circle');
    circles.forEach((circle) => {
      const transform = circle.getAttribute('transform');
      expect(transform).toContain('translate');
    });
  });

  it('should apply theme-aware fill classes', () => {
    const { container } = render(<FloatingParticles />);

    const circles = container.querySelectorAll('circle');
    circles.forEach((circle) => {
      expect(circle).toHaveClass('fill-foreground');
      expect(circle).toHaveClass('dark:fill-accent');
    });
  });

  it('should have particle-blur filter ID', () => {
    const { container } = render(<FloatingParticles />);

    const filter = container.querySelector('filter');

    // Should have the shared filter ID
    expect(filter).toHaveAttribute('id', 'particle-blur');
  });

  it('should use feGaussianBlur in filters', () => {
    const { container } = render(<FloatingParticles />);

    const filters = container.querySelectorAll('filter');
    filters.forEach((filter) => {
      const blur = filter.querySelector('feGaussianBlur');
      expect(blur).toBeInTheDocument();
      expect(blur).toHaveAttribute('stdDeviation');
    });
  });

  it('should set varying particle sizes', () => {
    const { container } = render(<FloatingParticles />);

    const circles = container.querySelectorAll('circle');
    const radii = Array.from(circles).map((circle) => parseFloat(circle.getAttribute('r') || '0'));

    // Should have varying sizes (at least some different values)
    const uniqueRadii = new Set(radii);
    expect(uniqueRadii.size).toBeGreaterThan(1);

    // All radii should be within expected range (2-6px)
    radii.forEach((r) => {
      expect(r).toBeGreaterThanOrEqual(2);
      expect(r).toBeLessThanOrEqual(6);
    });
  });

  it('should cancel animation frame on unmount', () => {
    const cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame');
    const { unmount } = render(<FloatingParticles />);

    unmount();

    expect(cancelAnimationFrameSpy).toHaveBeenCalled();
  });

  it('should start animation loop on mount', () => {
    const requestAnimationFrameSpy = vi.spyOn(window, 'requestAnimationFrame');
    render(<FloatingParticles />);

    expect(requestAnimationFrameSpy).toHaveBeenCalled();
  });

  it('should have will-change optimization on particles', () => {
    const { container } = render(<FloatingParticles />);

    const circles = container.querySelectorAll('circle');
    circles.forEach((circle) => {
      const style = circle.getAttribute('style');
      // Check for will-change with or without spaces
      expect(style).toMatch(/will-change:\s*transform/);
    });
  });
});
