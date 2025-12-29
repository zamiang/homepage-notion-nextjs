'use client';

import { useIsMobile } from '@/hooks/use-mobile';

import { ParticleCanvas, useParticles } from './particles';

export default function FloatingParticles() {
  const isMobile = useIsMobile();
  const { particles, circlesRef } = useParticles();

  if (isMobile) {
    return null;
  }

  return <ParticleCanvas particles={particles} circlesRef={circlesRef} />;
}
