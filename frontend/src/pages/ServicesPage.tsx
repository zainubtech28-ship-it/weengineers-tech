import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { ServiceItem } from '../types';
import {
  Layers,
  ArrowRight,
  Search,
  CheckCircle,
  Globe,
  Code,
  ShoppingBag,
  Smartphone,
  Palette,
  Share2,
  Database,
  Sparkles,
  LifeBuoy,
  CheckCircle2,
  Cloud,
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.getServices();
        if (res.success) setServices(res.services);
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = services.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
      s.technologies?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const getServiceIcon = (title: string) => {
    switch (title.toLowerCase()) {
      case 'website development':
        return <Globe className="w-5 h-5" />;
      case 'full-stack web development':
        return <Layers className="w-5 h-5" />;
      case 'custom software development':
        return <Code className="w-5 h-5" />;
      case 'e-commerce development':
        return <ShoppingBag className="w-5 h-5" />;
      case 'mobile application development':
        return <Smartphone className="w-5 h-5" />;
      case 'ui/ux design':
        return <Palette className="w-5 h-5" />;
      case 'api development and integration':
        return <Share2 className="w-5 h-5" />;
      case 'database development':
        return <Database className="w-5 h-5" />;
      case 'ai-powered applications':
        return <Sparkles className="w-5 h-5" />;
      case 'website maintenance and support':
        return <LifeBuoy className="w-5 h-5" />;
      case 'software testing and deployment':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'cloud and hosting solutions':
        return <Cloud className="w-5 h-5" />;
      default:
        return <Layers className="w-5 h-5" />;
    }
  };

  return (
    <div className="pt-28 pb-20">
      {/* Header */}
      <section className="bg-slate-50/70 border-b border-slate-200/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="badge-primary mb-3">Enterprise Offerings</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Our Core Engineering Services
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Twelve specialized technical disciplines engineered to build, scale, and secure your digital ventures beyond expectations.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by service or technology (e.g. React, MongoDB)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 text-xs"
            />
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                className="card-light p-6 md:p-8 flex flex-col justify-between hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-100 mb-6">
                    {getServiceIcon(service.title)}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">{service.shortDescription}</p>

                  <div className="space-y-2 mb-6">
                    {service.benefits?.slice(0, 3).map((benefit, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {service.technologies?.map((tech) => (
                      <span key={tech} className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/services/${service.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-800"
                  >
                    View Specifications <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    to="/contact"
                    className="text-xs text-slate-500 hover:text-slate-800 font-medium"
                  >
                    Enquire
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-16 card-light max-w-md mx-auto">
              <p className="text-sm text-slate-500">No services match your search criteria.</p>
              <button onClick={() => setSearch('')} className="btn-secondary text-xs mt-3">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
