import React from 'react';
import { Link } from 'react-router-dom';
import { LogoBadge } from '../ui/LogoBadge';
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Shield,
  Crown,
  CheckCircle2,
} from 'lucide-react';
import { Linkedin, Twitter, Github, Instagram } from '../ui/SocialIcons';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200/90 pt-16 pb-12 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <LogoBadge variant="hero" />
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">
              "YOUR VISION. OUR MISSION. BEYOND EXPECTATIONS."
            </p>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              Premier IT enterprise specializing in full-stack web applications, custom software development, cloud infrastructure, and modern digital platforms built for scale.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://linkedin.com/company/weengineers-tech"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-brand-50 hover:text-brand-600 flex items-center justify-center transition-colors text-slate-600"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/weengineers"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-brand-50 hover:text-brand-600 flex items-center justify-center transition-colors text-slate-600"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/weengineers"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-brand-50 hover:text-brand-600 flex items-center justify-center transition-colors text-slate-600"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/weengineers"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-brand-50 hover:text-brand-600 flex items-center justify-center transition-colors text-slate-600"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Solutions & Services */}
          <div>
            <h4 className="font-heading font-semibold text-slate-900 text-sm tracking-wide uppercase mb-4">
              Core Services
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/services/website-development" className="hover:text-brand-600 transition-colors">
                  Website Development
                </Link>
              </li>
              <li>
                <Link to="/services/full-stack-web-development" className="hover:text-brand-600 transition-colors">
                  Full-Stack Web Development
                </Link>
              </li>
              <li>
                <Link to="/services/custom-software-development" className="hover:text-brand-600 transition-colors">
                  Custom Software Development
                </Link>
              </li>
              <li>
                <Link to="/services/ecommerce-development" className="hover:text-brand-600 transition-colors">
                  E-commerce Solutions
                </Link>
              </li>
              <li>
                <Link to="/services/mobile-application-development" className="hover:text-brand-600 transition-colors">
                  Mobile Application Development
                </Link>
              </li>
              <li>
                <Link to="/services/ai-powered-applications" className="hover:text-brand-600 transition-colors">
                  AI-Powered Applications
                </Link>
              </li>
              <li>
                <Link to="/services" className="inline-flex items-center gap-1 text-brand-600 font-semibold hover:underline pt-1">
                  View All 12 Services <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Portfolios */}
          <div>
            <h4 className="font-heading font-semibold text-slate-900 text-sm tracking-wide uppercase mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/about" className="hover:text-brand-600 transition-colors">
                  About WEENGINEERS
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-brand-600 transition-colors">
                  Projects & Portfolio
                </Link>
              </li>
              <li>
                <Link to="/case-studies" className="hover:text-brand-600 transition-colors">
                  Case Studies & Metrics
                </Link>
              </li>
              <li>
                <Link to="/team" className="hover:text-brand-600 transition-colors">
                  Engineering Leadership & Team
                </Link>
              </li>
              <li>
                <Link to="/process" className="hover:text-brand-600 transition-colors">
                  Engineering Process
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-brand-600 transition-colors">
                  Client Reviews & Ratings
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-brand-600 transition-colors">
                  Careers & Hiring
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Portals */}
          <div>
            <h4 className="font-heading font-semibold text-slate-900 text-sm tracking-wide uppercase mb-4">
              Direct Contact
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                <span>contact@weengineers.tech</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                <span>+1 (555) 019-2834</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                <span>Innovation Tech Hub, Silicon Boulevard</span>
              </li>
            </ul>

            <div className="pt-4 border-t border-slate-100 mt-4 space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Secure Portals
              </span>
              <Link
                to="/admin/login"
                className="flex items-center gap-2 text-xs text-slate-600 hover:text-brand-600 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-brand-500" />
                Administrator Portal
              </Link>
              <Link
                to="/founder/login"
                className="flex items-center gap-2 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors"
              >
                <Crown className="w-3.5 h-3.5 text-amber-500" />
                Founder Portal
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} WEENGINEERS TECH. All rights reserved.</span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-emerald-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Systems Operational
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-brand-600 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-brand-600 transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/faq" className="hover:text-brand-600 transition-colors">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
