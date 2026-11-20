import React from 'react';
import {
  ChevronRight,
  Layers,
  ShieldCheck,
} from 'lucide-react';

interface ComparisonRow {
  leftTitle: string;
  leftText: string;
  rightTitle: string;
  rightText: string;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    leftTitle: 'Suivi de session complet :',
    leftText: "la sortie est enregistrée en continu ; après un redémarrage, l'application propose de restaurer la session en cours.",
    rightTitle: 'Reprise en 1 seconde :',
    rightText: 'projection instantanée sur le plan de route pour vous replacer à votre position exacte, sans session à restaurer.',
  },
  {
    leftTitle: 'Statistiques et historique intégrés :',
    leftText: 'vitesses moyennes, temps écoulé, records et carnet de sorties sont centralisés au même endroit.',
    rightTitle: 'Calculs mis à jour en direct :',
    rightText: 'distance, profil altimétrique et dénivelé D+ restants sont recalculés en temps réel depuis votre position.',
  },
  {
    leftTitle: "Reprise sécurisée d'activité :",
    leftText: "après une coupure, un écran de récupération permet de vérifier l'état de l'enregistrement avant de repartir.",
    rightTitle: 'Zéro session à gérer :',
    rightText: "aucun chrono à mettre en pause ni écran de récupération au redémarrage : vous ouvrez l'outil et reprenez la route.",
  },
  {
    leftTitle: "Recalcul dynamique d'itinéraire :",
    leftText: 'hors parcours ou à la relance, le moteur peut proposer un recalcul vers la trace ou le point de départ.',
    rightTitle: "Guidage vers l'aval et eau ciblée :",
    rightText: 'la projection ignore le chemin déjà parcouru, ne renvoie jamais au départ et cible la prochaine fontaine.',
  },
  {
    leftTitle: 'Une activité à la fois :',
    leftText: "changer d'itinéraire en cours de route passe par la mise en pause ou la clôture de l'activité active.",
    rightTitle: 'Changement de plan à la volée :',
    rightText: "passez en 1 clic sur une variante ou sur l'étape suivante, sans aucune activité en cours à interrompre.",
  },
  {
    leftTitle: 'Navigation sur parcours planifié :',
    leftText: 'rejoindre un point imprévu demande de passer par le planificateur pour générer un nouvel itinéraire.',
    rightTitle: 'Guidage direct à la demande :',
    rightText: 'sans trace chargée, touchez un point sur la carte et choisissez votre mode de déplacement pour y être guidé (avec réseau).',
  },
  {
    leftTitle: 'Enregistrement GPS continu :',
    leftText: 'le suivi permanent en arrière-plan (historique fidèle) et la cartographie permanente sollicitent davantage la batterie.',
    rightTitle: 'Autonomie préservée :',
    rightText: "sans enregistrement continu et avec le mode de guidage fil d'Ariane qui coupe la cartographie, le smartphone consomme beaucoup moins.",
  },
  {
    leftTitle: 'Hors-ligne à la carte :',
    leftText: 'vous sélectionnez et téléchargez manuellement les traces souhaitées avant de partir pour garder la main sur le stockage.',
    rightTitle: 'Plans de route hors-ligne automatiques :',
    rightText: 'vos parcours personnels sont stockés automatiquement en local (comme un Drive, sans action manuelle).',
  },
  {
    leftTitle: 'Cartes régionales ou nationales :',
    leftText: "le téléchargement préalable d'une région ou d'un pays entier assure un fond de carte disponible partout.",
    rightTitle: 'Cartes chargées au besoin :',
    rightText: 'chargement progressif des zones traversées et bouton de préchargement rapide des tuiles du parcours avant une zone blanche.',
  },
  {
    leftTitle: 'Grande polyvalence multi-sports :',
    leftText: 'conçues pour couvrir un maximum de pratiques, elles offrent de nombreux réglages et menus de personnalisation.',
    rightTitle: 'Ciblé vélo ou marche à pied :',
    rightText: "réparti en deux applications distinctes, TrackPilot affiche directement l'essentiel de chaque discipline, sans réglages.",
  },
  {
    leftTitle: 'Interface mobile dense :',
    leftText: 'réunissant suivi, stats et réglages, elle amène souvent à garder le téléphone dans la poche ou le sac et à le sortir ponctuellement.',
    rightTitle: 'Ergonomie pensée pour le cintre et la main :',
    rightText: "interface épurée et lisible d'un coup d'œil en mouvement, conçue pour vivre sur le guidon ou à la main.",
  },
  {
    leftTitle: 'Distribution via les stores :',
    leftText: "installées depuis l'App Store ou Google Play, avec téléchargement initial et mises à jour gérées par le store.",
    rightTitle: 'Accès direct sans store (PWA) :',
    rightText: "fonctionne depuis un simple raccourci sur l'écran d'accueil, toujours à jour automatiquement à chaque ouverture.",
  },
  {
    leftTitle: 'Application native complète :',
    leftText: "leur richesse fonctionnelle et leurs moteurs embarqués occupent souvent 150 Mo ou plus avant l'ajout des cartes.",
    rightTitle: 'Empreinte ultra-légère (< 2 Mo) :',
    rightText: 'préserve la mémoire de votre smartphone tout en offrant une expérience mobile fluide en plein écran.',
  },
];

export const StatelessShowcase: React.FC = () => {
  return (
    <div id="stateless" className="relative rounded-3xl glass-panel border border-brand-500/30 p-5 sm:p-7 overflow-hidden bg-gradient-to-b from-dark-850/90 via-dark-900/95 to-dark-950/95 shadow-2xl">
      
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Side-by-side Comparative Grid with Subgrid row alignment on desktop */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-6 lg:gap-y-2.5">
        
        {/* Left: All-in-one GPS Apps */}
        <div className="rounded-2xl p-5 sm:p-6 bg-dark-950/70 border border-white/15 flex flex-col gap-2.5 lg:grid lg:grid-rows-subgrid lg:row-[span_16_/_span_16]">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-white/[0.08] mb-1">
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
          <p className="text-xs sm:text-sm text-slate-300 mb-1.5 leading-relaxed">
            Véritables couteaux suisses outdoor, elles enregistrent votre trace seconde par seconde, gèrent vos statistiques et archivent vos sorties tout en assurant le guidage. Idéales quand le smartphone remplace la montre ou le compteur GPS, elles reposent sur une session active :
          </p>

          {/* Characteristics (1-to-1 aligned rows) */}
          {COMPARISON_ROWS.map((row) => (
            <div key={row.leftTitle} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-snug">
              <ChevronRight className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <span>
                <strong className="text-white font-medium">{row.leftTitle}</strong> {row.leftText}
              </span>
            </div>
          ))}

          <div className="mt-2 pt-3.5 border-t border-white/[0.08] text-xs font-mono text-slate-300 leading-relaxed self-end">
            <span className="text-white font-semibold">Idéal si :</span> vous souhaitez une seule application complète pour tout enregistrer, analyser et archiver sur votre smartphone.
          </div>
        </div>

        {/* Right: TrackPilot Stateless Engine */}
        <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-b from-dark-900 to-dark-950 border border-brand-500/45 shadow-glow-sm flex flex-col gap-2.5 lg:grid lg:grid-rows-subgrid lg:row-[span_16_/_span_16]">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-white/[0.08] mb-1">
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
          <p className="text-xs sm:text-sm text-slate-300 mb-1.5 leading-relaxed">
            TrackPilot fait un choix différent et complémentaire : le guidage n'enregistre aucun fichier chronologique et confie le suivi d'activité à votre montre ou compteur GPS. Entièrement dédié à la lecture du plan de route et au guidage, il privilégie la légèreté et la reprise immédiate :
          </p>

          {/* Characteristics (1-to-1 aligned rows) */}
          {COMPARISON_ROWS.map((row) => (
            <div key={row.rightTitle} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-snug">
              <ChevronRight className="w-4 h-4 text-brand-neon mt-0.5 shrink-0" />
              <span>
                <strong className="text-white font-medium">{row.rightTitle}</strong> {row.rightText}
              </span>
            </div>
          ))}

          <div className="mt-2 pt-3.5 border-t border-white/[0.08] text-xs font-mono text-emerald-300 leading-relaxed self-end">
            <span className="text-brand-neon font-semibold">Idéal si :</span> vous enregistrez déjà vos sorties sur montre ou compteur GPS et cherchez un plan de route léger, rapide et dédié au guidage.
          </div>
        </div>

      </div>

    </div>
  );
};
