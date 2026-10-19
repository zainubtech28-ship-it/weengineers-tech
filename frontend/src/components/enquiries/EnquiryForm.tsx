import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../../services/api';
import {
  Send,
  CheckCircle,
  Copy,
  Clock,
  Sparkles,
  Search,
  ExternalLink,
} from 'lucide-react';

interface EnquiryFormInputs {
  fullName: string;
  email: string;
  phone?: string;
  companyName?: string;
  service: string;
  budget?: string;
  timeline?: string;
  description: string;
  preferredContactMethod: 'email' | 'phone' | 'whatsapp';
  consent: boolean;
}

export const EnquiryForm: React.FC<{ initialService?: string }> = ({ initialService }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReference, setSubmittedReference] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquiryFormInputs>({
    defaultValues: {
      service: initialService || 'Full-Stack Web Development',
      preferredContactMethod: 'email',
      consent: true,
    },
  });

  const onSubmit = async (data: EnquiryFormInputs) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await api.submitEnquiry(data);
      if (res.success && res.referenceCode) {
        setSubmittedReference(res.referenceCode);
        reset();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReference = () => {
    if (submittedReference) {
      navigator.clipboard.writeText(submittedReference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const servicesList = [
    'Website Development',
    'Full-Stack Web Development',
    'Custom Software Development',
    'E-commerce Development',
    'Mobile Application Development',
    'UI/UX Design',
    'API Development and Integration',
    'Database Development',
    'AI-Powered Applications',
    'Website Maintenance and Support',
    'Software Testing and Deployment',
    'Cloud and Hosting Solutions',
  ];

  if (submittedReference) {
    return (
      <div className="card-light p-8 md:p-10 text-center animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-100">
          <CheckCircle className="w-8 h-8" />
        </div>
        <span className="badge-primary mb-2">Project Enquiry Registered</span>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Thank You for Your Vision!</h3>
        <p className="text-slate-600 max-w-md mx-auto text-sm leading-relaxed mb-6">
          Your project specifications have been logged securely into our engineering database. An engineering project lead will review your submission and follow up within 24–48 hours.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-sm mx-auto mb-8 text-left">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Your Unique Tracking Reference
          </span>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xl font-mono font-bold text-brand-700 tracking-wider">
              {submittedReference}
            </span>
            <button
              onClick={copyReference}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors shadow-sm"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" /> Copy
                </>
              )}
            </button>
          </div>
        </div>

        <button
          onClick={() => setSubmittedReference(null)}
          className="btn-secondary text-xs"
        >
          Submit Another Project Enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Row 1: Name & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Eleanor Vance"
            className={`input-field ${errors.fullName ? 'border-red-400' : ''}`}
            {...register('fullName', { required: 'Please enter your full name.' })}
          />
          {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Business Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="e.g. eleanor@company.com"
            className={`input-field ${errors.email ? 'border-red-400' : ''}`}
            {...register('email', {
              required: 'Please enter your business email.',
              pattern: { value: /^\S+@\S+$/i, message: 'Please enter a valid email address.' },
            })}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>
      </div>

      {/* Row 2: Phone & Company */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Phone / WhatsApp (Optional)
          </label>
          <input
            type="tel"
            placeholder="+1 (555) 000-0000"
            className="input-field"
            {...register('phone')}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Organization / Company (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Strata Logistics Inc."
            className="input-field"
            {...register('companyName')}
          />
        </div>
      </div>

      {/* Row 3: Service Selection */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
          Required Core Service <span className="text-red-500">*</span>
        </label>
        <select
          className="input-field cursor-pointer"
          {...register('service', { required: 'Please select a service.' })}
        >
          {servicesList.map((svc) => (
            <option key={svc} value={svc}>
              {svc}
            </option>
          ))}
        </select>
      </div>

      {/* Row 4: Budget & Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Estimated Budget (Optional)
          </label>
          <select className="input-field cursor-pointer" {...register('budget')}>
            <option value="">Select an investment tier...</option>
            <option value="$3,000 - $7,000">$3,000 – $7,000 (Starter / MVP)</option>
            <option value="$7,000 - $15,000">$7,000 – $15,000 (Growth Platform)</option>
            <option value="$15,000 - $35,000">$15,000 – $35,000 (Full-Stack Enterprise)</option>
            <option value="$35,000 - $75,000">$35,000 – $75,000 (Custom Architecture)</option>
            <option value="$75,000+">$75,000+ (High-Scale Multi-Tenant)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Target Timeline (Optional)
          </label>
          <select className="input-field cursor-pointer" {...register('timeline')}>
            <option value="">Expected launch schedule...</option>
            <option value="Under 1 month">Under 1 month (Expedited)</option>
            <option value="1 - 2 months">1 – 2 months</option>
            <option value="2 - 4 months">2 – 4 months (Standard)</option>
            <option value="4+ months">4+ months (Enterprise)</option>
            <option value="Flexible">Flexible / Ongoing Discovery</option>
          </select>
        </div>
      </div>

      {/* Row 5: Project Description */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
          Project Vision & Requirements <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={4}
          placeholder="Describe your current challenge, target audience, core features needed, or existing tech stack..."
          className={`input-field ${errors.description ? 'border-red-400' : ''}`}
          {...register('description', {
            required: 'Please provide a brief description of your project vision.',
            minLength: { value: 15, message: 'Please provide at least 15 characters of detail.' },
          })}
        />
        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
      </div>

      {/* Preferred Contact Method */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
          Preferred Response Method
        </label>
        <div className="flex flex-wrap gap-4 text-xs">
          {['email', 'phone', 'whatsapp'].map((method) => (
            <label key={method} className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="radio"
                value={method}
                {...register('preferredContactMethod')}
                className="text-brand-600 focus:ring-brand-500"
              />
              <span className="capitalize">{method === 'whatsapp' ? 'WhatsApp' : method}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Consent */}
      <div className="flex items-start gap-2.5 pt-1">
        <input
          type="checkbox"
          id="consent"
          {...register('consent', { required: 'Consent is required to process enquiry.' })}
          className="mt-1 rounded text-brand-600 focus:ring-brand-500"
        />
        <label htmlFor="consent" className="text-xs text-slate-500 cursor-pointer">
          I consent to WEENGINEERS TECH reviewing my project details and contacting me with technical proposals and architectural recommendations.
        </label>
      </div>
      {errors.consent && <p className="text-xs text-red-500">{errors.consent.message}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full py-3.5 text-sm font-semibold shadow-md"
      >
        {isSubmitting ? (
          <span className="inline-flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Transmitting Specifications...
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            <Send className="w-4 h-4" />
            Submit Project Specifications
          </span>
        )}
      </button>
    </form>
  );
};
