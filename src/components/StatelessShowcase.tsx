import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ShieldCheck,
  AlertOctagon
} from 'lucide-react';

export const StatelessShowcase: React.FC = () => {
  return (
    <div id="stateless" className="relative rounded-3xl glass-panel border border-brand-500/30 p-6 sm:p-8 overflow-hidden bg-gradient-to-b from-dark-850/90 via-dark-900/95 to-dark-950/95 shadow-2xl">
      
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Side-by-side Comparative Grid */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Left: Traditional Guidance Apps */}
        <div className="rounded-2xl p-6 sm:p-7 bg-dark-950/70 border border-red-500/20 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Applis de Guidage Classiques</h4>
                  <span className="text-xs font-mono text-slate-400">Chronologie enregistrée</span>
                </div>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-semibold">
                Pilotage exigeant
              </span>
            </div>

            {/* Problem explanation */}
            <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
              Le guidage est indissociable d'un fichier d'enregistrement chronologique continu seconde par seconde, car ces applis ont pour objectif de remplacer en partie les fonctions des montres et compteurs GPS, même quand vous les emportez déjà. Cette logique tout-en-un amène une complexité de fonctionnement et de redémarrage :
            </p>

            {/* Negative Bullet Points */}
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Session interrompue :</strong> l'enregistrement en cours doit être restauré ou scindé en deux activités.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Chronomètre et moyennes modifiés :</strong> le temps d'arrêt lié au redémarrage influe sur les statistiques.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Écran de récupération :</strong> une fenêtre demande de restaurer l'activité en cours avant de repartir.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Recalcul de l'itinéraire :</strong> au redémarrage, le guidage cherche parfois à vous ramener vers le point de départ.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Changement de trace contraignant :</strong> modifier son itinéraire en cours de route demande souvent d'interrompre ou de gérer l'activité en cours.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Sollicitation continue du smartphone :</strong> l'enregistrement continu de l'activité et la gestion des capteurs pèsent davantage sur la batterie lors des longues sorties.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Préparation hors-ligne manuelle :</strong> il faut sélectionner et télécharger chaque trace à l'avance pour y accéder sans réseau.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Cartes par zones étendues :</strong> le mode hors-ligne demande généralement de télécharger à l'avance la carte d'une région ou d'un pays entier.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Logique « couteau suisse » :</strong> conçues pour répondre à tous les cas de figure, elles demandent souvent de décocher des options et de chercher dans les menus pour paramétrer le système.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Installation via un store :</strong> nécessite de passer par l'App Store ou Google Play, de télécharger l'application et de gérer ses mises à jour.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Place sur le smartphone :</strong> les applications natives classiques occupent souvent 150 Mo ou plus en mémoire, avant même d'y ajouter des cartes.</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06] text-xs font-mono text-red-400/90 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>Résultat : usage plus complexe et plus stressant en cas d'imprévu</span>
          </div>
        </div>

        {/* Right: TrackPilot Stateless Engine */}
        <div className="rounded-2xl p-6 sm:p-7 bg-gradient-to-b from-dark-900 to-dark-950 border border-brand-500/50 shadow-glow-sm flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-neon">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">TrackPilot (Moteur Stateless)</h4>
                  <span className="text-xs font-mono text-brand-400">Projection Spatiale Pure</span>
                </div>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-brand-500/15 text-brand-300 border border-brand-500/30 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-brand-neon" />
                Pilotage serein
              </span>
            </div>

            {/* Solution explanation */}
            <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
              Le guidage n'enregistre pas de fichier chronologique continu seconde par seconde, car il reste entièrement dédié au suivi de votre itinéraire. Cette logique épurée permet de redémarrer très rapidement, de lancer votre plan de route en un seul clic et de le suivre sereinement sur la carte :
            </p>

            {/* Positive Bullet Points */}
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-brand-neon mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Reprise en 1 seconde :</strong> scan instantané du plan de route pour vous replacer à l'endroit exact où vous vous trouvez.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-brand-neon mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Calculs mis à jour en direct :</strong> distance, profil altimétrique et dénivelé D+ restants recalculés instantanément.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-brand-neon mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Zéro session à récupérer, zéro stress :</strong> aucun chrono bloqué, aucun écran de récupération. Vous reprenez la route instantanément.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-brand-neon mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Guidage vers l'aval et eau ciblée :</strong> la projection ne vous renvoie jamais au départ, ignore le passé et cible la prochaine fontaine devant vous.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-brand-neon mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Changement de plan à la volée :</strong> passez en 1 clic sur une variante ou sur l'étape suivante, sans jamais interrompre quoi que ce soit.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-brand-neon mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Autonomie préservée :</strong> sans enregistrement en boucle ni capteurs à maintenir en tâche de fond, et avec le mode éco OLED, le smartphone chauffe moins et tient plus longtemps.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-brand-neon mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Plans de route hors-ligne :</strong> ils sont stockés automatiquement en local (comme un Drive, sans synchronisation manuelle).</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-brand-neon mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Cartes chargées au besoin :</strong> inutile de télécharger la carte d'une région ou d'un pays entier. Les zones traversées se chargent au fur et à mesure, et un simple bouton dans le guidage permet de précharger provisoirement les tuiles du plan de route ouvert avant de partir en zone sans réseau.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-brand-neon mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Ciblé cyclisme ou marche à pied :</strong> réparti en deux applications distinctes, TrackPilot propose exactement ce dont chaque pratique a besoin, sans avoir à désactiver d'options, décocher de menus ni chercher pour paramétrer le système.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-brand-neon mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Aucune installation requise :</strong> tout fonctionne directement sur votre smartphone via un simple raccourci sur l'écran d'accueil, sans passer par un store et toujours à jour.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-brand-neon mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Empreinte ultra-légère (&lt; 2 Mo) :</strong> n'encombre pas le stockage de votre smartphone, tout en offrant l'expérience complète d'une application mobile.</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.08] text-xs font-mono text-emerald-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-neon animate-pulse"></span>
            <span>Résultat : usage simple, immédiat et sans stress, même sans réseau</span>
          </div>
        </div>

      </div>

    </div>
  );
};
