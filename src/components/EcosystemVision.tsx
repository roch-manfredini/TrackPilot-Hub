import React from 'react';
import { Compass, ArrowRight, GlobeCode } from 'lucide-react';
import { SectionBackground } from './SectionBackground';
import { recordHubEvent } from '../services/historyService';

interface EcosystemVisionProps {
  onOpenContact?: () => void;
}

export const EcosystemVision: React.FC<EcosystemVisionProps> = ({ onOpenContact }) => {
  return (
    <section id="vision" className="relative py-20 sm:py-28 border-t border-white/[0.06] overflow-hidden scroll-mt-16">
      <SectionBackground
        webpSrc="/images/cyclists_and_hikers.webp"
        jpgSrc="/images/cyclists_and_hikers.jpg"
        alt="Cyclistes sur route de montagne et randonneurs sur le sentier voisin"
        imgClassName="object-center"
        scrimClassName="bg-dark-950/45"
        glowClassName="top-1/4 -right-24 bg-brand-500/10"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-400 mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Esprit du Projet</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Développé par un passionné, accessible à tous.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            TrackPilot est né d’une idée simple : ne plus partir avec une trace muette, mais avec un plan de route complet - vent réel, points d’eau et gestion de l’énergie réunis au même endroit. Un projet indépendant, construit à l’écoute des pratiquants sur le terrain.
          </p>
        </div>

        {/* Dedicated Free & Open Ecosystem Commitment Box */}
        <div
          id="gratuite"
          className="max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl glass-panel border border-brand-500/30 bg-gradient-to-br from-brand-950/30 via-dark-900/90 to-dark-950 scroll-mt-24 shadow-card"
        >
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="w-11 h-11 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0">
              <GlobeCode className="w-5 h-5 text-brand-neon" />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Bâti sur le partage
              </h3>
              <p className="text-sm text-white leading-relaxed font-normal">
                TrackPilot (dont le code source reste privé pour l’instant) repose en grande majorité sur des outils open source et des bases de données collaboratives créées par la communauté (OpenStreetMap, BRouter, données météo ouvertes).
              </p>
              <p className="text-sm text-white leading-relaxed font-normal">
                Parce que TrackPilot bénéficie gratuitement de cet écosystème ouvert, les 2 applications sont gratuites et sans publicité.
              </p>
              <p className="text-sm text-white leading-relaxed font-normal">
                En toute transparence : si la communauté grandit fortement et que les frais d’hébergement ou d’infrastructure deviennent importants, un financement pourra être ajouté (un café symbolique facultatif ou un bandeau publicitaire), sur ce site web (le Hub).
              </p>
            </div>
          </div>
        </div>

        {/* Big Final Call to Action */}
        <div className="mt-16 text-center">
          <div className="inline-block rounded-2xl glass-panel border border-brand-500/30 bg-dark-950/90 px-8 py-10 sm:py-12 max-w-3xl shadow-card">
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
              Prêt à préparer votre prochain plan de route ?
            </h3>
            <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-xl mx-auto">
              Vélo, trail ou randonnée à pied : choisissez l’application adaptée à votre pratique et glissez un simple fichier GPX pour démarrer.
            </p>
            <a
              href="#modules"
              onClick={() => recordHubEvent({ type: 'cta_click', target: 'vision_choose_module' })}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-dark-950 bg-brand-neon hover:bg-brand-400 active:scale-[0.98] shadow-glow-md transition-all duration-150"
            >
              <span>Choisir mon module</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <div className="mt-5">
              <button
                type="button" 
                onClick={onOpenContact}
                className="text-xs text-slate-400 hover:text-brand-300 transition-colors inline-flex items-center gap-1.5 font-mono cursor-pointer"
              >
                <span>Une idée, une remarque ou envie d'échanger ? Contactez l'auteur</span>
                <ArrowRight className="w-3 h-3 text-brand-400" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
