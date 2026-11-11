import React from 'react';
import { ArrowUpRight, ChevronDown, Sparkles, Shield, Cpu, Gauge } from 'lucide-react';
import { TelemetryPreview } from './TelemetryPreview';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
      
      {/* Top Ambient Glow */}
      <div className="ambient-glow-top" />

      {/* Grid Pattern Background subtle overlay */}
      <div className="absolute inset-0 bg-grid-pattern bg-[size:32px_32px] opacity-25 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Header */}
        <div className="text-center max-w-3xl mx-auto">
          
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-850/90 border border-brand-500/30 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-6 shadow-glow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-neon" />
            <span>Écosystème GPS & Préparation Outdoor</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400"></span>
            <span className="font-mono text-slate-400">v1.4 Live</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
            Pilotez vos sorties avec une{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
              précision chirurgicale.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed font-normal">
            L’alliance ultime du <strong className="text-white font-medium">GPS haute fidélité</strong>, de la <strong className="text-white font-medium">météo</strong> et de la <strong className="text-white font-medium">physiologie d'effort</strong>. Préparez vos traces, anticipez les vents contraires et ne subissez plus jamais la défaillance.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://cycling.trackpilot.fit"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-base font-bold text-dark-950 bg-gradient-to-r from-brand-neon via-brand-400 to-brand-500 hover:brightness-110 active:scale-[0.98] rounded-xl shadow-glow-md transition-all duration-150"
            >
              <span>Ouvrir TrackPilot Cycling</span>
              <ArrowUpRight className="w-5 h-5" />
            </a>

            <a
              href="#modules"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-200 bg-dark-850/80 hover:bg-dark-800 hover:text-white border border-white/10 hover:border-white/20 active:scale-[0.98] rounded-xl transition-all duration-150"
            >
              <span>Explorer la suite</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          {/* Trust & Spec Micro-stats */}
          <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-400" />
              <span>100% Confidentialité Locale</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-brand-400" />
              <span>Moteur In-Browser Zéro-Latence</span>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-brand-400" />
              <span>Précision Météo au km</span>
            </div>
          </div>

        </div>

        {/* Telemetry Mockup Cockpit */}
        <div id="cockpit" className="mt-14 sm:mt-20 scroll-mt-24">
          <div className="relative mx-auto max-w-5xl">
            {/* Glow frame background */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-brand-500/20 via-teal-500/10 to-brand-500/20 rounded-3xl blur-xl opacity-60 pointer-events-none" />
            
            <TelemetryPreview />
          </div>
        </div>

      </div>
    </section>
  );
};
