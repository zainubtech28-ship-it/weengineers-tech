import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const tiers = [
    {
      name: 'Starter & MVP Platform',
      tagline: 'Ideal for validating product-market fit with a polished, high-performance web product.',
      investment: 'Starting from $3,500',
      timeline: '2 – 4 Weeks',
      features: [
        'Custom React & TypeScript Frontend',
        'Responsive Light-Theme Design System',
        'Node.js & Express RESTful API Core',
        'MongoDB Database Setup & Indexing',
        'JWT Token Authentication & RBAC',
        'Contact & Lead Capture Submissions',
        'Lighthouse Speed Optimization',
        '100% Intellectual Property Handover',
      ],
      isPopular: false,
    },
    {
      name: 'Growth & Business Suite',
      tagline: 'Full-featured web application designed for growing businesses and operational scale.',
      investment: 'Starting from $8,500',
      timeline: '4 – 8 Weeks',
      features: [
        'Everything in Starter & MVP',
        'Multi-Role Authentication (Admin, Staff, Client)',
        'Comprehensive Administrative Dashboards',
        'Interactive Charts & Recharts Analytics',
        'Payment Gateway Integration (Stripe)',
        'Transactional Email & Notification Triggers',
        'File & Image Uploads (S3 / Local Storage)',
        'Audit Logging & Security Hardening',
        '30 Days Post-Launch Maintenance Included',
      ],
      isPopular: true,
    },
    {
      name: 'Custom Enterprise Architecture',
      tagline: 'Tailored systems, high-concurrency data models, and specialized software operations.',
      investment: 'Custom Technical Scope',
      timeline: '8 – 16 Weeks',
      features: [
        'Everything in Growth Suite',
        'Multi-Tenant Organization Workspaces',
        'Complex Workflow Automation & State Machines',
        'Microservices or Modular Monolith Build',
        'AI / LLM Pipelines & Vector Search Integration',
        'Zero-Downtime Blue/Green Rolling Deployments',
        'Dedicated SLA Technical Support Retainer',
        'Regulatory Compliance (HIPAA, PCI, GDPR)',
      ],
      isPopular: false,
    },
  ];

  return (
    <div className="pt-28 pb-20">
      {/* Header */}
      <section className="bg-slate-50/70 border-b border-slate-200/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="badge-primary mb-3">Transparent Investment Tiers</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Predictable Pricing. No Hidden Surprises.
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Every engagement includes fixed milestones, clear deliverables, and 100% intellectual property assignment.
          </p>
        </div>
      </section>

      {/* Tiers Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`card-light p-8 flex flex-col justify-between relative ${
                  tier.isPopular ? 'border-2 border-brand-600 shadow-card-hover' : 'border border-slate-200'
                }`}
              >
                {tier.isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge-primary text-[10px] font-bold shadow-sm">
                    Most Popular Choice
                  </span>
                )}

                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{tier.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">{tier.tagline}</p>

                  <div className="py-4 border-y border-slate-100 mb-6">
                    <span className="text-2xl font-bold font-mono text-slate-900 block">
                      {tier.investment}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Estimated Schedule: {tier.timeline}</span>
                  </div>

                  <div className="space-y-2.5 mb-8">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Included Specifications
                    </span>
                    {tier.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to="/contact"
                  className={`w-full py-3 text-xs font-semibold text-center rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 ${
                    tier.isPopular
                      ? 'bg-brand-600 text-white hover:bg-brand-700'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  Request Technical Proposal <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>

          {/* Custom Quote Box */}
          <div className="mt-16 card-light p-8 bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
            <div>
              <h4 className="font-heading font-bold text-slate-900 text-lg mb-1">
                Have a Complex or Custom Technical Specification?
              </h4>
              <p className="text-xs text-slate-600 max-w-xl">
                We regularly architect custom multi-tenant platforms, legacy database migrations, and specialized AI workflows. Let us draft a bespoke technical quote.
              </p>
            </div>
            <Link to="/contact" className="btn-primary text-xs py-3 px-6 whitespace-nowrap">
              Request a Custom Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
