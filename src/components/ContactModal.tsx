import React, { useEffect, useState } from 'react';
import { Mail, Send, Copy, Check, X } from 'lucide-react';
import { recordHubEvent } from '../services/historyService';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const email = 'contact@trackpilot.fit';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    recordHubEvent({
      type: 'contact_action',
      target: 'email_copy',
      filterValue: 'contact_modal',
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl rounded-2xl bg-[#0c1017] border border-white/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-dark-900/80">
          <div className="flex items-center gap-2.5 text-brand-400">
            <Mail className="w-5 h-5" />
            <span className="font-bold text-sm tracking-wider uppercase font-mono">Contacter l'équipe</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Card exactly reproducing the screenshot */}
          <div className="rounded-xl border border-brand-500/30 bg-brand-500/[0.06] p-5 space-y-3">
            <div className="flex items-center gap-2 text-brand-400 font-bold text-xs uppercase tracking-wider font-mono">
              <Mail className="w-4 h-4" />
              <span>CONTACTER L'ÉQUIPE</span>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed">
              Une remarque, une idée d'amélioration ou un retour d'expérience sur vos sorties ?
            </p>
            <p className="text-slate-200 text-sm leading-relaxed">
              N'hésitez pas à contacter directement l'équipe TrackPilot :{' '}
              <a 
                href={`mailto:${email}?subject=Retour%20TrackPilot`}
                onClick={() =>
                  recordHubEvent({
                    type: 'contact_action',
                    target: 'mailto_click',
                    filterValue: 'contact_modal_inline',
                  })
                }
                className="font-bold text-white hover:text-brand-300 underline decoration-brand-400/50 underline-offset-4 transition-colors font-mono"
              >
                {email}
              </a>
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={`mailto:${email}?subject=Retour%20d%27exp%C3%A9rience%20TrackPilot`}
              onClick={() =>
                recordHubEvent({
                  type: 'contact_action',
                  target: 'mailto_click',
                  filterValue: 'contact_modal_button',
                })
              }
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-dark-950 bg-brand-400 hover:bg-brand-300 active:scale-[0.98] transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Envoyer un e-mail</span>
            </a>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 bg-dark-850 hover:bg-dark-800 hover:text-white border border-white/10 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-brand-neon" />
                  <span className="text-brand-300">Adresse copiée !</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copier l'adresse</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modal Footer with Close Button identical to screenshot */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-dark-950/90 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>TrackPilot.fit • Tous droits réservés</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:border-white/20 text-slate-300 text-xs font-semibold hover:text-white transition-all active:scale-[0.98] cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
