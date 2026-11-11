import React from 'react';
import { Compass, ArrowUpRight, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.08] bg-dark-950 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/[0.08]">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-dark-850 border border-brand-500/40 text-brand-400">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-lg font-extrabold text-white">TrackPilot<span className="text-brand-400 font-mono text-sm">.fit</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              La suite d’applications web haute précision pour l’orientation, l’analyse météo et la physiologie d’endurance.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 w-fit">
              <span className="w-2 h-2 rounded-full bg-brand-neon animate-pulse"></span>
              <span>Services opérationnels</span>
            </div>
          </div>

          {/* Column 1: Modules */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-300 font-semibold mb-4">
              Modules TrackPilot
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a 
                  href="https://cycling.trackpilot.fit" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  <span>TrackPilot Cycling</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-brand-500/20 text-brand-300 rounded font-mono">Live</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2 text-slate-500 cursor-not-allowed">
                  <span>TrackPilot Running</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded font-mono">Bientôt</span>
                </span>
              </li>
              <li>
                <span className="flex items-center gap-2 text-slate-500 cursor-not-allowed">
                  <span>TrackPilot Trekking</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded font-mono">En dev</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Column 2: Navigation & Tech */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-300 font-semibold mb-4">
              Technologie
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><a href="#cockpit" className="hover:text-white transition-colors">Cockpit Télémétrie</a></li>
              <li><a href="#tech" className="hover:text-white transition-colors">Moteur Météo Prédictive</a></li>
              <li><a href="#tech" className="hover:text-white transition-colors">Cibles Nutritionnelles Glucides</a></li>
              <li><a href="#simulator" className="hover:text-white transition-colors">Simulateur de Pente & Vent</a></li>
              <li><a href="#vision" className="hover:text-white transition-colors">Local-First & Confidentialité</a></li>
            </ul>
          </div>

          {/* Column 3: Standards & Formats */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-300 font-semibold mb-4">
              Formats & Écosystème
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Totalement agnostique et compatible avec tous vos appareils :
            </p>
            <div className="flex flex-wrap gap-1.5 text-[11px] font-mono text-slate-400">
              <span className="px-2 py-1 rounded bg-dark-900 border border-white/5">.GPX</span>
              <span className="px-2 py-1 rounded bg-dark-900 border border-white/5">.FIT</span>
              <span className="px-2 py-1 rounded bg-dark-900 border border-white/5">Garmin</span>
              <span className="px-2 py-1 rounded bg-dark-900 border border-white/5">Wahoo</span>
              <span className="px-2 py-1 rounded bg-dark-900 border border-white/5">Strava</span>
              <span className="px-2 py-1 rounded bg-dark-900 border border-white/5">Komoot</span>
              <span className="px-2 py-1 rounded bg-dark-900 border border-white/5">Karoo</span>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} TrackPilot.fit • Développé avec</span>
            <Heart className="w-3.5 h-3.5 text-brand-400 fill-brand-400" />
            <span>pour les sports d'endurance.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:text-white transition-colors">Hébergé sur Firebase Hosting</span>
            <span className="text-slate-600">•</span>
            <span className="hover:text-white transition-colors">Confidentialité Locale</span>
            <span className="text-slate-600">•</span>
            <a 
              href="https://cycling.trackpilot.fit" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>cycling.trackpilot.fit</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
