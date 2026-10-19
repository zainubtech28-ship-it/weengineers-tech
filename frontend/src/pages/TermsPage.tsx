import React from 'react';
import { Link } from 'react-router-dom';

export const TermsPage: React.FC = () => {
  return (
    <div className="pt-28 pb-20">
      <section className="bg-slate-50/70 border-b border-slate-200/70 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="badge-primary mb-3">Terms of Engagement</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Terms & Conditions
          </h1>
          <p className="text-xs text-slate-500">Effective Date: October 2026 | WEENGINEERS TECH</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-slate text-xs sm:text-sm leading-relaxed text-slate-600 space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">1. Agreement to Terms</h2>
            <p>
              By accessing or using the WEENGINEERS TECH platform, services, or submitting project enquiries, you agree to be bound by these Terms and Conditions.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">2. Scope of Services</h2>
            <p>
              WEENGINEERS TECH provides bespoke website development, custom software engineering, full-stack application development, database design, and cloud consulting services as agreed upon in formal project statements of work (SOW).
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">3. Intellectual Property Assignment</h2>
            <p>
              Upon complete settlement of agreed project milestone invoices, 100% of custom developed source code, design assets, and database schemas are transferred directly to the client without ongoing proprietary license fees.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">4. Client Testimonials & Case Studies</h2>
            <p>
              We only publish verified client feedback, corporate case studies, and measurable outcomes with explicit authorization. We never fabricate client metrics or ratings.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">5. Governing Law</h2>
            <p>
              These terms are governed by and construed in accordance with the laws governing commercial enterprise software development contracts.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
