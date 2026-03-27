import { useState, useCallback } from 'react';
import { getHintCooldown, setHintCooldown } from '@/config/featureFlags';

const DEFAULT_PHRASES = [
  "Você está a um passo",
  "Vai ser um prazer te receber",
  "Seu cuidado começa aqui",
  "Respira, esse pode ser o começo",
  "Clique e vamos conversar",
];

interface UseRandomPhraseOptions {
  phrases?: string[];
  cooldown?: number;
}

function getInitialLastShown(): number {
  if (typeof window === 'undefined') return 0;
  return getHintCooldown() || 0;
}

export function useRandomPhrase(options: UseRandomPhraseOptions = {}) {
  const { phrases = DEFAULT_PHRASES, cooldown = 2000 } = options;
  const [currentPhrase, setCurrentPhrase] = useState('');
  const [lastShown, setLastShown] = useState(getInitialLastShown);

  const showPhrase = useCallback(() => {
    const now = Date.now();
    if (now - lastShown < cooldown) return;
    
    const randomIndex = Math.floor(Math.random() * phrases.length);
    setCurrentPhrase(phrases[randomIndex]);
    setLastShown(now);
    setHintCooldown();
  }, [phrases, cooldown, lastShown]);

  const clearPhrase = useCallback(() => {
    setCurrentPhrase('');
  }, []);

  return { currentPhrase, showPhrase, clearPhrase };
}