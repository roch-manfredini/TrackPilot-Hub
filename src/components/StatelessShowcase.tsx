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
        
        {/* Left: Traditional Apps / GPS Devices */}
        <div className="rounded-2xl p-6 sm:p-7 bg-dark-950/70 border border-red-500/20 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Montres, Compteurs &amp; Applis Classiques</h4>
                  <span className="text-xs font-mono text-slate-400">Chronologie enregistrée</span>
                </div>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-semibold">
                Historique continu
              </span>
            </div>

            {/* Problem explanation */}
            <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
              Le guidage est indissociable d'un fichier d'enregistrement chronologique continu seconde par seconde. Si votre appareil s'éteint au km 45 ou 60 :
            </p>

            {/* Negative Bullet Points */}
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Session interrompue ou corrompue :</strong> le fichier d'activité est tronqué ou illisible.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Chronomètre et moyennes faussés :</strong> incohérence des temps d'arrêt et de déplacement.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Écran d'alerte anxiogène :</strong> message <em>« Voulez-vous tenter de récupérer l'activité perdue ? »</em> avec risque de plantage.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Perte du fil de guidage :</strong> la navigation tente parfois de vous renvoyer au point de départ.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Synchronisation manuelle fastidieuse :</strong> obligation de cocher chaque trace manuellement pour espérer y accéder hors-ligne.</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06] text-xs font-mono text-red-400/90 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>Résultat : stress sur le terrain et risque de perte définitive</span>
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
                Zéro session corrompue
              </span>
            </div>

            {/* Solution explanation */}
            <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
              TrackPilot n'enregistre aucun historique lourd en boucle. Dès que vous lancez le guidage, l'algorithme projette vos coordonnées GPS directement sur votre plan de route :
            </p>

            {/* Positive Bullet Points */}
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-brand-neon mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Reprise en 1 seconde :</strong> scan instantané du plan de route pour vous replacer au mètre exact où vous êtes (ex: km 60).</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-brand-neon mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Calculs mis à jour en direct :</strong> distance, profil altimétrique et dénivelé D+ restants recalculés instantanément.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-brand-neon mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Filtrage intelligent de l'eau :</strong> le cockpit ignore le passé et cible immédiatement la prochaine fontaine ou source en aval.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-brand-neon mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Plans de route hors-ligne :</strong> vos parcours sont stockés automatiquement en local (comme un Drive, sans synchronisation manuelle).</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-brand-neon mt-0.5 shrink-0" />
                <span><strong className="text-white font-medium">Zéro trace corrompue, zéro stress :</strong> aucun chrono bloqué, aucun écran de récupération. Vous reprenez la route instantanément.</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.08] text-xs font-mono text-emerald-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-neon animate-pulse"></span>
            <span>Résultat : reprise fiable et immédiate, même sans réseau</span>
          </div>
        </div>

      </div>

    </div>
  );
};
