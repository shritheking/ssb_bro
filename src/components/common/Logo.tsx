import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'horizontal' | 'compact' | 'wordmark' | 'monochrome';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withLink?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  className = '',
  size = 'md',
  withLink = true,
}) => {
  const sizeMap = {
    sm: { height: 32, emblemSize: 28, textSize: 'text-lg', subSize: 'text-[9px]' },
    md: { height: 42, emblemSize: 36, textSize: 'text-xl', subSize: 'text-[10px]' },
    lg: { height: 56, emblemSize: 48, textSize: 'text-2xl', subSize: 'text-xs' },
    xl: { height: 72, emblemSize: 64, textSize: 'text-3xl', subSize: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  // SVG Emblem Mark
  const Emblem = ({ isMono = false }: { isMono?: boolean }) => (
    <svg
      width={currentSize.emblemSize}
      height={currentSize.emblemSize}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-transform duration-300 group-hover:scale-105 shrink-0"
    >
      <defs>
        <linearGradient id={`shieldGrad-${variant}`} x1="20" y1="10" x2="100" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isMono ? "#FFFFFF" : "#1E304A"} />
          <stop offset="100%" stopColor={isMono ? "#E2E8F0" : "#0E1826"} />
        </linearGradient>
        <linearGradient id={`goldGrad-${variant}`} x1="30" y1="20" x2="90" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isMono ? "#FFFFFF" : "#DFCA95"} />
          <stop offset="50%" stopColor={isMono ? "#E2E8F0" : "#C8A96B"} />
          <stop offset="100%" stopColor={isMono ? "#CBD5E1" : "#9C7E42"} />
        </linearGradient>
        <linearGradient id={`steelGrad-${variant}`} x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isMono ? "#FFFFFF" : "#8FAECE"} />
          <stop offset="100%" stopColor={isMono ? "#CBD5E1" : "#4E7097"} />
        </linearGradient>
      </defs>

      {/* Outer Shield Crest */}
      <path
        d="M60 10L102 28V64C102 88.5 83.5 106.5 60 112C36.5 106.5 18 88.5 18 64V28L60 10Z"
        fill={`url(#shieldGrad-${variant})`}
        stroke={`url(#goldGrad-${variant})`}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      
      {/* Subtle Inner Facets */}
      <path d="M60 16L24 32V63C24 84.5 40 100 60 106V16Z" fill="#000000" opacity="0.25" />
      <path d="M60 16L96 32V63C96 84.5 80 100 60 106V16Z" fill="#FFFFFF" opacity="0.08" />

      {/* Steel Chevron Guides */}
      <path d="M34 68L44 68L60 84L54 88Z" fill={`url(#steelGrad-${variant})`} opacity="0.85" />
      <path d="M86 68L76 68L60 84L66 88Z" fill={`url(#steelGrad-${variant})`} opacity="0.85" />

      {/* Main Ascending Arrow (Progress & Drive) */}
      <path
        d="M60 30L80 54H68V82H52V54H40L60 30Z"
        fill={`url(#goldGrad-${variant})`}
      />

      {/* Guiding Compass Star (Direction & Purpose) */}
      <path
        d="M60 18L63 26L71 29L63 32L60 40L57 32L49 29L57 26L60 18Z"
        fill="#FFFFFF"
      />
    </svg>
  );

  const content = (
    <div className={`inline-flex items-center gap-3 select-none group ${className}`}>
      {variant !== 'wordmark' && (
        <Emblem isMono={variant === 'monochrome'} />
      )}

      {variant !== 'compact' && (
        <div className="flex flex-col">
          <div className={`font-heading font-bold tracking-wider leading-none ${currentSize.textSize} ${variant === 'monochrome' ? 'text-white' : 'text-brand-text'}`}>
            SSB <span className={variant === 'monochrome' ? 'text-white/80' : 'text-brand-gold'}>BRO</span>
          </div>
          <div className={`font-sans tracking-[0.25em] font-semibold uppercase leading-tight mt-1 ${currentSize.subSize} ${variant === 'monochrome' ? 'text-white/60' : 'text-brand-steelLight'}`}>
            Aspirant Development
          </div>
        </div>
      )}
    </div>
  );

  if (withLink) {
    return (
      <Link to="/" className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 rounded">
        {content}
      </Link>
    );
  }

  return content;
};
