import React from 'react';
import { ArrowRight } from 'lucide-react';
import { StatelessShowcase } from './StatelessShowcase';

export const StatelessSection: React.FC = () => {
  return (
    <section id="stateless-section" className="relative py-20 sm:py-28 border-t border-white/[0.06] bg-dark-950 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-400 mb-3 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
            <span>Architecture & Robustesse</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Zéro crash, zéro anxiété au guidon.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Comparez le fonctionnement des applications traditionnelles avec le moteur sans état de TrackPilot, et testez vous-même la reprise instantanée avec le simulateur ci-dessous.
          </p>
        </div>

        {/* Stateless Architecture Showcase Widget & Simulator */}
        <StatelessShowcase />

        {/* Bottom Banner to Cycling App */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl glass-panel border border-brand-500/30 bg-gradient-to-r from-brand-950/40 via-dark-900 to-dark-950 flex flex-col md:flex-row items-center justify-between gap-6 shadow-card">
          <div>
            <div className="text-xs font-mono uppercase text-brand-400 font-semibold tracking-wider">
              En cours de validation par un panel de testeurs experts de la discipline
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              Prêt à tester cette fiabilité sur votre prochaine sortie vélo ?
            </h4>
            <p className="text-sm text-slate-300 mt-1">
              Testez librement dès maintenant : tracez un itinéraire ou chargez votre fichier GPX pour lancer l’analyse.
            </p>
          </div>
          <a
            href="https://cycling.trackpilot.fit"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-dark-950 bg-brand-neon hover:bg-brand-400 active:scale-[0.98] transition-all duration-150 shadow-glow-sm"
          >
            <span>Tester sur TrackPilot Cycling</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
};
