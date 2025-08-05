import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    // Set initial state
    setIsMobile(mql.matches);

    // Add event listener
    mql.addEventListener('change', onChange);

    // Cleanup
    return () => {
      mql.removeEventListener('change', onChange);
    };
  }, []);

  return isMobile;
}
