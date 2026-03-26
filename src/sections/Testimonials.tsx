import React, { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Maria Fernanda',
    role: 'Empresária',
    image: '/testimonial-1.jpg',
    text: 'As sessões de Reiki com a Ana transformaram minha relação com o estresse. Hoje consigo lidar com os desafios do dia a dia com muito mais calma e clareza. Sou eternamente grata por esse trabalho tão especial.',
  },
  {
    id: 2,
    name: 'Carlos Eduardo',
    role: 'Professor',
    image: '/testimonial-2.jpg',
    text: 'A Constelação Familiar me ajudou a entender padrões que se repetiam na minha vida há anos. Foi um processo profundo de cura que mudou minha perspectiva sobre relacionamentos e sobre mim mesmo.',
  },
  {
    id: 3,
    name: 'Patrícia Lima',
    role: 'Artista',
    image: '/testimonial-3.jpg',
    text: 'A combinação de Yoga e Aromaterapia trouxe um equilíbrio que eu não sabia que era possível. Ana tem um dom especial de criar espaços seguros para a transformação acontecer naturalmente.',
  },
];

const Testimonials: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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

      // Animação do slider
      const sliderTrigger = ScrollTrigger.create({
        trigger: sliderRef.current,
        start: 'top 75%',
        onEnter: () => {
          gsap.fromTo(
            sliderRef.current,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power2.out' }
          );
        },
        once: true,
      });
      triggers.push(sliderTrigger);
    }, sectionRef);

    return () => {
      triggers.forEach(trigger => trigger.kill());
      ctx.revert();
    };
  }, []);

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);

    const direction = index > currentIndex ? 1 : -1;
    const currentCard = sliderRef.current?.querySelector('.testimonial-card');
    
    if (!currentCard) {
      setIsAnimating(false);
      return;
    }

    // Animação de saída
    gsap.to(currentCard, {
      rotateY: direction * -15,
      x: direction * -100,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        setCurrentIndex(index);
        // Animação de entrada
        gsap.fromTo(
          currentCard,
          { rotateY: direction * 15, x: direction * 100, opacity: 0 },
          {
            rotateY: 0,
            x: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => setIsAnimating(false),
          }
        );
      },
    });
  };

  const nextSlide = () => {
    const nextIndex = (currentIndex + 1) % testimonials.length;
    goToSlide(nextIndex);
  };

  const prevSlide = () => {
    const prevIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    goToSlide(prevIndex);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section
      id="depoimentos"
      ref={sectionRef}
      className="relative w-full py-24 lg:py-32 bg-cream overflow-hidden"
    >
      {/* Elemento decorativo */}
      <div className="absolute top-1/2 left-0 w-64 h-64 -translate-y-1/2 -translate-x-1/2 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-64 h-64 -translate-y-1/2 translate-x-1/2 bg-sage/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 relative z-10">
        {/* Título */}
        <div ref={titleRef} className="text-center max-w-2xl mx-auto mb-16">
          <span className="animate-item inline-block font-body text-sm tracking-widest uppercase text-gold mb-4">
            Depoimentos
          </span>
          <h2 className="animate-item font-display text-3xl sm:text-4xl lg:text-5xl text-dark mb-6">
            Vozes em Harmonia
          </h2>
          <p className="animate-item font-body text-gray leading-relaxed">
            Conheça as histórias de transformação de quem já vivenciou 
            o poder da terapia holística.
          </p>
        </div>

        {/* Slider */}
        <div
          ref={sliderRef}
          className="relative max-w-4xl mx-auto opacity-0"
          style={{ perspective: '1000px' }}
        >
          {/* Card principal */}
          <div
            className="testimonial-card relative bg-white rounded-3xl p-8 lg:p-12 shadow-soft"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Aspas decorativas */}
            <Quote className="absolute top-6 right-6 w-12 h-12 text-gold/20" />

            <div className="grid lg:grid-cols-[200px_1fr] gap-8 items-center">
              {/* Avatar */}
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-gold/20">
                    <img
                      src={currentTestimonial.image}
                      alt={`Foto de ${currentTestimonial.name}`}
                      width={128}
                      height={128}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                    <span className="text-cream text-sm">✦</span>
                  </div>
                </div>
                <h4 className="font-display text-lg text-dark">
                  {currentTestimonial.name}
                </h4>
                <p className="font-body text-sm text-gray">
                  {currentTestimonial.role}
                </p>
              </div>

              {/* Texto */}
              <div>
                <p className="font-body text-base lg:text-lg text-dark/80 leading-relaxed italic">
                  "{currentTestimonial.text}"
                </p>
              </div>
            </div>
          </div>

          {/* Navegação */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevSlide}
              disabled={isAnimating}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-dark/20 text-dark hover:bg-dark hover:text-cream hover:border-dark transition-all duration-300 disabled:opacity-50"
              aria-label="Depoimento anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Indicadores */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  disabled={isAnimating}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-8 bg-gold'
                      : 'bg-dark/20 hover:bg-dark/40'
                  }`}
                  aria-label={`Ir para depoimento ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              disabled={isAnimating}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-dark/20 text-dark hover:bg-dark hover:text-cream hover:border-dark transition-all duration-300 disabled:opacity-50"
              aria-label="Próximo depoimento"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cards laterais visíveis (desktop) */}
        <div className="hidden lg:flex justify-between max-w-6xl mx-auto mt-8 -px-8">
          {testimonials.map((testimonial, index) => {
            if (index === currentIndex) return null;
            return (
              <div
                key={testimonial.id}
                onClick={() => goToSlide(index)}
                className="w-48 opacity-40 hover:opacity-70 cursor-pointer transition-opacity duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={testimonial.image}
                      alt={`Foto de ${testimonial.name}`}
                      width={40}
                      height={40}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-display text-sm text-dark">{testimonial.name}</p>
                    <p className="font-body text-xs text-gray">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
