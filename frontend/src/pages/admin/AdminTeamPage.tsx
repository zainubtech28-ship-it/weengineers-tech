import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { TeamMemberItem } from '../../types';
import { Plus, Edit2, Trash2, X, CheckCircle, Eye, EyeOff } from 'lucide-react';

export const AdminTeamPage: React.FC = () => {
  const [team, setTeam] = useState<TeamMemberItem[]>([]);
  const [_loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMemberItem | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    designation: 'B.Tech Information Technology — 3rd Year',
    order: 1,
    isVisible: true,
  });

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminTeam();
      if (res.success && Array.isArray(res.team)) {
        const sorted = [...res.team].sort((a, b) => (a.order || 0) - (b.order || 0));
        setTeam(sorted);
      }
    } catch (err) {
      console.error('Failed to fetch team members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const openCreate = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      designation: 'B.Tech Information Technology — 3rd Year',
      order: team.length + 1,
      isVisible: true,
    });
    setModalOpen(true);
  };

  const openEdit = (m: TeamMemberItem) => {
    setEditingMember(m);
    setFormData({
      name: m.name,
      designation: m.designation || 'B.Tech Information Technology — 3rd Year',
      order: m.order || 1,
      isVisible: m.isVisible !== false,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name.trim(),
        designation: formData.designation.trim() || 'B.Tech Information Technology — 3rd Year',
        order: Number(formData.order) || 1,
        isVisible: formData.isVisible,
      };

      if (editingMember) {
        await api.updateTeamMember(editingMember._id, payload);
      } else {
        await api.createTeamMember(payload);
      }

      setModalOpen(false);
      fetchTeam();
    } catch (err: any) {
      alert(err.message || 'Failed to save team member.');
    }
  };

  const handleDelete = async (m: TeamMemberItem) => {
    if (!confirm(`Are you sure you want to remove ${m.name} from the team roster?`)) return;
    try {
      await api.deleteTeamMember(m._id);
      fetchTeam();
    } catch (err: any) {
      alert(err.message || 'Failed to delete team member.');
    }
  };

  const toggleVisibility = async (m: TeamMemberItem) => {
    try {
      await api.updateTeamMember(m._id, { isVisible: !m.isVisible });
      fetchTeam();
    } catch (err: any) {
      alert(err.message || 'Failed to update visibility.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Official Team Members Directory</h1>
          <p className="text-xs text-slate-500">
            Manage names, academic degree details, and display ordering ({team.length} members registered)
          </p>
        </div>

        <button onClick={openCreate} className="btn-primary text-xs py-2 px-4 self-start sm:self-auto">
          <Plus className="w-3.5 h-3.5" /> Add Team Member
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {team.map((member, index) => (
          <div
            key={member._id}
            className="card-light p-5 flex flex-col justify-between hover:border-brand-300 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  #{String(member.order || index + 1).padStart(2, '0')}
                </span>

                <button
                  onClick={() => toggleVisibility(member)}
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                    member.isVisible
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                  title="Click to toggle public visibility"
                >
                  {member.isVisible ? (
                    <>
                      <Eye className="w-3 h-3" /> Visible
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3" /> Hidden
                    </>
                  )}
                </button>
              </div>

              <h3 className="font-bold text-slate-900 text-base mb-1 tracking-tight">{member.name}</h3>
              <p className="text-xs font-medium text-brand-600">
                {member.designation || 'B.Tech Information Technology — 3rd Year'}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="text-[11px] font-mono text-slate-400">Order: {member.order || index + 1}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEdit(member)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 transition-colors"
                  title="Edit Member Details"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(member)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Remove Member"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Create/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-heading font-bold text-slate-900 text-base">
                {editingMember ? 'Edit Team Member' : 'Add Team Member'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. SURESH R"
                  className="input-field text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Degree & Academic Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="input-field text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Display Sequence Order
                </label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) || 1 })}
                  className="input-field text-xs font-mono"
                  required
                />
                <p className="text-[11px] text-slate-400 mt-1">Controls the appearance order (1 to 13) in the team grid.</p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isVisible"
                  checked={formData.isVisible}
                  onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                  className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                />
                <label htmlFor="isVisible" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Visible on public website
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary text-xs py-2 px-3"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs py-2 px-4">
                  <CheckCircle className="w-3.5 h-3.5" /> Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
