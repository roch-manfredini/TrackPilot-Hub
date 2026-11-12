import React from 'react';
import { Smartphone, Lock, Zap, RefreshCw, Compass, ArrowRight } from 'lucide-react';

interface EcosystemVisionProps {
  onOpenContact?: () => void;
}

export const EcosystemVision: React.FC<EcosystemVisionProps> = ({ onOpenContact }) => {
  const VISION_ITEMS = [
    {
      icon: <Smartphone className="w-5 h-5 text-brand-400" />,
      title: "100% Web & Mobile-Friendly",
      description: "Directement accessible depuis votre navigateur, sur ordinateur comme sur smartphone. Ouvrez simplement le lien la veille ou au départ de votre sortie : rien à installer, toujours à jour et prêt à l'emploi."
    },
    {
      icon: <Lock className="w-5 h-5 text-teal-400" />,
      title: "Vie Privée & Données Assainies",
      description: "Pour sauvegarder et retrouver vos parcours, un compte est nécessaire. À chaque chargement de GPX, TrackPilot nettoie automatiquement vos traces de toutes leurs données privées et biométriques (fréquence cardiaque, puissance, capteurs personnels). Seul l'itinéraire géographique utile est conservé."
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-sky-400" />,
      title: "Complémentaire de vos Compteurs GPS",
      description: "TrackPilot n'a pas vocation à remplacer votre compteur ou votre montre pour enregistrer des statistiques ou vos performances. Nos outils se concentrent sur la préparation en amont et le guidage épuré sur le terrain. Vos appareils GPS restent indispensables."
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      title: "Collaboratif & À l'Écoute",
      description: "Un projet indépendant, sans publicité ni abonnement forcé. Nous sommes une équipe de pratiquants qui fait évoluer ces outils en échangeant avec bienveillance avec les sportifs sur le terrain."
    }
  ];

  return (
    <section id="vision" className="relative py-20 sm:py-28 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-400 mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Esprit du Projet</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Développé par des passionnés, partagé avec tous.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            TrackPilot est né de l'envie d'avoir des repères simples et pratiques au guidon : anticiper le vent réel le long de la trace, repérer les points d'eau et adapter son énergie. Nous partageons ces outils librement pour que chacun puisse en profiter.
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
                Accès libre & gratuit
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white mt-2 mb-4">
                Envie d'essayer sur votre prochaine sortie ?
              </h3>
              <p className="text-sm sm:text-base text-slate-300 mb-8 max-w-xl mx-auto">
                Glissez votre dernière trace GPX dans TrackPilot Cycling pour découvrir vos repères météo et dénivelé.
              </p>
              <a
                href="https://cycling.trackpilot.fit"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-dark-950 bg-brand-neon hover:bg-brand-400 active:scale-[0.98] shadow-glow-md transition-all duration-150"
              >
                <span>Tester TrackPilot Cycling (Gratuit)</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-dark-950/20">cycling.trackpilot.fit</span>
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
