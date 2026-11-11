import React from 'react';
import { Layers, Wind, Flame, Droplets, CheckCircle, ArrowRight } from 'lucide-react';
import { TECH_PILLARS } from '../data/modules';

export const TechPillars: React.FC = () => {
  const getPillarIcon = (name: string) => {
    switch (name) {
      case 'Layers':
        return <Layers className="w-6 h-6 text-brand-400" />;
      case 'Wind':
        return <Wind className="w-6 h-6 text-teal-400" />;
      case 'Flame':
        return <Flame className="w-6 h-6 text-amber-400" />;
      case 'Droplets':
        return <Droplets className="w-6 h-6 text-sky-400" />;
      default:
        return <Layers className="w-6 h-6 text-brand-400" />;
    }
  };

  return (
    <section id="tech" className="relative py-20 sm:py-28 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-400 mb-3">
            <span>Rigueur Scientifique & Technologie Embarquée</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Les 4 Piliers Technologiques de TrackPilot.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Fini les prévisions statiques et les estimations au doigt mouillé. TrackPilot fusionne télémétrie spatiale, modèles météo et physiologie humaine.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TECH_PILLARS.map((pillar) => (
            <div
              key={pillar.id}
              className="group relative rounded-2xl glass-panel p-7 sm:p-9 border border-white/[0.08] hover:border-brand-500/40 transition-all duration-200"
            >
              {/* Pillar Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-dark-850 border border-white/10 group-hover:border-brand-500/40 transition-colors">
                  {getPillarIcon(pillar.iconName)}
                </div>
                <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-dark-850 text-slate-300 border border-white/10">
                  {pillar.badge}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-1">
                {pillar.title}
              </h3>
              <div className="text-xs font-mono font-medium text-emerald-400 uppercase tracking-wider mb-4">
                {pillar.subtitle}
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                {pillar.description}
              </p>

              {/* Technical bullet points */}
              <div className="space-y-2 pt-4 border-t border-white/[0.06]">
                {pillar.technicalDetails.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-400">
                    <CheckCircle className="w-3.5 h-3.5 mt-0.5 text-brand-400 shrink-0" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Banner to Cycling App */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl glass-panel border border-brand-500/30 bg-gradient-to-r from-brand-950/40 via-dark-900 to-dark-950 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-xs font-mono uppercase text-brand-400 font-semibold tracking-wider">
              Déjà éprouvé par des centaines d’athlètes
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              Prêt à tester ces 4 piliers sur votre prochaine sortie vélo ?
            </h4>
            <p className="text-sm text-slate-300 mt-1">
              Aucune inscription requise. Glissez simplement votre fichier GPX pour analyser votre parcours.
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
