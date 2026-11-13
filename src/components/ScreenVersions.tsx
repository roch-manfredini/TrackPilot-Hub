import React from 'react';
import { Monitor, Smartphone, CheckCircle2, Minus, Maximize2 } from 'lucide-react';

export const ScreenVersions: React.FC = () => {
  return (
    <div id="formats" className="mt-12 sm:mt-14 mx-auto max-w-5xl scroll-mt-24 text-left">
      {/* Compact Header */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-brand-400 mb-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
          <Maximize2 className="w-3 h-3" />
          <span>Deux formats selon la taille d’écran</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Complet sur grand écran, volontairement épuré sur smartphone.
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
          TrackPilot adapte son interface à la largeur de votre écran : tout l’atelier de préparation sur ordinateur ou tablette, et uniquement l’essentiel sur petit écran pour préserver la lisibilité.
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
                  Version complète (Studio &amp; options)
                </h3>
              </div>
            </div>
          </div>

          {/* Row 2: Description */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Dès que vous disposez d’un grand écran (ordinateur ou tablette), vous accédez à l’intégralité du produit avec tous les détails, les panneaux d’analyse et les réglages avancés pour préparer vos sorties confortablement.
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
                  Version épurée (Compagnon terrain)
                </h3>
              </div>
            </div>
          </div>

          {/* Row 2: Description */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Pour des raisons de commodité et pour éviter un écran surchargé et illisible, la version smartphone est volontairement beaucoup plus épurée et n’embarque pas toutes les fonctionnalités de préparation de parcours.
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
    </div>
  );
};
