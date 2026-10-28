import React from 'react';
import { Link } from 'react-router-dom';
import { LogoBadge } from '../ui/LogoBadge';
import {
  Mail,
  Shield,
  Crown,
  Search,
} from 'lucide-react';
import { Linkedin, Twitter, Github, Instagram } from '../ui/SocialIcons';

export const Footer: React.FC<{ onOpenTracker?: () => void }> = ({ onOpenTracker }) => {
  return (
    <footer className="bg-[#0d0d11] border-t border-[#2e2614] pt-16 pb-12 text-[#a29c8c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#2e2614]">
          {/* Brand Column */}
          <div className="space-y-4 lg:col-span-1">
            <LogoBadge variant="hero" />
            <p className="text-xs font-bold uppercase tracking-wider text-[#f4efe4]">
              Engineering Ideas Into Impact.
            </p>
            <p className="text-xs text-[#a29c8c] leading-relaxed max-w-sm">
              WEENGINEERS TECH is a software engineering and technology solutions company building reliable, scalable digital products.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://linkedin.com/company/weengineers-tech"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-[#131318] border border-[#2e2614] hover:border-[#e8b84a] hover:text-[#e8b84a] flex items-center justify-center transition-colors text-[#a29c8c]"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/weengineers"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-[#131318] border border-[#2e2614] hover:border-[#e8b84a] hover:text-[#e8b84a] flex items-center justify-center transition-colors text-[#a29c8c]"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/weengineers"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-[#131318] border border-[#2e2614] hover:border-[#e8b84a] hover:text-[#e8b84a] flex items-center justify-center transition-colors text-[#a29c8c]"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/weengineers"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-[#131318] border border-[#2e2614] hover:border-[#e8b84a] hover:text-[#e8b84a] flex items-center justify-center transition-colors text-[#a29c8c]"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Pages Column */}
          <div>
            <h4 className="font-heading font-semibold text-[#e8b84a] text-xs tracking-[0.14em] uppercase mb-4">
              PAGES
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="/#what-are-we" className="hover:text-[#e8b84a] transition-colors">
                  WHAT ARE WE
                </a>
              </li>
              <li>
                <a href="/#who-are-we" className="hover:text-[#e8b84a] transition-colors">
                  WHO ARE WE
                </a>
              </li>
              <li>
                <a href="/#what-we-do" className="hover:text-[#e8b84a] transition-colors">
                  WHAT WE DO
                </a>
              </li>
              <li>
                <a href="/#our-projects" className="hover:text-[#e8b84a] transition-colors">
                  OUR PROJECTS
                </a>
              </li>
              <li>
                <a href="/#contact-us" className="hover:text-[#e8b84a] transition-colors">
                  CONTACT US
                </a>
              </li>
            </ul>
          </div>

          {/* Core Services Column */}
          <div>
            <h4 className="font-heading font-semibold text-[#e8b84a] text-xs tracking-[0.14em] uppercase mb-4">
              SERVICES
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="/#what-we-do" className="hover:text-[#e8b84a] transition-colors">
                  Custom Software Development
                </a>
              </li>
              <li>
                <a href="/#what-we-do" className="hover:text-[#e8b84a] transition-colors">
                  Web Applications & Platforms
                </a>
              </li>
              <li>
                <a href="/#what-we-do" className="hover:text-[#e8b84a] transition-colors">
                  Mobile App Development
                </a>
              </li>
              <li>
                <a href="/#what-we-do" className="hover:text-[#e8b84a] transition-colors">
                  AI & Automation Solutions
                </a>
              </li>
              <li>
                <a href="/#what-we-do" className="hover:text-[#e8b84a] transition-colors">
                  Cloud Architecture & DevOps
                </a>
              </li>
              <li>
                <a href="/#what-we-do" className="hover:text-[#e8b84a] transition-colors">
                  UI/UX & Product Design
                </a>
              </li>
            </ul>
          </div>

          {/* Portals Column */}
          <div>
            <h4 className="font-heading font-semibold text-[#e8b84a] text-xs tracking-[0.14em] uppercase mb-4">
              ENTERPRISE & ACCESS
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/admin/login" className="flex items-center gap-1.5 hover:text-[#e8b84a] transition-colors">
                  <Shield className="w-3.5 h-3.5 text-[#e8b84a]" /> Administrator Portal
                </Link>
              </li>
              <li>
                <Link to="/founder/login" className="flex items-center gap-1.5 text-[#e8b84a] hover:text-[#fff2c4] transition-colors font-medium">
                  <Crown className="w-3.5 h-3.5" /> Founder Portal
                </Link>
              </li>
              {onOpenTracker && (
                <li>
                  <button
                    onClick={onOpenTracker}
                    className="flex items-center gap-1.5 hover:text-[#e8b84a] transition-colors text-left cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5 text-[#e8b84a]" /> Enquiry Tracking System
                  </button>
                </li>
              )}
              <li className="pt-2">
                <a
                  href="mailto:contact@weengineers.tech"
                  className="flex items-center gap-1.5 text-xs hover:text-[#e8b84a] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#e8b84a]" /> contact@weengineers.tech
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Compliance */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#a29c8c] gap-4">
          <p>© {new Date().getFullYear()} WEENGINEERS TECH. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-[#e8b84a] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-[#e8b84a] transition-colors">
              Terms of Engagement
            </Link>
            <Link to="/faq" className="hover:text-[#e8b84a] transition-colors">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
