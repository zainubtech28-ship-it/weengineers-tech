import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { ServiceItem } from '../../types';
import { Layers, Plus, Edit2, Trash2, CheckCircle, X, Globe } from 'lucide-react';

export const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    icon: 'Layers',
    benefits: '',
    technologies: '',
    isPublished: true,
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminServices();
      if (res.success) setServices(res.services);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openEdit = (s: ServiceItem) => {
    setEditingService(s);
    setFormData({
      title: s.title,
      slug: s.slug,
      shortDescription: s.shortDescription,
      fullDescription: s.fullDescription,
      icon: s.icon,
      benefits: (s.benefits || []).join('\n'),
      technologies: (s.technologies || []).join(', '),
      isPublished: s.isPublished,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        ...formData,
        benefits: formData.benefits.split('\n').map((b) => b.trim()).filter(Boolean),
        technologies: formData.technologies.split(',').map((t) => t.trim()).filter(Boolean),
      };

      if (editingService) {
        await api.updateService(editingService._id, payload);
      } else {
        await api.createService(payload);
      }
      setModalOpen(false);
      fetchServices();
    } catch (err: any) {
      alert(err.message || 'Failed to save service.');
    }
  };

  const togglePublish = async (s: ServiceItem) => {
    try {
      await api.updateService(s._id, { isPublished: !s.isPublished });
      setServices((prev) =>
        prev.map((item) => (item._id === s._id ? { ...item, isPublished: !item.isPublished } : item))
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Company Services Directory</h1>
          <p className="text-xs text-slate-500">Configure descriptions, capabilities, technical benefits, and public visibility</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc) => (
          <div key={svc._id} className="card-light p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="badge-primary text-[10px] font-mono">Order #{svc.order}</span>
                <button
                  onClick={() => togglePublish(svc)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${
                    svc.isPublished ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {svc.isPublished ? 'Published' : 'Hidden'}
                </button>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">{svc.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">{svc.shortDescription}</p>

              <div className="flex flex-wrap gap-1 mb-4">
                {svc.technologies?.slice(0, 3).map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">/{svc.slug}</span>
              <button
                onClick={() => openEdit(svc)}
                className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <Edit2 className="w-3 h-3" /> Edit Specs
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-heading font-bold text-slate-900 text-base">
                Edit Service: {editingService?.title}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Service Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Short Summary
                </label>
                <textarea
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="input-field text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Full Architectural Description
                </label>
                <textarea
                  rows={4}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="input-field text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Key Benefits (One per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  className="input-field text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Associated Technologies (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
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
                <button type="submit" className="btn-primary text-xs">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
