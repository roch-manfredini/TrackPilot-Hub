import React from 'react';
import { Route, Navigation, Layers, Wind, Flame, Droplets, CheckCircle } from 'lucide-react';
import { TECH_PILLARS } from '../data/modules';
import { SectionBackground } from './SectionBackground';

export const TechPillars: React.FC = () => {
  const getPillarIcon = (name: string) => {
    switch (name) {
      case 'Route':
        return <Route className="w-6 h-6 text-emerald-400" />;
      case 'Layers':
        return <Layers className="w-6 h-6 text-brand-400" />;
      case 'Wind':
        return <Wind className="w-6 h-6 text-teal-400" />;
      case 'Navigation':
        return <Navigation className="w-6 h-6 text-cyan-400" />;
      case 'Droplets':
        return <Droplets className="w-6 h-6 text-sky-400" />;
      case 'Flame':
        return <Flame className="w-6 h-6 text-amber-400" />;
      default:
        return <Layers className="w-6 h-6 text-brand-400" />;
    }
  };

  return (
    <section id="tech" className="relative py-20 sm:py-28 border-t border-white/[0.06] overflow-hidden scroll-mt-16">
      <SectionBackground
        webpSrc="/images/winding_mountain_cyclists.webp"
        jpgSrc="/images/winding_mountain_cyclists.jpg"
        alt="Lacets de col de montagne et cyclistes"
        imgClassName="object-[center_left] sm:object-[20%_center]"
        scrimClassName="bg-dark-950/45"
        horizontalGradientClassName="bg-gradient-to-l from-dark-950/60 via-transparent to-transparent"
        glowClassName="bottom-1/4 -left-24 bg-teal-500/10"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-400 mb-3">
            <span>Les 6 Piliers Fondateurs</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Une globalité pensée comme un vrai plan de route.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Créer un GPX et suivre une ligne sur une carte ne suffit pas : TrackPilot rassemble chaque dimension de votre sortie dans un seul plan de route — tracé, vent relatif, points d’eau, effort et guidage hors-ligne.
          </p>
        </div>

        {/* 6 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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

      </div>
    </section>
  );
};
