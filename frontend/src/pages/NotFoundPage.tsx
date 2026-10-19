import React from 'react';
import { Link } from 'react-router-dom';
import { LogoBadge } from '../components/ui/LogoBadge';
import { ArrowLeft, Home, HelpCircle, Layers } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-16 text-center">
      <div className="card-light p-8 md:p-12 max-w-lg w-full border border-slate-200/90 shadow-elevated">
        <div className="mb-6 flex justify-center">
          <LogoBadge variant="hero" />
        </div>

        <span className="text-6xl font-extrabold font-mono text-brand-600 block mb-2">404</span>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-8">
          The requested URL path does not exist on WEENGINEERS TECH. Please verify the web address or navigate back to one of our core sections below.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors"
          >
            <Home className="w-4 h-4 text-brand-600" /> Home Page
          </Link>
          <Link
            to="/services"
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors"
          >
            <Layers className="w-4 h-4 text-brand-600" /> Core Services
          </Link>
          <Link
            to="/projects"
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors"
          >
            <Home className="w-4 h-4 text-brand-600" /> Projects
          </Link>
          <Link
            to="/contact"
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-brand-600" /> Contact Us
          </Link>
        </div>

        <Link to="/" className="btn-primary w-full text-xs">
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Homepage
        </Link>
      </div>
    </div>
  );
};
