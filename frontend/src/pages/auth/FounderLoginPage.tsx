import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogoBadge } from '../../components/ui/LogoBadge';
import { Crown, Lock, Mail, ArrowRight, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';

export const FounderLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your founder credentials.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Specifically enforce founder role
      const res = await login({ email, password, requiredRole: 'founder' });
      if (res.success) {
        navigate('/founder/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Founder authentication failed. Access restricted.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12">
      <div className="card-light p-8 sm:p-10 max-w-md w-full border border-amber-200/80 shadow-elevated relative overflow-hidden">
        {/* Top Gold Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <LogoBadge variant="hero" linkTo="/" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-2">
            <Crown className="w-3.5 h-3.5 text-amber-600" /> Executive Founder Portal
          </div>
          <h1 className="text-xl font-bold text-slate-900">Founder Authentication</h1>
          <p className="text-xs text-slate-500 mt-1">
            Executive oversight, administrator governance, and business pipeline
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Founder Identity Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                placeholder="founder@weengineers.tech"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10 text-xs"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Master Security Key / Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] font-medium text-amber-700 hover:text-amber-800"
              >
                Reset key?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10 text-xs"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold text-xs transition-all shadow-md mt-2 flex items-center justify-center gap-2"
          >
            {loading ? 'Verifying Founder Cryptographic Key...' : 'Access Founder Console'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-slate-800">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Website
          </Link>

          <Link to="/admin/login" className="font-semibold text-brand-600 hover:text-brand-800">
            Admin Portal →
          </Link>
        </div>
      </div>
    </div>
  );
};
