import React from 'react';
import { ShieldCheck, Zap, WifiOff, ArrowRight, Mountain } from 'lucide-react';

export const FieldResilience: React.FC = () => {
  return (
    <section id="resilience" className="relative py-24 sm:py-32 border-t border-white/[0.06] overflow-hidden scroll-mt-16">
      
      {/* Background Photography Layer (Cyclist Climbing Mountain Pass - Intermediate Step, Strava-style) */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <picture className="absolute inset-0 w-full h-full">
          <source srcSet="/images/cyclist_climb.webp" type="image/webp" />
          <img
            src="/images/cyclist_climb.jpg"
            alt="Cycliste en ascension face au dénivelé et aux éléments"
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
        {/* Ambient emerald glow on the scenery side */}
        <div className="absolute top-1/4 -right-24 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30">
            <Mountain className="w-3.5 h-3.5 text-brand-neon" />
            <span>Épreuve du Terrain & Conditions Réelles</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Sur un col à 2 000 m ou en zone blanche,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
              votre trace ne doit jamais vous lâcher.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
            Froid mordant, pluie battante, batterie qui flanche sous les 5% : sur le terrain, la théorie s'arrête là où commence l'imprévu. TrackPilot a été architecturé pour éliminer tout risque d'écran figé ou de session perdue.
          </p>
        </div>

        {/* 3 Pillars of Field Reliability */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
          
          <div className="p-6 sm:p-7 rounded-2xl glass-panel border border-white/10 hover:border-emerald-500/30 transition-all shadow-card flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-dark-850 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <Zap className="w-5 h-5 text-brand-neon" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Reprise 1s après Coupure
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Le téléphone s'éteint par grand froid ? Rebranchez-le sur une batterie externe : votre navigation reprend exactement là où vous vous trouvez, sans aucun délai.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.08] text-[11px] font-mono text-emerald-400 font-semibold">
              Zéro historique corrompu
            </div>
          </div>

          <div className="p-6 sm:p-7 rounded-2xl glass-panel border border-white/10 hover:border-emerald-500/30 transition-all shadow-card flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-dark-850 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4">
                <WifiOff className="w-5 h-5 text-teal-300" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                100% Autonome Hors-Ligne
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Les profils altimétriques, les points d'eau et les repères de pente sont stockés localement dans votre appareil. Aucun besoin de réseau 4G/5G en haute montagne.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.08] text-[11px] font-mono text-teal-400 font-semibold">
              Accès garanti en zone blanche
            </div>
          </div>

          <div className="p-6 sm:p-7 rounded-2xl glass-panel border border-white/10 hover:border-emerald-500/30 transition-all shadow-card flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-dark-850 border border-brand-500/30 flex items-center justify-center text-brand-400 mb-4">
                <ShieldCheck className="w-5 h-5 text-brand-neon" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Projection Spatiale Pure
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Aucun serveur distant requis pendant votre sortie. Votre position GPS est projetée géométriquement en temps réel sur le vecteur du tracé, sans latence.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.08] text-[11px] font-mono text-brand-400 font-semibold">
              Fiabilité temps réel
            </div>
          </div>

        </div>

        {/* Small transition prompt towards the technical simulator below */}
        <div className="text-center">
          <a
            href="#stateless"
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-slate-300 hover:text-emerald-400 transition-colors drop-shadow"
          >
            <span>Découvrir l'architecture technique stateless & le simulateur interactif</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          </a>
        </div>

      </div>
    </section>
  );
};
