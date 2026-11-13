import React, { useEffect, useRef } from 'react';
import { Scale, ShieldCheck, AlertTriangle, X } from 'lucide-react';

export type LegalTab = 'mentions' | 'privacy' | 'disclaimer';

interface LegalModalProps {
  activeTab: LegalTab | null;
  onSelectTab: (tab: LegalTab) => void;
  onClose: () => void;
  onOpenCookieSettings: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  activeTab,
  onSelectTab,
  onClose,
  onOpenCookieSettings,
}) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (activeTab !== null) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [activeTab]);

  // Fallback light-dismiss for browsers without native `closedby` (e.g. Safari)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || 'closedBy' in HTMLDialogElement.prototype) return;

    const isOutside = (e: PointerEvent) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };

    let pressedOutside = false;
    const handlePointerDown = (e: PointerEvent) => {
      pressedOutside = isOutside(e);
    };
    const handlePointerUp = (e: PointerEvent) => {
      if (pressedOutside && isOutside(e)) {
        dialog.close();
      }
    };

    dialog.addEventListener('pointerdown', handlePointerDown);
    dialog.addEventListener('pointerup', handlePointerUp);
    return () => {
      dialog.removeEventListener('pointerdown', handlePointerDown);
      dialog.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  const handleCloseEvent = () => {
    if (activeTab !== null) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: 'any' } as Record<string, string>)}
      onClose={handleCloseEvent}
      aria-labelledby="legal-modal-title"
      className="w-[calc(100%-2rem)] max-w-2xl rounded-2xl bg-[#0c1017] text-slate-100 border border-white/15 shadow-card p-0 m-auto"
    >
      <div className="flex flex-col max-h-[85dvh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-dark-900/90 shrink-0">
          <div className="flex items-center gap-2.5 text-brand-400">
            <Scale className="w-5 h-5" />
            <h2 id="legal-modal-title" className="font-bold text-sm tracking-wider uppercase font-mono text-white">
              Informations légales &amp; confidentialité
            </h2>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Fermer les informations légales"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 sm:px-6 pt-3 pb-2 border-b border-white/[0.08] bg-dark-950/60 flex flex-wrap gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onSelectTab('mentions')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'mentions'
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                : 'text-slate-400 hover:text-white hover:bg-dark-850 border border-transparent'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Mentions légales</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('privacy')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                : 'text-slate-400 hover:text-white hover:bg-dark-850 border border-transparent'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Confidentialité &amp; RGPD</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('disclaimer')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'disclaimer'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-white hover:bg-dark-850 border border-transparent'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Avertissement &amp; CGU</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {activeTab === 'mentions' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">1. Éditeur du site</h3>
                <p>
                  Le site <span className="font-mono text-slate-200">trackpilot.fit</span> et l’écosystème associé sont édités à titre personnel, bénévole et non professionnel par l’équipe <strong className="text-white">TrackPilot.fit</strong>. Conformément à l’article 6 III-2 de la loi pour la confiance dans l’économie numérique (LCEN), les coordonnées d’identification personnelle de l’éditeur ont été communiquées à l’hébergeur.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-1">2. Contact</h3>
                <p>
                  Pour toute question, réclamation ou signalement :{' '}
                  <a
                    href="mailto:contact@trackpilot.fit"
                    className="font-mono text-teal-300 hover:text-teal-200 underline underline-offset-2"
                  >
                    contact@trackpilot.fit
                  </a>
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-1">3. Hébergement</h3>
                <p>
                  Ce site est hébergé sur l’infrastructure <strong className="text-white">Firebase Hosting</strong> fournie par Google Ireland Limited (Gordon House, Barrow Street, Dublin 4, Irlande) / Google LLC (1600 Amphitheatre Parkway, Mountain View, CA 94043, États-Unis).
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-1">4. Crédits &amp; données ouvertes</h3>
                <p>
                  Les données cartographiques et points d’eau proviennent des contributeurs{' '}
                  <strong className="text-white">OpenStreetMap</strong> (<span className="font-mono">© OpenStreetMap contributors</span>, sous licence ODbL). Le calcul d’itinéraire s’appuie sur le moteur libre <strong className="text-white">BRouter</strong> et des données météorologiques ouvertes.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">1. Collecte des données personnelles (RGPD)</h3>
                <p>
                  Le site vitrine <span className="font-mono text-slate-200">trackpilot.fit</span> ne collecte aucune donnée personnelle via formulaire (le champ d’aperçu « alerte bêta » de TrackPilot Trail reste strictement local tant que le module n’est pas lancé).
                </p>
                <p className="mt-2">
                  Dans l’application <span className="font-mono text-slate-200">cycling.trackpilot.fit</span>, la création volontaire d’un compte nécessite votre <strong className="text-white">adresse e-mail</strong> afin de vous authentifier et de retrouver vos parcours sauvegardés. Les fichiers GPX/FIT importés sont automatiquement purgés de leurs données biométriques et capteurs personnels (fréquence cardiaque, puissance, cadence) pour ne conserver que la trace géographique.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-1">2. Finalité, conservation et non-revente</h3>
                <p>
                  Vos données sont hébergées de manière sécurisée via Google Firebase. Elles servent exclusivement au fonctionnement technique de votre compte et ne sont <strong className="text-white">jamais vendues, louées ni cédées</strong> à des tiers à des fins commerciales. Elles sont conservées tant que votre compte reste actif.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-1">3. Vos droits (accès, rectification, suppression)</h3>
                <p>
                  Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d’un droit d’accès, de rectification, de portabilité et d’effacement de votre compte et de vos données à tout moment en écrivant à{' '}
                  <a
                    href="mailto:contact@trackpilot.fit?subject=RGPD%20-%20TrackPilot"
                    className="font-mono text-teal-300 hover:text-teal-200 underline underline-offset-2"
                  >
                    contact@trackpilot.fit
                  </a>
                  . Vous pouvez également introduire une réclamation auprès de la CNIL (<span className="font-mono">cnil.fr</span>).
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-1">4. Cookies &amp; mesure d’audience</h3>
                <p>
                  La mesure d’audience Google Analytics (<span className="font-mono">G-BFYKSM6F66</span>) n’est activée qu’avec votre consentement explicite préalable. Vous pouvez modifier ou retirer votre consentement à tout moment :
                </p>
                <button
                  type="button"
                  onClick={() => {
                    dialogRef.current?.close();
                    onOpenCookieSettings();
                  }}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 transition-colors cursor-pointer"
                >
                  Modifier mes préférences de cookies
                </button>
              </div>
            </div>
          )}

          {activeTab === 'disclaimer' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">1. Nature purement indicative des outils</h3>
                <p>
                  TrackPilot est un projet bénévole et gratuit mis à disposition en l’état, sans garantie d’exactitude, d’exhaustivité ni de disponibilité continue. Les tracés, pentes, profils altimétriques, prévisions météorologiques/vent et estimations de temps constituent de simples aides indicatives à la préparation.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-1">2. Sécurité, code de la route et conditions réelles</h3>
                <p>
                  Sur la route comme sur les sentiers, <strong className="text-white">l’utilisateur demeure seul responsable de sa sécurité</strong>, de son équipement, du respect du Code de la route, des propriétés privées, des arrêtés locaux et de l’adaptation à l’état réel du terrain (travaux, voies fermées, météo changeante, passages techniques).
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-1">3. Points d’eau &amp; données collaboratives</h3>
                <p>
                  Les fontaines et points d’eau signalés proviennent de la base collaborative OpenStreetMap. Leur présence effective, leur fonctionnement saisonnier (coupures hivernales ou sécheresse) et la potabilité de l’eau ne peuvent jamais être garantis : prévoyez toujours une marge d’autonomie suffisante.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-1">4. Effort, hydratation &amp; nutrition</h3>
                <p>
                  Les repères horaires d’hydratation et d’apports glucidiques sont des estimations générales de confort et ne remplacent en aucun cas un avis médical, diététique ou un suivi d’entraînement personnalisé.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-1">5. Limitation de responsabilité</h3>
                <p>
                  Dans les limites autorisées par la loi, l’éditeur ne pourra être tenu responsable des dommages matériels, corporels ou directs/indirects résultant de l’utilisation, d’une erreur de donnée ou d’une indisponibilité de l’application sur le terrain.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-white/10 bg-dark-950/90 flex items-center justify-between text-xs text-slate-500 font-mono shrink-0">
          <span>TrackPilot.fit • LCEN &amp; RGPD</span>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="px-4 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:border-white/20 text-slate-300 text-xs font-semibold hover:text-white transition-all active:scale-[0.98] cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </dialog>
  );
};
