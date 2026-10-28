import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../../services/api';
import {
  Send,
  CheckCircle,
  Copy,
  Sparkles,
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
      service: initialService || 'Custom Software Development',
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
    'Custom Software Development',
    'Web Development',
    'Mobile App Development',
    'AI & Automation',
    'Cloud & DevOps',
    'UI/UX Design',
    'API & System Integration',
    'Cybersecurity & Maintenance',
    'Full-Stack Web Development',
    'E-commerce Development',
    'Database Development',
    'Software Testing and Deployment',
  ];

  if (submittedReference) {
    return (
      <div className="card-gold p-8 md:p-10 text-center animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-[#1a1508] text-[#e8b84a] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#a87a1c]/40">
          <CheckCircle className="w-8 h-8" />
        </div>
        <span className="badge-primary mb-2">Project Enquiry Registered</span>
        <h3 className="text-2xl font-bold text-[#f4efe4] mb-2">Thank You for Your Vision!</h3>
        <p className="text-[#a29c8c] max-w-md mx-auto text-sm leading-relaxed mb-6">
          Your project specifications have been logged securely. An engineering project lead will review your submission and follow up within 24–48 hours.
        </p>

        <div className="bg-[#0b0b0f] border border-[#2e2614] rounded-2xl p-5 max-w-sm mx-auto mb-8 text-left">
          <span className="text-xs font-semibold text-[#a29c8c] uppercase tracking-wider block mb-1">
            Your Unique Tracking Reference
          </span>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xl font-mono font-bold text-[#e8b84a] tracking-wider">
              {submittedReference}
            </span>
            <button
              onClick={copyReference}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#131318] text-[#f4efe4] border border-[#2e2614] hover:border-[#e8b84a] transition-colors shadow-sm cursor-pointer"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-[#4ade80]" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#a29c8c]" /> Copy
                </>
              )}
            </button>
          </div>
        </div>

        <button
          onClick={() => setSubmittedReference(null)}
          className="btn-gold-outline text-xs"
        >
          Submit Another Project Enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-sm flex items-center gap-2">
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Row 1: Name & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#a29c8c] mb-1.5">
            Full Name <span className="text-[#e8b84a]">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Eleanor Vance"
            className={`input-field ${errors.fullName ? 'border-red-400' : ''}`}
            {...register('fullName', { required: 'Please enter your full name.' })}
          />
          {errors.fullName && <p className="text-xs text-[#ff8b80] mt-1">{errors.fullName.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#a29c8c] mb-1.5">
            Work Email <span className="text-[#e8b84a]">*</span>
          </label>
          <input
            type="email"
            placeholder="e.g. eleanor@company.com"
            className={`input-field ${errors.email ? 'border-red-400' : ''}`}
            {...register('email', {
              required: 'Please enter your work email.',
              pattern: { value: /^\S+@\S+$/i, message: 'Please enter a valid email address.' },
            })}
          />
          {errors.email && <p className="text-xs text-[#ff8b80] mt-1">{errors.email.message}</p>}
        </div>
      </div>

      {/* Row 2: Company & Service */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#a29c8c] mb-1.5">
            Company Name (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Strata Logistics Inc."
            className="input-field"
            {...register('companyName')}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#a29c8c] mb-1.5">
            Service of Interest <span className="text-[#e8b84a]">*</span>
          </label>
          <select
            className="input-field cursor-pointer"
            {...register('service', { required: 'Please choose a service.' })}
          >
            {servicesList.map((svc) => (
              <option key={svc} value={svc} className="bg-[#0b0b0f] text-[#f4efe4]">
                {svc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 3: Budget & Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#a29c8c] mb-1.5">
            Project Budget (Optional)
          </label>
          <select className="input-field cursor-pointer" {...register('budget')}>
            <option value="" className="bg-[#0b0b0f] text-[#a29c8c]">Prefer not to say</option>
            <option value="Under $5k" className="bg-[#0b0b0f] text-[#f4efe4]">Under $5k (Starter / MVP)</option>
            <option value="$5k – $20k" className="bg-[#0b0b0f] text-[#f4efe4]">$5k – $20k (Growth Platform)</option>
            <option value="$20k – $50k" className="bg-[#0b0b0f] text-[#f4efe4]">$20k – $50k (Enterprise Grade)</option>
            <option value="$50k+" className="bg-[#0b0b0f] text-[#f4efe4]">$50k+ (High-Scale Architecture)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#a29c8c] mb-1.5">
            Phone / WhatsApp (Optional)
          </label>
          <input
            type="tel"
            placeholder="+1 (555) 000-0000"
            className="input-field"
            {...register('phone')}
          />
        </div>
      </div>

      {/* Row 4: Project Description */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#a29c8c] mb-1.5">
          Project Details <span className="text-[#e8b84a]">*</span>
        </label>
        <textarea
          rows={4}
          placeholder="Tell us what you are building, key features required, target timeline, or existing tech stack..."
          className={`input-field ${errors.description ? 'border-red-400' : ''}`}
          {...register('description', {
            required: 'Please describe your project (at least 10 characters).',
            minLength: { value: 10, message: 'Please describe your project (at least 10 characters).' },
          })}
        />
        {errors.description && <p className="text-xs text-[#ff8b80] mt-1">{errors.description.message}</p>}
      </div>

      {/* Consent Checkbox */}
      <div className="flex items-start gap-2.5 pt-1">
        <input
          type="checkbox"
          id="consent"
          {...register('consent', { required: 'Consent is required to process enquiry.' })}
          className="mt-1 rounded border-[#2e2614] bg-[#0b0b0f] text-[#e8b84a] focus:ring-[#e8b84a]"
        />
        <label htmlFor="consent" className="text-xs text-[#a29c8c] cursor-pointer">
          I consent to WEENGINEERS TECH reviewing my project details and contacting me regarding technical proposals.
        </label>
      </div>
      {errors.consent && <p className="text-xs text-[#ff8b80]">{errors.consent.message}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-gold w-full py-3.5 text-sm font-bold tracking-wider disabled:opacity-50 cursor-pointer"
      >
        {isSubmitting ? (
          <span className="inline-flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            Sending Message...
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            <Send className="w-4 h-4" />
            Send Message
          </span>
        )}
      </button>
    </form>
  );
};
