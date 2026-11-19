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
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { recordHubEvent } from '../services/historyService';

export const InstallSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ios' | 'android' | 'desktop'>('ios');

  const handleSelectTab = (tab: 'ios' | 'android' | 'desktop') => {
    setActiveTab(tab);
    recordHubEvent({ type: 'install_tab', target: tab });
  };

  const ADVANTAGES = [
    {
      icon: <Zap className="w-5 h-5 text-brand-neon" />,
      title: "Zéro Store, Accès Immédiat",
      description: "Pas besoin de compte Google Play ou App Store. Un simple clic sur un lien suffit pour utiliser l'outil immédiatement."
    },
    {
      icon: <HardDrive className="w-5 h-5 text-brand-400" />,
      title: "Ultra Légère (< 2 Mo)",
      description: "Alors qu'une application native tout-en-un pèse souvent 150 Mo ou plus, TrackPilot reste très légère et préserve la mémoire de votre téléphone."
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      title: "Toujours à Jour",
      description: "Fini les corvées de mises à jour manuelles. Vous profitez automatiquement et en temps réel de la dernière version à chaque ouverture."
    },
    {
      icon: <WifiOff className="w-5 h-5 text-brand-400" />,
      title: "Plein Écran & Mode Hors-Ligne",
      description: "Ajoutée à votre écran d'accueil, elle s'ouvre sans barre d'adresse et garde vos plans de route accessibles hors ligne, même en zone blanche."
    }
  ];

  return (
    <section id="installation" className="relative py-24 sm:py-32 border-t border-white/[0.06] bg-dark-950 scroll-mt-16">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
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
        <div id="guide-installation" className="relative rounded-3xl glass-panel border border-white/10 p-6 sm:p-10 bg-gradient-to-b from-dark-850/80 to-dark-950/80 scroll-mt-24">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/[0.08]">
            <div>
              <span className="text-xs font-mono uppercase text-brand-400 font-semibold tracking-wider">
                Guide pas-à-pas (30 secondes)
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                Installer TrackPilot sur votre appareil
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
                Même application sur ordinateur pour préparer et sur smartphone pour le terrain.
              </p>
            </div>

            {/* Platform Selector Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-dark-950 border border-white/10 w-full md:w-auto">
              <button
                type="button"
                onClick={() => handleSelectTab('ios')}
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
                onClick={() => handleSelectTab('android')}
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
                onClick={() => handleSelectTab('desktop')}
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
                      Rendez-vous sur votre application TrackPilot (ex. <span className="font-mono text-emerald-400 font-semibold">cycling.trackpilot.fit</span>) depuis le navigateur <strong className="text-white">Safari</strong> de votre iPhone ou iPad.
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
                      Touchez le bouton <strong className="text-white">Partager</strong> (<Share className="inline w-3.5 h-3.5 text-brand-400" /> carré avec flèche vers le haut) situé en bas de votre écran.
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
                      Ouvrez votre application TrackPilot (ex. <span className="font-mono text-emerald-400 font-semibold">cycling.trackpilot.fit</span>) dans le navigateur <strong className="text-white">Google Chrome</strong> de votre smartphone.
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

          {/* Open App CTAs below the 3 installation steps */}
          <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-col lg:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-300 font-mono text-center lg:text-left">
              Prêt à suivre ces 3 étapes pour installer l’application ?
            </span>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <a
                href="https://cycling.trackpilot.fit"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  recordHubEvent({
                    type: 'app_launch',
                    target: 'install_section',
                    app: 'cycling',
                  })
                }
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-dark-950 bg-gradient-to-r from-brand-neon to-brand-400 hover:from-brand-400 hover:to-brand-300 active:scale-[0.98] shadow-glow-sm transition-all duration-150"
              >
                <span>Ouvrir TrackPilot Cycling</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <div
                aria-disabled="true"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold text-trail-300 bg-dark-950/70 border border-trail-500/25 select-none cursor-not-allowed"
              >
                <span>Ouvrir TrackPilot Trail</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-trail-500/15 text-trail-300 border border-trail-500/30">
                  <Clock className="w-3 h-3" />
                  Bientôt
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
