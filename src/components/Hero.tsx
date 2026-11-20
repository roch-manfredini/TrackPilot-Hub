import React from 'react';
import { ChevronDown, Lightbulb, MonitorSmartphone, Sparkles } from 'lucide-react';
import { SectionBackground } from './SectionBackground';
import { recordHubEvent } from '../services/historyService';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[76vh] sm:min-h-[82vh] flex items-center pt-32 pb-24 sm:pt-40 sm:pb-32 overflow-hidden">
      
      {/* Background Photography Layer (Alpine Cycling Switchbacks) */}
      <SectionBackground
        webpSrc="/images/swiss_mountain_cyclist.webp"
        jpgSrc="/images/swiss_mountain_cyclist.jpg"
        alt="Cyclisme sur route en montagne alpine"
        imgClassName="object-[center_right] sm:object-[85%_center]"
        scrimClassName="bg-dark-950/40"
        glowClassName="top-1/4 -right-24 bg-brand-500/10"
        eager
      />

      {/* Top Ambient Glow */}
      <div className="ambient-glow-top z-[1]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Main Hero Header */}
        <div className="text-center max-w-4xl mx-auto drop-shadow-[0_2px_16px_rgba(0,0,0,0.85)]">
          
          {/* Tag Pill */}
          <a
            href="#pourquoi"
            onClick={() => recordHubEvent({ type: 'cta_click', target: 'hero_slogan_pill' })}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-850/90 hover:bg-dark-800 border border-brand-500/35 hover:border-brand-400/70 text-brand-300 hover:text-brand-200 text-xs font-semibold uppercase tracking-wider mb-6 shadow-glow-sm transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-neon" />
            <span>Pensée pour le cintre et la main</span>
          </a>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
            Bien plus qu’un GPX :{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
              votre plan de route complet.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-slate-300 leading-relaxed font-normal">
            Transformez un simple fichier GPX ou FIT en véritable{' '}
            <strong className="text-white font-semibold">plan de route</strong> : relief, vent réel sur le parcours, points d’eau et repères d’effort réunis au même endroit. Un outil conçu par un passionné dans le respect de vos données.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#pourquoi"
              onClick={() => recordHubEvent({ type: 'cta_click', target: 'hero_pourquoi' })}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-base font-bold text-dark-950 bg-gradient-to-r from-brand-neon via-brand-400 to-brand-500 hover:brightness-110 active:scale-[0.98] rounded-xl shadow-glow-md transition-all duration-150"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Pourquoi TrackPilot ?</span>
              <ChevronDown className="w-4 h-4" />
            </a>

            <a
              href="#formats"
              onClick={() => recordHubEvent({ type: 'cta_click', target: 'hero_screens' })}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-200 bg-dark-850/80 hover:bg-dark-800 hover:text-white border border-white/10 hover:border-white/20 active:scale-[0.98] rounded-xl transition-all duration-150"
            >
              <MonitorSmartphone className="w-4 h-4 text-brand-400" />
              <span>Voir l’interface en images</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
