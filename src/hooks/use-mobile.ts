import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    // Initialize state with current media query match
    if (typeof window !== 'undefined') {
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
      return mql.matches;
    }
    return false;
  });

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    // Add event listener
    mql.addEventListener('change', onChange);

    // Cleanup
    return () => {
      mql.removeEventListener('change', onChange);
    };
  }, []);

  return isMobile;
}
