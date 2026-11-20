import React from 'react';
import { ArrowUpRight, Heart } from 'lucide-react';
import { LegalTab } from './LegalModal';
import { recordHubEvent } from '../services/historyService';

interface FooterProps {
  onOpenLegal?: (tab: LegalTab) => void;
  onOpenCookies?: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenLegal,
  onOpenCookies,
  onOpenAdmin,
}) => {
  return (
    <footer className="border-t border-white/[0.08] bg-dark-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Legal & Attribution Bar */}
        <div className="pb-4 border-b border-white/[0.06] flex flex-wrap items-center justify-center sm:justify-between gap-3 text-xs font-mono text-slate-400">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <button
              type="button"
              onClick={() => onOpenLegal?.('mentions')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Mentions légales
            </button>
            <button
              type="button"
              onClick={() => onOpenLegal?.('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Confidentialité &amp; RGPD
            </button>
            <button
              type="button"
              onClick={() => onOpenLegal?.('disclaimer')}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Avertissement &amp; CGU
            </button>
            <button
              type="button"
              onClick={() => onOpenCookies?.()}
              className="hover:text-brand-300 transition-colors cursor-pointer"
            >
              Gestion des cookies
            </button>
            <a
              href="#faq"
              onClick={() => recordHubEvent({ type: 'cta_click', target: 'footer_faq' })}
              className="hover:text-white transition-colors"
            >
              FAQ
            </a>
          </div>
          <span className="text-[11px] text-slate-500">
            Données cartographiques © OpenStreetMap contributors · BRouter
          </span>
        </div>

        {/* Bottom Bar: Clean single line without wrapping on desktop, centered on mobile */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-mono text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:whitespace-nowrap">
            <span
              onDoubleClick={onOpenAdmin}
              className="cursor-default select-none touch-manipulation"
            >
              © {new Date().getFullYear()} TrackPilot.fit
            </span>
            <span>• Développé avec</span>
            <Heart className="w-3.5 h-3.5 text-brand-400 fill-brand-400 inline" />
            <span>pour les passionnés d'endurance.</span>
          </div>

          <a 
            href="#modules" 
            onClick={() => recordHubEvent({ type: 'cta_click', target: 'footer_trackpilot' })}
            className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center justify-center gap-1 whitespace-nowrap"
          >
            <span>trackpilot.fit</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>

      </div>
    </footer>
  );
};
