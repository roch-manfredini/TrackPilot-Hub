import React from 'react';

export type BrandLogoVariant = 'hub' | 'cycling' | 'trail';

interface BrandLogoProps {
  variant?: BrandLogoVariant;
  className?: string;
}

const LOGO_COLORS: Record<BrandLogoVariant, { north: string; south: string }> = {
  hub: { north: '#10b981', south: '#f97316' },
  cycling: { north: '#10b981', south: '#94a3b8' },
  trail: { north: '#f97316', south: '#94a3b8' },
};

/**
 * Emblème TrackPilot (boussole 45° Maxi Bold flat).
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'hub',
  className = 'w-full h-full',
}) => {
  const { north, south } = LOGO_COLORS[variant];

  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <rect width="100" height="100" fill="#08090d" />
      <g transform="rotate(45 50 50)">
        <polygon
          points="50,6 71,44 50,40 29,44"
          fill={north}
          stroke={north}
          strokeWidth="8"
          strokeLinejoin="round"
        />
        <polygon
          points="50,94 71,56 50,60 29,56"
          fill={south}
          stroke={south}
          strokeWidth="8"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};
