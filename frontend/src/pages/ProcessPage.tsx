import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Layout,
  Code2,
  Cpu,
  ShieldCheck,
  Rocket,
  CheckCircle2,
  ArrowRight,
  LifeBuoy,
} from 'lucide-react';

export const ProcessPage: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Discovery & Systems Architecture',
      description:
        'We deconstruct your business workflows, define database schemas, document RESTful endpoints, and align on non-functional requirements such as concurrency and latency benchmarks.',
      deliverables: ['System Architecture Document', 'Data Model & ER Diagrams', 'API Specification Contract', 'Fixed Timeline & Milestone Schedule'],
      icon: Compass,
    },
    {
      num: '02',
      title: 'UX Flow & Light Design System',
      description:
        'Our design team constructs ergonomic, high-contrast light-theme interfaces, interactive Figma wireframes, and design systems tailored specifically to your brand guidelines.',
      deliverables: ['Clickable Figma Prototypes', 'Design System Tokens & Components', 'User Journey Maps', 'Accessibility (WCAG) Compliance'],
      icon: Layout,
    },
    {
      num: '03',
      title: 'Full-Stack Iterative Sprints',
      description:
        'We develop in disciplined 1-2 week agile sprints with continuous type validation, automated tests, and live staging previews so you see genuine software progress every step of the way.',
      deliverables: ['Weekly Working Staging Deployments', 'Clean TypeScript & React Codebase', 'Automated Unit & Integration Test Suites', 'Sprint Progress Reviews'],
      icon: Code2,
    },
    {
      num: '04',
      title: 'Security Audits & Performance Tuning',
      description:
        'Before any public rollout, we conduct strict vulnerability scans, database index profiling, asset optimization, and load stress testing under heavy simulated concurrency.',
      deliverables: ['Penetration Test & Vulnerability Report', 'Lighthouse 95+ Performance Audit', 'Database Query Profiling & Indexing', 'CORS, Rate Limiting & SSL Hardening'],
      icon: ShieldCheck,
    },
    {
      num: '05',
      title: 'Zero-Downtime Deployment & Handover',
      description:
        'We deploy your platform using blue/green or rolling cloud deployment strategies, configure automated backups, and hand over 100% intellectual property with full repository documentation.',
      deliverables: ['Zero-Downtime Production Deployment', 'Automated Daily Database Backups', '100% Source Code & IP Handover', 'Complete Technical Documentation & Walkthrough'],
      icon: Rocket,
    },
    {
      num: '06',
      title: 'Continuous Monitoring & Support',
      description:
        'Following launch, we provide ongoing synthetic health checks, security patches, framework upgrades, and feature expansion retainers to keep your systems operating at peak performance.',
      deliverables: ['24/7 Automated Uptime Monitoring', 'Guaranteed SLA Incident Response', 'Scheduled Dependency & Security Updates', 'Proactive Architecture Enhancements'],
      icon: LifeBuoy,
    },
  ];

  return (
    <div className="pt-28 pb-20">
      {/* Header */}
      <section className="bg-slate-50/70 border-b border-slate-200/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="badge-primary mb-3">Engineering Rigor</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Our Disciplined Development Lifecycle
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            From technical discovery to continuous enterprise maintenance—how WEENGINEERS TECH ensures structural reliability and predictability.
          </p>
        </div>
      </section>

      {/* Steps List */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className="card-light p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0 border border-brand-100">
                <step.icon className="w-7 h-7" />
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    STAGE {step.num}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{step.title}</h2>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{step.description}</p>

                <div className="pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block mb-2">
                    Key Deliverables:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {step.deliverables.map((del, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{del}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <span className="badge-gold">Predictable Engineering</span>
          <h2 className="text-3xl font-bold">Ready to Start Stage 01 with Us?</h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Experience the peace of mind that comes from transparent engineering sprints and uncompromised code quality.
          </p>
          <Link to="/contact" className="btn-primary text-xs py-3 px-6 inline-flex">
            Schedule Discovery Consultation <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
};
