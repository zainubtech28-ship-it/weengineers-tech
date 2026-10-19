import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { ProjectItem } from '../types';
import { CheckCircle2, ArrowRight, ExternalLink, Star } from 'lucide-react';

export const CaseStudiesPage: React.FC = () => {
  const [caseStudies, setCaseStudies] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.getProjects();
        if (res.success) {
          // Filter projects that have case study details
          const validCaseStudies = res.projects.filter(
            (p) => p.problemStatement && p.solution
          );
          setCaseStudies(validCaseStudies.length > 0 ? validCaseStudies : res.projects);
        }
      } catch (err) {
        console.error('Failed to load case studies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="pt-28 pb-20">
      {/* Header */}
      <section className="bg-slate-50/70 border-b border-slate-200/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="badge-primary mb-3">Enterprise Architectural Impact</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Verified Case Studies & Results
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Detailed dissections of how WEENGINEERS TECH solves critical enterprise bottlenecks through full-stack software engineering.
          </p>
        </div>
      </section>

      {/* Case Studies List */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {caseStudies.map((study, idx) => (
            <div
              key={study._id}
              className="card-light p-8 md:p-12 border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left 5 columns: Image & Specs */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="h-64 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={study.thumbnailUrl}
                      alt={study.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-400">Industry:</span>
                      <span className="font-semibold text-slate-800">{study.clientIndustry || 'Enterprise'}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-400">Category:</span>
                      <span className="font-semibold text-slate-800">{study.category}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {study.technologies?.map((tech) => (
                      <span key={tech} className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right 7 columns: Case Study Details */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <span className="badge-primary mb-2 text-[10px]">Case Study #{idx + 1}</span>
                    <h2 className="text-2xl font-bold text-slate-900 leading-tight mb-2">
                      {study.title}
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed">{study.description}</p>
                  </div>

                  {/* Problem & Solution */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {study.problemStatement && (
                      <div className="bg-red-50/50 border border-red-100 rounded-xl p-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 block mb-1">
                          The Operational Hurdle
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed">{study.problemStatement}</p>
                      </div>
                    )}

                    {study.solution && (
                      <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                          Our Engineered Solution
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed">{study.solution}</p>
                      </div>
                    )}
                  </div>

                  {/* Measurable Results */}
                  {study.measurableResults && study.measurableResults.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
                        Measurable Outcomes:
                      </span>
                      <div className="space-y-1.5">
                        {study.measurableResults.map((r, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Client Feedback */}
                  {study.clientFeedback?.comment && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs italic text-slate-600">
                      "{study.clientFeedback.comment}"
                      <span className="block font-bold text-slate-900 not-italic mt-1">
                        — {study.clientFeedback.clientName} ({study.clientFeedback.clientCompany})
                      </span>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between">
                    <Link
                      to={`/projects/${study.slug}`}
                      className="btn-primary text-xs py-2 px-4 font-semibold"
                    >
                      Read Full Engineering Architecture <ArrowRight className="w-3 h-3" />
                    </Link>

                    {study.liveUrl && (
                      <a
                        href={study.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-brand-600 font-medium"
                      >
                        Live Demonstration <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
