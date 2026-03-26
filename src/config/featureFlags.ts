import { useState, useEffect } from 'react';

export interface FeatureFlags {
  animationsEnabled: boolean;
  smartHeaderEnabled: boolean;
  heroTitleEnabled: boolean;
  hintsEnabled: boolean;
}

const DEFAULT_FLAGS: FeatureFlags = {
  animationsEnabled: false,
  smartHeaderEnabled: false,
  heroTitleEnabled: false,
  hintsEnabled: false,
};

const STORAGE_KEY = 'feature-flags';
const HINT_COOLDOWN_KEY = 'hint-cooldown';

export function clearHintCooldown() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(HINT_COOLDOWN_KEY);
}

export function getHintCooldown(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const stored = localStorage.getItem(HINT_COOLDOWN_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
}

export function setHintCooldown() {
  if (typeof window === 'undefined') return;
  localStorage.setItem(HINT_COOLDOWN_KEY, Date.now().toString());
}

function getInitialFlags(): FeatureFlags {
  if (typeof window === 'undefined') return DEFAULT_FLAGS;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_FLAGS, ...JSON.parse(stored) };
    }
  } catch {
    // Silently fallback to defaults on localStorage errors
  }
  
  return DEFAULT_FLAGS;
}

export function useFeatureFlags() {
  const [flags, setFlags] = useState<FeatureFlags>(getInitialFlags);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
  }, [flags]);

  const toggleFlag = (key: keyof FeatureFlags) => {
    setFlags(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const resetFlags = () => {
    setFlags(DEFAULT_FLAGS);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { flags, toggleFlag, resetFlags };
}

export function isAnimationsEnabled(flags: FeatureFlags): boolean {
  return flags.animationsEnabled;
}

export function shouldAnimate(flag: keyof FeatureFlags, flags: FeatureFlags): boolean {
  return flags.animationsEnabled && flags[flag];
}