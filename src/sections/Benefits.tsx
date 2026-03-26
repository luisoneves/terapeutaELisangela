import React, { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { Check, Sun, Moon, Wind } from 'lucide-react';

const benefits = [
  {
    icon: Sun,
    title: 'Clareza Mental',
    description: 'Reduza a neblina mental e ganhe foco para suas decisões diárias.',
  },
  {
    icon: Moon,
    title: 'Sono Reparador',
    description: 'Durma melhor e acorde renovado para aproveitar cada dia.',
  },
  {
    icon: Wind,
    title: 'Equilíbrio Emocional',
    description: 'Gerencie suas emoções com mais facilidade e serenidade.',
  },
];

const Benefits: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const col3Ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

      // Paralaxe das colunas de imagens
      const col1 = col1Ref.current;
      const col2 = col2Ref.current;
      const col3 = col3Ref.current;

      if (col1 && col2 && col3) {
        // Coluna 1 - move para cima mais rápido
        gsap.to(col1, {
          y: -80,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });

        // Coluna 2 - move para baixo (direção oposta)
        gsap.to(col2, {
          y: 60,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });

        // Coluna 3 - move para cima mais lento
        gsap.to(col3, {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      // Animação do conteúdo
      const contentTrigger = ScrollTrigger.create({
        trigger: contentRef.current,
        start: 'top 75%',
        onEnter: () => {
          const items = contentRef.current?.querySelectorAll('.animate-item');
          if (items && items.length > 0) {
            gsap.fromTo(
              items,
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out' }
            );
          }
        },
        once: true,
      });
      triggers.push(contentTrigger);
    }, sectionRef);

    return () => {
      triggers.forEach(trigger => trigger.kill());
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="beneficios"
      ref={sectionRef}
      className="relative w-full py-24 lg:py-32 bg-cream overflow-hidden"
    >
      {/* Gradient masks */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-cream to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream to-transparent z-10 pointer-events-none" />

      <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16">
        {/* Título */}
        <div ref={titleRef} className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
          <span className="animate-item inline-block font-body text-sm tracking-widest uppercase text-gold mb-4">
            Benefícios
          </span>
          <h2 className="animate-item font-display text-3xl sm:text-4xl lg:text-5xl text-dark mb-6">
            A Galeria de Luz
          </h2>
          <p className="animate-item font-body text-gray leading-relaxed">
            A terapia holística oferece uma abordagem integrada para o bem-estar, 
            harmonizando corpo, mente e espírito.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Colunas de Imagens - Cascata */}
          <div className="relative h-[500px] lg:h-[600px] hidden lg:block">
            <div className="absolute inset-0 flex gap-4">
              {/* Coluna 1 */}
              <div ref={col1Ref} className="flex-1 flex flex-col gap-4">
                <div className="relative overflow-hidden rounded-3xl">
                  <img
                    src="/benefit-1.jpg"
                    alt="Meditação na praia"
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="relative overflow-hidden rounded-3xl">
                  <img
                    src="/benefit-2.jpg"
                    alt="Yoga restaurativa"
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Coluna 2 - Central e mais alta */}
              <div ref={col2Ref} className="flex-1 flex flex-col gap-4 pt-12">
                <div className="relative overflow-hidden rounded-3xl">
                  <img
                    src="/benefit-3.jpg"
                    alt="Yoga na natureza"
                    className="w-full h-72 object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="relative overflow-hidden rounded-3xl">
                  <img
                    src="/benefit-1.jpg"
                    alt="Momento de paz"
                    className="w-full h-56 object-cover hover:scale-105 transition-transform duration-700"
                    style={{ objectPosition: 'center 30%' }}
                  />
                </div>
              </div>

              {/* Coluna 3 */}
              <div ref={col3Ref} className="flex-1 flex flex-col gap-4 pt-6">
                <div className="relative overflow-hidden rounded-3xl">
                  <img
                    src="/benefit-2.jpg"
                    alt="Bem-estar"
                    className="w-full h-52 object-cover hover:scale-105 transition-transform duration-700"
                    style={{ objectPosition: 'center 70%' }}
                  />
                </div>
                <div className="relative overflow-hidden rounded-3xl">
                  <img
                    src="/benefit-3.jpg"
                    alt="Conexão com a natureza"
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700"
                    style={{ objectPosition: 'center 60%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Versão mobile - imagem única */}
          <div className="lg:hidden relative h-64 rounded-3xl overflow-hidden">
            <img
              src="/benefit-1.jpg"
              alt="Benefícios da terapia holística"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Conteúdo */}
          <div ref={contentRef}>
            <h3 className="animate-item font-display text-2xl lg:text-3xl text-dark mb-6">
              Transforme sua vida de dentro para fora
            </h3>

            <p className="animate-item font-body text-gray leading-relaxed mb-8">
              A terapia holística trabalha em múltiplas dimensões do seu ser, 
              promovendo mudanças profundas e duradouras. Cada sessão é uma 
              oportunidade de reconexão com sua essência mais verdadeira.
            </p>

            {/* Lista de benefícios */}
            <div className="space-y-6 mb-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="animate-item flex gap-4 group"
                >
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-gold/10 text-gold group-hover:bg-gold group-hover:text-cream transition-all duration-300">
                    <benefit.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-lg text-dark mb-1">
                      {benefit.title}
                    </h4>
                    <p className="font-body text-sm text-gray">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Lista adicional */}
            <div className="animate-item grid grid-cols-2 gap-3">
              {[
                'Redução do estresse',
                'Maior autoconhecimento',
                'Melhora na qualidade de vida',
                'Fortalecimento da imunidade',
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 font-body text-sm text-gray"
                >
                  <Check className="w-4 h-4 text-sage flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
