import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin, Send, Instagram, MessageCircle, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { siteConfig } from '@/config/site';
import { formConfig } from '@/config/form';

gsap.registerPlugin(ScrollTrigger);

/**
 * Contact Section
 * ==============
 * 
 * Este componente exibe a seção de contato com:
 * - Informações de contato (telefone, email, endereço)
 * - Links para redes sociais
 * - Formulário de contato integrado com Formspree
 * - Opção de WhatsApp como fallback
 * 
 * CONFIGURAÇÃO:
 * See src/config/form.ts para configurar email e WhatsApp
 */

const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // ======================================
  // ESTADOS DO FORMULÁRIO
  // ======================================
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // Estado para controlar o dialog de sucesso
  // Este dialog aparece após o formulário ser enviado com sucesso
  const [showDialog, setShowDialog] = useState(false);
  
  // Estado para carregar as informações do site
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];
    
    const ctx = gsap.context(() => {
      // Animação da onda subindo
      const sectionTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 90%',
        onEnter: () => {
          gsap.fromTo(
            sectionRef.current,
            { backgroundColor: '#f8f7f2' },
            { backgroundColor: '#2d2d2d', duration: 1, ease: 'power2.out' }
          );
        },
        once: true,
      });
      triggers.push(sectionTrigger);

      // Animação do blob
      const blobTrigger = ScrollTrigger.create({
        trigger: blobRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(
            blobRef.current,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1, ease: 'power2.out' }
          );
        },
        once: true,
      });
      triggers.push(blobTrigger);

      // Animação dos campos do formulário
      const formTrigger = ScrollTrigger.create({
        trigger: formRef.current,
        start: 'top 75%',
        onEnter: () => {
          const fields = formRef.current?.querySelectorAll('.form-field');
          if (fields) {
            gsap.fromTo(
              fields,
              { x: -30, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
            );
          }
        },
        once: true,
      });
      triggers.push(formTrigger);

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
              { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out' }
            );
          }
        },
        once: true,
      });
      triggers.push(contentTrigger);

      // Animação contínua do blob
      gsap.to(blobRef.current, {
        borderRadius: '60% 40% 30% 70% / 50% 60% 40% 50%',
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, sectionRef);

    return () => {
      triggers.forEach(trigger => trigger.kill());
      ctx.revert();
    };
  }, []);

  /**
   * handleSubmit
   * ============
   * 
   * Enviar dados para o Formspree
   * 
   * FLUXO:
   * 1. Impede o comportamento padrão do formulário
   * 2. Envia dados para o Formspree via fetch
   * 3. Se sucesso, exibe dialog de confirmação
   * 4. Se enableWhatsappFallback=true, abre WhatsApp como backup
   * 5. Limpa o formulário
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // ======================================
      // ENVIO PARA FORMSPREE
      // ======================================
      // O Formspree espera os dados em formato JSON
      // A resposta é um objeto com o resultado da submissão
      const response = await fetch(
        `https://formspree.io/f/${formConfig.formspreeFormId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Este header é importante para o Formspree aceitar JSON
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            // Nome do campo no Formspree
            name: formData.name,
            // Email do cliente
            email: formData.email,
            // Telefone (opcional)
            phone: formData.phone,
            // Mensagem
            message: formData.message,
          }),
        }
      );

      // ======================================
      // TRATAMENTO DA RESPOSTA
      // ======================================
      if (response.ok) {
        // Sucesso: exibe dialog de confirmação
        setShowDialog(true);
        
        // ======================================
        // FALLBACK WHATSAPP (opcional)
        // ======================================
        // Se enabled, abre o WhatsApp como backup
        // Útil caso o email não seja verificado rapidamente
        if (formConfig.enableWhatsappFallback && formConfig.whatsappNumber !== 'SEU_NUMERO_AQUI') {
          // Pequeno delay para não interrupir a experiência do usuário
          setTimeout(() => {
            const message = encodeURIComponent(formConfig.whatsappDefaultMessage);
            const whatsappUrl = `https://wa.me/${formConfig.whatsappNumber}?text=${message}`;
            window.open(whatsappUrl, '_blank');
          }, 1500);
        }
        
        // Limpa o formulário após envio bem-sucedido
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        // Erro no envio: log no console para debug
        console.error('Erro ao enviar formulário:', response.statusText);
        alert('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente ou entre em contato pelo WhatsApp.');
      }
    } catch (error) {
      // Erro de conexão: sugere WhatsApp como alternativa
      console.error('Erro de conexão:', error);
      alert('Não foi possível enviar sua mensagem. Por favor, entre em contato pelo WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * handleChange
   * ============
   * Atualiza o estado do formulário conforme o usuário digita
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ======================================
  // DADOS DE CONTATO (da config)
  // ======================================
  const contactInfo = [
    { 
      icon: Phone, 
      label: 'Telefone', 
      // Uses config or falls back to siteConfig
      value: formConfig.whatsappNumber !== 'SEU_NUMERO_AQUI' 
        ? `+${formConfig.whatsappNumber}` 
        : siteConfig.contact.phone 
    },
    { 
      icon: Mail, 
      label: 'Email', 
      // Uses config or falls back to siteConfig
      value: formConfig.formspreeFormId !== 'SEU_FORM_ID_AQUI'
        ? 'Formulário ativo'
        : siteConfig.contact.email 
    },
    { icon: MapPin, label: 'Endereço', value: siteConfig.contact.address },
  ];

  return (
    <section
      id="contato"
      ref={sectionRef}
      className="relative w-full py-24 lg:py-32 bg-dark overflow-hidden"
    >
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-sage/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
          {/* Conteúdo */}
          <div ref={contentRef}>
            <span className="animate-item inline-block font-body text-sm tracking-widest uppercase text-gold mb-4">
              Contato
            </span>
            <h2 className="animate-item font-display text-3xl sm:text-4xl lg:text-5xl text-cream mb-6">
              {siteConfig.contactSection.title}
            </h2>
            <p className="animate-item font-body text-cream/70 leading-relaxed mb-8">
              {siteConfig.contactSection.description}
            </p>

            {/* Informações de contato */}
            <div className="space-y-4 mb-8">
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className="animate-item flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-cream/10 text-gold group-hover:bg-gold group-hover:text-dark transition-all duration-300">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-body text-xs text-cream/50 uppercase tracking-wider">
                      {item.label}
                    </p>
                    <p className="font-body text-sm text-cream">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Redes sociais */}
            <div className="animate-item">
              <p className="font-body text-xs text-cream/50 uppercase tracking-wider mb-4">
                Siga nas redes
              </p>
              <div className="flex gap-3">
                <a
                  href={siteConfig.contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-cream/10 text-cream hover:bg-gold hover:text-dark transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                
                {/* ======================================
                    BOTÃO WHATSAPP (usa config)
                    ====================================== */}
                <a
                  href={
                    // Se configurado, usa o link com mensagem
                    // Se não, usa o link básico do siteConfig
                    formConfig.whatsappNumber !== 'SEU_NUMERO_AQUI'
                      ? `https://wa.me/${formConfig.whatsappNumber}?text=${encodeURIComponent(formConfig.whatsappDefaultMessage)}`
                      : siteConfig.contact.whatsapp
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-cream/10 text-cream hover:bg-gold hover:text-dark transition-all duration-300"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Formulário em Blob */}
          <div className="relative">
            <div
              ref={blobRef}
              className="relative bg-cream/5 backdrop-blur-sm p-8 lg:p-10 opacity-0"
              style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}
            >
              <form 
                ref={formRef} 
                onSubmit={handleSubmit} 
                className="space-y-6"
                // Configuração do Formspree (não mostra na UI, apenas para o form)
                data-formspree-form-id={formConfig.formspreeFormId}
              >
                {/* Nome */}
                <div className="form-field opacity-0">
                  <label className="block font-body text-xs text-cream/50 uppercase tracking-wider mb-2">
                    {siteConfig.contactSection.form.name}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="w-full bg-transparent border-b border-cream/20 text-cream font-body py-2 focus:outline-none transition-colors duration-300"
                      placeholder={siteConfig.contactSection.form.namePlaceholder}
                    />
                    <div
                      className={`absolute bottom-0 left-0 h-px bg-gold transition-all duration-500 ${
                        focusedField === 'name' ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="form-field opacity-0">
                  <label className="block font-body text-xs text-cream/50 uppercase tracking-wider mb-2">
                    {siteConfig.contactSection.form.email}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="w-full bg-transparent border-b border-cream/20 text-cream font-body py-2 focus:outline-none transition-colors duration-300"
                      placeholder={siteConfig.contactSection.form.emailPlaceholder}
                    />
                    <div
                      className={`absolute bottom-0 left-0 h-px bg-gold transition-all duration-500 ${
                        focusedField === 'email' ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                </div>

                {/* Telefone */}
                <div className="form-field opacity-0">
                  <label className="block font-body text-xs text-cream/50 uppercase tracking-wider mb-2">
                    {siteConfig.contactSection.form.phone}
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-transparent border-b border-cream/20 text-cream font-body py-2 focus:outline-none transition-colors duration-300"
                      placeholder={siteConfig.contactSection.form.phonePlaceholder}
                    />
                    <div
                      className={`absolute bottom-0 left-0 h-px bg-gold transition-all duration-500 ${
                        focusedField === 'phone' ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                </div>

                {/* Mensagem */}
                <div className="form-field opacity-0">
                  <label className="block font-body text-xs text-cream/50 uppercase tracking-wider mb-2">
                    {siteConfig.contactSection.form.message}
                  </label>
                  <div className="relative">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      required
                      rows={3}
                      className="w-full bg-transparent border-b border-cream/20 text-cream font-body py-2 focus:outline-none transition-colors duration-300 resize-none"
                      placeholder={siteConfig.contactSection.form.messagePlaceholder}
                    />
                    <div
                      className={`absolute bottom-0 left-0 h-px bg-gold transition-all duration-500 ${
                        focusedField === 'message' ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                </div>

                {/* Botão de envio */}
                <div className="form-field opacity-0 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full py-4 bg-gold text-dark font-body text-sm font-medium rounded-full overflow-hidden transition-all duration-300 hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        // Estado de carregamento
                        <>
                          <span className="animate-pulse">Enviando...</span>
                        </>
                      ) : (
                        // Estado normal
                        <>
                          {siteConfig.contactSection.form.submit}
                          <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-cream transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================
          DIALOG DE CONFIRMAÇÃO
          Aparece após envio bem-sucedido
          ====================================== */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-cream border-none">
          <DialogHeader>
            {/* Ícone de sucesso */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center">
                <Check className="w-8 h-8 text-gold" />
              </div>
            </div>
            <DialogTitle className="font-display text-2xl text-dark text-center">
              {siteConfig.contactSection.dialog.title}
            </DialogTitle>
            <DialogDescription className="font-body text-gray text-center">
              {siteConfig.contactSection.dialog.description}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Contact;
