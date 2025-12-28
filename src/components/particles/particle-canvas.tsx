'use client';

import { Particle } from './particle-config';

interface ParticleCanvasProps {
  particles: Particle[];
  circlesRef: React.MutableRefObject<SVGCircleElement[]>;
}

export function ParticleCanvas({ particles, circlesRef }: ParticleCanvasProps) {
  return (
    <div
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
            fill={particle.color.light}
            opacity={particle.opacity}
            style={{
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
