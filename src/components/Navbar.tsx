import React, { useState, useEffect } from 'react';
import { Menu, X, Mail } from 'lucide-react';
import { recordHubEvent } from '../services/historyService';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  activeView?: 'home' | 'plans' | 'admin';
  onNavigateHome?: (hash?: string) => void;
  onNavigatePlans?: () => void;
}

const SECTION_LINKS_BEFORE_PLANS = [
  { href: '#pourquoi', label: 'Pourquoi ?' },
  { href: '#modules', label: 'Modules' },
  { href: '#formats', label: 'Profil & Cockpit' },
  { href: '#tech', label: 'Fonctionnalités' },
  { href: '#installation', label: 'Installation' },
] as const;

const SECTION_LINKS_AFTER_PLANS = [
  { href: '#vision', label: 'Esprit du Projet' },
  { href: '#faq', label: 'FAQ' },
] as const;

export const Navbar: React.FC<NavbarProps> = ({
  activeView = 'home',
  onNavigateHome,
  onNavigatePlans,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    setMobileMenuOpen(false);
    recordHubEvent({
      type: 'cta_click',
      target: hash ? `navbar_${hash.replace('#', '')}` : 'navbar_logo',
    });
    if (activeView !== 'home' && onNavigateHome) {
      e.preventDefault();
      onNavigateHome(hash);
    }
  };

  const handlePlansClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setMobileMenuOpen(false);
    recordHubEvent({ type: 'cta_click', target: 'navbar_plans' });
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

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const headerSurfaceClass = mobileMenuOpen
    ? isScrolled
      ? 'bg-dark-950 md:bg-dark-950/85 md:backdrop-blur-md border-b border-white/10 py-3.5 shadow-card'
      : 'bg-dark-950 md:bg-transparent border-b border-white/10 md:border-b-0 py-5 shadow-card md:shadow-none'
    : isScrolled
      ? 'bg-dark-950/85 backdrop-blur-md border-b border-white/[0.08] py-3.5 shadow-card'
      : 'bg-transparent py-5';

  return (
    <>
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-dark-950/80 backdrop-blur-sm"
          aria-hidden="true"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${headerSurfaceClass}`}
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Brand */}
          <a
            href="#top"
            onClick={(e) => handleSectionClick(e, '')}
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#08090d] border border-brand-500/30 group-hover:border-brand-500/70 transition-colors shadow-glow-sm overflow-hidden">
              <BrandLogo variant="hub" className="w-full h-full transition-transform duration-200 group-hover:scale-105" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-white">TrackPilot</span>
              <span className="text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-brand-500/10 text-brand-400 border border-brand-500/20 font-mono">
                .fit
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav aria-label="Navigation principale" className="hidden md:flex items-center gap-3 lg:gap-5 xl:gap-6 text-[13px] lg:text-sm font-medium text-slate-300 whitespace-nowrap">
            {SECTION_LINKS_BEFORE_PLANS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleSectionClick(e, link.href)}
                className="hover:text-white transition-colors duration-150 py-1"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/plans"
              onClick={handlePlansClick}
              aria-current={activeView === 'plans' ? 'page' : undefined}
              className={`transition-colors duration-150 py-1 ${
                activeView === 'plans'
                  ? 'text-brand-300 font-semibold'
                  : 'hover:text-white'
              }`}
            >
              Plans publics
            </a>
            {SECTION_LINKS_AFTER_PLANS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleSectionClick(e, link.href)}
                className="hover:text-white transition-colors duration-150 py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Quick Contact & Mobile Menu Trigger */}
          <div className="flex items-center gap-2">
            <a
              href="#contact"
              onClick={(e) => handleSectionClick(e, '#contact')}
              aria-label="Contacter l'auteur"
              title="Contacter l'auteur"
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-brand-500/15 hover:bg-brand-500/25 text-brand-400 hover:text-brand-300 border border-brand-500/35 hover:border-brand-400/60 shadow-glow-sm transition-all duration-150 ease-out active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <Mail className="w-4 h-4" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-menu"
              className="md:hidden p-2 rounded-lg bg-dark-850 border border-white/10 text-slate-300 hover:text-white hover:bg-dark-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              aria-label={mobileMenuOpen ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <nav
            id="mobile-nav-menu"
            aria-label="Navigation mobile"
            className="md:hidden mt-3 rounded-2xl bg-dark-900 border border-white/10 p-3 shadow-card max-h-[calc(100dvh-5.5rem)] overflow-y-auto space-y-1"
          >
            {SECTION_LINKS_BEFORE_PLANS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleSectionClick(e, link.href)}
                className="block px-3.5 py-2.5 rounded-xl text-base font-medium text-slate-100 hover:text-white hover:bg-dark-800 active:bg-dark-750 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/plans"
              onClick={handlePlansClick}
              aria-current={activeView === 'plans' ? 'page' : undefined}
              className={`block px-3.5 py-2.5 rounded-xl text-base font-medium transition-colors ${
                activeView === 'plans'
                  ? 'text-brand-300 font-semibold bg-brand-500/10 border border-brand-500/20'
                  : 'text-slate-100 hover:text-white hover:bg-dark-800 active:bg-dark-750'
              }`}
            >
              Plans publics
            </a>
            {SECTION_LINKS_AFTER_PLANS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleSectionClick(e, link.href)}
                className="block px-3.5 py-2.5 rounded-xl text-base font-medium text-slate-100 hover:text-white hover:bg-dark-800 active:bg-dark-750 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
    </>
  );
};
