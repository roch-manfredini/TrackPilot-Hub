import React from 'react';
import { Monitor, Smartphone, CheckCircle2, Minus, Maximize2, Lightbulb } from 'lucide-react';

export const ScreenVersions: React.FC = () => {
  return (
    <div id="formats" className="mt-12 sm:mt-14 mx-auto max-w-5xl scroll-mt-24 text-left">
      {/* Compact Header */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-brand-400 mb-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
          <Maximize2 className="w-3 h-3" />
          <span>Une seule application, adaptée à votre écran</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Une seule et même application : complète sur grand écran, épurée sur smartphone.
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
          Il n’y a pas deux applications différentes : c’est exactement le même TrackPilot (même lien, même compte, mêmes parcours) qui adapte automatiquement son affichage à la largeur de votre écran.
        </p>
      </div>

      {/* 2-Column Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-[auto_1fr_auto] gap-4 sm:gap-6">
        {/* Column 1: Large Screen (PC, Mac, Tablet / iPad) */}
        <article className="flex flex-col comparison-card-subgrid rounded-2xl glass-panel border border-brand-500/30 hover:border-brand-500/50 transition-all duration-150 ease-out p-5 sm:p-6 shadow-card gap-4">
          {/* Row 1: Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/30 text-brand-400 shrink-0">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-brand-400 font-semibold">
                  Grand écran · PC, Mac &amp; Tablette / iPad
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Affichage Grand Écran (Studio &amp; options)
                </h3>
              </div>
            </div>
          </div>

          {/* Row 2: Description */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Sur ordinateur ou tablette (PC, Mac, iPad), l’application déploie l’intégralité de ses outils avec tous les détails, les panneaux d’analyse et les réglages avancés pour préparer vos sorties confortablement.
          </p>

          {/* Row 3: Feature points */}
          <ul className="space-y-2 pt-3.5 border-t border-white/[0.08] text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-brand-neon shrink-0" />
              <span>Atelier complet de création, tracé et édition détaillée de parcours</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-brand-neon shrink-0" />
              <span>Toutes les options d’analyse : vent relatif, relief, points d’eau et nutrition</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-brand-neon shrink-0" />
              <span>Import, nettoyage et organisation confortable de vos traces GPX / FIT</span>
            </li>
          </ul>
        </article>

        {/* Column 2: Small Screen (Smartphone) */}
        <article className="flex flex-col comparison-card-subgrid rounded-2xl glass-panel border border-white/10 hover:border-white/20 transition-all duration-150 ease-out p-5 sm:p-6 shadow-card gap-4">
          {/* Row 1: Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-dark-850 border border-white/15 text-teal-300 shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-teal-400 font-semibold">
                  Petit écran · Smartphone
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Affichage Smartphone (Compagnon terrain)
                </h3>
              </div>
            </div>
          </div>

          {/* Row 2: Description */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Sur petit écran, la même application s’épure volontairement : pour des raisons de commodité et de lisibilité, elle n’affiche pas toutes les fonctionnalités de préparation de parcours afin d’éviter un écran surchargé.
          </p>

          {/* Row 3: Feature points */}
          <ul className="space-y-2 pt-3.5 border-t border-white/[0.08] text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-teal-400 shrink-0" />
              <span>Affichage clair, aéré et lisible sur petit écran sans surcharge visuelle</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-teal-400 shrink-0" />
              <span>Chargement rapide d’une trace GPX ou accès à vos parcours préparés, consultation hors-ligne et guidage</span>
            </li>
            <li className="flex items-start gap-2 text-slate-400">
              <Minus className="w-4 h-4 mt-0.5 text-slate-500 shrink-0" />
              <span>Sans les outils lourds d’édition et de préparation avancée (réservés aux grands écrans)</span>
            </li>
          </ul>
        </article>
      </div>

      {/* Side-by-Side Real Screenshots Comparison (Ventoux X 2 Demo) */}
      <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center">
        {/* Desktop Screenshot Frame + Live Resize Tip (8 cols) */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="rounded-2xl glass-panel border border-brand-500/30 overflow-hidden shadow-card">
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-dark-900/95 border-b border-white/[0.08]">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
                  <span className="w-2 h-2 rounded-full bg-white/15" />
                  <span className="w-2 h-2 rounded-full bg-white/15" />
                  <span className="w-2 h-2 rounded-full bg-white/15" />
                </div>
                <span className="text-[11px] font-mono text-slate-400 truncate ml-1.5">
                  cycling.trackpilot.fit — Cockpit Grand Écran
                </span>
              </div>
              <span className="shrink-0 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-brand-500/15 text-brand-300 border border-brand-500/30">
                PC · Mac · Tablette
              </span>
            </div>

            <div className="bg-dark-950 aspect-[16/10] w-full overflow-hidden">
              <img
                src="/images/cockpit_pc_ventoux.png"
                alt="Capture d'écran réelle du Cockpit TrackPilot Cycling sur grand écran : parcours Ventoux X 2 avec options complètes, 6 indicateurs clés et profil altimétrique"
                width={1024}
                height={640}
                decoding="async"
                className="block w-full h-full object-cover object-top"
              />
            </div>

            <div className="px-4 py-2.5 bg-dark-900/80 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
              <span className="text-slate-400">
                Démo réelle : Ventoux X 2 (<span className="tabular-nums text-slate-200">95.6 km</span> · <span className="tabular-nums text-slate-200">2 836 m</span> D+)
              </span>
              <span className="text-brand-400 font-semibold">
                Options Format/Objectif + 6 pavés complets
              </span>
            </div>
          </div>

          {/* Short live-resize tip (symmetrical to mobile caption) */}
          <div className="mt-3 text-center max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-brand-400 font-semibold">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Astuce</span>
            </div>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Sur PC ou tablette, ouvrez TrackPilot puis réduisez la largeur de votre fenêtre au format smartphone : vous verrez l’application basculer en direct vers son affichage épuré.
            </p>
          </div>
        </div>

        {/* Smartphone Screenshot Frame (4 cols) */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div className="w-full max-w-[260px] sm:max-w-[280px] rounded-[24px] p-2 bg-dark-900 border border-white/15 shadow-card">
            <div className="rounded-[18px] overflow-hidden border border-white/10 bg-dark-950">
              <div className="flex items-center justify-center py-1.5 bg-dark-950 border-b border-white/[0.05]" aria-hidden="true">
                <span className="w-14 h-2 rounded-full bg-dark-850 border border-white/10" />
              </div>
              <div className="aspect-[390/844] w-full overflow-hidden bg-dark-950">
                <img
                  src="/images/cockpit_mobile_ventoux.png"
                  alt="Capture d'écran réelle du Cockpit TrackPilot Cycling sur smartphone : même parcours Ventoux X 2 en vue épurée avec guidage direct, 4 indicateurs essentiels, profil et carte"
                  width={390}
                  height={844}
                  decoding="async"
                  className="block w-full h-full object-cover object-left-top"
                />
              </div>
            </div>
          </div>

          <div className="mt-3 text-center max-w-[280px]">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-teal-400 font-semibold">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Smartphone · Même parcours</span>
            </div>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Guidage direct, 4 repères essentiels, profil et carte lisibles sans surcharge.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
