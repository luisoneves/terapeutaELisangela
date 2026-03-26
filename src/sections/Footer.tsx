import React from 'react';
import { LotusIcon } from '../components/icons/TherapyIcons';
import { Instagram, MessageCircle, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { href: '#inicio', label: 'Início' },
    { href: '#sobre', label: 'Sobre' },
    { href: '#servicos', label: 'Serviços' },
    { href: '#beneficios', label: 'Benefícios' },
    { href: '#depoimentos', label: 'Depoimentos' },
    { href: '#contato', label: 'Contato' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full py-12 bg-dark border-t border-cream/10">
      <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#inicio');
            }}
            className="flex items-center gap-2 mb-8 group"
          >
            <LotusIcon
              size={24}
              className="text-gold transition-transform duration-300 group-hover:scale-110"
            />
            <span className="font-display text-lg text-cream tracking-wide">
              Ana Silva
            </span>
          </a>

          {/* Navegação */}
          <nav className="flex flex-wrap justify-center gap-6 mb-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className="relative font-body text-sm text-cream/60 hover:text-gold transition-colors duration-300 group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-1/2 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full group-hover:left-0" />
              </a>
            ))}
          </nav>

          {/* Redes sociais */}
          <div className="flex gap-4 mb-8">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-cream/5 text-cream/60 hover:bg-gold hover:text-dark transition-all duration-300"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-cream/5 text-cream/60 hover:bg-gold hover:text-dark transition-all duration-300"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>

          {/* Divider */}
          <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-cream/20 to-transparent mb-8" />

          {/* Copyright */}
          <div className="flex items-center gap-1 font-body text-xs text-cream/40">
            <span>© {currentYear} Ana Silva Terapeuta.</span>
            <span className="flex items-center gap-1">
              Feito com <Heart className="w-3 h-3 text-gold" /> e dedicação.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
