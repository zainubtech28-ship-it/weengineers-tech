import React from 'react';
import { Link } from 'react-router-dom';

interface LogoBadgeProps {
  variant?: 'navbar' | 'footer' | 'portal' | 'hero' | 'compact';
  showTagline?: boolean;
  linkTo?: string;
  className?: string;
}

export const LogoBadge: React.FC<LogoBadgeProps> = ({
  variant = 'navbar',
  showTagline = true,
  linkTo = '/',
  className = '',
}) => {
  const isCompact = variant === 'compact';
  const isPortal = variant === 'portal';
  const isHero = variant === 'hero';

  const logoImg = (
    <div
      className={`relative flex items-center justify-center rounded-xl bg-[#07070a] border border-[#a87a1c]/50 shadow-sm overflow-hidden flex-shrink-0 transition-transform duration-300 group-hover:scale-105 ${
        isHero ? 'w-14 h-14' : isPortal ? 'w-10 h-10' : isCompact ? 'w-9 h-9' : 'w-11 h-11'
      }`}
    >
      <img
        src="/hero/logo.png"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = '/LOGO.jpeg';
        }}
        alt="WEENGINEERS TECH Official Logo"
        className="w-full h-full object-contain p-0.5"
      />
    </div>
  );

  const textContent = (
    <div className="flex flex-col text-left">
      <div className="flex items-center tracking-wide leading-none font-bold text-sm md:text-base">
        <span className="text-[#ececf1] font-bold tracking-wider">
          WEENGINEERS
        </span>
        <b className="gold font-extrabold ml-0.5 text-base md:text-lg">
          TECH
        </b>
      </div>
      {showTagline && (
        <span className="text-[9px] md:text-[10px] tracking-widest uppercase font-medium text-[#a29c8c] mt-1">
          Engineering Ideas Into Impact
        </span>
      )}
    </div>
  );

  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {logoImg}
      {!isCompact && textContent}
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-flex items-center group transition-opacity hover:opacity-95">
        {content}
      </Link>
    );
  }

  return content;
};
