// Animation constants
export const PARTICLE_COUNT = 40;
export const SCROLL_VELOCITY_DECAY = 0.92; // 8% decay per frame
export const PARTICLE_VELOCITY_DECAY = 0.88; // 12% decay per frame
export const MIN_INERTIA_FACTOR = 0.3;
export const MAX_INERTIA_FACTOR = 0.7;
export const MIN_SCROLL_FACTOR = 0.02;
export const MAX_SCROLL_FACTOR = 0.07;
export const INERTIA_MULTIPLIER = 0.1;

// Particle size and movement ranges
export const MIN_PARTICLE_SIZE = 2;
export const MAX_PARTICLE_SIZE = 6;
export const MIN_OPACITY = 0.12;
export const MAX_OPACITY = 0.42;
export const MIN_SPEED_X = 0.002;
export const MAX_SPEED_X = 0.006;
export const MIN_SPEED_Y = 0.0015;
export const MAX_SPEED_Y = 0.005;
export const MIN_RADIUS_X = 20;
export const MAX_RADIUS_X = 60;
export const MIN_RADIUS_Y = 15;
export const MAX_RADIUS_Y = 45;

// Types
export interface ParticleColor {
  light: string;
  dark: string;
}

export interface Particle {
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
export const LIGHT_MODE_COLORS = [
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

export const DARK_MODE_COLORS = [
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
export function getRandomColor(): ParticleColor {
  const lightIndex = Math.floor(Math.random() * LIGHT_MODE_COLORS.length);
  const darkIndex = Math.floor(Math.random() * DARK_MODE_COLORS.length);

  return {
    light: LIGHT_MODE_COLORS[lightIndex],
    dark: DARK_MODE_COLORS[darkIndex],
  };
}

// Create a single particle with given dimensions
export function createParticle(
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
export function initializeParticles(
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
