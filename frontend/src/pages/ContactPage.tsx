import React, { useState } from 'react';
import { EnquiryForm } from '../components/enquiries/EnquiryForm';
import { EnquiryTrackerModal } from '../components/enquiries/EnquiryTrackerModal';
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Clock,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);

  return (
    <div className="pt-28 pb-20">
      {/* Header */}
      <section className="bg-slate-50/70 border-b border-slate-200/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="badge-primary mb-3">Project Consultation</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Commission Your Project with WEENGINEERS TECH
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
            Share your project parameters below. Our engineering leads will review your architecture specifications and schedule an initial discovery consultation.
          </p>

          <button
            onClick={() => setIsTrackerOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-brand-600 hover:border-brand-200 transition-colors shadow-sm"
          >
            <Search className="w-4 h-4 text-brand-600" /> Track Existing Project Enquiry Status
          </button>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left 5 columns: Contact Info & Value Prop */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <span className="badge-gold">Enterprise Direct Line</span>
                <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                  Direct Access to Engineering Leadership
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We eliminate intermediaries. From day one, you consult directly with system architects who understand technical feasibilities, databases, and production constraints.
                </p>
              </div>

              {/* Direct Info Cards */}
              <div className="space-y-4">
                <div className="card-light p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0 border border-brand-100">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Direct Inquiries
                    </span>
                    <a
                      href="mailto:contact@weengineers.tech"
                      className="font-bold text-slate-900 text-sm hover:text-brand-600 transition-colors"
                    >
                      contact@weengineers.tech
                    </a>
                    <p className="text-[11px] text-slate-500 mt-0.5">Response SLA: Under 24 Business Hours</p>
                  </div>
                </div>

                <div className="card-light p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-100">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Phone & WhatsApp
                    </span>
                    <a
                      href="tel:+15550192834"
                      className="font-bold text-slate-900 text-sm hover:text-brand-600 transition-colors"
                    >
                      +1 (555) 019-2834
                    </a>
                    <div className="flex gap-2 mt-1">
                      <a
                        href="https://wa.me/15550192834"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:underline"
                      >
                        Open WhatsApp Direct <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="card-light p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 border border-amber-100">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Headquarters
                    </span>
                    <p className="font-bold text-slate-900 text-sm">
                      WEENGINEERS TECH Global HQ
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Silicon Boulevard, Innovation Tech Hub
                    </p>
                  </div>
                </div>
              </div>

              {/* Guarantees */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-900 block">Our Working Guarantee</span>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Non-Disclosure Agreement (NDA) supported upon request</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Detailed technical breakdown before any commitment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>100% intellectual property assignment guarantee</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 7 columns: Enquiry Form */}
            <div className="lg:col-span-7">
              <div className="card-light p-6 md:p-10 border border-slate-200 shadow-card">
                <div className="mb-8">
                  <span className="badge-primary mb-2">Technical Specification Form</span>
                  <h3 className="font-heading font-bold text-slate-900 text-2xl">
                    Define Your Project Requirements
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Every enquiry receives an automated tracking reference code and review from an engineering lead.
                  </p>
                </div>

                <EnquiryForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <EnquiryTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
      />
    </div>
  );
};
