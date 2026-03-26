import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navigation from './components/Navigation';
import Hero from './sections/Hero';
import About from './sections/About';
import Services from './sections/Services';
import Benefits from './sections/Benefits';
import Testimonials from './sections/Testimonials';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

// Registrar plugins GSAP
gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // Configuração global do ScrollTrigger
    ScrollTrigger.config({
      ignoreMobileResize: true,
    });

    // Atualizar ScrollTrigger em resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Limpar ao desmontar
    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-cream">
      {/* Navegação */}
      <Navigation />

      {/* Conteúdo Principal */}
      <main>
        <Hero />
        <About />
        <Services />
        <Benefits />
        <Testimonials />
        <Contact />
      </main>

      {/* Rodapé */}
      <Footer />
    </div>
  );
}

export default App;
