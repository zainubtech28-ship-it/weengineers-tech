import React, { useState } from 'react';
import { api } from '../../services/api';
import { Search, X, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export const EnquiryTrackerModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [referenceCode, setReferenceCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceCode.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.trackEnquiry(referenceCode.trim());
      if (res.success && res.enquiry) {
        setResult(res.enquiry);
      }
    } catch (err: any) {
      setError(err.message || 'No enquiry found with that reference number.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-100">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-slate-900 text-lg">Track Your Project Enquiry</h3>
            <p className="text-xs text-slate-500">Check current review stage and timeline status</p>
          </div>
        </div>

        <form onSubmit={handleTrack} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. WE-2026-INIT01"
              value={referenceCode}
              onChange={(e) => setReferenceCode(e.target.value.toUpperCase())}
              className="input-field font-mono uppercase tracking-wider text-sm flex-1"
            />
            <button
              type="submit"
              disabled={loading || !referenceCode.trim()}
              className="btn-primary py-2.5 px-5 text-xs font-semibold whitespace-nowrap"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Ref: {result.referenceCode}
              </span>
              <span className="badge-primary font-bold text-xs">{result.status}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block">Client:</span>
                <span className="font-medium text-slate-800">{result.clientName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Service:</span>
                <span className="font-medium text-slate-800">{result.service}</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-500 block mb-2">History & Milestones:</span>
              <div className="space-y-2">
                {result.timeline?.map((step: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="font-medium">{step.status}</span>
                    <span className="text-slate-400 text-[11px] ml-auto">
                      {new Date(step.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
