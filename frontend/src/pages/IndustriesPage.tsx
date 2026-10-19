import React from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  HeartPulse,
  Truck,
  ShoppingBag,
  Building2,
  Cpu,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const IndustriesPage: React.FC = () => {
  const industries = [
    {
      title: 'FinTech & Banking',
      icon: CreditCard,
      description:
        'High-security digital banking portals, multi-currency transaction ledgers, KYC verification workflows, and PCI-DSS compliant payment infrastructures.',
      highlights: ['Sub-150ms ledger processing', 'Encrypted JWT stateless tokens', 'Automated transaction anomaly detection', 'Regulatory audit compliance logs'],
    },
    {
      title: 'Healthcare & Life Sciences',
      icon: HeartPulse,
      description:
        'HIPAA-compliant patient portals, tele-health video scheduling, diagnostic image management, and secure electronic health records (EHR) bridges.',
      highlights: ['Zero-knowledge data encryption', 'Strict role-based access for medical staff', 'Fast radiological scan viewing', 'Automated appointment lifecycle sync'],
    },
    {
      title: 'Supply Chain & Logistics',
      icon: Truck,
      description:
        'Enterprise fleet telemetry, distributed warehouse inventory tracking, automated bill of lading generation, and real-time shipment dispatch portals.',
      highlights: ['Multi-hub inventory reconciliation', 'Real-time GPS status webhooks', 'Automated purchase order workflows', 'Mobile driver dispatch apps'],
    },
    {
      title: 'Modern E-Commerce & Retail',
      icon: ShoppingBag,
      description:
        'Custom high-conversion storefronts, multi-currency Stripe checkouts, dynamic 3D customizers, automated inventory sync, and customer loyalty engines.',
      highlights: ['Sub-second catalog search', 'Frictionless one-click checkouts', 'Automated abandoned cart workflows', 'Custom admin sales analytics'],
    },
    {
      title: 'Real Estate & Property Tech',
      icon: Building2,
      description:
        'Interactive property listing platforms, virtual tours, automated tenant document generation, digital lease signing, and maintenance request trackers.',
      highlights: ['Dynamic map & radius filtering', 'Document e-sign integrations', 'Tenant & landlord portals', 'Automated rent collection gateways'],
    },
    {
      title: 'Enterprise SaaS & Cloud Tools',
      icon: Cpu,
      description:
        'Multi-tenant software-as-a-service architectures with granular organization workspaces, team invitation flows, recurring billing, and usage metering.',
      highlights: ['Tenant data isolation guarantees', 'Stripe recurring subscription webhooks', 'Granular team permissions & audit trails', 'Public developer API documentation'],
    },
  ];

  return (
    <div className="pt-28 pb-20">
      {/* Header */}
      <section className="bg-slate-50/70 border-b border-slate-200/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="badge-primary mb-3">Domain Specialization</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Industries We Transform Through Engineering
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Every sector possesses unique compliance, concurrency, and security demands. We architect custom solutions tailored specifically to your industry domain.
          </p>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((ind) => (
              <div
                key={ind.title}
                className="card-light p-8 flex flex-col justify-between hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-100 mb-6">
                    <ind.icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">{ind.title}</h2>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">{ind.description}</p>

                  <div className="space-y-2 mb-6">
                    {ind.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-800"
                  >
                    Discuss Your Industry Scope <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
