import React from 'react';
import { Compass, ArrowRight, Coffee } from 'lucide-react';

interface EcosystemVisionProps {
  onOpenContact?: () => void;
}

export const EcosystemVision: React.FC<EcosystemVisionProps> = ({ onOpenContact }) => {
  return (
    <section id="vision" className="relative py-20 sm:py-28 border-t border-white/[0.06] bg-dark-950 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-400 mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Esprit du Projet</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Développé par des passionnés, partagé avec tous.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            TrackPilot est né d’une idée simple : ne plus partir avec une trace muette, mais avec un plan de route complet — vent réel, points d’eau et gestion de l’énergie réunis au même endroit. Un projet indépendant, construit à l’écoute des pratiquants sur le terrain.
          </p>
        </div>

        {/* Dedicated Free & Open Ecosystem Commitment Box */}
        <div
          id="gratuite"
          className="max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl glass-panel border border-brand-500/30 bg-gradient-to-br from-brand-950/30 via-dark-900/90 to-dark-950 scroll-mt-24 shadow-card"
        >
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="w-11 h-11 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0">
              <Coffee className="w-5 h-5 text-brand-neon" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Gratuit par principe, parce que bâti sur le partage
                </h3>
                <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/30 font-semibold">
                  100% Gratuit · Sans abonnement
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                TrackPilot (dont le code source reste privé pour l’instant) repose en grande majorité sur des outils <strong className="text-white font-semibold">open source</strong> et des bases de données collaboratives créées par la communauté (<strong className="text-white font-medium">OpenStreetMap</strong>, <strong className="text-white font-medium">BRouter</strong>, données météo ouvertes).
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                Parce que nous bénéficions gratuitement de ce travail collectif, l’application est <strong className="text-brand-300 font-semibold">100 % gratuite, sans abonnement ni mur payant</strong> — et vouée à le rester. Si un jour l’outil vous rend service, tout au plus un café symbolique (totalement facultatif) permettra d’aider à financer l’hébergement.
              </p>
            </div>
          </div>
        </div>

        {/* Big Final Call to Action */}
        <div className="mt-16 text-center">
          <div className="inline-block p-1 rounded-2xl bg-gradient-to-r from-brand-neon via-brand-500 to-teal-400">
            <div className="bg-dark-950 rounded-[14px] px-8 py-10 sm:py-12 max-w-3xl">
              <span className="text-xs font-mono uppercase tracking-widest text-brand-400 font-bold">
                Accès libre & gratuit
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white mt-2 mb-4">
                Prêt à préparer votre prochain plan de route ?
              </h3>
              <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-xl mx-auto">
                Vélo, gravel, trail ou randonnée à pied : choisissez l’application adaptée à votre pratique et glissez un simple fichier GPX pour démarrer.
              </p>
              <a
                href="#modules"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-dark-950 bg-brand-neon hover:bg-brand-400 active:scale-[0.98] shadow-glow-md transition-all duration-150"
              >
                <span>Choisir mon module</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <div className="mt-5">
                <button
                  type="button" 
                  onClick={onOpenContact}
                  className="text-xs text-slate-400 hover:text-teal-300 transition-colors inline-flex items-center gap-1.5 font-mono cursor-pointer"
                >
                  <span>Une idée, une remarque ou envie d'échanger ? Contactez l'équipe</span>
                  <ArrowRight className="w-3 h-3 text-teal-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
