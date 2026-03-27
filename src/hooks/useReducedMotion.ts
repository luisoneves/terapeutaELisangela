/**
 * useReducedMotion Hook
 * ====================
 * 
 * Hook para verificar se o usuário prefere redução de movimento
 * Segue a diretiva prefers-reduced-motion do CSS
 * 
 * USO:
 * const prefersReducedMotion = useReducedMotion();
 * 
 * if (prefersReducedMotion) {
 *   // Pular animações
 * }
 */

import { useState, useEffect, useMemo } from 'react';

function getInitialReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getInitialReducedMotion);

  const mediaQuery = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return window.matchMedia('(prefers-reduced-motion: reduce)');
  }, []);

  useEffect(() => {
    if (!mediaQuery) return;

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [mediaQuery]);

  return prefersReducedMotion;
}
