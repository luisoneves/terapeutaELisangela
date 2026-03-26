import React, { useState, useEffect, useRef } from 'react';
import { X, Sun, Moon, Type, Eye, Zap, RotateCcw } from 'lucide-react';
import { useAccessibility, type Theme, type FontSize, type Contrast } from '@/hooks/useAccessibility';

/**
 * AccessibilityMenu - Menu de Acessibilidade Flutuante
 * =====================================================
 * 
 * Botão flutuante no canto da tela com opções de acessibilidade:
 * - Tema (light/dark/system)
 * - Tamanho de fonte
 * - Contraste
 * - Reduzir animações
 * 
 * Acessibilidade própria:
 * - Navegação por teclado (Escape para fechar)
 * - aria-label e aria-expanded
 * - Foco visível
 * - Suporte a screen readers
 */

export const AccessibilityMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const [prefs, actions] = useAccessibility();

  // Fechar menu ao pressionar Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Fechar ao clicar fora
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const themeLabels: Record<Theme, string> = {
    light: 'Claro',
    dark: 'Escuro',
    system: 'Sistema',
  };

  const fontSizeLabels: Record<FontSize, string> = {
    normal: 'Normal',
    large: 'Grande',
    'x-large': 'Muito Grande',
  };

  const contrastLabels: Record<Contrast, string> = {
    normal: 'Normal',
    high: 'Alto',
  };

  return (
    <>
      {/* Botão flutuante */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-dark text-cream shadow-lg hover:shadow-xl hover:bg-gold hover:text-dark transition-all duration-300 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        aria-label="Menu de acessibilidade"
        aria-expanded={isOpen}
        aria-controls="accessibility-menu"
      >
        {isOpen ? <X size={24} /> : <Eye size={24} />}
      </button>

      {/* Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          id="accessibility-menu"
          role="dialog"
          aria-label="Opções de acessibilidade"
          className="fixed bottom-24 right-6 z-50 w-72 bg-cream dark:bg-dark rounded-2xl shadow-xl border border-dark/10 dark:border-cream/10 p-4 animate-slide-up"
        >
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-dark/10 dark:border-cream/10">
            <h3 className="font-display text-lg text-dark dark:text-cream">
              Acessibilidade
            </h3>
            <button
              onClick={() => actions.reset()}
              className="p-2 rounded-full hover:bg-dark/5 dark:hover:bg-cream/10 transition-colors"
              aria-label="Restaurar padrões"
              title="Restaurar padrões"
            >
              <RotateCcw size={16} className="text-dark/60 dark:text-cream/60" />
            </button>
          </div>

          {/* Tema */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-medium text-dark dark:text-cream mb-2">
              <Sun size={16} />
              Tema
            </label>
            <div className="flex gap-2" role="radiogroup" aria-label="Selecionar tema">
              {(['light', 'system', 'dark'] as Theme[]).map((theme) => (
                <button
                  key={theme}
                  onClick={() => actions.setTheme(theme)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    prefs.theme === theme
                      ? 'bg-gold text-dark'
                      : 'bg-dark/5 dark:bg-cream/10 text-dark/70 dark:text-cream/70 hover:bg-dark/10 dark:hover:bg-cream/20'
                  }`}
                  role="radio"
                  aria-checked={prefs.theme === theme}
                  aria-label={themeLabels[theme]}
                >
                  {theme === 'light' && <Sun size={14} className="inline mr-1" />}
                  {theme === 'dark' && <Moon size={14} className="inline mr-1" />}
                  {themeLabels[theme]}
                </button>
              ))}
            </div>
          </div>

          {/* Tamanho de fonte */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-medium text-dark dark:text-cream mb-2">
              <Type size={16} />
              Tamanho do texto
            </label>
            <div className="flex gap-2" role="radiogroup" aria-label="Selecionar tamanho de fonte">
              {(['normal', 'large', 'x-large'] as FontSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => actions.setFontSize(size)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    prefs.fontSize === size
                      ? 'bg-gold text-dark'
                      : 'bg-dark/5 dark:bg-cream/10 text-dark/70 dark:text-cream/70 hover:bg-dark/10 dark:hover:bg-cream/20'
                  }`}
                  role="radio"
                  aria-checked={prefs.fontSize === size}
                  aria-label={fontSizeLabels[size]}
                >
                  {fontSizeLabels[size]}
                </button>
              ))}
            </div>
          </div>

          {/* Contraste */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-medium text-dark dark:text-cream mb-2">
              <Eye size={16} />
              Contraste
            </label>
            <div className="flex gap-2" role="radiogroup" aria-label="Selecionar contraste">
              {(['normal', 'high'] as Contrast[]).map((contrast) => (
                <button
                  key={contrast}
                  onClick={() => actions.setContrast(contrast)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    prefs.contrast === contrast
                      ? 'bg-gold text-dark'
                      : 'bg-dark/5 dark:bg-cream/10 text-dark/70 dark:text-cream/70 hover:bg-dark/10 dark:hover:bg-cream/20'
                  }`}
                  role="radio"
                  aria-checked={prefs.contrast === contrast}
                  aria-label={contrastLabels[contrast]}
                >
                  {contrast === 'high' && 'AA'}
                  {contrast === 'normal' && 'A'}
                  {' '}
                  {contrastLabels[contrast]}
                </button>
              ))}
            </div>
          </div>

          {/* Reduced Motion */}
          <div>
            <button
              onClick={() => actions.setReducedMotion(!prefs.reducedMotion)}
              className={`w-full flex items-center justify-between py-3 px-4 rounded-lg transition-all ${
                prefs.reducedMotion
                  ? 'bg-gold text-dark'
                  : 'bg-dark/5 dark:bg-cream/10 text-dark/70 dark:text-cream/70 hover:bg-dark/10 dark:hover:bg-cream/20'
              }`}
              role="switch"
              aria-checked={prefs.reducedMotion}
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <Zap size={16} />
                Reduzir animações
              </span>
              <span className="w-10 h-6 rounded-full bg-dark/20 dark:bg-cream/20 relative transition-colors">
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-current transition-transform ${
                    prefs.reducedMotion ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessibilityMenu;
