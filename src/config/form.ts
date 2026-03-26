/**
 * Configuração do formulário de contato
 * ======================================
 * 
 * INSTRUÇÕES DE CONFIGURAÇÃO:
 * 
 * 1. EMAIL (Formspree):
 *    - Acesse https://formspree.io/
 *    - Crie uma conta gratuita
 *    - Crie um novo formulário
 *    - Copie o ID do formulário (ex: xqkrgqrq)
 *    - Cole no campo 'formspreeFormId' abaixo
 * 
 * 2. WHATSAPP:
 *    - No campo 'whatsappNumber', coloque seu número com código do país
 *    - Exemplo: '5511999999999' (para +55 11 99999-9999)
 *    - O código já deve incluir o 55 (Brasil)
 * 
 * ======================================
 */

export const formConfig = {
  // ======================================
  // CONFIGURAÇÃO DO FORMSPREE (Email)
  // ======================================
  // Substitua pelo seu Form ID do Formspree
  // Obtain at: https://formspree.io/forms/<your-form-id>/settings
  formspreeFormId: 'SEU_FORM_ID_AQUI',

  // ======================================
  // CONFIGURAÇÃO DO WHATSAPP
  // ======================================
  // Seu número com código do país (sem + ou espaços)
  // Exemplo para (11) 99999-9999: '5511999999999'
  whatsappNumber: 'SEU_NUMERO_AQUI',

  // ======================================
  // MENSAGEM PADRÃO DO WHATSAPP
  // ======================================
  // Esta mensagem será pré-preenchida quando o cliente clicar no botão WhatsApp
  whatsappDefaultMessage: 'Olá! Gostaria de saber mais sobre as sessões de terapia holística.',

  // ======================================
  // CONFIGURAÇÃO DE FALLBACK
  // ======================================
  // Se true, quando o formulário for enviado, também abre o WhatsApp
  // Útil como backup caso o email não funcione
  enableWhatsappFallback: true,
};
