import { useEffect } from 'react';

// =============================================================================
// IMPORTS
// =============================================================================
// GSAP centralizado - registra ScrollTrigger uma única vez
// Deve ser importado antes de qualquer uso do gsap
import { ScrollTrigger, cleanupGSAP } from '@/lib/gsap';

import Navigation from './components/Navigation';
import Hero from './sections/Hero';
import About from './sections/About';
import Services from './sections/Services';
import Benefits from './sections/Benefits';
import Testimonials from './sections/Testimonials';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

// =============================================================================
// COMPONENT: App
// =============================================================================
// Componente principal da aplicação
// 
// Este arquivo configura o comportamento global da aplicação:
// - GSAP (importado via '@/lib/gsap' para side-effect)
// - ScrollTrigger refresh em resize
// 
// ESTRUTURA:
// - Navigation (header fixo)
// - main (conteúdo principal com todas as seções)
// - Footer (rodapé)

function App() {
  useEffect(() => {
    // =============================================================================
    // SCROLLTRIGGER REFRESH
    // =============================================================================
    // Atualiza o ScrollTrigger quando a janela é redimensionada
    // Isso garante que as animações continuem funcionando corretamente
    // após mudanças de tamanho da janela
    
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // =============================================================================
    // CLEANUP
    // =============================================================================
    // Remove o listener e limpa os triggers ao desmontar o componente
    // Isso previne vazamentos de memória
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cleanupGSAP();
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
