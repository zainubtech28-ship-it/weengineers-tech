import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogoBadge } from '../ui/LogoBadge';
import { api } from '../../services/api';
import { NotificationItem } from '../../types';
import {
  LayoutDashboard,
  FolderGit2,
  Layers,
  Users,
  Inbox,
  Star,
  FileText,
  Bell,
  History,
  LogOut,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  Crown,
  Shield,
  CheckCircle2,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout, isFounder } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.getNotifications();
        if (res.success) {
          setNotifications(res.notifications);
          setUnreadCount(res.unreadCount);
        }
      } catch (err) {
        // silent catch
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // 30s poll
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (id === 'all' || n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Project Portfolio', path: '/admin/projects', icon: FolderGit2 },
    { name: 'Services Suite', path: '/admin/services', icon: Layers },
    { name: 'Team Members', path: '/admin/team', icon: Users },
    { name: 'Client Enquiries', path: '/admin/enquiries', icon: Inbox },
    { name: 'Review Moderation', path: '/admin/reviews', icon: Star },
    { name: 'Content & Articles', path: '/admin/content', icon: FileText },
    { name: 'System Audit Logs', path: '/admin/audit-logs', icon: History },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <LogoBadge variant="compact" />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-slate-200/90 z-50 flex flex-col justify-between transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Sidebar Top: Logo */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <LogoBadge variant="portal" />
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Badge */}
          <div className="p-4 mx-3 my-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 font-bold flex items-center justify-center border border-brand-200 flex-shrink-0">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <span className="font-bold text-slate-900 text-xs block truncate">{user?.name}</span>
              <span className="badge-primary text-[9px] py-0">{user?.role?.toUpperCase()}</span>
            </div>
          </div>

          {/* Nav Links */}
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
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          {isFounder && (
            <Link
              to="/founder/dashboard"
              className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200/80 hover:bg-amber-100 transition-colors shadow-sm"
            >
              <Crown className="w-3.5 h-3.5 text-amber-600" /> Switch to Founder Portal
            </Link>
          )}

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
              navigate('/admin/login');
            }}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Secure Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200/80 px-6 py-3.5 sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Management Portal
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-800">
              {navItems.find((n) => n.path === location.pathname)?.name || 'Dashboard'}
            </span>
          </div>

          {/* Right Header items: Notifications & Profile */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 relative transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
                )}
              </button>

              {/* Notifications Popup */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-elevated border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <span className="font-bold text-slate-900 text-xs">System Alerts</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => handleMarkAsRead('all')}
                        className="text-[10px] text-brand-600 hover:underline font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">No recent notifications.</p>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n._id}
                          className={`p-2.5 rounded-xl text-xs transition-colors ${
                            n.isRead ? 'bg-white' : 'bg-slate-50 border border-slate-100'
                          }`}
                        >
                          <span className="font-semibold text-slate-800 block">{n.title}</span>
                          <span className="text-[11px] text-slate-500 block">{n.message}</span>
                          <span className="text-[9px] text-slate-400 mt-1 block">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="h-6 w-[1px] bg-slate-200" />

            <span className="text-xs font-semibold text-slate-600 hidden sm:inline">
              {user?.email}
            </span>
          </div>
        </header>

        {/* Child Routes Render */}
        <main className="p-6 md:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
