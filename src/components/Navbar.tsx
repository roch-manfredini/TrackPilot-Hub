import React, { useState, useEffect } from 'react';
import { Menu, X, Compass } from 'lucide-react';

interface NavbarProps {
  activeView?: 'home' | 'plans';
  onNavigateHome?: (hash?: string) => void;
  onNavigatePlans?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView = 'home',
  onNavigateHome,
  onNavigatePlans,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    setMobileMenuOpen(false);
    if (activeView === 'plans' && onNavigateHome) {
      e.preventDefault();
      onNavigateHome(hash);
    }
  };

  const handlePlansClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setMobileMenuOpen(false);
    if (onNavigatePlans) {
      e.preventDefault();
      onNavigatePlans();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled 
          ? 'bg-dark-950/85 backdrop-blur-md border-b border-white/[0.08] py-3.5 shadow-card' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Brand */}
          <a
            href="#top"
            onClick={(e) => handleSectionClick(e, '')}
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-dark-850 border border-brand-500/30 group-hover:border-brand-500/70 transition-colors shadow-glow-sm">
              <Compass className="w-5 h-5 text-brand-400 group-hover:rotate-45 transition-transform duration-300" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-neon"></span>
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-white">TrackPilot</span>
              <span className="text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-brand-500/10 text-brand-400 border border-brand-500/20 font-mono">
                .fit
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-7 text-sm font-medium text-slate-300">
            <a 
              href="#modules" 
              onClick={(e) => handleSectionClick(e, '#modules')}
              className="hover:text-white transition-colors duration-150 py-1"
            >
              Modules
            </a>
            <a
              href="/plans"
              onClick={handlePlansClick}
              className={`transition-colors duration-150 py-1 ${
                activeView === 'plans'
                  ? 'text-brand-300 font-semibold'
                  : 'hover:text-white'
              }`}
            >
              Plans publics
            </a>
            <a 
              href="#formats" 
              onClick={(e) => handleSectionClick(e, '#formats')}
              className="hover:text-white transition-colors duration-150 py-1"
            >
              Profil & Cockpit
            </a>
            <a 
              href="#tech" 
              onClick={(e) => handleSectionClick(e, '#tech')}
              className="hover:text-white transition-colors duration-150 py-1"
            >
              Fonctionnalités
            </a>
            <a 
              href="#installation" 
              onClick={(e) => handleSectionClick(e, '#installation')}
              className="hover:text-white transition-colors duration-150 py-1"
            >
              Installation
            </a>
            <a 
              href="#vision" 
              onClick={(e) => handleSectionClick(e, '#vision')}
              className="hover:text-white transition-colors duration-150 py-1"
            >
              Esprit du Projet
            </a>
            <a 
              href="#faq" 
              onClick={(e) => handleSectionClick(e, '#faq')}
              className="hover:text-white transition-colors duration-150 py-1"
            >
              FAQ
            </a>
          </nav>

          {/* Quick CTA & Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            <a
              href="#gratuite"
              onClick={(e) => handleSectionClick(e, '#gratuite')}
              title="Pourquoi TrackPilot est gratuit et voué à le rester"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono font-semibold text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 hover:border-brand-500/50 transition-all duration-150 whitespace-nowrap"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-neon shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline md:hidden lg:inline">Gratuit · Écosystème Libre</span>
              <span className="hidden md:inline lg:hidden">100% Gratuit</span>
            </a>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <a
              href="#gratuite"
              onClick={(e) => handleSectionClick(e, '#gratuite')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold text-brand-300 bg-brand-500/10 border border-brand-500/30 whitespace-nowrap"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-neon shrink-0" aria-hidden="true" />
              <span>100% Gratuit</span>
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-dark-850 border border-white/10 text-slate-300 hover:text-white hover:bg-dark-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-4 pt-4 border-t border-white/10 pb-4 space-y-3">
            <a
              href="#modules"
              onClick={(e) => handleSectionClick(e, '#modules')}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-dark-850"
            >
              Modules
            </a>
            <a
              href="/plans"
              onClick={handlePlansClick}
              className={`block px-3 py-2 rounded-lg text-base font-medium hover:bg-dark-850 ${
                activeView === 'plans' ? 'text-brand-300' : 'text-slate-300 hover:text-white'
              }`}
            >
              Plans publics
            </a>
            <a
              href="#formats"
              onClick={(e) => handleSectionClick(e, '#formats')}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-dark-850"
            >
              Profil & Cockpit
            </a>
            <a
              href="#tech"
              onClick={(e) => handleSectionClick(e, '#tech')}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-dark-850"
            >
              Fonctionnalités
            </a>
            <a
              href="#installation"
              onClick={(e) => handleSectionClick(e, '#installation')}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-dark-850"
            >
              Installation
            </a>
            <a
              href="#vision"
              onClick={(e) => handleSectionClick(e, '#vision')}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-dark-850"
            >
              Esprit du Projet
            </a>
            <a
              href="#faq"
              onClick={(e) => handleSectionClick(e, '#faq')}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-dark-850"
            >
              FAQ
            </a>
            <a
              href="#gratuite"
              onClick={(e) => handleSectionClick(e, '#gratuite')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-brand-300 hover:text-white hover:bg-dark-850"
            >
              <span className="w-2 h-2 rounded-full bg-brand-neon shrink-0" aria-hidden="true" />
              <span>Gratuit · Écosystème Libre</span>
            </a>
            <div className="pt-2">
              <a
                href="#modules"
                onClick={(e) => handleSectionClick(e, '#modules')}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-semibold text-dark-950 bg-brand-400 rounded-xl"
              >
                <span>Explorer les modules</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
