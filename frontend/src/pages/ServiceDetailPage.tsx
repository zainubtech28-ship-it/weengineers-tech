import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { ServiceItem } from '../types';
import {
  Layers,
  CheckCircle,
  ArrowLeft,
  ChevronRight,
  Cpu,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { EnquiryForm } from '../components/enquiries/EnquiryForm';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      if (!slug) return;
      try {
        const res = await api.getServiceBySlug(slug);
        if (res.success && res.service) {
          setService(res.service);
        }
      } catch (err: any) {
        setError(err.message || 'Service not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-36 pb-20 text-center">
        <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-slate-500">Loading service specifications...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="pt-36 pb-20 max-w-md mx-auto text-center px-4">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Service Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">{error || 'The requested engineering service could not be located.'}</p>
        <Link to="/services" className="btn-secondary text-xs">
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Services Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20">
      {/* Breadcrumb & Hero */}
      <section className="bg-slate-50/70 border-b border-slate-200/70 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link to="/" className="hover:text-brand-600">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/services" className="hover:text-brand-600">Services</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-800">{service.title}</span>
          </div>

          <div className="max-w-3xl space-y-4">
            <span className="badge-primary">Engineering Discipline</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {service.title}
            </h1>
            <p className="text-slate-600 text-base leading-relaxed">
              {service.shortDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Comprehensive Details */}
            <div className="lg:col-span-7 space-y-12">
              {/* Detailed Description */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">Overview & Capabilities</h2>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {service.fullDescription}
                </p>
              </div>

              {/* Concrete Benefits */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900">Key Architectural Benefits</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.benefits?.map((benefit, i) => (
                    <div key={i} className="card-light p-4 flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700 font-medium leading-relaxed">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Development Process Steps */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Development Lifecycle</h3>
                <div className="space-y-4">
                  {service.process?.map((step) => (
                    <div key={step.step} className="card-light p-5 flex items-start gap-4">
                      <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 font-mono font-bold flex items-center justify-center flex-shrink-0 border border-brand-200">
                        {step.step}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1">{step.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900">Primary Technologies & Frameworks</h3>
                <div className="flex flex-wrap gap-2">
                  {service.technologies?.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200 flex items-center gap-1.5"
                    >
                      <Cpu className="w-3.5 h-3.5 text-brand-600" />
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Service FAQs */}
              {service.faqs && service.faqs.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900">Service Frequently Asked Questions</h3>
                  <div className="space-y-3">
                    {service.faqs.map((faq, idx) => (
                      <div key={idx} className="card-light p-5">
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-1 flex items-start gap-2">
                          <HelpCircle className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                          {faq.question}
                        </h4>
                        <p className="text-xs text-slate-600 pl-6 leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Sticky Project Enquiry Card with Preselected Service */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 card-light p-6 sm:p-8 bg-slate-50/70 border border-slate-200 shadow-card">
                <div className="mb-6">
                  <span className="badge-primary mb-2">Request Technical Proposal</span>
                  <h3 className="font-heading font-bold text-slate-900 text-xl">
                    Commission This Service
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Fill out the specifications below. Our engineering leads will review your architecture requirements.
                  </p>
                </div>

                <EnquiryForm initialService={service.title} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
