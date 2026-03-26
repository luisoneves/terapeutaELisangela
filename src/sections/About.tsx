import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Award, Leaf } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const butterflyRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];
    
    const ctx = gsap.context(() => {
      // Animação da imagem
      const imageTrigger = ScrollTrigger.create({
        trigger: imageRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(
            imageRef.current,
            { x: -50, opacity: 0 },
            { x: 0, opacity: 1, duration: 1, ease: 'power2.out' }
          );
        },
        once: true,
      });
      triggers.push(imageTrigger);

      // Animação da borboleta - efeito de pouso
      const butterflyTrigger = ScrollTrigger.create({
        trigger: butterflyRef.current,
        start: 'top 85%',
        onEnter: () => {
          gsap.fromTo(
            butterflyRef.current,
            { y: -100, x: 50, opacity: 0, rotation: -20 },
            { y: 0, x: 0, opacity: 1, rotation: 0, duration: 1.5, ease: 'power2.out' }
          );
        },
        once: true,
      });
      triggers.push(butterflyTrigger);

      // Animação do conteúdo
      const contentTrigger = ScrollTrigger.create({
        trigger: contentRef.current,
        start: 'top 75%',
        onEnter: () => {
          const elements = contentRef.current?.querySelectorAll('.animate-item');
          if (elements) {
            gsap.fromTo(
              elements,
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out' }
            );
          }
        },
        once: true,
      });
      triggers.push(contentTrigger);

      // Animação das estatísticas
      const statsTrigger = ScrollTrigger.create({
        trigger: statsRef.current,
        start: 'top 85%',
        onEnter: () => {
          const elements = statsRef.current?.querySelectorAll('.stat-item');
          if (elements) {
            gsap.fromTo(
              elements,
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
            );
          }
        },
        once: true,
      });
      triggers.push(statsTrigger);
    }, sectionRef);

    return () => {
      triggers.forEach(trigger => trigger.kill());
      ctx.revert();
    };
  }, []);

  const stats = [
    { number: '10+', label: 'Anos de Experiência', icon: Award },
    { number: '500+', label: 'Clientes Atendidos', icon: Heart },
    { number: '4', label: 'Modalidades', icon: Leaf },
  ];

  return (
    <section
      id="sobre"
      ref={sectionRef}
      className="relative w-full py-24 lg:py-32 bg-cream overflow-hidden"
    >
      {/* Elemento decorativo de fundo */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gold/5 to-transparent pointer-events-none" />

      <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Imagem com Borboleta */}
          <div ref={imageRef} className="relative opacity-0">
            {/* Imagem principal */}
            <div className="relative max-w-md mx-auto lg:mx-0">
              <div
                className="overflow-hidden shadow-soft"
                style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}
              >
                <img
                  src="/therapist-portrait.jpg"
                  alt="Ana Silva - Terapeuta Holística"
                  className="w-full h-auto object-cover aspect-[3/4] hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Borboleta decorativa */}
              <img
                ref={butterflyRef}
                src="/butterfly.png"
                alt="Borboleta"
                className="absolute -top-8 -right-8 w-32 h-32 lg:w-40 lg:h-40 opacity-0 z-10 animate-breathe"
              />

              {/* Elementos decorativos */}
              <div className="absolute -bottom-6 -left-6 w-20 h-20 border-2 border-gold/30 rounded-full" />
              <div className="absolute top-1/2 -right-4 w-3 h-3 bg-sage/40 rounded-full" />
            </div>
          </div>

          {/* Conteúdo */}
          <div ref={contentRef} className="lg:pl-8">
            <span className="animate-item inline-block font-body text-sm tracking-widest uppercase text-gold mb-4">
              Sobre Mim
            </span>

            <h2 className="animate-item font-display text-3xl sm:text-4xl lg:text-5xl text-dark mb-6 leading-tight">
              Uma jornada de cura e transformação
            </h2>

            <div className="animate-item space-y-4 text-gray font-body leading-relaxed mb-8">
              <p>
                Olá, sou Ana Silva, terapeuta holística dedicada a ajudar você a 
                encontrar equilíbrio e bem-estar em todas as áreas da vida. Minha 
                jornada na terapia holística começou há mais de 10 anos, quando 
                descobri o poder transformador de abordagens integrativas que 
                consideram o ser humano como um todo — corpo, mente e espírito.
              </p>
              <p>
                Acredito que cada pessoa carrega dentro de si a capacidade de cura 
                e transformação. Meu trabalho é criar um espaço seguro e acolhedor 
                onde você possa se reconectar com sua essência, liberar bloqueios 
                e descobrir novos caminhos para uma vida mais plena e significativa.
              </p>
              <p>
                Formada em diversas modalidades terapêuticas, incluindo Reiki, 
                Yoga, Aromaterapia e Constelação Familiar, ofereço um atendimento 
                personalizado que respeita sua individualidade e necessidades únicas.
              </p>
            </div>

            {/* Botão CTA */}
            <div className="animate-item">
              <a
                href="#contato"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center px-6 py-3 border-2 border-dark text-dark font-body text-sm font-medium rounded-full hover:bg-dark hover:text-cream transition-all duration-300 group"
              >
                Vamos conversar
                <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div
          ref={statsRef}
          className="grid grid-cols-3 gap-6 lg:gap-12 mt-20 lg:mt-24 max-w-3xl mx-auto"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-item text-center opacity-0"
            >
              <div className="flex justify-center mb-3">
                <stat.icon className="w-5 h-5 text-gold" />
              </div>
              <div className="font-display text-3xl lg:text-4xl text-dark mb-1">
                {stat.number}
              </div>
              <div className="font-body text-xs lg:text-sm text-gray">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
