import { useEffect, useRef, useState } from 'react';

export function useInitialReveal(delayMs = 40) {
  const [isVisible, setIsVisible] = useState(false);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (hasAnimatedRef.current) {
      setIsVisible(true);
      return;
    }

    if (typeof window === 'undefined') return;

    const reduceMotion =
      typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      hasAnimatedRef.current = true;
      setIsVisible(true);
      return;
    }

    const timer = window.setTimeout(() => {
      hasAnimatedRef.current = true;
      setIsVisible(true);
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [delayMs]);

  return isVisible;
}
