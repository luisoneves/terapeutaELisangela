/**
 * useAccessibility Hook
 * =====================
 * 
 * Hook para gerenciar preferências de acessibilidade do usuário
 * 
 * Funcionalidades:
 * - Tema: light/dark (segue sistema por padrão)
 * - Tamanho de fonte: normal, grande, muito grande
 * - Contraste: normal, alto
 * - Reduced motion: respeita sistema + toggle
 * 
 * Armazena no localStorage para persistência
 */

import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type FontSize = 'normal' | 'large' | 'x-large';
export type Contrast = 'normal' | 'high';

interface AccessibilityState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  fontSize: FontSize;
  contrast: Contrast;
  reducedMotion: boolean;
}

interface AccessibilityActions {
  setTheme: (theme: Theme) => void;
  setFontSize: (size: FontSize) => void;
  setContrast: (contrast: Contrast) => void;
  setReducedMotion: (reduced: boolean) => void;
  reset: () => void;
}

const STORAGE_KEY = 'accessibility-preferences';

const DEFAULT_STATE: AccessibilityState = {
  theme: 'system',
  resolvedTheme: 'light',
  fontSize: 'normal',
  contrast: 'normal',
  reducedMotion: false,
};

const FONT_SIZE_VALUES: Record<FontSize, string> = {
  normal: '100%',
  large: '112%',
  'x-large': '125%',
};

function getInitialState(): AccessibilityState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  
  try {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const systemReduced = mediaQuery.matches;
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { 
        ...DEFAULT_STATE, 
        ...parsed,
        reducedMotion: systemReduced || parsed.reducedMotion
      };
    }
    
    return { ...DEFAULT_STATE, reducedMotion: systemReduced };
  } catch {
    return DEFAULT_STATE;
  }
}

export function useAccessibility(): [AccessibilityState, AccessibilityActions] {
  const [state, setState] = useState<AccessibilityState>(getInitialState);

  // Determinar tema resolved (considerando system)
  const getResolvedTheme = useCallback((theme: Theme): 'light' | 'dark' => {
    if (theme !== 'system') return theme;
    
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }, []);

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => getResolvedTheme(state.theme));

  // Atualizar localStorage quando state mudar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  // Listener para mudança de tema do sistema
  useEffect(() => {
    if (state.theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setResolvedTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [state.theme]);

  // Aplicar tema ao document
  useEffect(() => {
    const theme = state.theme === 'system' 
      ? resolvedTheme 
      : state.theme;
    
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    document.documentElement.style.colorScheme = theme;
  }, [resolvedTheme, state.theme]);

  // Aplicar tamanho de fonte
  useEffect(() => {
    const fontSize = FONT_SIZE_VALUES[state.fontSize];
    document.documentElement.style.fontSize = fontSize;
  }, [state.fontSize]);

  // Aplicar contraste
  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', state.contrast === 'high');
  }, [state.contrast]);

  // Ações
  const setTheme = useCallback((theme: Theme) => {
    setState(prev => ({ ...prev, theme }));
    setResolvedTheme(getResolvedTheme(theme));
  }, [getResolvedTheme]);

  const setFontSize = useCallback((fontSize: FontSize) => {
    setState(prev => ({ ...prev, fontSize }));
  }, []);

  const setContrast = useCallback((contrast: Contrast) => {
    setState(prev => ({ ...prev, contrast }));
  }, []);

  const setReducedMotion = useCallback((reducedMotion: boolean) => {
    setState(prev => ({ ...prev, reducedMotion }));
  }, []);

  const reset = useCallback(() => {
    setState(DEFAULT_STATE);
    setResolvedTheme(getResolvedTheme(DEFAULT_STATE.theme));
  }, [getResolvedTheme]);

  return [
    { ...state, resolvedTheme },
    { setTheme, setFontSize, setContrast, setReducedMotion, reset }
  ];
}
