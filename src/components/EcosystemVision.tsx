import React from 'react';
import { Smartphone, Lock, Zap, RefreshCw, Compass } from 'lucide-react';

export const EcosystemVision: React.FC = () => {
  const VISION_ITEMS = [
    {
      icon: <Smartphone className="w-5 h-5 text-brand-400" />,
      title: "100% Web & Mobile-First",
      description: "Aucune application lourde à télécharger depuis un store. Ouvrez un lien sur votre smartphone avant d'enfourcher votre vélo ou sur votre ordinateur la veille au soir. Instantané, fluide et toujours à jour."
    },
    {
      icon: <Lock className="w-5 h-5 text-teal-400" />,
      title: "Confidentialité Absolue (Local-First)",
      description: "Vos fichiers GPX et FIT contiennent vos tracés personnels, vos domiciles et vos performances. TrackPilot traite vos fichiers directement dans votre navigateur web sans jamais les stocker sur un serveur tiers."
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-sky-400" />,
      title: "Compatibilité Universelle Compteurs",
      description: "Compatible avec l’ensemble des standards du marché mondial : Garmin Edge, Wahoo ELEMNT, Hammerhead Karoo, Strava, Komoot, Coros et Suunto."
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      title: "Zéro Futilité, 100% Utilité Métier",
      description: "Pas de réseau social bruyant, pas de flux d'actualités invasif. Chaque pixel et chaque métrique affichée répondent à un besoin concret de l'athlète sur le terrain : rouler, courir ou marcher plus loin et plus fort."
    }
  ];

  return (
    <section id="vision" className="relative py-20 sm:py-28 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-400 mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Manifeste & Philosophie</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Conçu par des sportifs d’endurance, pour des sportifs d’endurance.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            TrackPilot est né d'un constat simple : la plupart des planificateurs d'itinéraires ignorent le vent réel, l'heure de passage aux cols et la nutrition d'effort. Nous avons bâti les outils que nous rêvions d'avoir au guidon.
          </p>
        </div>

        {/* 4 Pillars of Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {VISION_ITEMS.map((item, idx) => (
            <div 
              key={idx}
              className="p-6 sm:p-8 rounded-2xl glass-panel border border-white/[0.08] hover:border-white/20 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-dark-850 border border-white/10 flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Big Final Call to Action */}
        <div className="mt-16 text-center">
          <div className="inline-block p-1 rounded-2xl bg-gradient-to-r from-brand-neon via-brand-500 to-teal-400">
            <div className="bg-dark-950 rounded-[14px] px-8 py-10 sm:py-12 max-w-3xl">
              <span className="text-xs font-mono uppercase tracking-widest text-brand-400 font-bold">
                Écosystème TrackPilot
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white mt-2 mb-4">
                Passez au pilotage intelligent de vos sorties dès aujourd'hui.
              </h3>
              <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-xl mx-auto">
                Testez immédiatement le module de référence TrackPilot Cycling sur votre dernière trace GPX.
              </p>
              <a
                href="https://cycling.trackpilot.fit"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-dark-950 bg-brand-neon hover:bg-brand-400 active:scale-[0.98] shadow-glow-md transition-all duration-150"
              >
                <span>Accéder à TrackPilot Cycling (Gratuit)</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-dark-950/20">cycling.trackpilot.fit</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
