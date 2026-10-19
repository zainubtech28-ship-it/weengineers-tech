import React from 'react';
import { Link } from 'react-router-dom';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="pt-28 pb-20">
      <section className="bg-slate-50/70 border-b border-slate-200/70 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="badge-primary mb-3">Legal & Compliance</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500">Effective Date: October 2026 | WEENGINEERS TECH</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-slate text-xs sm:text-sm leading-relaxed text-slate-600 space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">1. Overview and Commitment</h2>
            <p>
              WEENGINEERS TECH is committed to protecting the privacy, confidentiality, and security of all personal and enterprise information entrusted to us by clients, website visitors, and project partners.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">2. Information Collection</h2>
            <p>
              We collect information that you explicitly provide when submitting project enquiries, requesting technical quotes, submitting verified client reviews, or communicating with our team. This includes your name, email address, phone number, company name, and project specifications.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">3. Purpose of Processing</h2>
            <p>
              All collected information is used strictly to evaluate project feasibility, prepare architectural proposals, coordinate development sprints, manage support lifecycles, and communicate critical service updates. We never sell, lease, or monetize your information to third-party advertisers.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">4. Data Security Standards</h2>
            <p>
              We implement industry-grade security protocols, including TLS 1.3 encryption for data in transit, encrypted database storage for sensitive credentials, parameterized database queries, strict role-based access control, and automated audit logging.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">5. Contact Information</h2>
            <p>
              For any questions regarding our privacy practices or to request data removal, please contact our Data Governance Officer at{' '}
              <a href="mailto:privacy@weengineers.tech" className="text-brand-600 font-medium">
                privacy@weengineers.tech
              </a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
