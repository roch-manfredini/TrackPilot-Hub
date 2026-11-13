import React, { useEffect, useRef } from 'react';
import { Scale, ShieldCheck, AlertTriangle, X } from 'lucide-react';
import legalContent from '../../public/legal.json';

export type LegalTab = 'mentions' | 'privacy' | 'disclaimer';

interface LegalSegment {
  text: string;
  style?: 'strong' | 'mono';
  href?: string;
}

interface LegalSection {
  heading: string;
  paragraphs: LegalSegment[][];
  hasCookieSettingsAction?: boolean;
}

interface LegalTabData {
  label: string;
  sections: LegalSection[];
}

interface LegalDocument {
  footerLabel: string;
  tabs: Record<LegalTab, LegalTabData>;
}

const LEGAL_DOC = legalContent as LegalDocument;

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
          {activeTab && (
            <div className="space-y-4">
              {LEGAL_DOC.tabs[activeTab].sections.map((section) => (
                <div key={section.heading}>
                  <h3 className="text-sm font-bold text-white mb-1">{section.heading}</h3>
                  {section.paragraphs.map((paragraph, pIdx) => (
                    <p key={pIdx} className={pIdx > 0 ? 'mt-2' : undefined}>
                      {paragraph.map((seg, sIdx) => {
                        if (seg.href) {
                          return (
                            <a
                              key={sIdx}
                              href={seg.href}
                              className="font-mono text-teal-300 hover:text-teal-200 underline underline-offset-2"
                            >
                              {seg.text}
                            </a>
                          );
                        }
                        if (seg.style === 'strong') {
                          return (
                            <strong key={sIdx} className="text-white">
                              {seg.text}
                            </strong>
                          );
                        }
                        if (seg.style === 'mono') {
                          return (
                            <span key={sIdx} className="font-mono text-slate-200">
                              {seg.text}
                            </span>
                          );
                        }
                        return <React.Fragment key={sIdx}>{seg.text}</React.Fragment>;
                      })}
                    </p>
                  ))}
                  {section.hasCookieSettingsAction && (
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
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-white/10 bg-dark-950/90 flex items-center justify-between text-xs text-slate-500 font-mono shrink-0">
          <span>{LEGAL_DOC.footerLabel}</span>
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
