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
      <div className="pt-36 pb-20 text-center bg-[#07070a] text-[#f4efe4] min-h-screen">
        <div className="w-8 h-8 border-2 border-[#e8b84a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-[#a29c8c]">Loading service specifications...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="pt-36 pb-20 max-w-md mx-auto text-center px-4 bg-[#07070a] text-[#f4efe4] min-h-screen">
        <h2 className="text-xl font-bold text-[#f4efe4] mb-2">Service Not Found</h2>
        <p className="text-xs text-[#a29c8c] mb-6">{error || 'The requested engineering service could not be located.'}</p>
        <Link to="/services" className="btn-gold-outline text-xs">
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Services Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-[#07070a] text-[#f4efe4] min-h-screen">
      {/* Breadcrumb & Hero */}
      <section className="border-b border-[#2e2614] py-12 bg-[#07070a]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center gap-2 text-xs text-[#a29c8c] mb-6">
            <Link to="/" className="hover:text-[#e8b84a]">WHAT ARE WE</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/services" className="hover:text-[#e8b84a]">WHAT WE DO</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-[#f4efe4]">{service.title}</span>
          </div>

          <div className="max-w-3xl space-y-4">
            <span className="badge-primary">Engineering Discipline</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#f4efe4] tracking-tight">
              {service.title}
            </h1>
            <p className="text-[#a29c8c] text-base leading-relaxed">
              {service.shortDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-16 bg-[#0d0d11]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Comprehensive Details */}
            <div className="lg:col-span-7 space-y-12">
              {/* Detailed Description */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#f4efe4]">Overview & Capabilities</h2>
                <p className="text-[#a29c8c] text-sm leading-relaxed whitespace-pre-line">
                  {service.fullDescription}
                </p>
              </div>

              {/* Concrete Benefits */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#f4efe4]">Key Architectural Benefits</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.benefits?.map((benefit, i) => (
                    <div key={i} className="card-gold p-4 flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-[#e8b84a] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#f4efe4] font-medium leading-relaxed">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Development Process Steps */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-[#f4efe4]">Development Lifecycle</h3>
                <div className="space-y-4">
                  {service.process?.map((step) => (
                    <div key={step.step} className="card-gold p-5 flex items-start gap-4">
                      <div className="w-8 h-8 rounded-xl bg-[#07070a] text-[#e8b84a] font-mono font-bold flex items-center justify-center flex-shrink-0 border border-[#2e2614]">
                        {step.step}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#f4efe4] mb-1">{step.title}</h4>
                        <p className="text-xs text-[#a29c8c] leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              {service.faqs && service.faqs.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-[#f4efe4]">Service FAQs</h3>
                  <div className="space-y-3">
                    {service.faqs.map((faq, i) => (
                      <div key={i} className="card-gold p-5 space-y-2">
                        <div className="flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-[#e8b84a]" />
                          <h4 className="font-bold text-sm text-[#f4efe4]">{faq.question}</h4>
                        </div>
                        <p className="text-xs text-[#a29c8c] pl-6 leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Direct Consultation Form */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 bg-[#131318] border border-[#2e2614] rounded-3xl p-6 md:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.5)] space-y-6">
                <div>
                  <span className="lbl mb-1">PROJECT INTAKE</span>
                  <h3 className="font-heading font-bold text-[#f4efe4] text-xl">
                    Commission This Service
                  </h3>
                  <p className="text-xs text-[#a29c8c] mt-1">
                    Direct access to engineering leads specializing in {service.title}.
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
