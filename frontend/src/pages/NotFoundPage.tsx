import React from 'react';
import { Link } from 'react-router-dom';
import { LogoBadge } from '../components/ui/LogoBadge';
import { ArrowLeft, Home, HelpCircle, Layers, Briefcase } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#07070a] flex flex-col justify-center items-center px-4 py-16 text-center text-[#f4efe4]">
      <div className="card-gold p-8 md:p-12 max-w-lg w-full border border-[#2e2614] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        <div className="mb-6 flex justify-center">
          <LogoBadge variant="hero" />
        </div>

        <span className="text-6xl font-extrabold font-mono gold block mb-2">404</span>
        <h1 className="text-2xl font-bold text-[#f4efe4] mb-2">Page Not Found</h1>
        <p className="text-xs sm:text-sm text-[#a29c8c] leading-relaxed mb-8">
          The requested URL path does not exist on WEENGINEERS TECH. Please verify the web address or navigate back to one of our core sections below.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <Link
            to="/#what-are-we"
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#07070a] hover:bg-[#131318] text-xs font-semibold text-[#f4efe4] border border-[#2e2614] hover:border-[#e8b84a] transition-colors"
          >
            <Home className="w-4 h-4 text-[#e8b84a]" /> WHAT ARE WE
          </Link>
          <Link
            to="/#what-we-do"
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#07070a] hover:bg-[#131318] text-xs font-semibold text-[#f4efe4] border border-[#2e2614] hover:border-[#e8b84a] transition-colors"
          >
            <Layers className="w-4 h-4 text-[#e8b84a]" /> WHAT WE DO
          </Link>
          <Link
            to="/#our-projects"
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#07070a] hover:bg-[#131318] text-xs font-semibold text-[#f4efe4] border border-[#2e2614] hover:border-[#e8b84a] transition-colors"
          >
            <Briefcase className="w-4 h-4 text-[#e8b84a]" /> OUR PROJECTS
          </Link>
          <Link
            to="/#contact-us"
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#07070a] hover:bg-[#131318] text-xs font-semibold text-[#f4efe4] border border-[#2e2614] hover:border-[#e8b84a] transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-[#e8b84a]" /> CONTACT US
          </Link>
        </div>

        <Link to="/" className="btn-gold w-full text-xs font-bold">
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Homepage
        </Link>
      </div>
    </div>
  );
};
