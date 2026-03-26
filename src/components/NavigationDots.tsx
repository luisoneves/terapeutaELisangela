import React, { useState, useEffect } from 'react';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

/**
 * NavigationDots - Indicador de Seção Vertical
 * ==============================================
 * 
 * Dots fixos na lateral direita indicando a seção atual
 * Permite navegação rápida entre seções
 * 
 * Características:
 * - Visual discreto e elegante
 * - Indicador da seção ativa
 * - Tooltip com nome da seção
 * - Acessível por teclado
 * - Respeita prefers-reduced-motion
 */

interface Section {
  id: string;
  label: string;
}

const sections: Section[] = [
  { id: 'inicio', label: 'Início' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'servicos', label: 'Serviços' },
  { id: 'beneficios', label: 'Benefícios' },
  { id: 'depoimentos', label: 'Depoimentos' },
  { id: 'contato', label: 'Contato' },
];

export const NavigationDots: React.FC = () => {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const { scrollToSection } = useSmoothScroll();

  useEffect(() => {
    // ObservarIntersection para detectar seção visível
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0,
      }
    );

    // Observar todas as seções
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = (sectionId: string) => {
    scrollToSection(`#${sectionId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent, sectionId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(sectionId);
    }
  };

  return (
    <nav
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3"
      aria-label="Navegação por seções"
    >
      {sections.map((section) => {
        const isActive = activeSection === section.id;
        const showTooltip = isHovered === section.id || isActive;

        return (
          <div key={section.id} className="relative group">
            <button
              onClick={() => handleClick(section.id)}
              onMouseEnter={() => setIsHovered(section.id)}
              onMouseLeave={() => setIsHovered(null)}
              onKeyDown={(e) => handleKeyDown(e, section.id)}
              className={`relative w-3 h-3 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${
                isActive
                  ? 'bg-gold scale-110'
                  : 'bg-dark/20 dark:bg-cream/30 hover:bg-gold/60 hover:scale-110'
              }`}
              aria-label={`Ir para ${section.label}`}
              aria-current={isActive ? 'step' : undefined}
            >
              {/* Anel indicador para seção ativa */}
              {isActive && (
                <span className="absolute inset-0 rounded-full border-2 border-gold animate-pulse" />
              )}
            </button>

            {/* Tooltip */}
            <span
              className={`absolute right-full mr-4 px-3 py-1.5 bg-dark dark:bg-cream text-cream dark:text-dark text-xs font-medium rounded-lg whitespace-nowrap transition-all duration-200 ${
                showTooltip
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-2 pointer-events-none'
              }`}
              role="tooltip"
            >
              {section.label}
              {/* Seta do tooltip */}
              <span className="absolute left-full top-1/2 -translate-y-1/2 border-8 border-transparent border-l-dark dark:border-l-cream" />
            </span>
          </div>
        );
      })}

      {/* Linha conectadora */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-dark/20 dark:via-cream/20 to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </nav>
  );
};

export default NavigationDots;
