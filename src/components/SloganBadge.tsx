import React, { useId } from 'react';
import { BrandLogo } from './BrandLogo';
import { recordHubEvent } from '../services/historyService';

interface SloganBadgeProps {
  activeView?: 'home' | 'plans' | 'admin';
  onNavigateHome?: (hash?: string) => void;
}

/**
 * Macaron circulaire permanent (bureau & tablette) affichant le slogan officiel
 * « Pensée pour le cintre et la main » et renvoyant au clic vers #pourquoi.
 * Statique par défaut (WCAG 2.2.2), avec micro-réaction au survol uniquement
 * si l'utilisateur n'a pas activé la réduction d'animations.
 */
export const SloganBadge: React.FC<SloganBadgeProps> = ({
  activeView = 'home',
  onNavigateHome,
}) => {
  const uid = useId();
  const topArcId = `${uid}-top-arc`;
  const bottomArcId = `${uid}-bottom-arc`;

  if (activeView === 'admin') {
    return null;
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    recordHubEvent({ type: 'cta_click', target: 'sticky_slogan_badge' });
    if (activeView !== 'home' && onNavigateHome) {
      e.preventDefault();
      onNavigateHome('#pourquoi');
    }
  };

  return (
    <a
      href="#pourquoi"
      onClick={handleClick}
      aria-label="TrackPilot : Pensée pour le cintre et la main. Découvrir pourquoi."
      title="Pensée pour le cintre et la main - Découvrir pourquoi"
      className="slogan-badge hidden md:flex fixed left-5 bottom-5 z-30 w-[108px] h-[108px] rounded-full items-center justify-center bg-[#08090d]/92 backdrop-blur-md border border-brand-500/40 hover:border-brand-neon/80 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_24px_rgba(16,185,129,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-950 select-none group"
    >
      {/* Dial SVG: upright circular text on top & bottom arcs */}
      <svg
        viewBox="0 0 120 120"
        aria-hidden="true"
        className="w-full h-full pointer-events-none"
      >
        <defs>
          {/* Top arc (clockwise, 9 o'clock -> 3 o'clock): text draws outward from r=42.5 */}
          <path id={topArcId} d="M 17.5,60 A 42.5,42.5 0 1,1 102.5,60" />
          {/* Bottom arc (counter-clockwise, 9 o'clock -> 3 o'clock): upright text draws inward from r=49.5 */}
          <path id={bottomArcId} d="M 10.5,60 A 49.5,49.5 0 1,0 109.5,60" />
        </defs>

        {/* Subtle outer bezel & inner ring */}
        <circle
          cx="60"
          cy="60"
          r="56"
          fill="none"
          stroke="rgba(16, 185, 129, 0.22)"
          strokeWidth="1"
          strokeDasharray="2 3"
        />
        <circle
          cx="60"
          cy="60"
          r="34"
          fill="rgba(8, 9, 13, 0.9)"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
        />

        {/* Top slogan text */}
        <text
          fill="#d1fae5"
          fontSize="7.4"
          fontWeight="700"
          letterSpacing="1.35"
          fontFamily="'JetBrains Mono', ui-monospace, monospace"
        >
          <textPath href={`#${topArcId}`} startOffset="50%" textAnchor="middle">
            PENSÉE POUR LE CINTRE
          </textPath>
        </text>

        {/* Bottom slogan text */}
        <text
          fill="#6ee7b7"
          fontSize="7.4"
          fontWeight="700"
          letterSpacing="1.6"
          fontFamily="'JetBrains Mono', ui-monospace, monospace"
        >
          <textPath href={`#${bottomArcId}`} startOffset="50%" textAnchor="middle">
            · ET LA MAIN ·
          </textPath>
        </text>
      </svg>

      {/* Center TrackPilot compass emblem */}
      <span
        aria-hidden="true"
        className="slogan-badge-emblem absolute w-9 h-9 rounded-full overflow-hidden border border-brand-500/35 bg-[#08090d] flex items-center justify-center p-1"
      >
        <BrandLogo variant="hub" className="w-full h-full" />
      </span>
    </a>
  );
};
