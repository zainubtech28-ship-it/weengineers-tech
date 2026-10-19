import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogoBadge } from '../ui/LogoBadge';
import {
  Crown,
  TrendingUp,
  UserCheck,
  Building,
  FileSpreadsheet,
  ShieldAlert,
  Sliders,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  Layers,
} from 'lucide-react';

export const FounderLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Executive Overview', path: '/founder/dashboard', icon: TrendingUp },
    { name: 'Admin Governance', path: '/founder/governance', icon: UserCheck },
    { name: 'Company Profile & Branding', path: '/founder/branding', icon: Building },
    { name: 'Business Pipeline', path: '/founder/pipeline', icon: Layers },
    { name: 'Executive Reports & CSV', path: '/founder/reports', icon: FileSpreadsheet },
    { name: 'Security & Audit Center', path: '/founder/security', icon: ShieldAlert },
    { name: 'System Settings & Health', path: '/founder/settings', icon: Sliders },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-amber-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <LogoBadge variant="compact" />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Founder Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-68 bg-white border-r border-amber-200/80 z-50 flex flex-col justify-between transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Top Crest */}
          <div className="p-5 border-b border-amber-100 flex items-center justify-between bg-amber-50/40">
            <LogoBadge variant="portal" />
            <span className="badge-gold text-[10px] flex items-center gap-1 shadow-subtle">
              <Crown className="w-3 h-3 text-amber-600" /> Founder
            </span>
          </div>

          {/* Founder Identity Card */}
          <div className="p-4 mx-3 my-3 rounded-2xl bg-gradient-to-br from-amber-50/60 to-slate-50 border border-amber-200/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-extrabold flex items-center justify-center shadow-sm flex-shrink-0">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div className="overflow-hidden">
              <span className="font-bold text-slate-900 text-xs block truncate">{user?.name}</span>
              <span className="text-[10px] font-semibold text-amber-800 block">Chief Executive / Founder</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-amber-50/50'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-amber-600/70'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Area */}
        <div className="p-4 border-t border-amber-100 bg-amber-50/20 space-y-2">
          <Link
            to="/admin/dashboard"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-brand-600" /> Switch to Operational Admin
          </Link>

          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-slate-500 hover:text-slate-800 text-xs transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View Public Corporate Site
          </Link>

          <button
            onClick={async () => {
              await logout();
              navigate('/founder/login');
            }}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Founder Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-amber-200/80 px-6 py-3.5 sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5" /> Founder Executive Suite
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-800">
              {navItems.find((n) => n.path === location.pathname)?.name || 'Executive Suite'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="badge-gold text-[10px] font-bold">Confidential Executive View</span>
            <span className="text-slate-500 hidden sm:inline">{user?.email}</span>
          </div>
        </header>

        <main className="p-6 md:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
