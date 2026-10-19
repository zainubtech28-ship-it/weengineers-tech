import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { User } from '../../types';
import {
  UserCheck,
  Plus,
  Shield,
  Trash2,
  CheckCircle,
  XCircle,
  X,
  AlertCircle,
  Lock,
} from 'lucide-react';

export const FounderGovernancePage: React.FC = () => {
  const [admins, setAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    permissions: ['projects', 'services', 'enquiries', 'reviews', 'content'],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await api.getAdministrators();
      if (res.success) setAdmins(res.admins);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const res = await api.createAdministrator(formData);
      if (res.success) {
        setModalOpen(false);
        setFormData({
          name: '',
          email: '',
          password: '',
          phone: '',
          permissions: ['projects', 'services', 'enquiries', 'reviews', 'content'],
        });
        fetchAdmins();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create administrator.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (admin: User) => {
    const newStatus = (admin as any).status === 'active' ? 'inactive' : 'active';
    try {
      await api.toggleAdminStatus(admin.id, newStatus);
      setAdmins((prev) =>
        prev.map((a) => (a.id === admin.id ? { ...a, status: newStatus } as any : a))
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (!confirm('Revoke administrator access and permanently delete this account?')) return;
    try {
      await api.deleteAdministrator(id);
      setAdmins((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200/80">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Administrator Governance & Access Control</h1>
          <p className="text-xs text-slate-500">
            Provision, review, activate, or revoke administrative staff credentials. Exclusive to Founder.
          </p>
        </div>

        <button
          onClick={() => {
            setError(null);
            setModalOpen(true);
          }}
          className="btn-primary text-xs py-2 px-4 bg-amber-600 hover:bg-amber-700 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" /> Provision Administrator
        </button>
      </div>

      {/* Admins Table */}
      <div className="card-light overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Administrator</th>
                <th className="p-4">Role</th>
                <th className="p-4">Account Status</th>
                <th className="p-4">Permissions</th>
                <th className="p-4">Created Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {admins.map((adm: any) => (
                <tr key={adm._id || adm.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-slate-900 block">{adm.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono block">{adm.email}</span>
                  </td>
                  <td className="p-4">
                    <span className="badge-primary text-[10px] uppercase">
                      {adm.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`badge-${
                        adm.status === 'active' ? 'success' : 'neutral'
                      } text-[10px] uppercase`}
                    >
                      {adm.status || 'active'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {adm.permissions?.map((p: string) => (
                        <span key={p} className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-slate-400">
                    {new Date(adm.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleStatus(adm)}
                        className={`p-1.5 rounded-lg text-xs font-semibold ${
                          adm.status === 'active'
                            ? 'text-amber-700 hover:bg-amber-50'
                            : 'text-emerald-700 hover:bg-emerald-50'
                        }`}
                        title={adm.status === 'active' ? 'Deactivate Account' : 'Reactivate Account'}
                      >
                        {adm.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>

                      <button
                        onClick={() => handleDeleteAdmin(adm._id || adm.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete Administrator"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Provision New Administrator Account</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Liam Parker"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Corporate Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="liam@weengineers.tech"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Initial Password (Min 8 Chars) <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Direct Phone (Optional)
                </label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary text-xs bg-amber-600 hover:bg-amber-700"
                >
                  {saving ? 'Provisioning...' : 'Provision Administrator'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
