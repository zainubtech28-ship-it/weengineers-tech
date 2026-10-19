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
      className={`relative flex items-center justify-center rounded-xl bg-slate-950 border border-amber-500/30 shadow-sm overflow-hidden flex-shrink-0 transition-transform duration-300 hover:scale-105 ${
        isHero ? 'w-14 h-14' : isPortal ? 'w-10 h-10' : isCompact ? 'w-9 h-9' : 'w-11 h-11'
      }`}
    >
      <img
        src="/LOGO.jpeg"
        alt="WEENGINEERS TECH Official Logo"
        className="w-full h-full object-contain p-0.5"
      />
    </div>
  );

  const textContent = (
    <div className="flex flex-col text-left">
      <div className="flex items-center gap-1.5 leading-none">
        <span className="font-heading font-extrabold tracking-tight text-slate-900 text-base md:text-lg">
          WEENGINEERS
        </span>
        <span className="font-heading font-extrabold tracking-wider text-brand-600 text-xs md:text-sm px-1.5 py-0.5 rounded bg-brand-50 border border-brand-100">
          TECH
        </span>
      </div>
      {showTagline && (
        <span className="text-[9px] md:text-[10px] tracking-widest uppercase font-semibold text-slate-400 mt-1">
          Beyond Expectations
        </span>
      )}
    </div>
  );

  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      {logoImg}
      {!isCompact && textContent}
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-flex items-center group">
        {content}
      </Link>
    );
  }

  return content;
};
