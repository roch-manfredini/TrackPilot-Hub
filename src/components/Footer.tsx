import React from 'react';
import { Compass, ArrowUpRight, Heart, Mail } from 'lucide-react';

interface FooterProps {
  onOpenContact?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenContact }) => {
  return (
    <footer className="border-t border-white/[0.08] bg-dark-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/[0.06]">
          
          {/* Brand & Brief Tagline */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-dark-850 border border-brand-500/40 text-brand-400">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-base font-extrabold text-white">
                TrackPilot<span className="text-brand-400 font-mono text-xs">.fit</span>
              </span>
            </div>
            <span className="hidden sm:inline text-slate-600">•</span>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Des outils web simples et partagés pour préparer vos sorties vélo, trail et rando.
            </p>
          </div>

          {/* Quick Access Links */}
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 text-xs text-slate-400 font-mono">
            <a 
              href="https://cycling.trackpilot.fit" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-emerald-400 transition-colors flex items-center gap-1 font-medium"
            >
              <span>TrackPilot Cycling</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            
            <button
              type="button"
              onClick={onOpenContact}
              className="hover:text-teal-300 text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
              title="Contacter l'équipe"
            >
              <Mail className="w-3.5 h-3.5 text-teal-400" />
              <span>contact@trackpilot.fit</span>
            </button>
          </div>

        </div>

        {/* Bottom Bar: Clean single line without wrapping on desktop, centered on mobile */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-mono text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:whitespace-nowrap">
            <span>© {new Date().getFullYear()} TrackPilot.fit • Développé avec</span>
            <Heart className="w-3.5 h-3.5 text-brand-400 fill-brand-400 inline" />
            <span>pour les passionnés d'endurance.</span>
          </div>

          <a 
            href="https://cycling.trackpilot.fit" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center justify-center gap-1 whitespace-nowrap"
          >
            <span>cycling.trackpilot.fit</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>

      </div>
    </footer>
  );
};
