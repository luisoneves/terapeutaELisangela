import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useRandomPhrase } from '@/hooks/useRandomPhrase';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { FeatureFlags } from '@/config/featureFlags';
import { cn } from '@/lib/utils';

interface HintTooltipProps {
  children: React.ReactNode;
  flags: FeatureFlags;
  className?: string;
}

export const HintTooltip: React.FC<HintTooltipProps> = ({ children, flags, className }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { currentPhrase, showPhrase, clearPhrase } = useRandomPhrase();
  const prefersReducedMotion = useReducedMotion();

  const shouldAnimate = flags.animationsEnabled && flags.hintsEnabled;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isHovered && !prefersReducedMotion) {
      showPhrase();
    }
    return () => clearPhrase();
  }, [isHovered, showPhrase, clearPhrase, prefersReducedMotion]);

  useEffect(() => {
    if (isMobile && currentPhrase) {
      const timer = setTimeout(() => clearPhrase(), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentPhrase, isMobile, clearPhrase]);

  if (!shouldAnimate) {
    return <>{children}</>;
  }

  return (
    <div 
      className={cn('relative inline-block', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
    >
      {children}
      
      <AnimatePresence>
        {currentPhrase && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className={cn(
              'absolute left-1/2 -translate-x-1/2 mt-3 px-5 py-3 min-w-[200px]',
              'bg-dark text-cream text-base font-body rounded-xl shadow-lg',
              'whitespace-nowrap z-50 pointer-events-none text-center',
              isMobile && 'bottom-full mb-3'
            )}
          >
            {currentPhrase}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HintTooltip;