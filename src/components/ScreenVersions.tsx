import React from 'react';
import { Monitor, Smartphone, CheckCircle2, Minus, Lightbulb } from 'lucide-react';
import { SectionBackground } from './SectionBackground';

export const ScreenVersions: React.FC = () => {
  return (
    <section id="formats" className="relative py-20 sm:py-28 border-t border-white/[0.06] overflow-hidden scroll-mt-16">
      <SectionBackground
        webpSrc="/images/mountain_hiker.webp"
        jpgSrc="/images/mountain_hiker.jpg"
        alt="Randonneur avec sac à dos et bâtons sur un col de montagne"
        imgClassName="object-[center_right] sm:object-[75%_center]"
        scrimClassName="bg-dark-950/50"
        horizontalGradientClassName="bg-gradient-to-r from-dark-950/60 via-transparent to-transparent"
        glowClassName="top-1/4 -right-24 bg-emerald-500/10"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      {/* Compact Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Une seule et même application : complète sur grand écran, épurée sur smartphone.
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
          Même lien, même compte, mêmes plans de route : l’affichage s’adapte automatiquement à la largeur de votre écran.
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
              <span>Import d’un simple GPX / FIT pour composer et organiser vos plans de route</span>
            </li>
          </ul>
        </article>

        {/* Column 2: Small Screen (Smartphone) */}
        <article className="flex flex-col comparison-card-subgrid rounded-2xl glass-panel border border-white/10 hover:border-white/20 transition-all duration-150 ease-out p-5 sm:p-6 shadow-card gap-4">
          {/* Row 1: Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-dark-850 border border-white/15 text-brand-300 shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-brand-400 font-semibold">
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
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-brand-400 shrink-0" />
              <span>Affichage clair, aéré et lisible sur petit écran sans surcharge visuelle</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-brand-400 shrink-0" />
              <span>Chargement d’un plan de route préparé (ou d’un simple GPX), consultation hors-ligne et guidage</span>
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
          <div className="mt-3.5 text-center max-w-xl mx-auto px-4 py-2.5 rounded-xl bg-dark-950/75 backdrop-blur-md border border-white/[0.08] shadow-sm">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-brand-400 font-semibold">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Astuce</span>
            </div>
            <p className="mt-1 text-xs text-slate-200 leading-relaxed">
              Sur PC ou tablette, ouvrez TrackPilot puis réduisez la largeur de votre fenêtre au format smartphone : vous verrez l’application basculer en direct vers son affichage épuré.
            </p>
          </div>
        </div>

        {/* Smartphone Screenshot Frame (4 cols) */}
        <div className="lg:col-span-4 flex flex-col items-center">
          {/* Realistic Smartphone Chassis (Titanium Bezel + Side Buttons + Dynamic Island + Home Bar) */}
          <div className="relative w-full max-w-[265px] sm:max-w-[285px]">
            {/* Left Side Physical Buttons (Silent switch + Volume Up/Down) */}
            <span className="absolute -left-[3px] top-20 w-[3px] h-5 rounded-l-sm bg-slate-600/80 border-l border-white/20" aria-hidden="true" />
            <span className="absolute -left-[3px] top-28 w-[3px] h-9 rounded-l-sm bg-slate-600/80 border-l border-white/20" aria-hidden="true" />
            <span className="absolute -left-[3px] top-40 w-[3px] h-9 rounded-l-sm bg-slate-600/80 border-l border-white/20" aria-hidden="true" />
            {/* Right Side Power Button */}
            <span className="absolute -right-[3px] top-32 w-[3px] h-12 rounded-r-sm bg-slate-600/80 border-r border-white/20" aria-hidden="true" />

            {/* Outer Metallic Titanium Frame */}
            <div className="rounded-[36px] p-[7px] bg-gradient-to-b from-slate-700/70 via-dark-850 to-slate-800/80 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.75),inset_0_1px_1px_rgba(255,255,255,0.25)]">
              {/* Inner OLED Screen Bezel */}
              <div className="rounded-[29px] overflow-hidden bg-[#0e0f10] ring-1 ring-black/90">
                {/* Mobile Status Bar + Dynamic Island */}
                <div className="relative flex items-center justify-between px-5 pt-2 pb-1.5 bg-[#0e0f10] text-[10px] font-semibold text-white/85 select-none" aria-hidden="true">
                  <span className="tabular-nums tracking-tight">09:41</span>
                  {/* Dynamic Island Pill */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-1.5 w-16 h-4 rounded-full bg-black border border-white/[0.08] flex items-center justify-end pr-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#111827] ring-1 ring-indigo-500/30" />
                  </div>
                  {/* Cellular + 5G + Battery */}
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-end gap-[1.5px] h-2.5">
                      <span className="w-[2px] h-1 rounded-[0.5px] bg-white/85" />
                      <span className="w-[2px] h-1.5 rounded-[0.5px] bg-white/85" />
                      <span className="w-[2px] h-2 rounded-[0.5px] bg-white/85" />
                      <span className="w-[2px] h-2.5 rounded-[0.5px] bg-white/85" />
                    </div>
                    <span className="text-[8px] font-bold tracking-tighter text-white/80">5G</span>
                    <div className="flex items-center">
                      <span className="w-4 h-2.5 rounded-[3px] border border-white/50 p-[1.5px] flex items-center">
                        <span className="w-full h-full rounded-[1px] bg-brand-neon" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pure App Viewport (Zero Windows frame) */}
                <div className="aspect-[438/961] w-full overflow-hidden bg-[#0e0f10]">
                  <img
                    src="/images/cockpit_mobile_ventoux.png"
                    alt="Capture d'écran réelle du Cockpit TrackPilot Cycling sur smartphone : même parcours Ventoux X 2 en vue épurée avec guidage direct, 4 indicateurs essentiels, profil et carte"
                    width={438}
                    height={961}
                    decoding="async"
                    className="block w-full h-full object-contain"
                  />
                </div>

                {/* Bottom Home Gesture Bar */}
                <div className="flex items-center justify-center pt-1.5 pb-2 bg-[#0e0f10]" aria-hidden="true">
                  <span className="w-24 h-1 rounded-full bg-white/30" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3.5 text-center max-w-[285px] w-full px-4 py-2.5 rounded-xl bg-dark-950/75 backdrop-blur-md border border-white/[0.08] shadow-sm">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-brand-400 font-semibold">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Smartphone · Même parcours</span>
            </div>
            <p className="mt-1 text-xs text-slate-200 leading-relaxed">
              Guidage direct, 4 repères essentiels, profil et carte lisibles sans surcharge.
            </p>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};
