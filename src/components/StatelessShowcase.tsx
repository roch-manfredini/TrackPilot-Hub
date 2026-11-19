import React from 'react';
import {
  ChevronRight,
  Layers,
  ShieldCheck,
} from 'lucide-react';

export const StatelessShowcase: React.FC = () => {
  return (
    <div id="stateless" className="relative rounded-3xl glass-panel border border-brand-500/30 p-6 sm:p-8 overflow-hidden bg-gradient-to-b from-dark-850/90 via-dark-900/95 to-dark-950/95 shadow-2xl">
      
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Side-by-side Comparative Grid */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Left: All-in-one GPS Apps */}
        <div className="rounded-2xl p-6 sm:p-7 bg-dark-950/70 border border-white/15 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/[0.08] mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/15 flex items-center justify-center text-slate-200 shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Applis GPS Tout-en-Un</h4>
                  <span className="text-xs font-mono text-slate-400">Enregistrement &amp; suivi complet</span>
                </div>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-white/[0.06] text-slate-300 border border-white/15 font-semibold shrink-0">
                Approche complète
              </span>
            </div>

            {/* Philosophy explanation */}
            <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
              Véritables couteaux suisses du sport outdoor, ces applications sont remarquablement complètes : elles enregistrent votre trace seconde par seconde, gèrent vos statistiques et vos souvenirs de sortie tout en assurant le guidage. C'est une solution idéale lorsque le smartphone remplace la montre ou le compteur GPS. En contrepartie, leur fonctionnement s'articule autour d'une session active :
            </p>

            {/* Characteristics */}
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <ChevronRight className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Suivi de session complet :</strong> chaque sortie est enregistrée comme une activité chronologique continue ; après un redémarrage, l'application propose de restaurer ou de poursuivre la session pour préserver vos données.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <ChevronRight className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Statistiques et historique intégrés :</strong> vitesses moyennes, temps écoulé, records et carnet de sorties sont centralisés au même endroit (un arrêt lié à un redémarrage peut simplement demander un ajustement de pause).</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <ChevronRight className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Reprise sécurisée d'activité :</strong> après une coupure, un écran de récupération permet de vérifier l'état de l'enregistrement en cours avant de repartir.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <ChevronRight className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Recalcul dynamique d'itinéraire :</strong> si vous quittez le parcours ou relancez le guidage, le moteur peut proposer un recalcul pour rejoindre la trace ou le point de départ.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <ChevronRight className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Une activité à la fois :</strong> changer d'itinéraire en cours de sortie passe généralement par la mise en pause ou la clôture de l'activité active afin de garder un historique propre.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <ChevronRight className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Enregistrement GPS continu :</strong> le suivi permanent de la trace en arrière-plan et l'enregistrement de l'activité assurent un historique fidèle, tout en sollicitant davantage la batterie sur les très longues sorties.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <ChevronRight className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Hors-ligne à la carte :</strong> vous sélectionnez précisément les traces à télécharger avant de partir, ce qui vous laisse le contrôle sur les fichiers stockés.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <ChevronRight className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Cartes régionales ou nationales :</strong> le téléchargement préalable d'une région ou d'un pays entier garantit une cartographie disponible partout dans la zone, même hors itinéraire prévu.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <ChevronRight className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Grande polyvalence multi-sports :</strong> conçues pour couvrir un maximum de pratiques et de profils, elles offrent de nombreux réglages et options de personnalisation dans leurs menus.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <ChevronRight className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Interface mobile dense :</strong> pensée pour réunir suivi d'activité, statistiques et réglages sur un même écran ; sur le terrain, cette richesse amène souvent à laisser le smartphone dans la poche ou le sac et à ne le sortir que ponctuellement.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <ChevronRight className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Distribution via les stores :</strong> installées depuis l'App Store ou Google Play, elles s'intègrent de façon native au smartphone avec un suivi des versions géré par le store.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <ChevronRight className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Application native complète :</strong> leur richesse fonctionnelle et leurs moteurs embarqués occupent logiquement plus d'espace en mémoire (souvent 150 Mo ou plus avant ajout des cartes).</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.08] text-xs font-mono text-slate-300 leading-relaxed">
            <span className="text-white font-semibold">Idéal si :</span> vous souhaitez une seule application complète pour tout enregistrer, analyser et archiver sur votre smartphone.
          </div>
        </div>

        {/* Right: TrackPilot Stateless Engine */}
        <div className="rounded-2xl p-6 sm:p-7 bg-gradient-to-b from-dark-900 to-dark-950 border border-brand-500/45 shadow-glow-sm flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/[0.08] mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-neon shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">TrackPilot (Moteur Stateless)</h4>
                  <span className="text-xs font-mono text-brand-400">Guidage dédié &amp; projection spatiale</span>
                </div>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-brand-500/15 text-brand-300 border border-brand-500/30 font-semibold shrink-0">
                Approche épurée
              </span>
            </div>

            {/* Philosophy explanation */}
            <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
              TrackPilot fait un choix différent et complémentaire : le guidage n'enregistre aucun fichier chronologique et laisse l'enregistrement d'activité à votre montre ou compteur GPS. Entièrement dédié à la lecture du plan de route, il privilégie la légèreté, la reprise immédiate et la simplicité sur le terrain :
            </p>

            {/* Characteristics */}
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <ChevronRight className="w-4 h-4 text-brand-neon mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Reprise en 1 seconde :</strong> projection instantanée sur le plan de route pour vous replacer à l'endroit exact où vous vous trouvez, sans session à restaurer.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <ChevronRight className="w-4 h-4 text-brand-neon mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Calculs mis à jour en direct :</strong> distance, profil altimétrique et dénivelé D+ restants recalculés en temps réel depuis votre position actuelle.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <ChevronRight className="w-4 h-4 text-brand-neon mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Zéro session à gérer :</strong> aucun chrono à mettre en pause ni écran de récupération après un redémarrage : vous ouvrez l'outil et vous reprenez la route.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <ChevronRight className="w-4 h-4 text-brand-neon mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Guidage vers l'aval et eau ciblée :</strong> la projection ignore le chemin déjà parcouru, ne renvoie jamais au départ et pointe vers la prochaine fontaine devant vous.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <ChevronRight className="w-4 h-4 text-brand-neon mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Changement de plan à la volée :</strong> passez en 1 clic sur une variante ou sur l'étape suivante, sans aucune activité en cours à interrompre.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <ChevronRight className="w-4 h-4 text-brand-neon mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Guidage direct à la demande :</strong> besoin de rejoindre un point précis sans trace chargée ? Touchez la carte et choisissez votre mode de déplacement pour y être ramené (option disponible avec connexion réseau).</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <ChevronRight className="w-4 h-4 text-brand-neon mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Autonomie préservée :</strong> sans enregistrement continu en tâche de fond et grâce au mode éco OLED, le smartphone chauffe moins et tient plus longtemps.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <ChevronRight className="w-4 h-4 text-brand-neon mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Plans de route hors-ligne automatiques :</strong> vos parcours personnels sont stockés automatiquement en local (comme un Drive, sans manipulation manuelle).</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <ChevronRight className="w-4 h-4 text-brand-neon mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Cartes chargées au besoin :</strong> les zones traversées se chargent au fur et à mesure, et un bouton dans le guidage permet de précharger provisoirement les tuiles du plan de route ouvert avant une zone sans réseau.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <ChevronRight className="w-4 h-4 text-brand-neon mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Ciblé vélo ou marche à pied :</strong> réparti en deux applications distinctes, TrackPilot affiche directement l'essentiel de chaque discipline, prêt à l'emploi sans réglages multiples.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <ChevronRight className="w-4 h-4 text-brand-neon mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Ergonomie mobile pensée pour le cintre et la main :</strong> l'interface smartphone est épurée au maximum pour rester lisible d'un coup d'œil en mouvement, afin que le téléphone vive vraiment sur le guidon ou à la main plutôt que de rester dans la poche ou le sac.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <ChevronRight className="w-4 h-4 text-brand-neon mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Accès direct sans store (PWA) :</strong> fonctionne depuis un simple raccourci sur l'écran d'accueil, toujours à jour automatiquement à chaque ouverture.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <ChevronRight className="w-4 h-4 text-brand-neon mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Empreinte ultra-légère (&lt; 2 Mo) :</strong> préserve le stockage de votre smartphone tout en offrant une expérience mobile plein écran.</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.08] text-xs font-mono text-emerald-300 leading-relaxed">
            <span className="text-brand-neon font-semibold">Idéal si :</span> vous enregistrez déjà vos sorties sur montre ou compteur GPS et cherchez un plan de route léger, rapide et dédié au guidage.
          </div>
        </div>

      </div>

    </div>
  );
};
