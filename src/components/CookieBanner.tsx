import React from 'react';
import { Cookie } from 'lucide-react';

interface CookieBannerProps {
  isOpen: boolean;
  onAccept: () => void;
  onRefuse: () => void;
  onOpenPrivacy: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({
  isOpen,
  onAccept,
  onRefuse,
  onOpenPrivacy,
}) => {
  if (!isOpen) return null;

  return (
    <aside
      aria-label="Gestion du consentement aux cookies"
      className="fixed bottom-4 inset-x-4 sm:left-auto sm:right-5 sm:max-w-md z-40 rounded-2xl glass-panel border border-white/15 bg-dark-900/95 p-4 sm:p-5 shadow-card"
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-500/15 border border-brand-500/30 text-brand-400 shrink-0 mt-0.5">
          <Cookie className="w-4 h-4 text-brand-neon" />
        </div>
        <div className="flex-1 space-y-2">
          <h2 className="text-sm font-bold text-white tracking-tight">
            Cookies &amp; mesure d’audience
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Ce site utilise Google Analytics uniquement avec votre accord pour mesurer la fréquentation de façon anonyme. Aucun traceur publicitaire n’est déposé.{' '}
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="text-brand-300 hover:text-brand-neon underline underline-offset-2 cursor-pointer font-medium"
            >
              En savoir plus
            </button>
          </p>

          {/* CNIL compliance: Accept and Refuse buttons have identical visibility & 1-click access */}
          <div className="pt-1.5 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onRefuse}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-dark-850 hover:bg-dark-800 hover:text-white border border-white/15 hover:border-white/25 transition-all duration-150 active:scale-[0.98] cursor-pointer"
            >
              Refuser
            </button>
            <button
              type="button"
              onClick={onAccept}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold text-dark-950 bg-brand-neon hover:bg-brand-400 transition-all duration-150 active:scale-[0.98] cursor-pointer"
            >
              Accepter
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
