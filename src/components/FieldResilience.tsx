import React from 'react';
import { Lightbulb } from 'lucide-react';
import { StatelessShowcase } from './StatelessShowcase';

export const FieldResilience: React.FC = () => {
  return (
    <section id="pourquoi" className="relative py-24 sm:py-32 border-t border-white/[0.06] bg-dark-950 scroll-mt-16">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30">
            <Lightbulb className="w-3.5 h-3.5 text-brand-neon" />
            <span>Le Sens du Projet</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Pourquoi TrackPilot existe :{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
              proposer une autre approche du guidage.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
            Deux philosophies différentes, deux usages complémentaires : comparez le fonctionnement des applications GPS tout-en-un et le moteur sans état (stateless) de TrackPilot.
          </p>
        </div>

        {/* Stateless vs Traditional Comparison */}
        <StatelessShowcase />

      </div>
    </section>
  );
};
