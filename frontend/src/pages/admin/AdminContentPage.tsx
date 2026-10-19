import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { FAQItem, BlogPostItem, CompanySettingsData } from '../../types';
import {
  FileText,
  HelpCircle,
  Settings,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  X,
  Save,
} from 'lucide-react';

export const AdminContentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'faqs' | 'blogs' | 'company'>('faqs');
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [blogs, setBlogs] = useState<BlogPostItem[]>([]);
  const [settings, setSettings] = useState<CompanySettingsData | null>(null);
  const [loading, setLoading] = useState(true);

  // FAQ Modal
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [faqForm, setFaqForm] = useState({ question: '', answer: '', category: 'General', isPublished: true });

  // Blog Modal
  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPostItem | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: 'WEENGINEERS Editorial',
    category: 'Engineering',
    tags: '',
    readTimeMinutes: 5,
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    isPublished: true,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [faqsRes, blogsRes, settingsRes] = await Promise.all([
        api.getAdminFAQs(),
        api.getAdminBlogs(),
        api.getAdminSettings(),
      ]);
      if (faqsRes.success) setFaqs(faqsRes.faqs);
      if (blogsRes.success) setBlogs(blogsRes.blogs);
      if (settingsRes.success) setSettings(settingsRes.settings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // FAQ Handlers
  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFaq) {
        await api.updateFAQ(editingFaq._id, faqForm);
      } else {
        await api.createFAQ(faqForm);
      }
      setFaqModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Delete FAQ item?')) return;
    try {
      await api.deleteFAQ(id);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Blog Handlers
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        ...blogForm,
        tags: blogForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };
      if (editingBlog) {
        await api.updateBlogPost(editingBlog._id, payload);
      } else {
        await api.createBlogPost(payload);
      }
      setBlogModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Delete blog article?')) return;
    try {
      await api.deleteBlogPost(id);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Company Settings Update
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await api.updateAdminSettings(settings);
      alert('Company content & settings saved successfully.');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Content Management System</h1>
          <p className="text-xs text-slate-500">Manage frequently asked questions, engineering blog articles, and company copy</p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('faqs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'faqs' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            FAQs ({faqs.length})
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'blogs' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Articles ({blogs.length})
          </button>
          <button
            onClick={() => setActiveTab('company')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'company' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Company Info
          </button>
        </div>
      </div>

      {/* FAQs Tab */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500">Published and internal FAQs</span>
            <button
              onClick={() => {
                setEditingFaq(null);
                setFaqForm({ question: '', answer: '', category: 'General', isPublished: true });
                setFaqModalOpen(true);
              }}
              className="btn-primary text-xs py-1.5 px-3"
            >
              <Plus className="w-3.5 h-3.5" /> Add FAQ Item
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((f) => (
              <div key={f._id} className="card-light p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="badge-primary text-[10px]">{f.category}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingFaq(f);
                          setFaqForm({
                            question: f.question,
                            answer: f.answer,
                            category: f.category,
                            isPublished: f.isPublished,
                          });
                          setFaqModalOpen(true);
                        }}
                        className="p-1 text-slate-400 hover:text-brand-600"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteFaq(f._id)}
                        className="p-1 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs mb-1">{f.question}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{f.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blogs Tab */}
      {activeTab === 'blogs' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500">Engineering blog articles</span>
            <button
              onClick={() => {
                setEditingBlog(null);
                setBlogForm({
                  title: '',
                  slug: '',
                  excerpt: '',
                  content: '',
                  author: 'WEENGINEERS Editorial',
                  category: 'Engineering',
                  tags: 'Architecture, TypeScript',
                  readTimeMinutes: 5,
                  coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
                  isPublished: true,
                });
                setBlogModalOpen(true);
              }}
              className="btn-primary text-xs py-1.5 px-3"
            >
              <Plus className="w-3.5 h-3.5" /> Write New Article
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blogs.map((b) => (
              <div key={b._id} className="card-light p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="badge-primary text-[10px]">{b.category}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingBlog(b);
                          setBlogForm({
                            title: b.title,
                            slug: b.slug,
                            excerpt: b.excerpt,
                            content: b.content,
                            author: b.author,
                            category: b.category,
                            tags: (b.tags || []).join(', '),
                            readTimeMinutes: b.readTimeMinutes,
                            coverImage: b.coverImage || '',
                            isPublished: b.isPublished,
                          });
                          setBlogModalOpen(true);
                        }}
                        className="p-1 text-slate-400 hover:text-brand-600"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(b._id)}
                        className="p-1 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">{b.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">{b.excerpt}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">/{b.slug}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Company Info Tab */}
      {activeTab === 'company' && settings && (
        <form onSubmit={handleSaveSettings} className="card-light p-6 md:p-8 space-y-4 max-w-2xl text-xs">
          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              className="input-field text-xs"
              required
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Official Tagline
            </label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="input-field text-xs font-bold text-brand-700"
              required
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
              About Story
            </label>
            <textarea
              rows={3}
              value={settings.aboutStory}
              onChange={(e) => setSettings({ ...settings, aboutStory: e.target.value })}
              className="input-field text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="input-field text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="input-field text-xs"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button type="submit" className="btn-primary text-xs py-2 px-5">
              <Save className="w-3.5 h-3.5" /> Save Company Details
            </button>
          </div>
        </form>
      )}

      {/* FAQ Modal */}
      {faqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingFaq ? 'Edit FAQ Item' : 'New FAQ Item'}
              </h3>
              <button onClick={() => setFaqModalOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveFaq} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Question
                </label>
                <input
                  type="text"
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  className="input-field text-xs"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Answer
                </label>
                <textarea
                  rows={3}
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  className="input-field text-xs"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={faqForm.category}
                  onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                  className="input-field text-xs cursor-pointer"
                >
                  <option value="General">General</option>
                  <option value="Process">Process</option>
                  <option value="Security">Security</option>
                  <option value="Support">Support</option>
                </select>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFaqModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blog Modal */}
      {blogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingBlog ? 'Edit Article' : 'Compose Engineering Article'}
              </h3>
              <button onClick={() => setBlogModalOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveBlog} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  className="input-field text-xs"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Excerpt (Summary)
                </label>
                <textarea
                  rows={2}
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  className="input-field text-xs"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Full Article Body
                </label>
                <textarea
                  rows={6}
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  className="input-field text-xs"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={blogForm.tags}
                  onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                  className="input-field text-xs"
                />
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBlogModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
