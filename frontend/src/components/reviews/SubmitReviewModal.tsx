import React, { useState } from 'react';
import { api } from '../../services/api';
import { Star, X, CheckCircle, AlertCircle } from 'lucide-react';

export const SubmitReviewModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmitted?: () => void }> = ({
  isOpen,
  onClose,
  onSubmitted,
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientRole, setClientRole] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !reviewText.trim()) {
      setError('Please provide your name and constructive feedback.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await api.submitReview({
        clientName: clientName.trim(),
        clientCompany: clientCompany.trim() || undefined,
        clientRole: clientRole.trim() || undefined,
        rating,
        reviewText: reviewText.trim(),
      });

      if (res.success) {
        setSubmitted(true);
        if (onSubmitted) onSubmitted();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h3 className="font-heading font-bold text-slate-900 text-xl mb-2">Review Submitted</h3>
            <p className="text-slate-600 text-xs leading-relaxed max-w-sm mx-auto mb-6">
              Thank you for sharing your experience with WEENGINEERS TECH. To ensure transparency and integrity, genuine client feedback is published following brief editorial verification.
            </p>
            <button onClick={onClose} className="btn-secondary text-xs">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="badge-primary mb-1">Client Feedback</span>
              <h3 className="font-heading font-bold text-slate-900 text-xl">Rate Your Experience</h3>
              <p className="text-xs text-slate-500">Your feedback helps uphold our commitment to exceeding expectations.</p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Star Rating Picker */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Rating
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= (hoverRating || rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 ml-2">
                  {hoverRating || rating} of 5 Stars
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. David King"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Company / Brand (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. King Retail Group"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Your Role / Title (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Chief Technology Officer"
                value={clientRole}
                onChange={(e) => setClientRole(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Written Review <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Share your perspective on the project execution, engineering quality, communication, and results..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button type="button" onClick={onClose} className="btn-secondary text-xs">
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary text-xs"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
