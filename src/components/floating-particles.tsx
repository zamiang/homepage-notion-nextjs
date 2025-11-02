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
  // Independent animation parameters
  angleX: number; // Current angle in X oscillation
  angleY: number; // Current angle in Y oscillation
  speedX: number; // How fast X oscillation changes
  speedY: number; // How fast Y oscillation changes
  radiusX: number; // How far X oscillates
  radiusY: number; // How far Y oscillates
}

const PARTICLE_COUNT = 40;

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
    const opacity = 0.08 + (size / 6) * 0.25; // 0.08-0.33 range (size-dependent)

    initialParticles.push({
      id: i,
      x,
      y,
      baseX: x,
      baseY: y,
      size,
      opacity,
      blurRadius: 4 + Math.random() * 4, // 4-8px
      // Each particle gets completely independent animation parameters
      angleX: Math.random() * Math.PI * 2, // Random starting angle
      angleY: Math.random() * Math.PI * 2,
      speedX: 0.001 + Math.random() * 0.003, // 0.001-0.004 (very slow, independent speeds)
      speedY: 0.0008 + Math.random() * 0.0025, // 0.0008-0.0033 (different range for Y)
      radiusX: 15 + Math.random() * 35, // 15-50px horizontal movement
      radiusY: 10 + Math.random() * 25, // 10-35px vertical movement
    });
  }

  return initialParticles;
}

export default function FloatingParticles() {
  const canvasRef = useRef<HTMLDivElement>(null);
  // Use lazy initializer to avoid setState in effect
  const [particles, setParticles] = useState<Particle[]>(initializeParticles);
  const particlesRef = useRef<Particle[]>(particles);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const scrollYRef = useRef(0);
  const frameTimesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(0);

  useEffect(() => {
    // Scroll handler - subtle parallax effect
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
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

      particlesRef.current.forEach((particle, index) => {
        // Each particle independently updates its angle (this is the key to independence!)
        particle.angleX += particle.speedX;
        particle.angleY += particle.speedY;

        // Calculate position based on particle's own angle and radius
        // No shared time variable - each particle is on its own timeline!
        const oscillationX = Math.sin(particle.angleX) * particle.radiusX;
        const oscillationY = Math.cos(particle.angleY) * particle.radiusY;

        // Add subtle scroll-based offset - move particles UP as user scrolls DOWN
        // This creates a parallax effect where particles stay visible in viewport
        // Larger particles (closer) move MORE than smaller particles (farther away)
        const scrollFactor = 0.02 + (particle.size / 6) * 0.05; // 0.02-0.07 range (larger = faster)
        const scrollOffset = -scrollYRef.current * scrollFactor; // Negative = move up when scrolling down

        // Wrap particles vertically so they stay visible throughout the page
        // Use viewport height for wrapping to keep particles in view
        const viewportHeight = window.innerHeight;
        let finalY = particle.baseY + oscillationY + scrollOffset;

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
        {particles.map((particle) => (
          <circle
            key={particle.id}
            r={particle.size}
            className="fill-foreground dark:fill-accent"
            style={{
              opacity: particle.opacity,
              filter: 'url(#particle-blur)',
              willChange: 'transform',
            }}
            transform={`translate(${particle.x}, ${particle.y})`}
          />
        ))}
      </svg>
    </div>
  );
}
