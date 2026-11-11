import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Menu, X, Compass, Radio } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <a href="#" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg">
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
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a 
              href="#modules" 
              className="hover:text-white transition-colors duration-150 py-1"
            >
              Modules
            </a>
            <a 
              href="#cockpit" 
              className="hover:text-white transition-colors duration-150 py-1"
            >
              Cockpit & Données
            </a>
            <a 
              href="#tech" 
              className="hover:text-white transition-colors duration-150 py-1"
            >
              Piliers Technologiques
            </a>
            <a 
              href="#simulator" 
              className="hover:text-white transition-colors duration-150 py-1"
            >
              Simulateur
            </a>
            <a 
              href="#vision" 
              className="hover:text-white transition-colors duration-150 py-1"
            >
              Vision
            </a>
          </nav>

          {/* Quick CTA & Status */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-400 px-2.5 py-1 rounded-full bg-dark-850/80 border border-white/5">
              <Radio className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
              <span>Réseau v1.4</span>
            </div>

            <a
              href="https://cycling.trackpilot.fit"
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-dark-950 bg-gradient-to-r from-brand-neon to-brand-400 hover:from-brand-400 hover:to-brand-300 active:scale-[0.98] rounded-xl shadow-glow-sm transition-all duration-150"
            >
              <span>Lancer TrackPilot Cycling</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex sm:hidden items-center gap-2">
            <a
              href="https://cycling.trackpilot.fit"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-semibold text-dark-950 bg-brand-400 rounded-lg"
            >
              Cycling
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
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-dark-850"
            >
              Modules
            </a>
            <a
              href="#cockpit"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-dark-850"
            >
              Cockpit & Données
            </a>
            <a
              href="#tech"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-dark-850"
            >
              Piliers Technologiques
            </a>
            <a
              href="#simulator"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-dark-850"
            >
              Simulateur
            </a>
            <a
              href="#vision"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-dark-850"
            >
              Vision
            </a>
            <div className="pt-2">
              <a
                href="https://cycling.trackpilot.fit"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-semibold text-dark-950 bg-brand-400 rounded-xl"
              >
                <span>Accéder à TrackPilot Cycling</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
