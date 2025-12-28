'use client';

import { Particle } from './particle-config';

interface ParticleCanvasProps {
  particles: Particle[];
  circlesRef: React.MutableRefObject<SVGCircleElement[]>;
}

export function ParticleCanvas({ particles, circlesRef }: ParticleCanvasProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg className="absolute inset-0 size-full">
        <defs>
          {/* Simplified blur filter for better performance */}
          <filter id="particle-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
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
            fill={particle.color.light}
            opacity={particle.opacity}
            style={{
              filter: 'url(#particle-blur)',
              willChange: 'transform',
              transform: `translate(${particle.x}px, ${particle.y}px)`,
            }}
            data-light-color={particle.color.light}
            data-dark-color={particle.color.dark}
          />
        ))}
      </svg>
    </div>
  );
}
