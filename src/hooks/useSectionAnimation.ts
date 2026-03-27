import { useEffect, type RefObject } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

/**
 * useSectionAnimation Hook
 * ========================
 * 
 * Hook reutilizável para animações de entrada de seções
 * Padroniza o padrão usado em todas as seções do site
 * 
 * ANTERIORMENTE:
 * - ~30 linhas de código repetido em cada seção
 * - Lógica de gsap.context() + ScrollTrigger.create() duplicada
 * 
 * AGORA:
 * - 1 hook com configuração flexível
 * - Cleanup automático
 * - Suporte a refs múltiplas
 * 
 * =============================================================================
 */

interface AnimationConfig {
  selector?: string;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  stagger?: number;
  start?: string;
}

interface UseSectionAnimationOptions {
  /** Ref do elemento raiz da seção */
  sectionRef: RefObject<HTMLElement | null>;
  /** Refs opcionais para animações específicas */
  refs?: {
    titleRef?: RefObject<HTMLElement | null>;
    contentRef?: RefObject<HTMLElement | null>;
    cardsRef?: RefObject<HTMLElement | null>;
  };
  /** Configuração da animação de título */
  titleAnimation?: AnimationConfig | false;
  /** Configuração da animação de conteúdo */
  contentAnimation?: AnimationConfig | false;
  /** Configuração da animação de cards */
  cardsAnimation?: AnimationConfig | false;
  /** Habilitar animação contínua (ex: blob pulsante) */
  continuousAnimation?: {
    element: RefObject<HTMLElement | null>;
    from?: gsap.TweenVars;
    to?: gsap.TweenVars;
    duration?: number;
    repeat?: number;
    yoyo?: boolean;
  };
}

/**
 * Default animation values
 */
const DEFAULT_TITLE_ANIMATION = {
  selector: '.animate-item',
  from: { y: 30, opacity: 0 },
  to: { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
  start: 'top 80%',
};

const DEFAULT_CONTENT_ANIMATION = {
  selector: '.animate-item',
  from: { y: 30, opacity: 0 },
  to: { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out' },
  start: 'top 75%',
};

const DEFAULT_CARDS_ANIMATION = {
  selector: '.service-card, .card',
  from: { y: 60, opacity: 0, scale: 0.9 },
  to: { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out' },
  start: 'top 75%',
};

/**
 * useSectionAnimation
 * ==================
 * 
 * @param options - Opções de configuração
 * 
 * @example
 * ```tsx
 * const { titleRef, contentRef } = useRef<HTMLDivElement>(null);
 * 
 * useSectionAnimation({
 *   sectionRef,
 *   refs: { titleRef, contentRef },
 *   titleAnimation: { start: 'top 80%' },
 *   contentAnimation: { stagger: 0.1 },
 * });
 * ```
 */
export function useSectionAnimation({
  sectionRef,
  refs,
  titleAnimation,
  contentAnimation,
  cardsAnimation,
  continuousAnimation,
}: UseSectionAnimationOptions) {
  useEffect(() => {
    // =============================================================================
    // VALIDACAO
    // =============================================================================
    if (!sectionRef.current) return;

    const triggers: ScrollTrigger[] = [];

    // =============================================================================
    // CONTEXT GSAP
    // =============================================================================
    // Agrupa todas as animações para cleanup correto
    const ctx = gsap.context(() => {
      // =============================================================================
      // ANIMACAO DE TITULO
      // =============================================================================
      if (refs?.titleRef?.current && titleAnimation !== false) {
        const config = titleAnimation 
          ? { ...DEFAULT_TITLE_ANIMATION, ...titleAnimation }
          : DEFAULT_TITLE_ANIMATION;
        const fromVars = config.from ?? { y: 30, opacity: 0 };
        const toVars = config.to ?? { y: 0, opacity: 1, duration: 0.8 };
        const trigger = ScrollTrigger.create({
          trigger: refs.titleRef.current,
          start: config.start ?? 'top 80%',
          onEnter: () => {
            const elements = refs.titleRef!.current?.querySelectorAll(config.selector ?? '.animate-item');
            if (elements) {
              gsap.fromTo(elements, fromVars, toVars);
            }
          },
          once: true,
        });
        triggers.push(trigger);
      }

      // =============================================================================
      // ANIMACAO DE CONTEUDO
      // =============================================================================
      if (refs?.contentRef?.current && contentAnimation !== false) {
        const config: AnimationConfig = contentAnimation
          ? { ...DEFAULT_CONTENT_ANIMATION, ...contentAnimation }
          : DEFAULT_CONTENT_ANIMATION;
        const fromVars = config.from ?? { y: 30, opacity: 0 };
        const toVars = config.to ?? { y: 0, opacity: 1, duration: 0.8 };
        const trigger = ScrollTrigger.create({
          trigger: refs.contentRef.current,
          start: config.start ?? 'top 75%',
          onEnter: () => {
            const elements = refs.contentRef!.current?.querySelectorAll(config.selector ?? '.animate-item');
            if (elements) {
              gsap.fromTo(elements, fromVars, {
                ...toVars,
                stagger: config.stagger ?? 0.15,
              });
            }
          },
          once: true,
        });
        triggers.push(trigger);
      }

      // =============================================================================
      // ANIMACAO DE CARDS
      // =============================================================================
      if (refs?.cardsRef?.current && cardsAnimation !== false) {
        const config: AnimationConfig = cardsAnimation
          ? { ...DEFAULT_CARDS_ANIMATION, ...cardsAnimation }
          : DEFAULT_CARDS_ANIMATION;
        const fromVars = config.from ?? { y: 60, opacity: 0, scale: 0.9 };
        const toVars = config.to ?? { y: 0, opacity: 1, scale: 1, duration: 0.8 };
        const trigger = ScrollTrigger.create({
          trigger: refs.cardsRef.current,
          start: config.start ?? 'top 75%',
          onEnter: () => {
            const elements = refs.cardsRef!.current?.querySelectorAll(config.selector ?? '.service-card');
            if (elements) {
              gsap.fromTo(elements, fromVars, {
                ...toVars,
                stagger: config.stagger ?? 0.15,
              });
            }
          },
          once: true,
        });
        triggers.push(trigger);
      }

      // =============================================================================
      // ANIMACAO CONTINUA
      // =============================================================================
      if (continuousAnimation?.element?.current) {
        gsap.to(continuousAnimation.element.current, {
          borderRadius: continuousAnimation.to?.borderRadius || '60% 40% 30% 70% / 50% 60% 40% 50%',
          duration: continuousAnimation.duration || 6,
          repeat: continuousAnimation.repeat || -1,
          yoyo: continuousAnimation.yoyo ?? true,
          ease: 'sine.inOut',
        });
      }
    }, sectionRef);

    // =============================================================================
    // CLEANUP
    // =============================================================================
    return () => {
      triggers.forEach((trigger) => trigger.kill());
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sectionRef,
    titleAnimation,
    contentAnimation,
    cardsAnimation,
    continuousAnimation,
  ]);
}
