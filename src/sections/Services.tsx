import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ReikiIcon,
  YogaIcon,
  AromatherapyIcon,
  FamilyConstellationIcon,
} from '../components/icons/TherapyIcons';

gsap.registerPlugin(ScrollTrigger);

interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.FC<{ className?: string; size?: number }>;
  benefits: string[];
}

const services: Service[] = [
  {
    id: 1,
    title: 'Reiki',
    description:
      'Técnica japonesa de harmonização energética que promove equilíbrio, relaxamento profundo e ativação do poder de autocura do organismo.',
    icon: ReikiIcon,
    benefits: ['Redução do estresse', 'Equilíbrio energético', 'Bem-estar emocional'],
  },
  {
    id: 2,
    title: 'Yoga',
    description:
      'Prática milenar que integra posturas, respiração e meditação para fortalecer o corpo, acalmar a mente e elevar o espírito.',
    icon: YogaIcon,
    benefits: ['Flexibilidade e força', 'Concentração mental', 'Paz interior'],
  },
  {
    id: 3,
    title: 'Aromaterapia',
    description:
      'Uso terapêutico de óleos essenciais naturais para promover saúde física, equilíbrio emocional e harmonia ambiental.',
    icon: AromatherapyIcon,
    benefits: ['Relaxamento natural', 'Alívio da ansiedade', 'Ambiente harmonioso'],
  },
  {
    id: 4,
    title: 'Constelação Familiar',
    description:
      'Método terapêutico que revela dinâmicas ocultas no sistema familiar, permitindo a resolução de conflitos e padrões repetitivos.',
    icon: FamilyConstellationIcon,
    benefits: ['Harmonia familiar', 'Libertação de padrões', 'Relacionamentos saudáveis'],
  },
];

const Services: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [activeService, setActiveService] = useState<number | null>(null);

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];
    
    const ctx = gsap.context(() => {
      // Animação do título
      const titleTrigger = ScrollTrigger.create({
        trigger: titleRef.current,
        start: 'top 80%',
        onEnter: () => {
          const items = titleRef.current?.querySelectorAll('.animate-item');
          if (items && items.length > 0) {
            gsap.fromTo(
              items,
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out' }
            );
          }
        },
        once: true,
      });
      triggers.push(titleTrigger);

      // Animação dos cards - efeito de convergência
      const cardsTrigger = ScrollTrigger.create({
        trigger: cardsRef.current,
        start: 'top 75%',
        onEnter: () => {
          const cards = cardsRef.current?.querySelectorAll('.service-card');
          if (cards) {
            gsap.fromTo(
              cards,
              { 
                y: 60, 
                opacity: 0,
                scale: 0.9
              },
              { 
                y: 0, 
                opacity: 1,
                scale: 1,
                duration: 0.8, 
                stagger: 0.15, 
                ease: 'power2.out' 
              }
            );
          }
        },
        once: true,
      });
      triggers.push(cardsTrigger);
    }, sectionRef);

    return () => {
      triggers.forEach(trigger => trigger.kill());
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="servicos"
      ref={sectionRef}
      className="relative w-full py-24 lg:py-32 bg-cream overflow-hidden"
    >
      {/* Elemento decorativo central - representando o Ikigai */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-5 pointer-events-none">
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <circle cx="200" cy="200" r="180" fill="none" stroke="#d4b896" strokeWidth="1" />
          <circle cx="200" cy="200" r="140" fill="none" stroke="#a8b8a6" strokeWidth="1" />
          <circle cx="200" cy="200" r="100" fill="none" stroke="#d4b896" strokeWidth="1" />
        </svg>
      </div>

      <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 relative z-10">
        {/* Título da Seção */}
        <div ref={titleRef} className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
          <span className="animate-item inline-block font-body text-sm tracking-widest uppercase text-gold mb-4">
            Meus Serviços
          </span>
          <h2 className="animate-item font-display text-3xl sm:text-4xl lg:text-5xl text-dark mb-6">
            O Jardim de Ikigai
          </h2>
          <p className="animate-item font-body text-gray leading-relaxed">
            Descubra o propósito que conecta o que você ama, o que o mundo 
            precisa, no que você é bom e pelo que pode ser remunerado.
          </p>
        </div>

        {/* Grid de Serviços */}
        <div
          ref={cardsRef}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto"
        >
          {services.map((service) => {
            const IconComponent = service.icon;
            const isActive = activeService === service.id;

            return (
              <div
                key={service.id}
                className="service-card group relative opacity-0"
                onMouseEnter={() => setActiveService(service.id)}
                onMouseLeave={() => setActiveService(null)}
              >
                <div
                  className={`relative h-full p-6 lg:p-8 bg-white/50 backdrop-blur-sm border border-dark/5 rounded-3xl transition-all duration-500 ${
                    isActive
                      ? 'bg-white shadow-glow border-gold/30 scale-105'
                      : 'hover:bg-white hover:shadow-soft'
                  }`}
                >
                  {/* Ícone */}
                  <div
                    className={`mb-6 transition-all duration-500 ${
                      isActive ? 'scale-110' : ''
                    }`}
                  >
                    <div
                      className={`w-16 h-16 flex items-center justify-center rounded-2xl transition-all duration-500 ${
                        isActive
                          ? 'bg-gold/20 text-gold'
                          : 'bg-dark/5 text-dark group-hover:bg-gold/10 group-hover:text-gold'
                      }`}
                    >
                      <IconComponent size={32} />
                    </div>
                  </div>

                  {/* Título */}
                  <h3 className="font-display text-xl lg:text-2xl text-dark mb-3">
                    {service.title}
                  </h3>

                  {/* Descrição */}
                  <p className="font-body text-sm text-gray leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Benefícios */}
                  <ul className="space-y-2">
                    {service.benefits.map((benefit, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 font-body text-xs text-gray"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                            isActive ? 'bg-gold' : 'bg-sage'
                          }`}
                        />
                        {benefit}
                      </li>
                    ))}
                  </ul>

                  {/* Hover indicator */}
                  <div
                    className={`absolute bottom-6 right-6 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-500 ${
                      isActive
                        ? 'bg-gold text-cream opacity-100'
                        : 'bg-dark/5 text-dark opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <span className="text-sm">→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 lg:mt-16">
          <a
            href="#contato"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center px-8 py-4 bg-dark text-cream font-body text-sm font-medium rounded-full hover:bg-gold transition-all duration-300 hover:shadow-glow group"
          >
            Escolha sua jornada
            <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;
