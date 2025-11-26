'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

// Animation constants
const PARTICLE_COUNT = 40;
const SCROLL_VELOCITY_DECAY = 0.92; // 8% decay per frame
const PARTICLE_VELOCITY_DECAY = 0.88; // 12% decay per frame
const MIN_INERTIA_FACTOR = 0.3;
const MAX_INERTIA_FACTOR = 0.7;
const MIN_SCROLL_FACTOR = 0.02;
const MAX_SCROLL_FACTOR = 0.07;
const INERTIA_MULTIPLIER = 0.1;

// Particle size and movement ranges
const MIN_PARTICLE_SIZE = 2;
const MAX_PARTICLE_SIZE = 6;
const MIN_OPACITY = 0.12;
const MAX_OPACITY = 0.42;
const MIN_SPEED_X = 0.002;
const MAX_SPEED_X = 0.006;
const MIN_SPEED_Y = 0.0015;
const MAX_SPEED_Y = 0.005;
const MIN_RADIUS_X = 20;
const MAX_RADIUS_X = 60;
const MIN_RADIUS_Y = 15;
const MAX_RADIUS_Y = 45;

interface ParticleColor {
  light: string;
  dark: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  opacity: number;
  color: ParticleColor;
  // Independent animation parameters
  angleX: number; // Current angle in X oscillation
  angleY: number; // Current angle in Y oscillation
  speedX: number; // How fast X oscillation changes
  speedY: number; // How fast Y oscillation changes
  radiusX: number; // How far X oscillates
  radiusY: number; // How far Y oscillates
  // Scroll inertia
  velocityY: number; // Current velocity from scrolling
}

// Color variations within the theme for light and dark modes
const LIGHT_MODE_COLORS = [
  '#3a4555', // Deep slate (darker variation)
  '#4b5673', // Slate blue (foreground)
  '#5a6b8a', // Medium blue (primary)
  '#6b7ba8', // Brighter blue
  '#6b7588', // Blue-gray (muted-foreground)
  '#7a8090', // Light gray-blue
  '#526382', // Deep blue-gray
  '#5d7399', // Sky blue
  '#445166', // Charcoal blue
  '#8490a8', // Pale blue
];

const DARK_MODE_COLORS = [
  '#ff8f00', // Deep orange
  '#ffa726', // Orange (accent)
  '#ffb34d', // Light orange
  '#ff9d0f', // Amber orange
  '#ffcc80', // Pale orange
  '#c5c9d1', // Cool white (foreground)
  '#cad0db', // Bright white (primary)
  '#a0a8b5', // Medium gray
  '#8a8e96', // Warm gray (muted-foreground)
  '#d5d9e0', // Very light gray
];

// Get a random color pair from both palettes
function getRandomColor(): ParticleColor {
  const lightIndex = Math.floor(Math.random() * LIGHT_MODE_COLORS.length);
  const darkIndex = Math.floor(Math.random() * DARK_MODE_COLORS.length);

  return {
    light: LIGHT_MODE_COLORS[lightIndex],
    dark: DARK_MODE_COLORS[darkIndex],
  };
}

// Create a single particle with given dimensions
function createParticle(
  id: number,
  viewportWidth: number,
  viewportHeight: number,
  cols: number,
  rows: number,
): Particle {
  const col = id % cols;
  const row = Math.floor(id / cols);
  const cellWidth = viewportWidth / cols;
  const cellHeight = viewportHeight / rows;

  // Random position within cell for even distribution
  const x = col * cellWidth + Math.random() * cellWidth;
  const y = row * cellHeight + Math.random() * cellHeight;

  // Size determines movement characteristics
  const sizeRange = MAX_PARTICLE_SIZE - MIN_PARTICLE_SIZE;
  const size = MIN_PARTICLE_SIZE + Math.random() * sizeRange;

  // Smaller particles are more transparent, larger ones more opaque
  const sizeNormalized = size / MAX_PARTICLE_SIZE;
  const opacityRange = MAX_OPACITY - MIN_OPACITY;
  const opacity = MIN_OPACITY + sizeNormalized * opacityRange;

  return {
    id,
    x,
    y,
    baseX: x,
    baseY: y,
    size,
    opacity,
    color: getRandomColor(),
    angleX: Math.random() * Math.PI * 2,
    angleY: Math.random() * Math.PI * 2,
    speedX: MIN_SPEED_X + Math.random() * (MAX_SPEED_X - MIN_SPEED_X),
    speedY: MIN_SPEED_Y + Math.random() * (MAX_SPEED_Y - MIN_SPEED_Y),
    radiusX: MIN_RADIUS_X + Math.random() * (MAX_RADIUS_X - MIN_RADIUS_X),
    radiusY: MIN_RADIUS_Y + Math.random() * (MAX_RADIUS_Y - MIN_RADIUS_Y),
    velocityY: 0,
  };
}

// Initialize particles function
function initializeParticles(
  viewportWidth: number = typeof window !== 'undefined' ? window.innerWidth : 0,
  viewportHeight: number = typeof window !== 'undefined' ? window.innerHeight : 0,
): Particle[] {
  // Check if window is available (SSR safety)
  if (viewportWidth === 0 || viewportHeight === 0) {
    return [];
  }

  const cols = Math.ceil(Math.sqrt(PARTICLE_COUNT * (viewportWidth / viewportHeight)));
  const rows = Math.ceil(PARTICLE_COUNT / cols);

  const particles: Particle[] = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createParticle(i, viewportWidth, viewportHeight, cols, rows));
  }

  return particles;
}

export default function FloatingParticles() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const circlesRef = useRef<SVGCircleElement[]>([]); // Cached circle refs
  const pathname = usePathname(); // Track route changes
  // Use lazy initializer to avoid setState in effect
  const [particles, setParticles] = useState<Particle[]>(initializeParticles);
  const particlesRef = useRef<Particle[]>(particles);
  const animationFrameRef = useRef<number>(0);
  const scrollYRef = useRef(0);
  const scrollVelocityRef = useRef(0);
  const isVisibleRef = useRef(true); // Page visibility state
  const prefersReducedMotionRef = useRef(false); // Reduced motion preference

  // Keep particlesRef in sync with state
  useEffect(() => {
    particlesRef.current = particles;
  }, [particles]);

  // Reset scroll position and velocity when route changes
  useEffect(() => {
    scrollYRef.current = 0;
    scrollVelocityRef.current = 0;

    // Reset particle velocities to prevent jolting
    particlesRef.current.forEach((particle) => {
      particle.velocityY = 0;
    });
  }, [pathname]);

  // Redistribute particles on resize
  const handleResize = useCallback(() => {
    const newParticles = initializeParticles(window.innerWidth, window.innerHeight);
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    // Check for reduced motion preference
    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotionRef.current = motionMediaQuery.matches;

    const handleMotionPreferenceChange = (event: MediaQueryListEvent) => {
      prefersReducedMotionRef.current = event.matches;
    };
    motionMediaQuery.addEventListener('change', handleMotionPreferenceChange);

    // Page visibility handler - pause animation when tab is hidden
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Resize handler with debounce
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 250);
    };
    window.addEventListener('resize', debouncedResize);

    // Theme change handler - update particle colors based on dark mode
    const updateParticleColors = () => {
      const circles = circlesRef.current;
      if (circles.length === 0) return;

      const isDark = document.documentElement.classList.contains('dark');

      circles.forEach((circle) => {
        if (!circle) return;
        const lightColor = circle.getAttribute('data-light-color');
        const darkColor = circle.getAttribute('data-dark-color');
        if (lightColor && darkColor) {
          circle.setAttribute('fill', isDark ? darkColor : lightColor);
        }
      });
    };

    // Update colors on mount (after circles are rendered)
    requestAnimationFrame(updateParticleColors);

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          updateParticleColors();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Scroll handler - calculate scroll velocity for inertia
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollVelocityRef.current = currentScrollY - scrollYRef.current;
      scrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Animation loop - each particle moves completely independently
    const animate = () => {
      // Skip animation if tab is hidden or user prefers reduced motion
      if (!isVisibleRef.current || prefersReducedMotionRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const circles = circlesRef.current;
      if (circles.length === 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // Apply inertia decay to scroll velocity (smooth deceleration)
      scrollVelocityRef.current *= SCROLL_VELOCITY_DECAY;

      const viewportHeight = window.innerHeight;

      particlesRef.current.forEach((particle, index) => {
        // Each particle independently updates its angle
        particle.angleX += particle.speedX;
        particle.angleY += particle.speedY;

        // Calculate position based on particle's own angle and radius
        const oscillationX = Math.sin(particle.angleX) * particle.radiusX;
        const oscillationY = Math.cos(particle.angleY) * particle.radiusY;

        // Add scroll velocity to particle's own velocity with inertia
        // Different particles respond differently based on size (larger = more responsive)
        const sizeNormalized = particle.size / MAX_PARTICLE_SIZE;
        const inertiaRange = MAX_INERTIA_FACTOR - MIN_INERTIA_FACTOR;
        const inertiaFactor = MIN_INERTIA_FACTOR + sizeNormalized * inertiaRange;
        particle.velocityY += scrollVelocityRef.current * inertiaFactor * INERTIA_MULTIPLIER;
        particle.velocityY *= PARTICLE_VELOCITY_DECAY;

        // Parallax effect - larger particles (closer) move more than smaller ones
        const scrollRange = MAX_SCROLL_FACTOR - MIN_SCROLL_FACTOR;
        const scrollFactor = MIN_SCROLL_FACTOR + sizeNormalized * scrollRange;
        const scrollOffset = -scrollYRef.current * scrollFactor;

        // Wrap particles vertically to keep them visible
        let finalY = particle.baseY + oscillationY + scrollOffset + particle.velocityY;
        finalY = ((finalY % viewportHeight) + viewportHeight) % viewportHeight;

        particle.x = particle.baseX + oscillationX;
        particle.y = finalY;

        // Update SVG element using cached ref
        const circle = circles[index];
        if (circle) {
          circle.setAttribute('transform', `translate(${particle.x}, ${particle.y})`);
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      motionMediaQuery.removeEventListener('change', handleMotionPreferenceChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimeout);
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleResize]);

  return (
    <div
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <svg className="absolute inset-0 size-full">
        <defs>
          {/* Optimized blur filter - single shared filter for all particles */}
          <filter
            id="particle-blur"
            x="-75%"
            y="-75%"
            width="250%"
            height="250%"
            colorInterpolationFilters="sRGB"
          >
            {/* First blur to soften edges */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1" />
            {/* Morphology to make rounder (dilate slightly) */}
            <feMorphology in="blur1" operator="dilate" radius="0.8" result="round" />
            {/* Final blur to smooth out the morphology */}
            <feGaussianBlur in="round" stdDeviation="2" />
          </filter>
        </defs>

        {/* Render particles */}
        {particles.map((particle, index) => (
          <circle
            key={particle.id}
            ref={(el) => {
              if (el) circlesRef.current[index] = el;
            }}
            r={particle.size}
            style={{
              fill: particle.color.light,
              opacity: particle.opacity,
              filter: 'url(#particle-blur)',
              willChange: 'transform',
            }}
            data-light-color={particle.color.light}
            data-dark-color={particle.color.dark}
            transform={`translate(${particle.x}, ${particle.y})`}
          />
        ))}
      </svg>
    </div>
  );
}
