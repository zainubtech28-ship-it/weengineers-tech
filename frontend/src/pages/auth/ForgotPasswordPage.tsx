import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { LogoBadge } from '../../components/ui/LogoBadge';
import { Mail, ArrowRight, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [devToken, setDevToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.forgotPassword(email);
      if (res.success) {
        setSubmitted(true);
        if (res.devResetToken) setDevToken(res.devResetToken);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process password reset request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12">
      <div className="card-light p-8 sm:p-10 max-w-md w-full border border-slate-200/90 shadow-elevated">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <LogoBadge variant="hero" linkTo="/" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Reset Your Password</h1>
          <p className="text-xs text-slate-500 mt-1">
            Enter your authorized account email to receive a secure, single-use recovery link.
          </p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100">
              <CheckCircle className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              If an account is associated with <span className="font-semibold text-slate-800">{email}</span>, a cryptographic reset token has been dispatched.
            </p>

            {devToken && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-left text-xs space-y-2">
                <span className="font-bold text-amber-900 block">Development Reset Token:</span>
                <code className="text-[11px] block break-all bg-white p-2 rounded border border-amber-200 text-slate-800 font-mono">
                  {devToken}
                </code>
                <Link
                  to={`/reset-password?token=${devToken}`}
                  className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:underline pt-1"
                >
                  Proceed to Reset Screen Directly <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100">
              <Link to="/admin/login" className="btn-secondary text-xs w-full justify-center">
                <ArrowLeft className="w-3.5 h-3.5" /> Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Authorized Account Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  placeholder="name@weengineers.tech"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10 text-xs"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-xs font-semibold shadow-md mt-2"
            >
              {loading ? 'Generating Security Token...' : 'Send Recovery Instructions'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="text-center pt-4">
              <Link to="/admin/login" className="text-xs text-slate-500 hover:text-slate-800">
                Cancel and return to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
