import React from 'react';

interface SectionBackgroundProps {
  webpSrc: string;
  jpgSrc: string;
  alt: string;
  imgClassName?: string;
  scrimClassName?: string;
  horizontalGradientClassName?: string;
  glowClassName?: string;
  eager?: boolean;
}

/**
 * Full-bleed atmospheric photography backdrop with dark-950 edge fades.
 */
export const SectionBackground: React.FC<SectionBackgroundProps> = ({
  webpSrc,
  jpgSrc,
  alt,
  imgClassName = 'object-center',
  scrimClassName = 'bg-dark-950/45',
  horizontalGradientClassName,
  glowClassName = 'top-1/4 -right-24 bg-brand-500/10',
  eager = false,
}) => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none select-none">
      <picture className="absolute inset-0 w-full h-full">
        <source srcSet={webpSrc} type="image/webp" />
        <img
          src={jpgSrc}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding={eager ? 'sync' : 'async'}
          {...(eager ? { fetchPriority: 'high' as const } : {})}
          className={`w-full h-full object-cover opacity-90 contrast-[1.05] ${imgClassName}`}
        />
      </picture>
      <div className={`absolute inset-0 ${scrimClassName}`} />
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-dark-950 via-dark-950/80 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-dark-950 via-dark-950/80 to-transparent" />
      {horizontalGradientClassName && (
        <div className={`absolute inset-0 ${horizontalGradientClassName}`} />
      )}
      <div className={`absolute w-[500px] h-[500px] rounded-full blur-3xl ${glowClassName}`} />
    </div>
  );
};
