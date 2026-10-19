import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import {
  FolderGit2,
  Inbox,
  Star,
  Bell,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  Clock,
  ExternalLink,
  Plus,
  FileSpreadsheet,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.getAdminDashboardStats();
        if (res.success) setStats(res.stats);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-slate-500">Querying administration database metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="badge-primary mb-1">Operational Workspace</span>
          <h1 className="text-2xl font-bold text-slate-900">Administrator Console</h1>
          <p className="text-xs text-slate-500">Manage client enquiries, published projects, services, and moderation</p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/projects" className="btn-primary text-xs py-2 px-3.5">
            <Plus className="w-3.5 h-3.5" /> New Project
          </Link>
          <a
            href="/api/v1/admin/enquiries/export"
            download
            className="btn-secondary text-xs py-2 px-3.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Export Enquiries
          </a>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card-light p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Enquiries</span>
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">{stats?.enquiries?.total || 0}</span>
            {stats?.enquiries?.new > 0 && (
              <span className="badge-warning text-[10px]">{stats.enquiries.new} New</span>
            )}
          </div>
          <span className="text-[11px] text-slate-400 block">From public enquiry form</span>
        </div>

        <div className="card-light p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Portfolio Projects</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">{stats?.projects?.published || 0}</span>
            <span className="text-xs text-slate-400">/ {stats?.projects?.total || 0} total</span>
          </div>
          <span className="text-[11px] text-slate-400 block">{stats?.projects?.draft || 0} drafts in progress</span>
        </div>

        <div className="card-light p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Reviews</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">{stats?.reviews?.pending || 0}</span>
            <span className="text-xs text-slate-400">awaiting check</span>
          </div>
          <span className="text-[11px] text-slate-400 block">Moderation queue</span>
        </div>

        <div className="card-light p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">System Alerts</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">{stats?.notifications?.unread || 0}</span>
            <span className="text-xs text-slate-400">unread</span>
          </div>
          <span className="text-[11px] text-slate-400 block">Real-time alerts</span>
        </div>
      </div>

      {/* Enquiries by Status Breakdown */}
      <div className="card-light p-6">
        <h3 className="font-heading font-bold text-slate-900 text-sm mb-4">Project Enquiries by Operational Status</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
          {Object.entries(stats?.enquiries?.byStatus || {}).map(([st, count]) => (
            <div key={st} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-lg font-bold font-mono text-slate-900 block">{count as number}</span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mt-0.5 truncate">
                {st}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Two Columns: Recent Enquiries & Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Enquiries */}
        <div className="card-light p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-heading font-bold text-slate-900 text-sm">Recent Client Submissions</h3>
              <Link to="/admin/enquiries" className="text-xs font-semibold text-brand-600 hover:underline">
                View All Enquiries →
              </Link>
            </div>

            <div className="space-y-3">
              {stats?.recentEnquiries?.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No recent enquiries.</p>
              ) : (
                stats?.recentEnquiries?.map((enq: any) => (
                  <div
                    key={enq._id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-brand-700">{enq.referenceCode}</span>
                        <span className="badge-primary text-[9px] py-0">{enq.status}</span>
                      </div>
                      <span className="text-slate-800 font-medium block mt-0.5">{enq.fullName}</span>
                      <span className="text-[11px] text-slate-400">{enq.service}</span>
                    </div>

                    <Link
                      to="/admin/enquiries"
                      className="text-slate-400 hover:text-slate-800 p-1"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="card-light p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-heading font-bold text-slate-900 text-sm">Recently Updated Projects</h3>
              <Link to="/admin/projects" className="text-xs font-semibold text-brand-600 hover:underline">
                Manage Portfolio →
              </Link>
            </div>

            <div className="space-y-3">
              {stats?.recentProjects?.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No projects in database.</p>
              ) : (
                stats?.recentProjects?.map((proj: any) => (
                  <div
                    key={proj._id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={proj.thumbnailUrl}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block truncate max-w-xs">{proj.title}</span>
                        <span className="badge-neutral text-[9px] py-0">{proj.status}</span>
                      </div>
                    </div>

                    <Link
                      to="/admin/projects"
                      className="text-slate-400 hover:text-slate-800 p-1"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
