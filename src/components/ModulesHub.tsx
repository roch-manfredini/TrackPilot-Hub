import React from 'react';
import { Bike, Footprints, Mountain, ChevronDown, CheckCircle2, Clock, Wrench, Watch } from 'lucide-react';
import { MODULES } from '../data/modules';
import { ModuleInfo } from '../types';

export const ModulesHub: React.FC = () => {

  const getDisciplineIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bike':
        return <Bike className="w-6 h-6" />;
      case 'Footprints':
        return <Footprints className="w-6 h-6" />;
      case 'Mountain':
        return <Mountain className="w-6 h-6" />;
      default:
        return <Bike className="w-6 h-6" />;
    }
  };

  const renderBadge = (module: ModuleInfo) => {
    switch (module.status) {
      case 'available':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500/15 text-brand-300 border border-brand-500/30">
            <span className="w-2 h-2 rounded-full bg-brand-neon animate-pulse"></span>
            {module.statusLabel}
          </span>
        );
      case 'soon':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" />
            {module.statusLabel}
          </span>
        );
      case 'dev':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/15 text-sky-300 border border-sky-500/30">
            <Wrench className="w-3.5 h-3.5" />
            {module.statusLabel}
          </span>
        );
    }
  };

  return (
    <section id="modules" className="relative py-24 sm:py-32 border-t border-white/[0.06] overflow-hidden scroll-mt-16">
      
      {/* Background Photography Layer (Alpine Cycling Switchbacks - Offset Right, Strava-style) */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <picture className="absolute inset-0 w-full h-full">
          <source srcSet="/images/swiss_mountain_cyclist.webp" type="image/webp" />
          <img
            src="/images/swiss_mountain_cyclist.jpg"
            alt="Cyclisme sur route en montagne alpine"
            className="w-full h-full object-cover object-[center_right] sm:object-[85%_center] opacity-90 contrast-[1.05]"
          />
        </picture>
        {/* Subtle overall dark tint allowing the photo to remain clear and vibrant */}
        <div className="absolute inset-0 bg-dark-950/40" />
        {/* Top & bottom edge fades to melt smoothly into pure dark-950 above & below */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-dark-950 via-dark-950/80 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-dark-950 via-dark-950/80 to-transparent" />
        {/* Subtle horizontal gradient to softly balance text area on left while leaving right vista open */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950/60 via-transparent to-transparent" />
        {/* Ambient emerald glow on the scenery side */}
        <div className="absolute top-1/4 -right-24 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-400 mb-3">
            <span>Disciplines & Pratiques</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            À chaque pratique ses repères, construits avec vous.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Sur deux roues ou sur deux jambes, chaque pratique a ses exigences propres. Nous adaptons ces outils en échangeant directement avec les sportifs sur le terrain, pour apporter des aides simples et concrètes.
          </p>
        </div>

        {/* 2 Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {MODULES.map((module) => {
            const isAvailable = module.status === 'available';

            return (
              <div 
                key={module.id} 
                className={`relative flex flex-col justify-between rounded-2xl glass-panel p-6 sm:p-8 transition-all duration-200 ${
                  isAvailable 
                    ? 'border-brand-500/40 shadow-glow-sm hover:border-brand-500/70 hover:bg-dark-850/90' 
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Available highlight top border tag */}
                {isAvailable && (
                  <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-md bg-brand-neon text-dark-950 font-mono text-[10px] font-black uppercase tracking-wider shadow-sm">
                    Disponible en ligne
                  </div>
                )}

                <div>
                  {/* Top Bar with Icon & Status Badge */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className={`p-3 rounded-xl border ${
                      isAvailable 
                        ? 'bg-brand-500/15 border-brand-500/30 text-brand-400' 
                        : module.status === 'soon'
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        : 'bg-sky-500/10 border-sky-500/20 text-sky-400'
                    }`}>
                      {getDisciplineIcon(module.iconName)}
                    </div>
                    {renderBadge(module)}
                  </div>

                  {/* Title & Tagline */}
                  <div className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-1">
                    {module.discipline}
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
                    {module.title}
                  </h3>
                  <p className="text-sm font-medium text-emerald-400 mb-4">
                    {module.tagline}
                  </p>

                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    {module.description}
                  </p>

                  {/* Key Highlights list */}
                  <div className="space-y-2.5 pt-4 border-t border-white/[0.08] mb-6">
                    <div className="text-xs uppercase font-mono tracking-wider text-slate-400 font-semibold mb-2">
                      Fonctionnalités Clés :
                    </div>
                    {module.highlights.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${
                          isAvailable ? 'text-brand-400' : 'text-slate-500'
                        }`} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Metrics Specs Pill */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-dark-950/60 border border-white/5 mb-6 text-center">
                    {module.metrics.map((m, idx) => (
                      <div key={idx} className="p-1">
                        <div className="text-[10px] uppercase font-mono text-slate-500">{m.label}</div>
                        <div className="text-xs font-bold text-slate-200 tabular-nums mt-0.5">{m.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Area */}
                <div className="pt-4 border-t border-white/[0.08]">
                  {isAvailable ? (
                    <a
                      href="#guide-installation"
                      className="group flex items-center justify-center gap-2.5 w-full py-3 px-5 rounded-xl font-bold text-sm text-dark-950 bg-gradient-to-r from-brand-neon to-brand-400 hover:from-brand-400 hover:to-brand-300 active:scale-[0.98] shadow-glow-sm transition-all duration-150"
                    >
                      <span>Installer {module.title}</span>
                      <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                    </a>
                  ) : (
                    <div className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl font-semibold text-sm text-amber-300/90 bg-amber-500/10 border border-amber-500/20 select-none">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>Bientôt disponible</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* Clarification Box: Preparation & Guidance vs GPS Track/Stats Recording */}
        <div className="mt-12 max-w-4xl mx-auto p-5 sm:p-6 rounded-2xl glass-panel border border-white/10 bg-dark-850/60 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
            <Watch className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Un positionnement clair : un plan de route global, pas un carnet de statistiques</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              TrackPilot n’est pas un outil d’enregistrement d’activités ni un carnet de statistiques (type Strava ou Garmin Connect). Son but n’est pas seulement de tracer un GPX ou de vous guider, mais de réunir toute votre sortie dans un véritable plan de route — relief, météo, eau et effort. <strong className="text-white font-medium">Vos montres et compteurs GPS restent indispensables</strong> pour enregistrer vos traces réelles, vos données de performance (fréquence cardiaque, puissance, allure) et votre historique d'entraînement.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
