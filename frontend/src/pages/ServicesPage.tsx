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
    <div className="pt-28 pb-20 bg-[#07070a] text-[#f4efe4] min-h-screen">
      {/* Header */}
      <section className="border-b border-[#2e2614] py-16 bg-[#07070a]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="lbl mb-2">WHAT WE DO</span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            Technology Built Around <span className="gold">Your Vision</span>
          </h1>
          <p className="text-[#a29c8c] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            From the first idea to a scalable production-ready solution, we engineer digital products designed for real-world impact.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-[#a29c8c] absolute left-3.5 top-3.5" />
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
      <section className="py-16 bg-[#0d0d11]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                className="card-gold p-6 md:p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#07070a] text-[#e8b84a] flex items-center justify-center border border-[#2e2614] mb-6">
                    {getServiceIcon(service.title)}
                  </div>
                  <h3 className="text-xl font-bold text-[#f4efe4] mb-2">{service.title}</h3>
                  <p className="text-xs text-[#a29c8c] leading-relaxed mb-6">{service.shortDescription}</p>

                  <div className="space-y-2 mb-6">
                    {service.benefits?.slice(0, 3).map((benefit, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#f4efe4]">
                        <CheckCircle className="w-3.5 h-3.5 text-[#e8b84a] flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {service.technologies?.map((tech) => (
                      <span key={tech} className="px-2 py-0.5 rounded border border-[#2e2614] bg-[#07070a] text-[10px] text-[#a29c8c] font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#2e2614] flex items-center justify-between">
                  <Link
                    to={`/services/${service.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#e8b84a] hover:underline"
                  >
                    View Specifications <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    to="/#contact-us"
                    className="text-xs text-[#a29c8c] hover:text-[#e8b84a] font-medium"
                  >
                    Discuss this →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-16 card-gold max-w-md mx-auto p-8">
              <p className="text-sm text-[#a29c8c]">No services match your search criteria.</p>
              <button onClick={() => setSearch('')} className="btn-gold-outline text-xs mt-3">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
