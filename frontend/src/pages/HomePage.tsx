import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { ServiceItem, ProjectItem, ReviewItem, TeamMemberItem } from '../types';
import {
  Code,
  Globe,
  Smartphone,
  Sparkles,
  Cloud,
  Palette,
  Share2,
  Shield,
  ArrowRight,
  Search,
  CheckCircle2,
  Cpu,
  Mail,
  Phone,
  ExternalLink,
  ChevronRight,
  Layers,
  Database,
  Terminal,
} from 'lucide-react';
import { HeroCanvas } from '../components/ui/HeroCanvas';
import { EnquiryForm } from '../components/enquiries/EnquiryForm';
import { EnquiryTrackerModal } from '../components/enquiries/EnquiryTrackerModal';

// Authentic Official Team from About/Team pages
const OFFICIAL_TEAM: TeamMemberItem[] = [
  { _id: '1', name: 'SURESH R', designation: 'B.Tech Information Technology — 3rd Year', order: 1, isVisible: true },
  { _id: '2', name: 'MAHARAJA', designation: 'B.Tech Information Technology — 3rd Year', order: 2, isVisible: true },
  { _id: '3', name: 'SARANYA', designation: 'B.Tech Information Technology — 3rd Year', order: 3, isVisible: true },
  { _id: '4', name: 'DHANYA SHANKARI', designation: 'B.Tech Information Technology — 3rd Year', order: 4, isVisible: true },
  { _id: '5', name: 'ZAINUDEEN', designation: 'B.Tech Information Technology — 3rd Year', order: 5, isVisible: true },
  { _id: '6', name: 'BALANAVIN S', designation: 'B.Tech Information Technology — 3rd Year', order: 6, isVisible: true },
  { _id: '7', name: 'MAHESH', designation: 'B.Tech Information Technology — 3rd Year', order: 7, isVisible: true },
  { _id: '8', name: 'MATHIVANAN', designation: 'B.Tech Information Technology — 3rd Year', order: 8, isVisible: true },
  { _id: '9', name: 'VINOTH', designation: 'B.Tech Information Technology — 3rd Year', order: 9, isVisible: true },
  { _id: '10', name: 'ADSHAYAA', designation: 'B.Tech Information Technology — 3rd Year', order: 10, isVisible: true },
  { _id: '11', name: 'DEEPIKAA', designation: 'B.Tech Information Technology — 3rd Year', order: 11, isVisible: true },
  { _id: '12', name: 'DEVIKAA', designation: 'B.Tech Information Technology — 3rd Year', order: 12, isVisible: true },
  { _id: '13', name: 'ISHWARYALAKSHMI', designation: 'B.Tech Information Technology — 3rd Year', order: 13, isVisible: true },
];

// Reference Services Data
const REFERENCE_SERVICES = [
  {
    icon: Code,
    title: 'Custom Software Development',
    desc: 'Tailored software solutions designed around business workflows and requirements.',
    tags: 'Business workflows · Internal tools · Platforms',
  },
  {
    icon: Globe,
    title: 'Web Development',
    desc: 'Fast, responsive, accessible websites and web applications built with modern technologies.',
    tags: 'Responsive design · Accessibility · Performance',
  },
  {
    icon: Smartphone,
    title: 'Mobile App Development',
    desc: 'Intuitive mobile experiences designed for performance and usability.',
    tags: 'Android & iOS · Usability · Performance',
  },
  {
    icon: Sparkles,
    title: 'AI & Automation',
    desc: 'Intelligent features and automated workflows that help simplify complex tasks.',
    tags: 'Workflow automation · AI features · Integrations',
  },
  {
    icon: Cloud,
    title: 'Cloud & DevOps',
    desc: 'Reliable cloud infrastructure, deployment workflows, monitoring, and scalability.',
    tags: 'Deployment · Monitoring · Scalability',
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    desc: 'User-focused interfaces and experiences that combine clarity, usability, and visual quality.',
    tags: 'User flows · Wireframes · Interface design',
  },
  {
    icon: Share2,
    title: 'API & System Integration',
    desc: 'Secure integrations that connect services, platforms, and business systems.',
    tags: 'REST APIs · Third-party services · Data sync',
  },
  {
    icon: Shield,
    title: 'Cybersecurity & Maintenance',
    desc: 'Security-conscious engineering, updates, monitoring, and ongoing technical support.',
    tags: 'Updates · Monitoring · Technical support',
  },
];

// Reference Projects Data (Demonstration concepts clearly distinguished per instructions)
const REFERENCE_PROJECTS = [
  {
    id: 'proj-1',
    name: 'Business Analytics Dashboard',
    category: 'Web Applications',
    visual: 'web',
    desc: 'A responsive dashboard that turns business data into clear, live charts and reports.',
    features: ['Interactive charts and filters', 'Role-based access', 'Exportable reports'],
    tech: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    isConcept: true,
  },
  {
    id: 'proj-2',
    name: 'Customer Portal',
    category: 'Web Applications',
    visual: 'web',
    desc: 'A secure self-service portal where customers manage accounts, requests and documents.',
    features: ['Secure sign-in', 'Request tracking', 'Document uploads'],
    tech: ['Next.js', 'Node.js', 'MongoDB'],
    isConcept: true,
  },
  {
    id: 'proj-3',
    name: 'Workflow & Approvals Platform',
    category: 'Software Platforms',
    visual: 'g',
    desc: 'A platform that connects teams, tasks and approvals in one place.',
    features: ['Custom workflows', 'Notifications', 'Audit history'],
    tech: ['React', 'Express', 'PostgreSQL', 'Docker'],
    isConcept: true,
  },
  {
    id: 'proj-4',
    name: 'Smart Support Assistant',
    category: 'AI Solutions',
    visual: 'c',
    desc: 'An AI-assisted tool that summarises incoming requests and routes them to the right team.',
    features: ['Request summarising', 'Smart routing', 'Human review step'],
    tech: ['Python', 'AI APIs'],
    isConcept: true,
  },
  {
    id: 'proj-5',
    name: 'Document Intelligence Tool',
    category: 'AI Solutions',
    visual: 'c',
    desc: 'Extracts key information from documents and turns it into structured, searchable data.',
    features: ['Text extraction', 'Structured output', 'Search'],
    tech: ['Python', 'AI APIs', 'REST APIs'],
    isConcept: true,
  },
  {
    id: 'proj-6',
    name: 'Service Booking App',
    category: 'Mobile Applications',
    visual: 'm',
    desc: 'A clean mobile app for booking services, tracking status and getting updates.',
    features: ['Easy booking flow', 'Status updates', 'Push notifications'],
    tech: ['Mobile', 'REST APIs'],
    isConcept: true,
  },
];

// Reference Engineering Principles
const PRINCIPLES = [
  'Architecture-First Planning',
  'Clean and Maintainable Code',
  'Security by Design',
  'Scalable System Architecture',
  'Continuous Improvement',
  'User-Centered Product Thinking',
];

// Reference How We Work Steps
const STEPS = [
  { num: '01 Discover', text: 'Understand the business goals, requirements, and users.' },
  { num: '02 Strategize', text: 'Define architecture, technical direction, and delivery milestones.' },
  { num: '03 Design', text: 'Create user flows, wireframes, and polished interface designs.' },
  { num: '04 Engineer', text: 'Develop, integrate, test, and optimize the solution.' },
  { num: '05 Launch & Evolve', text: 'Deploy, monitor, maintain, and improve the product.' },
];

export const HomePage: React.FC = () => {
  const [selectedService, setSelectedService] = useState('Custom Software Development');
  const [projectCategory, setProjectCategory] = useState('All');
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMemberItem[]>(OFFICIAL_TEAM);
  const [dbProjects, setDbProjects] = useState<ProjectItem[]>([]);

  // Smooth scroll handler
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Pre-select service and scroll to contact form
  const handleDiscussService = (serviceTitle: string) => {
    setSelectedService(serviceTitle);
    scrollTo('contact-us');
  };

  // Intersection observer for .rv reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.rv:not(.in)').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Fetch backend dynamic data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [teamRes, projRes] = await Promise.all([
          api.getTeam().catch(() => ({ success: false, team: [] })),
          api.getProjects({ featured: true }).catch(() => ({ success: false, projects: [] })),
        ]);

        if (teamRes.success && Array.isArray(teamRes.team) && teamRes.team.length > 0) {
          const sorted = [...teamRes.team].sort((a, b) => (a.order || 0) - (b.order || 0));
          setTeamMembers(sorted);
        }

        if (projRes.success && Array.isArray(projRes.projects) && projRes.projects.length > 0) {
          setDbProjects(projRes.projects);
        }
      } catch (err) {
        console.error('Error fetching supplementary data:', err);
      }
    };
    loadData();
  }, []);

  const projectCategories = ['All', 'Web Applications', 'Software Platforms', 'AI Solutions', 'Mobile Applications'];

  const filteredProjects = REFERENCE_PROJECTS.filter(
    (p) => projectCategory === 'All' || p.category === projectCategory
  );

  return (
    <div className="bg-[#07070a] text-[#f4efe4] min-h-screen">
      {/* ========================================================
          1. WHAT ARE WE (HERO & COMPANY IDENTITY)
          ======================================================== */}
      <section
        id="what-are-we"
        className="relative min-h-[92vh] flex items-center pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden border-b border-[#2e2614]"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Column: Headline, Tags, CTAs */}
            <div className="lg:col-span-7 space-y-6">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 rv">
                {['Architecture-First Engineering', 'End-to-End Product Development', 'Scalable Cloud & AI Solutions'].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="border border-[#2e2614] rounded-full px-3.5 py-1 text-xs text-[#a29c8c] bg-[#0d0d11]/80 backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] rv">
                Engineering Ideas <span className="gold">Into Impact.</span>
              </h1>

              {/* Tagline / Subhead */}
              <p className="text-base sm:text-lg text-[#a29c8c] leading-relaxed max-w-xl rv">
                <b className="text-[#f4efe4]">WEENGINEERS TECH</b> builds reliable, scalable digital products — from the first idea to production. Combining architecture-first planning, enterprise security, and modern engineering to elevate your enterprise beyond expectations.
              </p>

              {/* Call to Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2 rv">
                <button
                  onClick={() => scrollTo('contact-us')}
                  className="btn-gold font-bold text-sm tracking-wider cursor-pointer"
                >
                  Start a Project
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
                <button
                  onClick={() => scrollTo('our-projects')}
                  className="btn-gold-outline font-semibold text-sm tracking-wider cursor-pointer"
                >
                  Explore Our Work
                </button>
                <button
                  onClick={() => setIsTrackerOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-[#a29c8c] hover:text-[#e8b84a] px-3 py-2 transition-colors cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 text-[#e8b84a]" /> Track Existing Enquiry
                </button>
              </div>

              {/* Trust Metrics Bar */}
              <div className="pt-6 border-t border-[#2e2614] flex flex-wrap items-center gap-6 text-xs text-[#a29c8c]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#e8b84a]" />
                  <span>Production-Grade Architecture</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#e8b84a]" />
                  <span>Zero Security Compromise</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#e8b84a]" />
                  <span>High-Scale Cloud & AI</span>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Emblem Stage */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <HeroCanvas />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. WHO ARE WE (COMPANY PROFILE, PHILOSOPHY & TEAM)
          ======================================================== */}
      <section id="who-are-we" className="py-24 bg-[#07070a] border-b border-[#2e2614]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Section Header */}
          <div className="max-w-3xl mb-16 rv">
            <span className="lbl">WHO WE ARE</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Bridging Deep Engineering With <span className="gold">Product Thinking</span>
            </h2>
            <p className="text-[#a29c8c] text-base sm:text-lg leading-relaxed">
              WEENGINEERS TECH is a software engineering and technology solutions company focused on building reliable, scalable, and meaningful digital products. We combine thoughtful design, modern engineering practices, and emerging technologies to transform ideas into real-world solutions.
            </p>
          </div>

          {/* Split Section: How We Work & Core Engineering Principles */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-20">
            {/* Left 7 Columns: How We Work Steps */}
            <div className="lg:col-span-7 space-y-6 rv">
              <span className="lbl">HOW WE WORK</span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#f4efe4]">From Concept to Production</h3>
              <div className="space-y-4 pt-2">
                {STEPS.map((step, idx) => (
                  <div
                    key={step.num}
                    className="border-l-2 border-[#a87a1c] pl-5 py-1.5 transition-all duration-200 hover:border-[#e8b84a]"
                    style={{ ['--i' as any]: idx }}
                  >
                    <b className="text-[#e8b84a] text-sm tracking-wider uppercase block">{step.num}</b>
                    <span className="text-[#a29c8c] text-sm leading-relaxed">{step.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 5 Columns: Panel "Our Core Engineering Principles" */}
            <div className="lg:col-span-5 rv" style={{ ['--i' as any]: 2 }}>
              <div className="bg-[#131318] border border-[#a87a1c]/60 rounded-3xl p-8 shadow-[0_0_60px_rgba(232,184,74,0.07)]">
                <h3 className="text-xl font-bold text-[#f4efe4] mb-6 flex items-center gap-2">
                  <span className="text-[#e8b84a]">◆</span> Our Core Engineering Principles
                </h3>
                <ul className="space-y-3.5">
                  {PRINCIPLES.map((principle) => (
                    <li
                      key={principle}
                      className="flex items-center gap-3 text-sm text-[#f4efe4] pb-3 border-b border-[#2e2614]"
                    >
                      <span className="text-[#e8b84a] text-xs">◆</span>
                      <span>{principle}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Team Showcase */}
          <div className="pt-10 border-t border-[#2e2614] rv">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
              <div>
                <span className="lbl">ENGINEERING TEAM</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#f4efe4]">The Engineers Behind the Architecture</h3>
              </div>
              <Link
                to="/team"
                className="inline-flex items-center gap-1.5 text-xs text-[#e8b84a] hover:underline font-semibold mt-2 sm:mt-0"
              >
                View full directory <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {teamMembers.slice(0, 8).map((member, idx) => (
                <div
                  key={member._id || idx}
                  className="card-gold p-5 flex flex-col justify-between"
                  style={{ ['--i' as any]: idx }}
                >
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-[#07070a] border border-[#2e2614] text-[#e8b84a] flex items-center justify-center font-bold text-xs mb-3">
                      {member.name.charAt(0)}
                    </div>
                    <h4 className="font-bold text-sm text-[#f4efe4] tracking-wide mb-1">{member.name}</h4>
                    <p className="text-xs text-[#a29c8c]">{member.designation}</p>
                  </div>
                  <span className="text-[10px] uppercase font-semibold text-[#a87a1c] tracking-widest mt-3">
                    WEENGINEERS TECH
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. WHAT WE DO (TECHNOLOGY SERVICES)
          ======================================================== */}
      <section id="what-we-do" className="py-24 bg-[#0d0d11] border-b border-[#2e2614]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="max-w-3xl mb-16 rv">
            <span className="lbl">WHAT WE DO</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Technology Built Around <span className="gold">Your Vision</span>
            </h2>
            <p className="text-[#a29c8c] text-base sm:text-lg leading-relaxed">
              From the first idea to a scalable production-ready solution, we engineer digital products designed for real-world impact.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {REFERENCE_SERVICES.map((svc, idx) => {
              const IconComponent = svc.icon;
              return (
                <div
                  key={svc.title}
                  className="card-gold p-6 flex flex-col justify-between group cursor-pointer rv"
                  style={{ ['--i' as any]: idx }}
                  onClick={() => handleDiscussService(svc.title)}
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#07070a] border border-[#2e2614] flex items-center justify-center text-[#e8b84a] group-hover:border-[#e8b84a] transition-colors mb-4">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-[#f4efe4] mb-2 group-hover:text-[#e8b84a] transition-colors">
                      {svc.title}
                    </h3>
                    <p className="text-xs text-[#a29c8c] leading-relaxed mb-4">{svc.desc}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#a87a1c] mb-3 font-medium">{svc.tags}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDiscussService(svc.title);
                      }}
                      className="inline-flex items-center gap-1 text-xs text-[#e8b84a] font-semibold hover:underline cursor-pointer"
                    >
                      Discuss this <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Link to Full Services Page */}
          <div className="mt-10 flex items-center justify-between text-xs text-[#a29c8c] rv">
            <p>Looking for a specialized enterprise architecture consultation?</p>
            <Link to="/services" className="text-[#e8b84a] font-semibold hover:underline inline-flex items-center gap-1">
              Explore All 12 Capabilities →
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. OUR PROJECTS (SELECTED WORK & PORTFOLIO)
          ======================================================== */}
      <section id="our-projects" className="py-24 bg-[#07070a] border-b border-[#2e2614]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="max-w-3xl mb-12 rv">
            <span className="lbl">SELECTED WORK</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Engineered to <span className="gold">Make an Impact</span>
            </h2>
            <p className="text-[#a29c8c] text-base leading-relaxed">
              The projects below are demonstration concepts and engineered solutions showing the breadth of work we build. Clearly distinguishing concept prototypes from completed production deployments.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-2 mb-10 rv">
            {projectCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setProjectCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer min-h-[40px] ${
                  projectCategory === cat
                    ? 'bg-[#e8b84a] text-[#111] font-bold shadow-[0_4px_16px_rgba(232,184,74,0.3)]'
                    : 'bg-[#131318] text-[#a29c8c] border border-[#2e2614] hover:border-[#e8b84a] hover:text-[#f4efe4]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((p, idx) => (
              <div
                key={p.id}
                className="card-gold p-6 flex flex-col justify-between group rv"
                style={{ ['--i' as any]: idx }}
              >
                <div>
                  {/* Mock Visual Top Graphic */}
                  <div className={`mock ${p.visual === 'web' ? '' : p.visual}`}>
                    {p.visual === 'web' ? (
                      [40, 65, 50, 85, 60, 95, 75].map((h, i) => (
                        <i key={i} style={{ ['--h' as any]: `${h}%` }} />
                      ))
                    ) : p.visual === 'g' ? (
                      Array.from({ length: 9 }).map((_, i) => <b key={i} />)
                    ) : p.visual === 'c' ? (
                      Array.from({ length: 4 }).map((_, i) => <b key={i} />)
                    ) : (
                      <b />
                    )}
                  </div>

                  {/* Badge */}
                  <span className="badge-demo">
                    {p.isConcept ? 'DEMONSTRATION CONCEPT' : 'CLIENT SOLUTION'}
                  </span>

                  <h3 className="text-lg font-bold text-[#f4efe4] mb-2 group-hover:text-[#e8b84a] transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-xs text-[#a29c8c] leading-relaxed mb-4">{p.desc}</p>
                </div>

                <div>
                  {/* Technology Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tech.map((techItem: string) => (
                      <span
                        key={techItem}
                        className="text-[11px] border border-[#2e2614] bg-[#07070a] text-[#a29c8c] rounded-md px-2 py-0.5"
                      >
                        {techItem}
                      </span>
                    ))}
                  </div>

                  <Link
                    to="/projects"
                    className="inline-flex items-center gap-1 text-xs text-[#e8b84a] font-semibold hover:underline"
                  >
                    View details →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Database Projects Integration (if present in backend) */}
          {dbProjects.length > 0 && (
            <div className="mt-14 pt-10 border-t border-[#2e2614] rv">
              <span className="lbl">DATABASE ARCHIVE</span>
              <h3 className="text-xl font-bold text-[#f4efe4] mb-6">Recent Additions from Project Database</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {dbProjects.slice(0, 3).map((dbp) => (
                  <div key={dbp._id} className="card-gold p-6 flex flex-col justify-between">
                    <div>
                      <span className="badge-verified">PUBLISHED RECORD</span>
                      <h4 className="text-base font-bold text-[#f4efe4] mb-2">{dbp.title}</h4>
                      <p className="text-xs text-[#a29c8c] line-clamp-3 mb-4">{dbp.description}</p>
                    </div>
                    <Link
                      to={`/projects/${dbp.slug}`}
                      className="text-xs text-[#e8b84a] font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      Inspect Specification →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View All Projects CTA */}
          <div className="mt-12 text-center rv">
            <Link to="/projects" className="btn-gold-outline text-xs">
              View All Projects Archive →
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          CALL TO ACTION INTERMISSION BAND
          ======================================================== */}
      <div className="text-center py-20 px-6 border-y border-[#2e2614] bg-[#0d0d11]">
        <div className="max-w-3xl mx-auto space-y-5 rv">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Have an Idea? Let’s <span className="gold">Engineer It.</span>
          </h2>
          <p className="text-[#a29c8c] text-sm sm:text-base leading-relaxed">
            From technical discovery to high-scale production deployment, WEENGINEERS TECH turns complex requirements into clean, resilient code.
          </p>
          <div className="pt-2">
            <button
              onClick={() => scrollTo('contact-us')}
              className="btn-gold font-bold text-sm tracking-wider cursor-pointer"
            >
              Start a Project
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          5. CONTACT US (ENGAGEMENT & CONSULTATION)
          ======================================================== */}
      <section id="contact-us" className="py-24 bg-[#07070a]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="max-w-3xl mb-16 rv">
            <span className="lbl">CONTACT US</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Have an Idea? Let’s <span className="gold">Engineer It.</span>
            </h2>
            <p className="text-[#a29c8c] text-base leading-relaxed">
              Tell us what you are building, and let’s explore how we can bring your vision to life.
            </p>
          </div>

          {/* Main Grid: Form on Left, Contact Details on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left 7 Columns: The Contact Form */}
            <div className="lg:col-span-7 bg-[#0d0d11] border border-[#2e2614] rounded-3xl p-6 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.5)] rv">
              <EnquiryForm initialService={selectedService} />
            </div>

            {/* Right 5 Columns: Direct Access & Credentials */}
            <div className="lg:col-span-5 space-y-6 rv" style={{ ['--i' as any]: 1 }}>
              <div className="bg-[#131318] border border-[#2e2614] rounded-3xl p-7 space-y-6">
                <div>
                  <span className="lbl">DIRECT ACCESS</span>
                  <h3 className="text-xl font-bold text-[#f4efe4] mb-2">Direct Engineering Leadership</h3>
                  <p className="text-xs text-[#a29c8c] leading-relaxed">
                    Consult directly with lead software engineers and system architects. No sales bureaucracy.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#07070a] border border-[#2e2614]">
                    <div className="w-9 h-9 rounded-xl bg-[#131318] border border-[#2e2614] text-[#e8b84a] flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-[#a29c8c] uppercase tracking-wider block">
                        Direct Inquiries
                      </span>
                      <a
                        href="mailto:contact@weengineers.tech"
                        className="text-sm font-bold text-[#f4efe4] hover:text-[#e8b84a] transition-colors"
                      >
                        contact@weengineers.tech
                      </a>
                      <p className="text-[10px] text-[#a87a1c] mt-0.5">Response SLA: Under 24 Business Hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#07070a] border border-[#2e2614]">
                    <div className="w-9 h-9 rounded-xl bg-[#131318] border border-[#2e2614] text-[#e8b84a] flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-[#a29c8c] uppercase tracking-wider block">
                        Telephone & WhatsApp
                      </span>
                      <a
                        href="tel:+15550192834"
                        className="text-sm font-bold text-[#f4efe4] hover:text-[#e8b84a] transition-colors"
                      >
                        +1 (555) 019-2834
                      </a>
                      <a
                        href="https://wa.me/15550192834"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-[#4ade80] hover:underline flex items-center gap-1 mt-0.5"
                      >
                        Open WhatsApp Direct <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#2e2614]">
                  <button
                    onClick={() => setIsTrackerOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#07070a] border border-[#2e2614] hover:border-[#e8b84a] text-xs font-semibold text-[#f4efe4] transition-colors cursor-pointer"
                  >
                    <Search className="w-4 h-4 text-[#e8b84a]" />
                    Track Existing Project Enquiry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry Tracker Modal */}
      <EnquiryTrackerModal isOpen={isTrackerOpen} onClose={() => setIsTrackerOpen(false)} />
    </div>
  );
};
