import React, { useState } from 'react';
import { EnquiryForm } from '../components/enquiries/EnquiryForm';
import { EnquiryTrackerModal } from '../components/enquiries/EnquiryTrackerModal';
import {
  Mail,
  Phone,
  MapPin,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);

  return (
    <div className="pt-28 pb-20 bg-[#07070a] text-[#f4efe4] min-h-screen">
      {/* Header */}
      <section className="border-b border-[#2e2614] py-16 bg-[#07070a]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="lbl mb-2">CONTACT US</span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            Have an Idea? Let’s <span className="gold">Engineer It.</span>
          </h1>
          <p className="text-[#a29c8c] text-sm sm:text-base leading-relaxed mb-6 max-w-2xl mx-auto">
            Tell us what you are building, and let’s explore how we can bring your vision to life. Share your project parameters below to consult directly with engineering leads.
          </p>

          <button
            onClick={() => setIsTrackerOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#131318] border border-[#2e2614] hover:border-[#e8b84a] text-xs font-semibold text-[#f4efe4] transition-colors shadow-sm cursor-pointer"
          >
            <Search className="w-4 h-4 text-[#e8b84a]" /> Track Existing Project Enquiry Status
          </button>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-16 bg-[#0d0d11]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left 5 columns: Contact Info & Direct Access */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <span className="lbl">ENTERPRISE DIRECT ACCESS</span>
                <h2 className="text-2xl font-bold text-[#f4efe4] leading-tight">
                  Direct Access to Engineering Leadership
                </h2>
                <p className="text-xs text-[#a29c8c] leading-relaxed">
                  We eliminate intermediaries. From day one, you consult directly with system architects who understand technical feasibilities, databases, and production constraints.
                </p>
              </div>

              {/* Direct Info Cards */}
              <div className="space-y-4">
                <div className="card-gold p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#07070a] text-[#e8b84a] flex items-center justify-center flex-shrink-0 border border-[#2e2614]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[#a29c8c] uppercase tracking-wider block">
                      Direct Inquiries
                    </span>
                    <a
                      href="mailto:contact@weengineers.tech"
                      className="font-bold text-[#f4efe4] text-sm hover:text-[#e8b84a] transition-colors"
                    >
                      contact@weengineers.tech
                    </a>
                    <p className="text-[11px] text-[#a87a1c] mt-0.5">Response SLA: Under 24 Business Hours</p>
                  </div>
                </div>

                <div className="card-gold p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#07070a] text-[#e8b84a] flex items-center justify-center flex-shrink-0 border border-[#2e2614]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[#a29c8c] uppercase tracking-wider block">
                      Telephone & WhatsApp
                    </span>
                    <a
                      href="tel:+15550192834"
                      className="font-bold text-[#f4efe4] text-sm hover:text-[#e8b84a] transition-colors"
                    >
                      +1 (555) 019-2834
                    </a>
                    <div className="flex gap-2 mt-1">
                      <a
                        href="https://wa.me/15550192834"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4ade80] hover:underline"
                      >
                        Open WhatsApp Direct <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="card-gold p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#07070a] text-[#e8b84a] flex items-center justify-center flex-shrink-0 border border-[#2e2614]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[#a29c8c] uppercase tracking-wider block">
                      Headquarters
                    </span>
                    <p className="font-bold text-[#f4efe4] text-sm">
                      WEENGINEERS TECH Global
                    </p>
                    <p className="text-[11px] text-[#a29c8c] mt-0.5">
                      Engineering Hub & Enterprise Solutions
                    </p>
                  </div>
                </div>
              </div>

              {/* Guarantees */}
              <div className="p-6 rounded-2xl bg-[#131318] border border-[#2e2614] space-y-3">
                <span className="text-xs font-bold text-[#e8b84a] block uppercase tracking-wider">
                  Our Engineering Guarantee
                </span>
                <div className="space-y-2 text-xs text-[#a29c8c]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#e8b84a]" />
                    <span>Non-Disclosure Agreement (NDA) supported upon request</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#e8b84a]" />
                    <span>Detailed technical breakdown before any commitment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#e8b84a]" />
                    <span>100% intellectual property assignment guarantee</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 7 columns: Enquiry Form */}
            <div className="lg:col-span-7">
              <div className="bg-[#131318] border border-[#2e2614] rounded-3xl p-6 md:p-10 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
                <div className="mb-6">
                  <span className="lbl mb-1">SPECIFICATION INTAKE</span>
                  <h3 className="font-heading font-bold text-[#f4efe4] text-2xl">
                    Define Your Project Requirements
                  </h3>
                  <p className="text-xs text-[#a29c8c] mt-1">
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
