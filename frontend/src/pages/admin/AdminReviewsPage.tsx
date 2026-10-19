import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { ReviewItem } from '../../types';
import { Star, CheckCircle, XCircle, Flag, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';

export const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminReviews();
      if (res.success) setReviews(res.reviews);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleModerate = async (id: string, status: 'approved' | 'rejected') => {
    const note = prompt(`Enter moderation audit note for marking as ${status}:`, `Editorial check passed`);
    if (note === null) return;

    try {
      const res = await api.moderateReview(id, status, note, true);
      if (res.success) {
        setReviews((prev) =>
          prev.map((r) => (r._id === id ? res.review : r))
        );
      }
    } catch (err: any) {
      alert(err.message || 'Failed to moderate review.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this review submission?')) return;
    try {
      await api.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete review.');
    }
  };

  const filtered = reviews.filter((r) =>
    statusFilter === 'all'
      ? true
      : statusFilter === 'flagged'
      ? r.isFlagged
      : r.status === statusFilter
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Review Moderation Center</h1>
          <p className="text-xs text-slate-500">Audit client testimonials, verify project associations, and approve public display</p>
        </div>

        <div className="flex gap-1.5 self-start sm:self-auto">
          {['all', 'pending', 'approved', 'rejected', 'flagged'].map((st) => (
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((rev) => (
          <div
            key={rev._id}
            className={`card-light p-6 flex flex-col justify-between ${
              rev.isFlagged ? 'border-2 border-red-300 bg-red-50/20' : ''
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-1">({rev.rating}/5)</span>
                </div>

                <span
                  className={`badge-${
                    rev.status === 'approved' ? 'success' : rev.status === 'pending' ? 'warning' : 'neutral'
                  } text-[10px] uppercase`}
                >
                  {rev.status}
                </span>
              </div>

              {rev.isFlagged && (
                <div className="mb-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[11px] flex items-center gap-2">
                  <Flag className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                  <span>Flagged: {rev.flagReason || 'Requires editorial scrutiny'}</span>
                </div>
              )}

              <p className="text-xs text-slate-700 italic leading-relaxed mb-4">
                "{rev.reviewText}"
              </p>

              <div className="mb-4">
                <span className="font-bold text-slate-900 text-xs block">{rev.clientName}</span>
                <span className="text-[11px] text-slate-500">
                  {rev.clientRole ? `${rev.clientRole}, ` : ''}
                  {rev.clientCompany || 'Corporate Client'}
                </span>
                {rev.projectId && (
                  <span className="badge-primary text-[9px] mt-1 block max-w-fit">
                    Project: {rev.projectId.title}
                  </span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                {new Date(rev.createdAt).toLocaleDateString()}
              </span>

              <div className="flex items-center gap-2">
                {rev.status !== 'approved' && (
                  <button
                    onClick={() => handleModerate(rev._id, 'approved')}
                    className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold flex items-center gap-1"
                    title="Approve Review"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                  </button>
                )}

                {rev.status !== 'rejected' && (
                  <button
                    onClick={() => handleModerate(rev._id, 'rejected')}
                    className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1"
                    title="Reject Review"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                )}

                <button
                  onClick={() => handleDelete(rev._id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 card-light max-w-md mx-auto">
          <p className="text-xs text-slate-500">No reviews found in this moderation category.</p>
        </div>
      )}
    </div>
  );
};
