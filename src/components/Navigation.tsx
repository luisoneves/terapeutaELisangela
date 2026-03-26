import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { LotusIcon } from './icons/TherapyIcons';
import { useScroll } from '@/hooks/useScroll';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { siteConfig } from '@/config/site';
import type { FeatureFlags } from '@/config/featureFlags';
import { cn } from '@/lib/utils';

interface SmartHeaderProps {
  flags: FeatureFlags;
}

const Navigation: React.FC<SmartHeaderProps> = ({ flags }) => {
  const isScrolled = useScroll(50);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollToSection } = useSmoothScroll();
  
  const shouldAnimate = flags.animationsEnabled && flags.smartHeaderEnabled;
  const prefersReducedMotion = useReducedMotion();
  const scrollDirection = useScrollDirection({ threshold: 10 });
  
  const isHidden = shouldAnimate && !prefersReducedMotion && scrollDirection === 'down';

  const handleNavClick = (href: string) => {
    scrollToSection(href);
    setIsMobileMenuOpen(false);
  };

  const headerClasses = cn(
    'fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out',
    isScrolled
      ? 'bg-cream/80 backdrop-blur-md shadow-soft py-3'
      : 'bg-transparent py-6',
    shouldAnimate && !prefersReducedMotion && (
      isHidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
    )
  );

  return (
    <>
      <nav className={headerClasses}>
        <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex items-center justify-between">
            <a
              href={siteConfig.navigation[0].href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(siteConfig.navigation[0].href);
              }}
              className="flex items-center gap-2 group"
            >
              <LotusIcon
                size={28}
                className="text-gold transition-transform duration-300 group-hover:scale-110"
              />
              <span className="font-display text-xl font-medium text-dark tracking-wide">
                {siteConfig.name}
              </span>
            </a>

            <div className="hidden md:flex items-center gap-8">
              {siteConfig.navigation.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="relative font-body text-sm text-dark/80 hover:text-dark transition-colors duration-300 group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-1/2 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full group-hover:left-0" />
                </a>
              ))}
            </div>

            <div className="hidden md:block">
              <a
                href="#contato"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('#contato');
                }}
                className="inline-flex items-center px-5 py-2.5 bg-dark text-cream text-sm font-body font-medium rounded-full hover:bg-gold transition-colors duration-300"
              >
                Agendar
              </a>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-dark hover:text-gold transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div
          className="absolute inset-0 bg-dark/20 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 w-72 h-full bg-cream shadow-xl transition-transform duration-500 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="pt-24 px-6">
            <div className="flex flex-col gap-4">
              {siteConfig.navigation.map((link, index) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="font-body text-lg text-dark/80 hover:text-gold transition-colors duration-300 py-2 border-b border-dark/10"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="mt-8">
              <a
                href="#contato"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('#contato');
                }}
                className="inline-flex items-center justify-center w-full px-5 py-3 bg-dark text-cream text-sm font-body font-medium rounded-full hover:bg-gold transition-colors duration-300"
              >
                Agendar Sessão
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;