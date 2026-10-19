import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, CheckCircle2, ArrowRight, Sparkles, Heart } from 'lucide-react';

export const CareersPage: React.FC = () => {
  const openings = [
    {
      title: 'Senior Full-Stack Engineer (React / Node / TypeScript)',
      location: 'Remote / Silicon Hub',
      type: 'Full-Time',
      department: 'Core Engineering',
      description:
        'Architect high-throughput full-stack web platforms, design optimized MongoDB schemas, and write rock-solid TypeScript code that powers enterprise clients.',
    },
    {
      title: 'Senior UI/UX Product Designer',
      location: 'Remote',
      type: 'Full-Time',
      department: 'Product & Design',
      description:
        'Craft elegant, accessible light-theme design systems, interactive prototypes, and ergonomic interfaces that simplify complex data operations.',
    },
    {
      title: 'Cloud DevOps & Site Reliability Engineer',
      location: 'Hybrid / Remote',
      type: 'Full-Time',
      department: 'Infrastructure',
      description:
        'Automate containerized CI/CD deployment pipelines, manage AWS/GCP clusters, and enforce zero-downtime rolling releases with 99.99% uptime guarantees.',
    },
  ];

  return (
    <div className="pt-28 pb-20">
      {/* Header */}
      <section className="bg-slate-50/70 border-b border-slate-200/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="badge-primary mb-3">Careers at WEENGINEERS TECH</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Build Software that Matters
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Join a disciplined engineering team that prioritizes structural elegance, mutual respect, and continuous technical growth.
          </p>
        </div>
      </section>

      {/* Openings Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Current Active Openings</h2>
            <p className="text-xs text-slate-500">We hire exceptional problem-solvers who take immense pride in their craft.</p>
          </div>

          <div className="space-y-6">
            {openings.map((job) => (
              <div
                key={job.title}
                className="card-light p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-card-hover transition-all"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="badge-primary text-[10px]">{job.department}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">{job.location}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-medium">{job.type}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{job.description}</p>
                </div>

                <a
                  href="mailto:careers@weengineers.tech"
                  className="btn-secondary text-xs py-2.5 px-4 font-semibold whitespace-nowrap self-start md:self-auto"
                >
                  Apply Directly <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>

          {/* Spontaneous Application */}
          <div className="card-light p-8 bg-slate-50 border border-slate-200 text-center max-w-2xl mx-auto mt-16 space-y-3">
            <h3 className="font-bold text-slate-900 text-lg">Don't See Your Exact Role?</h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
              We are always excited to meet brilliant systems architects, frontend developers, and data engineers. Send your resume and portfolio directly to our engineering leadership.
            </p>
            <a
              href="mailto:careers@weengineers.tech?subject=General%20Engineering%20Application"
              className="btn-primary text-xs py-2.5 px-6 inline-flex"
            >
              Email careers@weengineers.tech
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
