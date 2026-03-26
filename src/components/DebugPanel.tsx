import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, X, RefreshCw } from 'lucide-react';
import { useFeatureFlags, clearHintCooldown, type FeatureFlags } from '@/config/featureFlags';

const FLAG_LABELS: Record<keyof FeatureFlags, string> = {
  animationsEnabled: 'Animações Globais',
  smartHeaderEnabled: 'Smart Header',
  heroTitleEnabled: 'Hero Title',
  hintsEnabled: 'Hint Tooltip',
};

const DebugPanel: React.FC = () => {
  const { flags, toggleFlag, resetFlags } = useFeatureFlags();
  const [isOpen, setIsOpen] = useState(false);

  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-[100] p-3 bg-dark text-cream rounded-full shadow-lg hover:bg-gold transition-colors"
        aria-label="Debug panel"
      >
        <Settings size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-20 right-4 z-[100] w-80 bg-cream dark:bg-dark border border-dark/20 dark:border-cream/20 rounded-xl shadow-xl p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-body text-sm font-medium text-dark dark:text-cream">Feature Flags</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:text-gold transition-colors text-dark dark:text-cream"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              {Object.entries(flags).map(([key, value]) => (
                <label
                  key={key}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span className="font-body text-xs text-dark/80 dark:text-cream/80">
                    {FLAG_LABELS[key as keyof FeatureFlags]}
                  </span>
                  <button
                    onClick={() => toggleFlag(key as keyof FeatureFlags)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      value ? 'bg-gold' : 'bg-gray/30 dark:bg-cream/20'
                    }`}
                  >
                    <motion.span
                      animate={{ x: value ? 20 : 2 }}
                      className="absolute top-0.5 w-4 h-4 bg-white dark:bg-cream rounded-full shadow"
                    />
                  </button>
                </label>
              ))}
            </div>

            <button
              onClick={() => {
                resetFlags();
                clearHintCooldown();
              }}
              className="w-full py-2 text-xs font-body text-dark/60 dark:text-cream/60 hover:text-dark dark:hover:text-cream border border-dark/20 dark:border-cream/20 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={14} />
              Resetar + Limpar Cache
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DebugPanel;