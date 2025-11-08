'use client';

import { useEffect, useRef, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  opacity: number;
  blurRadius: number;
  color: string; // Subtle color variation within theme
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

const PARTICLE_COUNT = 40;

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

// Get a random color from the appropriate palette
function getRandomColor(): string {
  // We'll use CSS variables in the actual render, but for initialization we need to pick an index
  // This returns a color that will be used with CSS custom properties
  const lightColors = LIGHT_MODE_COLORS;
  const darkColors = DARK_MODE_COLORS;

  // Return both light and dark in a format that can be used with CSS variables
  const lightIndex = Math.floor(Math.random() * lightColors.length);
  const darkIndex = Math.floor(Math.random() * darkColors.length);

  return `light:${lightColors[lightIndex]};dark:${darkColors[darkIndex]}`;
}

// Initialize particles function
function initializeParticles(): Particle[] {
  // Check if window is available (SSR safety)
  if (typeof window === 'undefined') {
    return [];
  }

  const initialParticles: Particle[] = [];
  const cols = Math.ceil(Math.sqrt(PARTICLE_COUNT * (window.innerWidth / window.innerHeight)));
  const rows = Math.ceil(PARTICLE_COUNT / cols);
  const cellWidth = window.innerWidth / cols;
  const cellHeight = window.innerHeight / rows;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);

    // Random position within cell for even distribution
    const x = col * cellWidth + Math.random() * cellWidth;
    const y = row * cellHeight + Math.random() * cellHeight;

    // Size determines movement characteristics
    const size = 2 + Math.random() * 4; // 2-6px

    // Smaller particles are more transparent, larger ones more opaque
    const opacity = 0.12 + (size / 6) * 0.3; // 0.12-0.42 range (increased for better color visibility)

    initialParticles.push({
      id: i,
      x,
      y,
      baseX: x,
      baseY: y,
      size,
      opacity,
      blurRadius: 4 + Math.random() * 4, // 4-8px
      color: getRandomColor(), // Assign random color from theme palette
      // Each particle gets completely independent animation parameters
      angleX: Math.random() * Math.PI * 2, // Random starting angle
      angleY: Math.random() * Math.PI * 2,
      speedX: 0.002 + Math.random() * 0.004, // 0.002-0.006 (increased for more movement)
      speedY: 0.0015 + Math.random() * 0.0035, // 0.0015-0.005 (increased for more movement)
      radiusX: 20 + Math.random() * 40, // 20-60px horizontal movement (increased)
      radiusY: 15 + Math.random() * 30, // 15-45px vertical movement (increased)
      velocityY: 0, // Start with no velocity from scrolling
    });
  }

  return initialParticles;
}

export default function FloatingParticles() {
  const canvasRef = useRef<HTMLDivElement>(null);
  // Use lazy initializer to avoid setState in effect
  const [particles] = useState<Particle[]>(initializeParticles);
  const particlesRef = useRef<Particle[]>(particles);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const scrollYRef = useRef(0);
  const scrollVelocityRef = useRef(0);
  const frameTimesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(0);

  useEffect(() => {
    // Theme change handler - update particle colors based on dark mode
    const updateParticleColors = () => {
      const svg = canvasRef.current?.querySelector('svg');
      const circles = svg?.querySelectorAll('circle');
      if (!circles) return;

      const isDark = document.documentElement.classList.contains('dark');

      circles.forEach((circle) => {
        const lightColor = circle.getAttribute('data-light-color');
        const darkColor = circle.getAttribute('data-dark-color');
        if (lightColor && darkColor) {
          circle.setAttribute('fill', isDark ? darkColor : lightColor);
        }
      });
    };

    // Update colors on mount
    updateParticleColors();

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
    const animate = (currentTime: number) => {
      const svg = canvasRef.current?.querySelector('svg');
      const circles = svg?.querySelectorAll('circle');
      if (!circles) return;

      // Performance monitoring
      if (lastFrameTimeRef.current > 0) {
        const frameDuration = currentTime - lastFrameTimeRef.current;
        frameTimesRef.current.push(frameDuration);

        // Keep only last 60 frames for average
        if (frameTimesRef.current.length > 60) {
          frameTimesRef.current.shift();
        }

        // Log performance stats every 5 seconds
        if (frameTimesRef.current.length === 60) {
          const avgFrameTime = frameTimesRef.current.reduce((a, b) => a + b, 0) / 60;
          const fps = 1000 / avgFrameTime;
          if (process.env.NODE_ENV === 'development') {
            console.log(
              `[Particles] FPS: ${fps.toFixed(1)}, Avg frame time: ${avgFrameTime.toFixed(2)}ms`,
            );
          }
          frameTimesRef.current = [];
        }
      }
      lastFrameTimeRef.current = currentTime;

      // Apply inertia decay to scroll velocity (smooth deceleration)
      scrollVelocityRef.current *= 0.92; // 8% decay per frame

      particlesRef.current.forEach((particle, index) => {
        // Each particle independently updates its angle (this is the key to independence!)
        particle.angleX += particle.speedX;
        particle.angleY += particle.speedY;

        // Calculate position based on particle's own angle and radius
        // No shared time variable - each particle is on its own timeline!
        const oscillationX = Math.sin(particle.angleX) * particle.radiusX;
        const oscillationY = Math.cos(particle.angleY) * particle.radiusY;

        // Add scroll velocity to particle's own velocity with inertia
        // Different particles respond differently based on size (larger = more responsive)
        const inertiaFactor = 0.3 + (particle.size / 6) * 0.4; // 0.3-0.7 range
        particle.velocityY += scrollVelocityRef.current * inertiaFactor * 0.1;
        particle.velocityY *= 0.88; // Decay particle's individual velocity (12% per frame)

        // Add subtle scroll-based offset - move particles UP as user scrolls DOWN
        // This creates a parallax effect where particles stay visible in viewport
        // Larger particles (closer) move MORE than smaller particles (farther away)
        const scrollFactor = 0.02 + (particle.size / 6) * 0.05; // 0.02-0.07 range (larger = faster)
        const scrollOffset = -scrollYRef.current * scrollFactor; // Negative = move up when scrolling down

        // Wrap particles vertically so they stay visible throughout the page
        // Use viewport height for wrapping to keep particles in view
        const viewportHeight = window.innerHeight;
        let finalY = particle.baseY + oscillationY + scrollOffset + particle.velocityY;

        // Wrap around: if particle goes above viewport, move it to bottom
        // This creates infinite particles as you scroll
        finalY = ((finalY % viewportHeight) + viewportHeight) % viewportHeight;

        particle.x = particle.baseX + oscillationX;
        particle.y = finalY;

        // Update SVG element using setAttribute (works correctly for SVG)
        const circle = circles[index];
        if (circle) {
          circle.setAttribute('transform', `translate(${particle.x}, ${particle.y})`);
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation with initial timestamp
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

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
        {particles.map((particle) => {
          // Parse the color string to get light and dark mode colors
          const colors = particle.color.split(';');
          const lightColor = colors[0].split(':')[1];
          const darkColor = colors[1].split(':')[1];

          return (
            <circle
              key={particle.id}
              r={particle.size}
              style={{
                fill: lightColor,
                opacity: particle.opacity,
                filter: 'url(#particle-blur)',
                willChange: 'transform',
              }}
              data-light-color={lightColor}
              data-dark-color={darkColor}
              transform={`translate(${particle.x}, ${particle.y})`}
            />
          );
        })}
      </svg>
    </div>
  );
}
