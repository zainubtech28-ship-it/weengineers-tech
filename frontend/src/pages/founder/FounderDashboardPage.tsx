import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import {
  Crown,
  TrendingUp,
  Inbox,
  CheckCircle2,
  Users,
  ShieldCheck,
  Star,
  FileSpreadsheet,
  ArrowRight,
  Sliders,
  DollarSign,
  Activity,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export const FounderDashboardPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await api.getFounderOverview();
        if (res.success) setData(res.executive);
      } catch (err) {
        console.error('Failed to load founder overview:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-slate-500">Compiling executive intelligence metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Executive Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-2">
            <Crown className="w-3.5 h-3.5 text-amber-600" /> Founder Executive Suite
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Executive Company Oversight</h1>
          <p className="text-xs text-slate-500">
            High-level business pipeline, conversion analytics, administrative governance, and system health
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/founder/reports" className="btn-secondary text-xs py-2 px-3.5">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Export Reports
          </Link>
          <Link to="/founder/governance" className="btn-primary text-xs py-2 px-3.5 bg-amber-600 hover:bg-amber-700">
            <Users className="w-3.5 h-3.5" /> Manage Admins
          </Link>
        </div>
      </div>

      {/* High-Level Executive KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card-light p-6 space-y-2 border border-amber-200/60 bg-gradient-to-br from-amber-50/30 to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Conversion Ratio</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-extrabold font-mono text-slate-900">{data?.conversionRate || 0}%</span>
          <span className="text-[11px] text-slate-400 block">Enquiries reaching Proposal/Active stages</span>
        </div>

        <div className="card-light p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Enquiries</span>
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-extrabold font-mono text-slate-900">{data?.totalEnquiries || 0}</span>
          <span className="text-[11px] text-emerald-600 font-semibold block">{data?.newEnquiries || 0} pending review</span>
        </div>

        <div className="card-light p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Governed Administrators</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-extrabold font-mono text-slate-900">{data?.totalAdmins || 0}</span>
          <span className="text-[11px] text-slate-400 block">Under active security governance</span>
        </div>

        <div className="card-light p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Audited Client Rating</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-extrabold font-mono text-slate-900">{data?.averageRating || 5.0} / 5</span>
          <span className="text-[11px] text-slate-400 block">{data?.approvedReviews || 0} verified client reviews</span>
        </div>
      </div>

      {/* Analytics Charts: Monthly Inquiries & Service Popularity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Monthly Enquiries Chart (7 columns) */}
        <div className="lg:col-span-7 card-light p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-heading font-bold text-slate-900 text-sm">Monthly Inbound Enquiry Trends</h3>
              <p className="text-[11px] text-slate-400">Database-backed submission volume</p>
            </div>
            <span className="badge-primary text-[10px]">Real Database Records</span>
          </div>

          <div className="h-64 w-full pt-4">
            {data?.monthlyTrends && data.monthlyTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" fontSize={11} stroke="#94a3b8" />
                  <YAxis allowDecimals={false} fontSize={11} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '0.75rem',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="enquiries" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Awaiting historical enquiry records.
              </div>
            )}
          </div>
        </div>

        {/* Service Popularity (5 columns) */}
        <div className="lg:col-span-5 card-light p-6 space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-heading font-bold text-slate-900 text-sm">Service Demand Breakdown</h3>
            <p className="text-[11px] text-slate-400">Most requested technical services</p>
          </div>

          <div className="space-y-3">
            {data?.servicePopularity?.map((item: any) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700 truncate max-w-[200px]">{item.name}</span>
                  <span className="font-mono font-bold text-slate-900">{item.count} leads</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-brand-600 rounded-full"
                    style={{
                      width: `${Math.min(100, (item.count / (data.totalEnquiries || 1)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Administrative Security Actions */}
      <div className="card-light p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h3 className="font-heading font-bold text-slate-900 text-sm">Recent Administrative & Security Events</h3>
            <p className="text-[11px] text-slate-400">Audit trail of privileged changes</p>
          </div>
          <Link to="/founder/security" className="text-xs font-semibold text-amber-700 hover:underline">
            View Complete Security Audit Center →
          </Link>
        </div>

        <div className="space-y-2 font-mono text-[11px]">
          {data?.recentAuditLogs?.slice(0, 5).map((log: any) => (
            <div
              key={log._id}
              className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-brand-700">{log.action}</span>
                <span className="text-slate-400 font-sans text-xs">by {log.userEmail}</span>
                <span className="badge-neutral text-[9px] py-0">{log.module}</span>
              </div>
              <span className="text-slate-400 text-[10px]">
                {new Date(log.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
