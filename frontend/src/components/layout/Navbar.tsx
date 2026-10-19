import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogoBadge } from '../ui/LogoBadge';
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Shield,
  Crown,
  Briefcase,
  Layers,
  Sparkles,
  PhoneCall,
  Search,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [moreDropdown, setMoreDropdown] = useState(false);
  const location = useLocation();
  const { user, isFounder, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setMoreDropdown(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Case Studies', path: '/case-studies' },
    { name: 'About', path: '/about' },
    { name: 'Team', path: '/team' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Contact', path: '/contact' },
  ];

  const moreLinks = [
    { name: 'Our Process', path: '/process', icon: Layers },
    { name: 'Industries We Serve', path: '/industries', icon: Briefcase },
    { name: 'Request a Quote / Pricing', path: '/pricing', icon: Sparkles },
    { name: 'Insights & Blog', path: '/blog', icon: Search },
    { name: 'FAQ', path: '/faq', icon: PhoneCall },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3.5'
          : 'bg-white/80 backdrop-blur-sm border-b border-slate-100 py-4.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Badge with genuine LOGO.jpeg */}
          <LogoBadge variant="navbar" />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-brand-600 bg-brand-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* "More" Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreDropdown(!moreDropdown)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors ${
                  moreDropdown ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                More <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreDropdown ? 'rotate-180' : ''}`} />
              </button>

              {moreDropdown && (
                <div
                  className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-elevated border border-slate-200/80 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                  onMouseLeave={() => setMoreDropdown(false)}
                >
                  {moreLinks.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50 transition-colors"
                    >
                      <item.icon className="w-4 h-4 text-slate-400 group-hover:text-brand-600" />
                      {item.name}
                    </Link>
                  ))}
                  <div className="my-1.5 border-t border-slate-100" />
                  <Link
                    to="/admin/login"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition-colors"
                  >
                    <Shield className="w-4 h-4 text-brand-500" />
                    Administrator Portal
                  </Link>
                  <Link
                    to="/founder/login"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-amber-700 hover:text-amber-800 hover:bg-amber-50/60 transition-colors"
                  >
                    <Crown className="w-4 h-4 text-amber-500" />
                    Founder Portal
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Right Action Area */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <Link
                to={isFounder ? '/founder/dashboard' : '/admin/dashboard'}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
              >
                {isFounder ? <Crown className="w-3.5 h-3.5 text-amber-400" /> : <Shield className="w-3.5 h-3.5 text-brand-400" />}
                {isFounder ? 'Founder Console' : 'Admin Console'}
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin/login"
                  title="Administrator Portal"
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                </Link>
                <Link
                  to="/founder/login"
                  title="Founder Portal"
                  className="p-2 rounded-xl text-amber-600 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                >
                  <Crown className="w-4 h-4" />
                </Link>
              </div>
            )}

            <Link
              to="/contact"
              className="btn-primary py-2.5 px-5 text-xs font-semibold shadow-sm"
            >
              Start Your Project
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/contact"
              className="btn-primary py-2 px-3 text-xs font-medium"
            >
              Enquire
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-brand-600 hover:bg-slate-50"
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-2 pb-1 border-t border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400 px-3">
              Explore More
            </div>
            {moreLinks.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50"
              >
                <item.icon className="w-4 h-4 text-slate-400" />
                {item.name}
              </Link>
            ))}

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/admin/login"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200"
              >
                <Shield className="w-4 h-4 text-brand-600" />
                Administrator Portal
              </Link>
              <Link
                to="/founder/login"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200"
              >
                <Crown className="w-4 h-4 text-amber-600" />
                Founder Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
