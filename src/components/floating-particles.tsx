'use client';

import { useEffect, useRef, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  size: number;
  opacity: number;
  blurRadius: number;
  speed: number;
  phase: number;
}

const PARTICLE_COUNT = 40;
const DRIFT_SPEED = 0.15;
const SCROLL_FORCE = 0.15; // Reduced from 0.8 for smoother scroll reaction
const SCROLL_DAMPING = 0.75; // Much faster decay for quick stabilization (was 0.85)
const VELOCITY_DAMPING = 0.94; // Faster particle velocity damping for quicker settling (was 0.98)
const RETURN_FORCE = 0.006; // Stronger return force for faster stabilization (was 0.002)

export default function FloatingParticles() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const scrollVelocityRef = useRef(0);
  const lastScrollRef = useRef(0);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Initialize particles with even distribution
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
      const sizeRatio = (size - 2) / 4; // 0-1 based on size

      initialParticles.push({
        id: i,
        x,
        y,
        vx: 0,
        vy: 0,
        baseX: x,
        baseY: y,
        size,
        opacity: 0.15 + Math.random() * 0.2, // 0.15-0.35
        blurRadius: 4 + Math.random() * 4, // 4-8px
        speed: 0.2 + sizeRatio * 1.0, // Much wider range: small=0.2, large=1.2
        phase: Math.random() * Math.PI * 2, // Random starting phase for sine wave
      });
    }

    particlesRef.current = initialParticles;
    setParticles(initialParticles);

    // Track scroll velocity
    let lastScroll = window.scrollY;
    let lastTime = Date.now();

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;
      const deltaScroll = currentScroll - lastScroll;

      // Calculate scroll velocity (pixels per millisecond, scaled up for effect)
      if (deltaTime > 0) {
        scrollVelocityRef.current = (deltaScroll / deltaTime) * SCROLL_FORCE;
      }

      lastScroll = currentScroll;
      lastTime = currentTime;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Animation loop
    let time = 0;
    const animate = () => {
      time += 0.016; // ~60fps
      scrollVelocityRef.current *= SCROLL_DAMPING; // Decay scroll velocity quickly

      const elements = canvasRef.current?.children;
      if (!elements) return;

      particlesRef.current.forEach((particle, index) => {
        // Size-based movement multiplier (larger = much faster)
        const sizeRatio = (particle.size - 2) / 4; // 0-1 based on size
        const speedMultiplier = 0.3 + sizeRatio * 1.4; // 0.3-1.7 (much wider range!)

        // Gentle sine wave drift
        const driftX = Math.sin(time * particle.speed + particle.phase) * DRIFT_SPEED;
        const driftY = Math.cos(time * particle.speed * 0.7 + particle.phase) * DRIFT_SPEED;

        // Apply drift with dramatic size-based multiplier
        particle.vx += driftX * 0.015 * speedMultiplier; // Increased from 0.01
        particle.vy += driftY * 0.015 * speedMultiplier;

        // Apply scroll force - larger particles react dramatically more
        const scrollForce = scrollVelocityRef.current * speedMultiplier;
        particle.vy += scrollForce * 0.25; // Increased slightly
        particle.vx += scrollForce * 0.08 * (Math.random() - 0.5); // Increased slightly

        // Return force to base position (very gentle)
        const dx = particle.baseX - particle.x;
        const dy = particle.baseY - particle.y;
        particle.vx += dx * RETURN_FORCE;
        particle.vy += dy * RETURN_FORCE;

        // Apply velocity damping
        particle.vx *= VELOCITY_DAMPING;
        particle.vy *= VELOCITY_DAMPING;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around screen boundaries
        if (particle.x < -50) particle.x = window.innerWidth + 50;
        if (particle.x > window.innerWidth + 50) particle.x = -50;
        if (particle.y < -50) particle.y = window.innerHeight + 50;
        if (particle.y > window.innerHeight + 50) particle.y = -50;

        // Update DOM element
        const element = elements[index] as HTMLElement;
        if (element) {
          element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      // Reposition particles proportionally
      const widthRatio = window.innerWidth / (particlesRef.current[0]?.baseX ? window.innerWidth : 1);
      const heightRatio = window.innerHeight / (particlesRef.current[0]?.baseY ? window.innerHeight : 1);

      particlesRef.current.forEach((particle) => {
        particle.baseX *= widthRatio;
        particle.baseY *= heightRatio;
        particle.x *= widthRatio;
        particle.y *= heightRatio;
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
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
          {/* Blur filter for soft particles */}
          {particles.map((particle) => (
            <filter
              key={`blur-${particle.id}`}
              id={`particle-blur-${particle.id}`}
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation={particle.blurRadius} />
            </filter>
          ))}
        </defs>

        {/* Render particles */}
        {particles.map((particle) => (
          <circle
            key={particle.id}
            r={particle.size}
            className="fill-foreground dark:fill-accent"
            style={{
              opacity: particle.opacity,
              filter: `url(#particle-blur-${particle.id})`,
              transform: `translate(${particle.x}px, ${particle.y}px)`,
              willChange: 'transform',
            }}
          />
        ))}
      </svg>
    </div>
  );
}
