import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  Search,
  Star,
  Users,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC<{ onOpenTracker?: () => void }> = ({ onOpenTracker }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [moreDropdown, setMoreDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
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

  // Exact 5 Navigation Labels per Task Specification
  const navItems = [
    { label: 'WHAT ARE WE', sectionId: 'what-are-we', fallbackPath: '/' },
    { label: 'WHO ARE WE', sectionId: 'who-are-we', fallbackPath: '/about' },
    { label: 'WHAT WE DO', sectionId: 'what-we-do', fallbackPath: '/services' },
    { label: 'OUR PROJECTS', sectionId: 'our-projects', fallbackPath: '/projects' },
  ];

  const handleNavClick = (sectionId: string, fallbackPath: string) => {
    setIsOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    navigate(`/#${sectionId}`);
  };

  const moreLinks = [
    { name: 'Services Directory', path: '/services', icon: Layers },
    { name: 'Projects Archive', path: '/projects', icon: Briefcase },
    { name: 'Company & Team', path: '/about', icon: Users },
    { name: 'Engineering Process', path: '/process', icon: Sparkles },
    { name: 'Client Reviews', path: '/reviews', icon: Star },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#07070a]/90 backdrop-blur-md border-b border-[#2e2614] py-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
          : 'bg-[#07070a]/75 backdrop-blur-sm border-b border-[#2e2614]/70 py-4.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Brand */}
          <LogoBadge variant="navbar" />

          {/* Desktop Navigation Links (The Exact 5 Labels) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.sectionId, item.fallbackPath)}
                className="px-3.5 py-2 rounded-full text-[13px] font-semibold text-[#a29c8c] hover:text-[#e8b84a] hover:bg-[#131318] transition-all duration-200 tracking-wider cursor-pointer"
              >
                {item.label}
              </button>
            ))}

            {/* "More" Directory Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreDropdown(!moreDropdown)}
                className={`px-3 py-2 rounded-full text-[13px] font-semibold flex items-center gap-1 transition-all duration-200 cursor-pointer ${
                  moreDropdown
                    ? 'text-[#e8b84a] bg-[#131318]'
                    : 'text-[#a29c8c] hover:text-[#e8b84a] hover:bg-[#131318]'
                }`}
                aria-expanded={moreDropdown}
              >
                MORE <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreDropdown ? 'rotate-180 text-[#e8b84a]' : ''}`} />
              </button>

              {moreDropdown && (
                <div
                  className="absolute top-full right-0 mt-2 w-60 bg-[#0d0d11] rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.7)] border border-[#2e2614] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                  onMouseLeave={() => setMoreDropdown(false)}
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#e8b84a]">
                    Explore WEENGINEERS TECH
                  </div>
                  {moreLinks.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMoreDropdown(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#f4efe4] hover:text-[#e8b84a] hover:bg-[#131318] transition-colors"
                    >
                      <item.icon className="w-3.5 h-3.5 text-[#e8b84a]/80" />
                      {item.name}
                    </Link>
                  ))}
                  {onOpenTracker && (
                    <button
                      onClick={() => {
                        setMoreDropdown(false);
                        onOpenTracker();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#f4efe4] hover:text-[#e8b84a] hover:bg-[#131318] transition-colors text-left cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5 text-[#e8b84a]" />
                      Track Existing Enquiry
                    </button>
                  )}
                  <div className="my-1.5 border-t border-[#2e2614]" />
                  <Link
                    to="/admin/login"
                    onClick={() => setMoreDropdown(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#a29c8c] hover:text-[#e8b84a] hover:bg-[#131318] transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#e8b84a]" />
                    Administrator Portal
                  </Link>
                  <Link
                    to="/founder/login"
                    onClick={() => setMoreDropdown(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#f5c342] hover:text-[#fff2c4] hover:bg-[#1a1508] transition-colors"
                  >
                    <Crown className="w-3.5 h-3.5 text-[#e8b84a]" />
                    Founder Portal
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Right Action Area: CONTACT US CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <Link
                to={isFounder ? '/founder/dashboard' : '/admin/dashboard'}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#131318] text-[#f4efe4] border border-[#2e2614] text-xs font-semibold hover:border-[#e8b84a] transition-colors"
              >
                {isFounder ? <Crown className="w-3.5 h-3.5 text-[#e8b84a]" /> : <Shield className="w-3.5 h-3.5 text-[#e8b84a]" />}
                {isFounder ? 'Founder Console' : 'Admin Console'}
              </Link>
            ) : null}

            {/* CONTACT US (Primary Gold CTA) */}
            <button
              onClick={() => handleNavClick('contact-us', '/contact')}
              className="btn-gold text-[13px] tracking-wider py-2 px-5 font-bold cursor-pointer"
            >
              CONTACT US
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => handleNavClick('contact-us', '/contact')}
              className="btn-gold py-1.5 px-3.5 text-xs font-bold"
            >
              CONTACT US
            </button>
            <button
              id="mb"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-[#f4efe4] border border-[#2e2614] bg-[#0d0d11] hover:border-[#e8b84a] focus:outline-none transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6 text-[#e8b84a]" /> : <Menu className="w-6 h-6 text-[#f4efe4]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-[#0d0d11] border-b border-[#2e2614] px-5 pt-4 pb-7 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-1.5">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.sectionId, item.fallbackPath)}
                className="w-full text-left px-3.5 py-3 rounded-xl text-sm font-semibold tracking-wider text-[#f4efe4] hover:text-[#e8b84a] hover:bg-[#131318] transition-colors"
              >
                {item.label}
              </button>
            ))}

            <button
              onClick={() => handleNavClick('contact-us', '/contact')}
              className="w-full text-left px-3.5 py-3 rounded-xl text-sm font-bold tracking-wider text-[#e8b84a] hover:bg-[#131318] transition-colors"
            >
              CONTACT US
            </button>

            <div className="pt-3 pb-1 border-t border-[#2e2614] text-[11px] font-bold uppercase tracking-widest text-[#a29c8c] px-3">
              Explore More
            </div>
            {moreLinks.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#a29c8c] hover:text-[#e8b84a] hover:bg-[#131318]"
              >
                <item.icon className="w-4 h-4 text-[#e8b84a]" />
                {item.name}
              </Link>
            ))}

            {onOpenTracker && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenTracker();
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#a29c8c] hover:text-[#e8b84a] hover:bg-[#131318] text-left"
              >
                <Search className="w-4 h-4 text-[#e8b84a]" />
                Track Existing Enquiry
              </button>
            )}

            <div className="pt-3 border-t border-[#2e2614] flex flex-col gap-2">
              <Link
                to="/admin/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#131318] text-[#f4efe4] text-xs font-medium border border-[#2e2614] hover:border-[#e8b84a]"
              >
                <Shield className="w-4 h-4 text-[#e8b84a]" />
                Administrator Portal
              </Link>
              <Link
                to="/founder/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a1508] text-[#e8b84a] text-xs font-semibold border border-[#a87a1c]/40 hover:border-[#e8b84a]"
              >
                <Crown className="w-4 h-4 text-[#e8b84a]" />
                Founder Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
