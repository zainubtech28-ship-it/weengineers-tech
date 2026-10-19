import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { CompanySettingsData } from '../../types';
import { Building, Save, Crown, CheckCircle } from 'lucide-react';

export const FounderBrandingPage: React.FC = () => {
  const [settings, setSettings] = useState<CompanySettingsData | null>(null);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.getSettings();
        if (res.success) setSettings(res.settings);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setStatusMsg(null);
    try {
      const res = await api.updateCompanyBranding(settings);
      if (res.success) {
        setStatusMsg('Company profile and branding settings updated.');
        setTimeout(() => setStatusMsg(null), 3000);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update branding.');
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return <div className="py-20 text-center text-xs text-slate-500">Loading company branding profile...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200/80">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Company Identity & Strategic Branding</h1>
          <p className="text-xs text-slate-500">
            Founder control over legal company name, official tagline, mission, and vision statements
          </p>
        </div>
      </div>

      {statusMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="card-light p-6 md:p-8 space-y-6 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Legal Company Name
            </label>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              className="input-field text-xs font-bold"
              required
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
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
        </div>

        <div>
          <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Mission Statement
          </label>
          <textarea
            rows={3}
            value={settings.mission}
            onChange={(e) => setSettings({ ...settings, mission: e.target.value })}
            className="input-field text-xs leading-relaxed"
            required
          />
        </div>

        <div>
          <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Vision Statement
          </label>
          <textarea
            rows={3}
            value={settings.vision}
            onChange={(e) => setSettings({ ...settings, vision: e.target.value })}
            className="input-field text-xs leading-relaxed"
            required
          />
        </div>

        <div>
          <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Company Story (Displayed on About Us page)
          </label>
          <textarea
            rows={4}
            value={settings.aboutStory}
            onChange={(e) => setSettings({ ...settings, aboutStory: e.target.value })}
            className="input-field text-xs leading-relaxed"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Direct Business Email
            </label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="input-field text-xs"
              required
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Official Phone
            </label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="input-field text-xs"
              required
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              WhatsApp Integration Number
            </label>
            <input
              type="text"
              value={settings.whatsappNumber || ''}
              onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
              className="input-field text-xs"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary text-xs py-2.5 px-6 bg-amber-600 hover:bg-amber-700"
          >
            <Save className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save Corporate Identity'}
          </button>
        </div>
      </form>
    </div>
  );
};
