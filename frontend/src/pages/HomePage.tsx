import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { ServiceItem, ProjectItem, ReviewItem, FAQItem } from '../types';
import {
  ArrowRight,
  Shield,
  Layers,
  Code2,
  Cpu,
  Sparkles,
  CheckCircle2,
  Star,
  ExternalLink,
  ChevronRight,
  Database,
  Cloud,
  Terminal,
  Search,
  MessageSquare,
  Award,
} from 'lucide-react';
import { SubmitReviewModal } from '../components/reviews/SubmitReviewModal';
import { EnquiryTrackerModal } from '../components/enquiries/EnquiryTrackerModal';

export const HomePage: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [stats, setStats] = useState({
    publishedProjects: 0,
    verifiedReviews: 0,
    totalServices: 12,
    averageRating: 5.0,
  });
  const [loading, setLoading] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, projectsRes, reviewsRes, faqsRes, statsRes] = await Promise.all([
          api.getServices(),
          api.getProjects({ featured: true }),
          api.getReviews(),
          api.getFAQs(),
          api.getStats(),
        ]);

        if (servicesRes.success) setServices(servicesRes.services);
        if (projectsRes.success) setProjects(projectsRes.projects);
        if (reviewsRes.success) setReviews(reviewsRes.reviews);
        if (faqsRes.success) setFaqs(faqsRes.faqs.slice(0, 4));
        if (statsRes.success) setStats(statsRes.stats);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const technologies = [
    { name: 'React.js', category: 'Frontend' },
    { name: 'TypeScript', category: 'Language' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Express.js', category: 'Backend' },
    { name: 'MongoDB', category: 'Database' },
    { name: 'Tailwind CSS', category: 'Styling' },
    { name: 'Docker', category: 'DevOps' },
    { name: 'AWS Cloud', category: 'Cloud' },
    { name: 'Python AI', category: 'AI & Data' },
    { name: 'Redis', category: 'Caching' },
  ];

  return (
    <div className="pt-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 border-b border-slate-200/60 bg-gradient-to-b from-white via-slate-50/60 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-semibold shadow-subtle">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Premier IT & Custom Software Engineering</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                WEENGINEERS <span className="text-brand-600">TECH</span>
              </h1>

              {/* Official Tagline */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 text-white shadow-md inline-block max-w-xl">
                <p className="text-xs sm:text-sm font-bold tracking-widest uppercase text-amber-400">
                  YOUR VISION. OUR MISSION. BEYOND EXPECTATIONS.
                </p>
              </div>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                We engineer scalable full-stack web applications, custom corporate platforms, and resilient cloud architectures. Designed with architectural rigor and precision to elevate your enterprise beyond expectations.
              </p>

              {/* Hero CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/contact" className="btn-primary text-sm shadow-md">
                  Start Your Project
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/projects" className="btn-secondary text-sm">
                  Explore Our Work
                </Link>
                <button
                  onClick={() => setIsTrackerOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-brand-600 p-2"
                >
                  <Search className="w-3.5 h-3.5" /> Track Existing Enquiry
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Production-Grade Architecture</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-brand-600" />
                  <span>Zero Security Vulnerability Policy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{stats.averageRating} / 5.0 Client Satisfaction</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual with Real LOGO.jpeg */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card hover:shadow-card-hover transition-all duration-300">
                {/* Emblem Showcase */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-amber-400/40 p-1 flex items-center justify-center shadow-md overflow-hidden">
                      <img
                        src="/LOGO.jpeg"
                        alt="WEENGINEERS TECH Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-heading font-extrabold text-slate-900 text-lg leading-tight">
                        WEENGINEERS TECH
                      </h3>
                      <p className="text-[10px] tracking-widest uppercase font-semibold text-brand-600">
                        Official Enterprise Crest
                      </p>
                    </div>
                  </div>
                  <span className="badge-gold text-[10px]">Verified Entity</span>
                </div>

                {/* Live System Metrics in Hero */}
                <div className="py-6 space-y-4">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs text-slate-600 font-medium">Specialized Engineering Services</span>
                    <span className="text-sm font-bold text-slate-900 font-mono">12 Active Disciplines</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs text-slate-600 font-medium">Published Enterprise Projects</span>
                    <span className="text-sm font-bold text-brand-600 font-mono">{stats.publishedProjects} Case Studies</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs text-slate-600 font-medium">Audited Client Satisfaction</span>
                    <div className="flex items-center gap-1 text-sm font-bold text-amber-700">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{stats.averageRating} / 5.0</span>
                    </div>
                  </div>
                </div>

                {/* Hero Card Footer */}
                <Link
                  to="/contact"
                  className="w-full btn-primary py-3 text-xs font-semibold flex items-center justify-center gap-2"
                >
                  Consult with Our Engineering Team
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COMPANY INTRODUCTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="badge-primary">Engineering Philosophy</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Transforming Complex Challenges into Scalable Software
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              At WEENGINEERS TECH, we reject fragile templates and superficial quick fixes. We apply strict software engineering principles, rigorous typing, database optimization, and user-centric aesthetics to build web applications that stand the test of time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-light p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-100">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Full-Stack Precision</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                From responsive React user interfaces to hardened Node.js and Express backends, every layer is crafted with end-to-end type safety and clean architecture.
              </p>
            </div>

            <div className="card-light p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Optimized Data Engineering</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Structured MongoDB collections, indexed query execution, and atomic transaction handling designed to handle exponential data scaling effortlessly.
              </p>
            </div>

            <div className="card-light p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Enterprise Security</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Role-based access control (RBAC), bcrypt credential hashing, encrypted session tokens, rate limiting, and immutable audit logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED SERVICES (Loaded dynamically from MongoDB) */}
      <section className="py-20 bg-slate-50/70 border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="badge-primary mb-2">Capabilities</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Full-Spectrum Technology Solutions
              </h2>
              <p className="text-slate-600 text-sm max-w-xl mt-2">
                Twelve specialized disciplines delivering end-to-end software craftsmanship.
              </p>
            </div>
            <Link to="/services" className="btn-secondary text-xs whitespace-nowrap self-start md:self-auto">
              View All 12 Services <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((service) => (
              <div key={service._id} className="card-premium flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-100 mb-4">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{service.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{service.shortDescription}</p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {service.technologies?.slice(0, 3).map((tech) => (
                      <span key={tech} className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-medium text-slate-600">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  to={`/services/${service.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-800 transition-colors pt-2 border-t border-slate-100"
                >
                  Explore Service Specifications <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PROJECTS (Loaded from MongoDB) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="badge-primary mb-2">Proven Track Record</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Featured Engineering Case Studies
              </h2>
              <p className="text-slate-600 text-sm max-w-xl mt-2">
                Real software implementations backed by measurable results and genuine client partnerships.
              </p>
            </div>
            <Link to="/projects" className="btn-secondary text-xs whitespace-nowrap self-start md:self-auto">
              View All Projects <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.map((project) => (
              <div key={project._id} className="card-light overflow-hidden flex flex-col justify-between group">
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  <img
                    src={project.thumbnailUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20">
                      {project.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{project.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">{project.description}</p>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.technologies?.map((tech) => (
                        <span key={tech} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <Link
                      to={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-800"
                    >
                      Read Full Case Study <ChevronRight className="w-3.5 h-3.5" />
                    </Link>

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
                      >
                        Live Demo <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TECHNOLOGIES & TOOLS */}
      <section className="py-16 bg-slate-50 border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="badge-primary mb-2">Modern Technology Stack</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">
            Engineered with Industry-Benchmark Tooling
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {technologies.map((tech) => (
              <div key={tech.name} className="card-light p-4 flex flex-col items-center justify-center hover:-translate-y-1 transition-transform">
                <Cpu className="w-6 h-6 text-brand-600 mb-2" />
                <span className="font-bold text-slate-900 text-sm">{tech.name}</span>
                <span className="text-[11px] text-slate-400 font-medium">{tech.category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. DEVELOPMENT PROCESS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="badge-primary">Engineering Method</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Disciplined 4-Stage Delivery Cycle
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              How we take your vision from initial discovery to high-concurrency production deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card-light p-6 relative">
              <span className="text-3xl font-extrabold font-mono text-brand-200 block mb-2">01</span>
              <h3 className="text-base font-bold text-slate-900 mb-1">Architecture & Discovery</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Defining technical requirements, API contracts, schema models, and security compliance roadmaps.
              </p>
            </div>

            <div className="card-light p-6 relative">
              <span className="text-3xl font-extrabold font-mono text-brand-200 block mb-2">02</span>
              <h3 className="text-base font-bold text-slate-900 mb-1">UX & Prototyping</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Human-centric wireframing, high-contrast light design tokens, and clickable Figma prototypes.
              </p>
            </div>

            <div className="card-light p-6 relative">
              <span className="text-3xl font-extrabold font-mono text-brand-200 block mb-2">03</span>
              <h3 className="text-base font-bold text-slate-900 mb-1">Full-Stack Sprints</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Iterative test-driven development, continuous automated code reviews, and weekly live demos.
              </p>
            </div>

            <div className="card-light p-6 relative">
              <span className="text-3xl font-extrabold font-mono text-brand-200 block mb-2">04</span>
              <h3 className="text-base font-bold text-slate-900 mb-1">QA & Zero-Downtime Launch</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Penetration testing, load stress benchmarking, and automated blue/green cloud deployment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. GENUINE CLIENT TESTIMONIALS */}
      <section className="py-20 bg-slate-50/70 border-t border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="badge-primary mb-2">Audited Client Feedback</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Verified Client Testimonials
              </h2>
              <p className="text-slate-600 text-sm max-w-xl mt-2">
                Real reviews backed by actual project associations. We never fabricate client testimonials.
              </p>
            </div>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="btn-primary text-xs self-start md:self-auto"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Submit a Client Review
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div key={rev._id} className="card-light p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 italic leading-relaxed mb-4">
                    "{rev.reviewText}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{rev.clientName}</h4>
                    <p className="text-[11px] text-slate-400">
                      {rev.clientRole ? `${rev.clientRole}, ` : ''}
                      {rev.clientCompany || 'Corporate Partner'}
                    </p>
                  </div>
                  {rev.isVerified && (
                    <span className="badge-success text-[10px]">Verified Client</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ PREVIEW */}
      <section className="py-20 bg-white border-t border-slate-200/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <span className="badge-primary">Direct Answers</span>
            <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-slate-600 text-sm">Common inquiries about our working process, technology, and support.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq._id} className="card-light p-6">
                <h3 className="font-bold text-slate-900 text-sm mb-2">{faq.question}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/faq" className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-800">
              Explore All Company FAQs <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. FINAL CALL TO ACTION */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <span className="badge-gold">Ready to Build Beyond Expectations?</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight">
            Let's Engineer Your Vision into a Scalable Reality.
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Submit your technical specifications or schedule an architectural discovery consultation with our senior engineering team today.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link to="/contact" className="btn-primary py-3.5 px-8 text-sm font-semibold shadow-lg">
              Start Your Project
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/about" className="btn-secondary py-3.5 px-6 text-sm font-semibold">
              Learn About Our Firm
            </Link>
          </div>
        </div>
      </section>

      {/* Modals */}
      <SubmitReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
      <EnquiryTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
      />
    </div>
  );
};
