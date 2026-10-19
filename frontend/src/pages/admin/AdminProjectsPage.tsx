import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { ProjectItem } from '../../types';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  ExternalLink,
  X,
  Upload,
  CheckCircle,
} from 'lucide-react';
import { Github } from '../../components/ui/SocialIcons';

export const AdminProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Full-Stack Web Development',
    description: '',
    fullDescription: '',
    technologies: '',
    clientIndustry: '',
    problemStatement: '',
    solution: '',
    measurableResults: '',
    thumbnailUrl: '',
    liveUrl: '',
    githubUrl: '',
    status: 'published',
    isFeatured: false,
  });
  const [saving, setSaving] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminProjects({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: search.trim() || undefined,
      });
      if (res.success) setProjects(res.projects);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProjects();
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Full-Stack Web Development',
      description: '',
      fullDescription: '',
      technologies: 'React, Node.js, Express, MongoDB, TypeScript',
      clientIndustry: '',
      problemStatement: '',
      solution: '',
      measurableResults: '99.9% uptime, 40% efficiency improvement',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      liveUrl: '',
      githubUrl: '',
      status: 'published',
      isFeatured: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (p: ProjectItem) => {
    setEditingProject(p);
    setFormData({
      title: p.title,
      slug: p.slug,
      category: p.category,
      description: p.description,
      fullDescription: p.fullDescription || '',
      technologies: (p.technologies || []).join(', '),
      clientIndustry: p.clientIndustry || '',
      problemStatement: p.problemStatement || '',
      solution: p.solution || '',
      measurableResults: (p.measurableResults || []).join('\n'),
      thumbnailUrl: p.thumbnailUrl,
      liveUrl: p.liveUrl || '',
      githubUrl: p.githubUrl || '',
      status: p.status,
      isFeatured: p.isFeatured,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: any = {
        ...formData,
        technologies: formData.technologies.split(',').map((s) => s.trim()).filter(Boolean),
        measurableResults: formData.measurableResults.split('\n').map((s) => s.trim()).filter(Boolean),
      };

      if (editingProject) {
        await api.updateProject(editingProject._id, payload);
      } else {
        await api.createProject(payload);
      }

      setModalOpen(false);
      fetchProjects();
    } catch (err: any) {
      alert(err.message || 'Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this project record?')) return;
    try {
      await api.deleteProject(id);
      fetchProjects();
    } catch (err: any) {
      alert(err.message || 'Failed to delete project.');
    }
  };

  const toggleFeatured = async (p: ProjectItem) => {
    try {
      await api.updateProject(p._id, { isFeatured: !p.isFeatured });
      setProjects((prev) =>
        prev.map((item) => (item._id === p._id ? { ...item, isFeatured: !item.isFeatured } : item))
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Project Portfolio Management</h1>
          <p className="text-xs text-slate-500">Create, edit, draft, and publish company software projects and case studies</p>
        </div>

        <button onClick={openCreateModal} className="btn-primary text-xs py-2 px-4">
          <Plus className="w-3.5 h-3.5" /> Add Project Record
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 text-xs py-2"
          />
        </form>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {['all', 'published', 'draft', 'archived'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card-light overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Project</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Featured</th>
                <th className="p-4">Technologies</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.thumbnailUrl}
                        alt=""
                        className="w-12 h-10 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block max-w-xs truncate">{p.title}</span>
                        <span className="text-[11px] text-slate-400 block font-mono">/{p.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 font-medium">{p.category}</td>
                  <td className="p-4">
                    <span
                      className={`badge-${
                        p.status === 'published' ? 'success' : p.status === 'draft' ? 'warning' : 'neutral'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => toggleFeatured(p)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        p.isFeatured ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-slate-500'
                      }`}
                      title={p.isFeatured ? 'Featured (Click to unfeature)' : 'Not Featured'}
                    >
                      <Star className={`w-4 h-4 ${p.isFeatured ? 'fill-amber-400' : ''}`} />
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {p.technologies?.slice(0, 3).map((t) => (
                        <span key={t} className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100"
                        title="Edit Project"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50"
                        title="Delete Project"
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

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <h3 className="font-heading font-bold text-slate-900 text-lg">
                {editingProject ? 'Edit Project Specifications' : 'New Project Record'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field text-xs cursor-pointer"
                  >
                    <option value="Website Development">Website Development</option>
                    <option value="Full-Stack Web Development">Full-Stack Web Development</option>
                    <option value="Custom Software Development">Custom Software Development</option>
                    <option value="AI-Powered Applications">AI-Powered Applications</option>
                    <option value="E-commerce Development">E-commerce Development</option>
                    <option value="Mobile Application Development">Mobile Application Development</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Publication Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="input-field text-xs cursor-pointer"
                  >
                    <option value="published">Published (Visible on site)</option>
                    <option value="draft">Draft (Internal only)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Full Architecture Details (Case Study)
                </label>
                <textarea
                  rows={4}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="input-field text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    The Challenge (Problem Statement)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.problemStatement}
                    onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                    className="input-field text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Our Engineered Solution
                  </label>
                  <textarea
                    rows={2}
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    className="input-field text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Technologies (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  className="input-field text-xs"
                  placeholder="React, Node.js, Express, MongoDB"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Thumbnail Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  className="input-field text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Live Demo Link
                  </label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    className="input-field text-xs"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Public GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="input-field text-xs"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <label htmlFor="featuredToggle" className="font-semibold text-slate-800 cursor-pointer">
                  Feature this project prominently on the Homepage and Portfolio
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
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
                  className="btn-primary text-xs"
                >
                  {saving ? 'Saving...' : 'Save Project Specifications'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
