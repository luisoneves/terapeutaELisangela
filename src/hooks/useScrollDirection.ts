import { useState, useEffect } from 'react';

export type ScrollDirection = 'up' | 'down' | 'none';

interface UseScrollDirectionOptions {
  threshold?: number;
}

export function useScrollDirection(options: UseScrollDirectionOptions = {}): ScrollDirection {
  const { threshold = 10 } = options;
  const [direction, setDirection] = useState<ScrollDirection>('none');

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY;

      if (Math.abs(diff) < threshold) {
        return;
      }

      if (diff > 0) {
        setDirection('down');
      } else {
        setDirection('up');
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return direction;
}