'use client';

import { ParticleCanvas, useParticles } from './particles';

export default function FloatingParticles() {
  const { particles, circlesRef } = useParticles();

  return <ParticleCanvas particles={particles} circlesRef={circlesRef} />;
}
