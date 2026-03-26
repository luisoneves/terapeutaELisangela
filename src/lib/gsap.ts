/**
 * GSAP Configuration
 * =================
 * 
 * Centralização da configuração do GSAP para evitar duplicação.
 * 
 * ANTERIORMENTE:
 * - gsap.registerPlugin(ScrollTrigger) repetido em 6 arquivos
 * - ScrollTrigger.config() disperso no App.tsx
 * 
 * AGORA:
 * - Registro único e centralizado
 * - Configuração global em um único lugar
 * 
 * USO:
 * import { gsap, ScrollTrigger } from '@/lib/gsap';
 * 
 * =============================================================================
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Inicializa o GSAP com as configurações padrão do projeto
 * 
 * Este arquivo deve ser importado uma única vez (ex: no main.tsx ou App.tsx)
 * para garantir que o ScrollTrigger esteja registrado antes de qualquer uso.
 */

// Registra o plugin ScrollTrigger
// O GSAP ignora se já estiver registrado, então é seguro chamar múltiplas vezes
gsap.registerPlugin(ScrollTrigger);

/**
 * Configuração global do ScrollTrigger
 * 
 * ignoreMobileResize: Evita re-renderizações desnecessárias em mobile
 * Isso melhora performance em dispositivos móveis
 */
ScrollTrigger.config({
  ignoreMobileResize: true,
});

/**
 * Configura o comportamento padrão do GSAP
 */
gsap.defaults({
  ease: 'power2.out',
});

// Exporta para uso nos componentes
export { gsap, ScrollTrigger };

/**
 * cleanupGSAP
 * ==========
 * Função utilitária para limpar todos os triggers do ScrollTrigger
 * Útil para usar no useEffect cleanup de cada seção
 */
export function cleanupGSAP() {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
}
