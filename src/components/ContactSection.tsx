import React, { useState } from 'react';
import { Mail, Send, Copy, Check, MessageSquare, Sparkles } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const email = 'contact@trackpilot.fit';

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32 border-t border-white/[0.06] overflow-hidden scroll-mt-16">
      
      {/* Background Photography Layer (Open Road Cyclist - Final Contact Step, Strava-style) */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <picture className="absolute inset-0 w-full h-full">
          <source srcSet="/images/open_road_cyclist.webp" type="image/webp" />
          <img
            src="/images/open_road_cyclist.jpg"
            alt="Cycliste sur route ouverte en pleine nature"
            className="w-full h-full object-cover object-[center_right] sm:object-[75%_center] opacity-90 contrast-[1.05]"
          />
        </picture>
        {/* Subtle overall dark tint allowing the photo to remain clear, sharp and vibrant */}
        <div className="absolute inset-0 bg-dark-950/40" />
        {/* Top & bottom edge fades to melt smoothly into pure dark-950 above & below */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-dark-950 via-dark-950/80 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-dark-950 via-dark-950/80 to-transparent" />
        {/* Subtle horizontal gradient to softly balance text area on left while leaving right scenery open */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950/60 via-transparent to-transparent" />
        {/* Ambient teal glow on the scenery side */}
        <div className="absolute top-1/4 -right-24 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-teal-400 mb-3 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Échange & Projet Ouvert</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Une question, une idée ou un retour de sortie ?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            TrackPilot est un projet partagé : nous roulons et faisons évoluer ces outils grâce aux retours de chacun sur le terrain. Écrivez-nous en toute simplicité !
          </p>
        </div>

        {/* Featured Contact Card matching TrackPilot visual standard */}
        <div className="relative rounded-2xl glass-panel p-6 sm:p-9 border border-teal-500/30 hover:border-teal-500/50 transition-all duration-200 shadow-card">
          
          {/* Card Title with Icon */}
          <div className="flex items-center gap-2.5 text-teal-400 mb-4">
            <Mail className="w-5 h-5 flex-shrink-0" />
            <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider font-mono">
              CONTACTER L'ÉQUIPE
            </h3>
          </div>

          {/* Description text identical to app reference */}
          <div className="space-y-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            <p>
              Une remarque, une idée d'amélioration ou un retour d'expérience sur vos sorties ?
            </p>
            <p>
              N'hésitez pas à contacter directement l'équipe TrackPilot :{' '}
              <a
                href={`mailto:${email}?subject=Retour%20TrackPilot`}
                className="font-bold text-white hover:text-teal-300 underline decoration-teal-400/50 underline-offset-4 transition-colors"
              >
                {email}
              </a>
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-6 pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${email}?subject=Retour%20d%27exp%C3%A9rience%20TrackPilot`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-dark-950 bg-teal-400 hover:bg-teal-300 active:scale-[0.98] transition-all shadow-glow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Envoyer un e-mail</span>
              </a>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 bg-dark-850 hover:bg-dark-800 hover:text-white border border-white/10 hover:border-white/20 active:scale-[0.98] transition-all"
                aria-label="Copier l'adresse e-mail"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-brand-neon" />
                    <span className="text-brand-300">Adresse copiée !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-400" />
                    <span>Copier l'adresse</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct human response guarantee */}
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Échanges directs entre sportifs et développeurs</span>
            </div>

          </div>

          {/* Context Topics Chips */}
          <div className="mt-6 flex flex-wrap items-center gap-2 pt-4 border-t border-white/[0.04]">
            <span className="text-xs text-slate-500 font-mono">Sujets fréquents :</span>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-dark-850/80 border border-white/5 text-slate-400 font-mono">
              💡 Suggestions de fonctionnalités
            </span>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-dark-850/80 border border-white/5 text-slate-400 font-mono">
              🚴 Retours sur trace GPX & Météo
            </span>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-dark-850/80 border border-white/5 text-slate-400 font-mono">
              🐛 Signalement de bug
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};
