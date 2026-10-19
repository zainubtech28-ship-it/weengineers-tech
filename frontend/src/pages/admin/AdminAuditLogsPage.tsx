import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { AuditLogItem } from '../../types';
import { History, Search, Filter, Shield } from 'lucide-react';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.getAuditLogs({
        module: moduleFilter !== 'all' ? moduleFilter : undefined,
        search: search.trim() || undefined,
      });
      if (res.success) setLogs(res.logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [moduleFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs();
  };

  const modules = ['all', 'AUTH', 'PROJECTS', 'SERVICES', 'TEAM', 'ENQUIRIES', 'REVIEWS', 'SETTINGS', 'GOVERNANCE'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">System Audit Trail</h1>
          <p className="text-xs text-slate-500">Immutable record of administrative operations, data modifications, and security events</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by user email, action..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 text-xs py-2"
          />
        </form>

        <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
          {modules.map((m) => (
            <button
              key={m}
              onClick={() => setModuleFilter(m)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-colors ${
                moduleFilter === m ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="card-light overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Operator</th>
                <th className="p-4">Role</th>
                <th className="p-4">Action</th>
                <th className="p-4">Module</th>
                <th className="p-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 text-slate-500 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4 font-sans font-bold text-slate-900">{log.userEmail}</td>
                  <td className="p-4">
                    <span className="badge-primary text-[9px] py-0">{log.userRole}</span>
                  </td>
                  <td className="p-4 font-bold text-brand-700">{log.action}</td>
                  <td className="p-4 text-slate-600 font-sans">{log.module}</td>
                  <td className="p-4 text-slate-500 max-w-xs truncate">
                    {log.details ? JSON.stringify(log.details) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {logs.length === 0 && (
        <div className="text-center py-16 card-light max-w-md mx-auto">
          <p className="text-xs text-slate-500">No audit logs matching this search.</p>
        </div>
      )}
    </div>
  );
};
