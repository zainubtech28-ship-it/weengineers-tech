import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ReviewItem } from '../types';
import {
  Star,
  MessageSquare,
  ShieldCheck,
  Flag,
  CheckCircle,
  AlertCircle,
  Search,
} from 'lucide-react';
import { SubmitReviewModal } from '../components/reviews/SubmitReviewModal';

export const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(5.0);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportingId, setReportingId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportStatus, setReportStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await api.getReviews();
      if (res.success) {
        setReviews(res.reviews);
        setTotalReviews(res.totalReviews);
        setAverageRating(res.averageRating);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleReport = async (id: string) => {
    try {
      await api.reportReview(id, reportReason || 'Flagged by website visitor');
      setReportStatus('Report submitted for editorial review.');
      setTimeout(() => {
        setReportingId(null);
        setReportStatus(null);
        setReportReason('');
      }, 2500);
    } catch (err: any) {
      alert(err.message || 'Failed to submit report.');
    }
  };

  const filteredReviews = reviews.filter((r) =>
    filterRating === 'all' ? true : r.rating === filterRating
  );

  return (
    <div className="pt-28 pb-20">
      {/* Header */}
      <section className="bg-slate-50/70 border-b border-slate-200/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="badge-primary mb-3">Transparency & Auditability</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Audited Client Reviews & Ratings
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
            Read verified appraisals from partners who entrusted their critical digital infrastructure to WEENGINEERS TECH.
          </p>

          {/* Average Rating Scorecard */}
          <div className="card-light p-6 max-w-md mx-auto flex items-center justify-around shadow-sm border border-slate-200">
            <div className="text-center">
              <span className="text-4xl font-extrabold text-slate-900 font-mono">
                {averageRating.toFixed(1)}
              </span>
              <div className="flex items-center gap-1 text-amber-400 mt-1 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(averageRating) ? 'fill-amber-400' : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] text-slate-400 font-medium mt-1 block">
                Out of 5 Stars
              </span>
            </div>

            <div className="h-12 w-[1px] bg-slate-200" />

            <div className="text-center">
              <span className="text-4xl font-extrabold text-brand-700 font-mono">
                {totalReviews}
              </span>
              <span className="text-xs font-semibold text-slate-700 block mt-1">
                Verified Reviews
              </span>
              <span className="text-[11px] text-emerald-600 font-medium block">
                100% Genuine Audit
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
            {/* Filter by star rating */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Filter Rating:
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setFilterRating('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    filterRating === 'all'
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({totalReviews})
                </button>
                {[5, 4, 3].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFilterRating(star)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      filterRating === star
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {star} Stars
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Review Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary text-xs py-2.5 px-4 font-semibold"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Submit a Verified Review
            </button>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((rev) => (
              <div key={rev._id} className="card-light p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    {rev.isVerified && (
                      <span className="badge-success text-[10px] flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Verified Client
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 italic leading-relaxed mb-6">
                    "{rev.reviewText}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{rev.clientName}</h4>
                      <p className="text-[11px] text-slate-400">
                        {rev.clientRole ? `${rev.clientRole}, ` : ''}
                        {rev.clientCompany || 'Corporate Client'}
                      </p>
                    </div>

                    <button
                      onClick={() => setReportingId(rev._id)}
                      className="text-[10px] text-slate-400 hover:text-red-500 p-1 flex items-center gap-1"
                      title="Report Review"
                    >
                      <Flag className="w-3 h-3" /> Report
                    </button>
                  </div>

                  {/* Inline Report Input */}
                  {reportingId === rev._id && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 animate-in fade-in duration-200">
                      {reportStatus ? (
                        <p className="text-xs text-emerald-600 font-medium">{reportStatus}</p>
                      ) : (
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Reason for report..."
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                            className="input-field text-xs py-1.5"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setReportingId(null)}
                              className="text-xs text-slate-500"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleReport(rev._id)}
                              className="btn-danger text-[11px] py-1 px-3"
                            >
                              Submit Report
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredReviews.length === 0 && (
            <div className="text-center py-16 card-light max-w-md mx-auto">
              <p className="text-sm text-slate-500">No reviews found for this rating filter.</p>
              <button onClick={() => setFilterRating('all')} className="btn-secondary text-xs mt-3">
                Show All Reviews
              </button>
            </div>
          )}
        </div>
      </section>

      <SubmitReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitted={fetchReviews}
      />
    </div>
  );
};
