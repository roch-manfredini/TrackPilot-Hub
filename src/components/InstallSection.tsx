import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Monitor, 
  Share, 
  PlusSquare, 
  CheckCircle2, 
  Zap, 
  WifiOff, 
  HardDrive, 
  ArrowUpRight
} from 'lucide-react';

export const InstallSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ios' | 'android' | 'desktop'>('ios');

  const ADVANTAGES = [
    {
      icon: <Zap className="w-5 h-5 text-brand-neon" />,
      title: "Zéro Store, Accès Immédiat",
      description: "Pas besoin de compte Google Play ou App Store. Un simple clic sur un lien suffit pour utiliser l'outil immédiatement."
    },
    {
      icon: <HardDrive className="w-5 h-5 text-teal-400" />,
      title: "Ultra Légère (< 2 Mo)",
      description: "Contrairement aux applications classiques qui pèsent 150 Mo ou plus, TrackPilot n'encombre jamais la mémoire de votre téléphone."
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      title: "Toujours à Jour",
      description: "Fini les corvées de mises à jour manuelles. Vous profitez automatiquement et en temps réel de la dernière version à chaque ouverture."
    },
    {
      icon: <WifiOff className="w-5 h-5 text-cyan-400" />,
      title: "Plein Écran & Mode Hors-Ligne",
      description: "Une fois ajoutée sur votre écran d'accueil, elle s'ouvre sans barre d'adresse et stocke automatiquement tous vos plans de route en local : vos parcours restent accessibles hors ligne même en zone blanche, comme un Drive mais 100% automatique."
    }
  ];

  return (
    <section id="installation" className="relative py-24 sm:py-32 border-t border-white/[0.06] overflow-hidden scroll-mt-16">
      
      {/* Background Photography Layer (Winding Alpine Mountain Pass & Cyclists - Offset Left, Strava-style) */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <picture className="absolute inset-0 w-full h-full">
          <source srcSet="/images/winding_mountain_cyclists.webp" type="image/webp" />
          <img
            src="/images/winding_mountain_cyclists.jpg"
            alt="Lacets de col de montagne et cyclistes"
            className="w-full h-full object-cover object-[center_left] sm:object-[20%_center] opacity-90 contrast-[1.05]"
          />
        </picture>
        {/* Subtle overall dark tint allowing the photo to remain clear, sharp and vibrant */}
        <div className="absolute inset-0 bg-dark-950/40" />
        {/* Top & bottom edge fades to melt smoothly into pure dark-950 above & below */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-dark-950 via-dark-950/80 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-dark-950 via-dark-950/80 to-transparent" />
        {/* Subtle horizontal gradient to softly balance text area on right while leaving left scenery open */}
        <div className="absolute inset-0 bg-gradient-to-l from-dark-950/60 via-transparent to-transparent" />
        {/* Ambient teal glow on the scenery side */}
        <div className="absolute bottom-1/4 -left-24 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-400 mb-3 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
            <Download className="w-3.5 h-3.5" />
            <span>Installation & Mobilité</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Qu’est-ce qu’une Web App et comment l’installer ?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            TrackPilot est conçue comme une <strong className="text-white font-semibold">Progressive Web App (PWA)</strong> : une technologie moderne qui réunit la légèreté d’un site web et la puissance d’une application mobile native installée sur votre écran d'accueil.
          </p>
        </div>

        {/* 4 Key Advantages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {ADVANTAGES.map((adv, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-2xl glass-panel border border-white/[0.08] hover:border-brand-500/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-dark-850 border border-white/10 flex items-center justify-center mb-4">
                {adv.icon}
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                {adv.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {adv.description}
              </p>
            </div>
          ))}
        </div>

        {/* Installation Steps Guide with Device Switcher */}
        <div className="relative rounded-3xl glass-panel border border-white/10 p-6 sm:p-10 bg-gradient-to-b from-dark-850/80 to-dark-950/80">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/[0.08]">
            <div>
              <span className="text-xs font-mono uppercase text-brand-400 font-semibold tracking-wider">
                Guide pas-à-pas (30 secondes)
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                Installer TrackPilot sur votre appareil
              </h3>
            </div>

            {/* Platform Selector Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-dark-950 border border-white/10 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab('ios')}
                className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'ios'
                    ? 'bg-brand-neon text-dark-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-dark-850'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>iPhone / iPad</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('android')}
                className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'android'
                    ? 'bg-brand-neon text-dark-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-dark-850'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Android</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('desktop')}
                className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'desktop'
                    ? 'bg-brand-neon text-dark-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-dark-850'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>Ordinateur</span>
              </button>
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="mt-8">
            {activeTab === 'ios' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-dark-950/70 border border-white/5 flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 font-mono text-sm font-bold flex items-center justify-center mb-4 border border-brand-500/20">
                      1
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">Ouvrir dans Safari</h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Rendez-vous sur <span className="font-mono text-emerald-400 font-semibold">cycling.trackpilot.fit</span> depuis le navigateur <strong className="text-white">Safari</strong> de votre iPhone ou iPad.
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-dark-950/70 border border-white/5 flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 font-mono text-sm font-bold flex items-center justify-center mb-4 border border-brand-500/20">
                      2
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">Bouton Partager</h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Touchez le bouton <strong className="text-white">Partager</strong> (<Share className="inline w-3.5 h-3.5 text-cyan-400" /> carré avec flèche vers le haut) situé en bas de votre écran.
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-dark-950/70 border border-brand-500/30 flex flex-col justify-between bg-gradient-to-br from-brand-950/20 to-dark-950/70">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-brand-neon text-dark-950 font-mono text-sm font-black flex items-center justify-center mb-4">
                      3
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">Sur l'écran d'accueil</h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Faites défiler le menu et touchez <strong className="text-white">« Sur l'écran d'accueil »</strong> (<PlusSquare className="inline w-3.5 h-3.5 text-emerald-400" />), puis confirmez avec <strong className="text-white">« Ajouter »</strong>.
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 text-xs text-brand-300 font-mono">
                    ✓ L'icône apparaît sur votre écran d'accueil
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'android' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-dark-950/70 border border-white/5 flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 font-mono text-sm font-bold flex items-center justify-center mb-4 border border-brand-500/20">
                      1
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">Ouvrir dans Chrome</h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Ouvrez le lien <span className="font-mono text-emerald-400 font-semibold">cycling.trackpilot.fit</span> dans le navigateur <strong className="text-white">Google Chrome</strong> de votre smartphone.
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-dark-950/70 border border-white/5 flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 font-mono text-sm font-bold flex items-center justify-center mb-4 border border-brand-500/20">
                      2
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">Bannière ou Menu</h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Une invite <strong className="text-white">« Installer l'application »</strong> s'affiche en bas, ou touchez le menu <strong className="text-white">⋮</strong> (trois points en haut à droite).
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-dark-950/70 border border-brand-500/30 flex flex-col justify-between bg-gradient-to-br from-brand-950/20 to-dark-950/70">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-brand-neon text-dark-950 font-mono text-sm font-black flex items-center justify-center mb-4">
                      3
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">Installation en 1 clic</h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Validez <strong className="text-white">« Installer »</strong>. L'application s'ajoute immédiatement à votre tiroir d'applications et à votre bureau comme n'importe quelle appli native.
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 text-xs text-brand-300 font-mono">
                    ✓ Plein écran &amp; accès direct sans barre d'adresse
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'desktop' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-dark-950/70 border border-white/5 flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 font-mono text-sm font-bold flex items-center justify-center mb-4 border border-brand-500/20">
                      1
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">Navigateur Moderne</h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Sur Mac, PC Windows ou Linux, utilisez un navigateur moderne compatible (Chrome, Edge, Brave ou Vivaldi).
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-dark-950/70 border border-white/5 flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 font-mono text-sm font-bold flex items-center justify-center mb-4 border border-brand-500/20">
                      2
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">Icône d'Installation</h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Dans la barre d'adresse tout à droite, cliquez sur la petite icône d'ordinateur avec une flèche <strong className="text-white">« Installer TrackPilot »</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-dark-950/70 border border-brand-500/30 flex flex-col justify-between bg-gradient-to-br from-brand-950/20 to-dark-950/70">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-brand-neon text-dark-950 font-mono text-sm font-black flex items-center justify-center mb-4">
                      3
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">Fenêtre Dédiée</h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      TrackPilot s'ouvre dans sa propre fenêtre indépendante, s'épingle à votre Dock ou barre des tâches, et devient votre studio de tracé permanent.
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 text-xs text-brand-300 font-mono">
                    ✓ Idéal pour préparer et tracer confortablement
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick link button */}
          <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-400 font-mono">
              Envie de tester l'installation dès maintenant ?
            </span>
            <a
              href="https://cycling.trackpilot.fit"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-dark-950 bg-brand-neon hover:bg-brand-400 transition-all duration-150 active:scale-[0.98]"
            >
              <span>Ouvrir TrackPilot Cycling</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
