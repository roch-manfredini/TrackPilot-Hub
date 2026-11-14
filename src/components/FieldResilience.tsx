import React from 'react';
import { Mountain } from 'lucide-react';
import { StatelessShowcase } from './StatelessShowcase';

export const FieldResilience: React.FC = () => {
  return (
    <section id="resilience" className="relative py-24 sm:py-32 border-t border-white/[0.06] bg-dark-950 scroll-mt-16">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30">
            <Mountain className="w-3.5 h-3.5 text-brand-neon" />
            <span>Épreuve du Terrain &amp; Architecture Stateless</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Sur un col à 2 000 m ou en zone blanche,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
              votre plan de route ne doit jamais vous lâcher.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
            Froid, pluie ou coupure de batterie au km 60 : TrackPilot repose sur une projection spatiale sans état (stateless), sans historique chronologique fragile ni besoin de réseau.
          </p>
        </div>

        {/* Stateless vs Traditional Comparison */}
        <StatelessShowcase />

      </div>
    </section>
  );
};
