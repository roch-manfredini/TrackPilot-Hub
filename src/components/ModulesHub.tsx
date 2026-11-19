import React from 'react';
import { Bike, Footprints, ChevronDown, CheckCircle2, Clock, Wrench, Watch, Compass, ArrowRight, Smartphone, Navigation } from 'lucide-react';
import { MODULES } from '../data/modules';
import { ModuleInfo } from '../types';
import { recordHubEvent } from '../services/historyService';
import { BrandLogo } from './BrandLogo';

interface ModulesHubProps {
  onOpenPlans?: () => void;
}

export const ModulesHub: React.FC<ModulesHubProps> = ({ onOpenPlans }) => {

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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-trail-500/15 text-trail-300 border border-trail-500/35">
            <Clock className="w-3.5 h-3.5" />
            {module.statusLabel}
          </span>
        );
      case 'dev':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500/15 text-brand-300 border border-brand-500/30">
            <Wrench className="w-3.5 h-3.5" />
            {module.statusLabel}
          </span>
        );
    }
  };

  return (
    <section id="modules" className="relative py-24 sm:py-32 border-t border-white/[0.06] bg-dark-950 scroll-mt-16">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-400 mb-3">
            <span>Disciplines & Pratiques</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            À chaque pratique ses repères sur le terrain.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Sur deux roues ou sur deux jambes, chaque pratique a ses exigences propres. Chaque outil est adapté aux réalités du terrain pour apporter des aides simples et concrètes.
          </p>
        </div>

        {/* 2 Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {MODULES.map((module) => {
            const isAvailable = module.status === 'available';
            const isTrail = module.id === 'trail';

            return (
              <div 
                key={module.id} 
                className={`relative flex flex-col justify-between rounded-2xl glass-panel p-6 sm:p-8 transition-all duration-200 ${
                  isAvailable 
                    ? 'border-brand-500/40 shadow-glow-sm hover:border-brand-500/70 hover:bg-dark-850/90' 
                    : isTrail
                    ? 'border-trail-500/35 hover:border-trail-400/55 hover:bg-dark-850/90'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  {/* Top Bar with Icon & Status Badge */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-xl border overflow-hidden shrink-0 bg-[#08090d] ${
                      isAvailable 
                        ? 'border-brand-500/30' 
                        : isTrail
                        ? 'border-trail-500/35'
                        : 'border-brand-500/20'
                    }`}>
                      <BrandLogo variant={isTrail ? 'trail' : 'cycling'} />
                    </div>
                    {renderBadge(module)}
                  </div>

                  {/* Title & Tagline */}
                  <div className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-1">
                    {module.discipline}
                  </div>
                  <h3 className={`text-2xl font-bold tracking-tight mb-2 ${
                    isTrail ? 'text-trail-300' : 'text-brand-300'
                  }`}>
                    {module.title}
                  </h3>
                  <p className={`text-sm font-medium mb-4 ${
                    isTrail ? 'text-trail-400' : 'text-emerald-400'
                  }`}>
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
                          isAvailable ? 'text-brand-400' : isTrail ? 'text-trail-400' : 'text-slate-500'
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
                      onClick={() =>
                        recordHubEvent({
                          type: 'cta_click',
                          target: `modules_install_${module.id}`,
                        })
                      }
                      className="group flex items-center justify-center gap-2.5 w-full py-3 px-5 rounded-xl font-bold text-sm text-dark-950 bg-gradient-to-r from-brand-neon to-brand-400 hover:from-brand-400 hover:to-brand-300 active:scale-[0.98] shadow-glow-sm transition-all duration-150"
                    >
                      <span>Installer {module.title}</span>
                      <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                    </a>
                  ) : (
                    <div className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl font-semibold text-sm text-trail-300 bg-trail-500/10 border border-trail-500/25 select-none">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>Bientôt disponible</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* Clarification Box: Complementary Role & Two Field Usage Modes */}
        <div className="mt-12 max-w-4xl mx-auto p-5 sm:p-6 rounded-2xl glass-panel border border-white/10 bg-dark-850/60 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/25 text-brand-400 shrink-0">
              <Watch className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">
                Un positionnement clair : le complément terrain de votre montre ou compteur GPS
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong className="text-white font-medium">Vos montres et compteurs GPS restent indispensables</strong> pour enregistrer vos traces, vos performances (fréquence cardiaque, puissance, allure) et votre historique. Côté smartphone, grâce à son démarrage instantané, vous utilisez TrackPilot de deux façons :
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-dark-900/70 border border-white/[0.08] flex items-start gap-3">
              <div className="p-2 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400 shrink-0 mt-0.5">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    Dans la poche ou le sac
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-slate-400 shrink-0" aria-hidden="true">
                    <Bike className="w-3.5 h-3.5" />
                    <Footprints className="w-3.5 h-3.5" />
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  À vélo comme à pied, sortez le smartphone uniquement quand une question se pose : son démarrage express permet de faire le point sur votre plan de route en quelques secondes, puis de le ranger.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-dark-900/70 border border-white/[0.08] flex items-start gap-3">
              <div className="p-2 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400 shrink-0 mt-0.5">
                <Navigation className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    Sur le guidon ou en main
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-slate-400 shrink-0" aria-hidden="true">
                    <Bike className="w-3.5 h-3.5" />
                    <Footprints className="w-3.5 h-3.5" />
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Fixé sur le guidon ou tenu à la main pendant la marche, profitez d'un écran de guidage nettement plus grand et lisible que celui d'une montre ou d'un compteur GPS.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Discreet Public Plans Preview Callout */}
        <div className="mt-4 max-w-4xl mx-auto p-4 sm:px-6 rounded-2xl glass-panel border border-brand-500/20 bg-brand-500/[0.04] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/25 text-brand-400 shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong className="text-white font-medium">Aperçu des plans publics :</strong>{' '}
              filtrez rapidement les tracés et profils partagés avant de les ouvrir dans leur application dédiée.
            </p>
          </div>
          <a
            href="/plans"
            onClick={(e) => {
              recordHubEvent({ type: 'cta_click', target: 'modules_open_plans' });
              if (onOpenPlans) {
                e.preventDefault();
                onOpenPlans();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 transition-colors shrink-0 whitespace-nowrap"
          >
            <span>Consulter les plans</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
};
