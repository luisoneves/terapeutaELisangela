import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowDown, Sparkles } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { HintTooltip } from '@/components/HintTooltip';
import type { FeatureFlags } from '@/config/featureFlags';

interface HeroProps {
  flags?: FeatureFlags;
}

const Hero: React.FC<HeroProps> = ({ flags }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<HTMLDivElement>(null);

  const shouldAnimate = flags?.animationsEnabled && flags?.heroTitleEnabled;
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (shouldAnimate && !prefersReducedMotion) return;
    
    const ctx = gsap.context(() => {
      // Timeline de entrada
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // Animação da forma orgânica
      tl.fromTo(
        shapeRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.8 }
      );

      // Animação da imagem com máscara de íris
      tl.fromTo(
        imageRef.current,
        { scale: 1.1, opacity: 0, clipPath: 'circle(0% at 50% 50%)' },
        { scale: 1, opacity: 1, clipPath: 'circle(75% at 50% 50%)', duration: 2 },
        '-=1'
      );

      // Animação do título - revelação por palavra
      if (titleRef.current) {
        const words = titleRef.current.querySelectorAll('.word');
        tl.fromTo(
          words,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, stagger: 0.15 },
          '-=0.8'
        );
      }

      // Animação do subtítulo
      tl.fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        '-=0.6'
      );

      // Animação do CTA
      tl.fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.4'
      );

      // Animação contínua da forma orgânica
      gsap.to(shapeRef.current, {
        borderRadius: '60% 40% 30% 70% / 50% 60% 40% 50%',
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, heroRef);

    return () => ctx.revert();
  }, [shouldAnimate, prefersReducedMotion]);

  // Efeito de paralaxe suave no mouse
  useEffect(() => {
    if (shouldAnimate && !prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;

      gsap.to(imageRef.current, {
        x: xPercent * -15,
        y: yPercent * -10,
        duration: 1,
        ease: 'power2.out',
      });

      gsap.to(shapeRef.current, {
        x: xPercent * 10,
        y: yPercent * 8,
        duration: 1.2,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToAbout = () => {
    const element = document.querySelector('#sobre');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const titleWords = 'Bem-vindo ao seu espaço de cura e equilíbrio'.split(' ');

  return (
    <section
      id="inicio"
      ref={heroRef}
      className="relative min-h-screen w-full flex items-center overflow-hidden bg-cream"
    >
      {/* Forma Orgânica de Fundo */}
      <div
        ref={shapeRef}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[65vw] h-[85vh] bg-gradient-to-br from-gold/20 to-sage/15 opacity-0"
        style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}
      />

      {/* Partículas decorativas sutis */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-[15%] w-2 h-2 rounded-full bg-gold/30 animate-float" />
        <div className="absolute top-40 left-[25%] w-1.5 h-1.5 rounded-full bg-sage/40 animate-float animation-delay-200" />
        <div className="absolute bottom-32 left-[10%] w-2 h-2 rounded-full bg-gold/25 animate-float animation-delay-400" />
        <div className="absolute top-1/3 right-[20%] w-1 h-1 rounded-full bg-sage/30 animate-float animation-delay-300" />
      </div>

      <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 pt-24 pb-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Conteúdo Textual */}
          <div className="relative z-10 order-2 lg:order-1">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="font-body text-sm tracking-widest uppercase text-gray">
                Terapia Holística Integrativa
              </span>
            </div>

            <h1
              ref={titleRef}
              className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-dark leading-tight mb-6"
            >
              {titleWords.map((word, index) => (
                <span key={index} className="word inline-block mr-[0.25em]">
                  {word}
                </span>
              ))}
            </h1>

            <p
              ref={subtitleRef}
              className="font-body text-base lg:text-lg text-gray max-w-lg mb-8 leading-relaxed opacity-0"
            >
              Descubra o poder da cura através do Reiki, Yoga, Aromaterapia e 
              Constelação Familiar. Um caminho de transformação e autoconhecimento 
              guiado com amor e dedicação.
            </p>

            <div ref={ctaRef} className="flex flex-wrap gap-4 opacity-0">
              <HintTooltip flags={flags || { animationsEnabled: false, smartHeaderEnabled: false, heroTitleEnabled: false, hintsEnabled: false }}>
                <a
                  href="#contato"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center px-8 py-4 bg-dark text-cream font-body text-sm font-medium rounded-full hover:bg-gold transition-all duration-300 hover:shadow-glow group"
                >
                  Agende sua sessão
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </HintTooltip>
              <a
                href="#servicos"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#servicos')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center px-8 py-4 border border-dark/20 text-dark font-body text-sm font-medium rounded-full hover:border-gold hover:text-gold transition-all duration-300"
              >
                Conheça os serviços
              </a>
            </div>
          </div>

          {/* Imagem Principal */}
          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
            <div
              ref={imageRef}
              className="relative w-full max-w-lg lg:max-w-xl xl:max-w-2xl opacity-0"
            >
              {/* Moldura orgânica */}
              <div
                className="absolute -inset-4 bg-gradient-to-br from-gold/30 to-sage/20 -z-10"
                style={{ borderRadius: '45% 55% 65% 35% / 45% 55% 45% 55%' }}
              />
              
              {/* Imagem com borda orgânica */}
              <div
                className="overflow-hidden"
                style={{ borderRadius: '40% 60% 60% 40% / 50% 50% 50% 50%' }}
              >
                <img
                  src="/hero-image.jpg"
                  alt="Mulher em momento de tranquilidade e paz"
                  width={600}
                  height={800}
                  loading="eager"
                  className="w-full h-auto object-cover aspect-[3/4] hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Elemento decorativo */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 border border-gold/40 rounded-full animate-breathe" />
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-sage/20 rounded-full animate-breathe animation-delay-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray hover:text-gold transition-colors duration-300 group"
        aria-label="Scroll to next section"
      >
        <span className="font-body text-xs tracking-widest uppercase">Explore</span>
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </button>
    </section>
  );
};

export default Hero;
