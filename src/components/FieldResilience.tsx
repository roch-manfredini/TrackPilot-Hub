import React from 'react';
import { Mountain } from 'lucide-react';
import { StatelessShowcase } from './StatelessShowcase';

export const FieldResilience: React.FC = () => {
  return (
    <section id="resilience" className="relative py-24 sm:py-32 border-t border-white/[0.06] overflow-hidden scroll-mt-16">
      
      {/* Background Photography Layer (Mountain Hiker with Backpack - Alpine Pass) */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <picture className="absolute inset-0 w-full h-full">
          <source srcSet="/images/mountain_hiker.webp" type="image/webp" />
          <img
            src="/images/mountain_hiker.jpg"
            alt="Randonneur avec sac à dos et bâtons sur un col de montagne"
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
        <div className="text-center max-w-3xl mx-auto mb-12 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30">
            <Mountain className="w-3.5 h-3.5 text-brand-neon" />
            <span>Épreuve du Terrain &amp; Architecture Stateless</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Sur un col à 2 000 m ou en zone blanche,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
              votre plan de route ne doit jamais vous lâcher.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
            Froid, pluie ou coupure de batterie au km 60 : TrackPilot repose sur une projection spatiale sans état (stateless), sans historique chronologique fragile ni besoin de réseau.
          </p>
        </div>

        {/* Stateless vs Traditional Comparison */}
        <StatelessShowcase />

      </div>
    </section>
  );
};
