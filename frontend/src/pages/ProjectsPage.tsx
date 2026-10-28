import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { ProjectItem } from '../types';
import { Search, ExternalLink, ArrowRight, ChevronRight, Layers, Sparkles } from 'lucide-react';
import { Github } from '../components/ui/SocialIcons';

interface DemoProject {
  id: string;
  title: string;
  category: string;
  visual: 'web' | 'g' | 'c' | 'm';
  description: string;
  technologies: string[];
  isConcept: boolean;
}

const DEMO_PROJECTS: DemoProject[] = [
  {
    id: 'demo-1',
    title: 'Business Analytics Dashboard',
    category: 'Web Applications',
    visual: 'web',
    description: 'A responsive dashboard that turns business data into clear, live charts and reports.',
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    isConcept: true,
  },
  {
    id: 'demo-2',
    title: 'Customer Portal',
    category: 'Web Applications',
    visual: 'web',
    description: 'A secure self-service portal where customers manage accounts, requests and documents.',
    technologies: ['Next.js', 'Node.js', 'MongoDB'],
    isConcept: true,
  },
  {
    id: 'demo-3',
    title: 'Workflow & Approvals Platform',
    category: 'Software Platforms',
    visual: 'g',
    description: 'A platform that connects teams, tasks and approvals in one place.',
    technologies: ['React', 'Express', 'PostgreSQL', 'Docker'],
    isConcept: true,
  },
  {
    id: 'demo-4',
    title: 'Smart Support Assistant',
    category: 'AI Solutions',
    visual: 'c',
    description: 'An AI-assisted tool that summarises incoming requests and routes them to the right team.',
    technologies: ['Python', 'AI APIs', 'NLP'],
    isConcept: true,
  },
  {
    id: 'demo-5',
    title: 'Document Intelligence Tool',
    category: 'AI Solutions',
    visual: 'c',
    description: 'Extracts key information from documents and turns it into structured, searchable data.',
    technologies: ['Python', 'AI APIs', 'REST APIs'],
    isConcept: true,
  },
  {
    id: 'demo-6',
    title: 'Service Booking App',
    category: 'Mobile Applications',
    visual: 'm',
    description: 'A clean mobile app for booking services, tracking status and getting updates.',
    technologies: ['React Native', 'Mobile', 'REST APIs'],
    isConcept: true,
  },
];

export const ProjectsPage: React.FC = () => {
  const [dbProjects, setDbProjects] = useState<ProjectItem[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res = await api.getProjects({
          category: category !== 'All' ? category : undefined,
          search: search.trim() || undefined,
        });
        if (res.success && Array.isArray(res.projects)) {
          setDbProjects(res.projects);
        }
      } catch (err) {
        console.error('Failed to load projects from DB:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchProjects, 250);
    return () => clearTimeout(timer);
  }, [category, search]);

  const categories = [
    'All',
    'Web Applications',
    'Software Platforms',
    'AI Solutions',
    'Mobile Applications',
    'Custom Software Development',
  ];

  // Filter demonstration concepts
  const filteredDemos = DEMO_PROJECTS.filter((demo) => {
    const matchesCat = category === 'All' || demo.category === category;
    const matchesSearch =
      !search.trim() ||
      demo.title.toLowerCase().includes(search.toLowerCase()) ||
      demo.description.toLowerCase().includes(search.toLowerCase()) ||
      demo.technologies.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="pt-28 pb-20 bg-[#07070a] text-[#f4efe4] min-h-screen">
      {/* Header */}
      <section className="border-b border-[#2e2614] py-16 bg-[#07070a]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="lbl mb-2">OUR PROJECTS</span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            Engineered to <span className="gold">Make an Impact</span>
          </h1>
          <p className="text-[#a29c8c] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            The projects below include demonstration concepts showing the kind of work we build alongside delivered client platforms. Real case studies are clearly distinguished from prototypes.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-[#a29c8c] absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by title, technology, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 text-xs"
            />
          </div>
        </div>
      </section>

      {/* Filter Chips & Projects Grid */}
      <section className="py-16 bg-[#0d0d11]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer min-h-[40px] ${
                  category === cat
                    ? 'bg-[#e8b84a] text-[#111] font-bold shadow-[0_4px_16px_rgba(232,184,74,0.3)]'
                    : 'bg-[#131318] text-[#a29c8c] border border-[#2e2614] hover:border-[#e8b84a] hover:text-[#f4efe4]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Published Database Projects (If available) */}
          {dbProjects.length > 0 && (
            <div className="mb-14">
              <div className="mb-6">
                <span className="badge-verified">PUBLISHED DATABASE WORK</span>
                <h3 className="text-xl font-bold text-[#f4efe4] mt-2">Verified Client Platforms</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dbProjects.map((project) => (
                  <div
                    key={project._id}
                    className="card-gold p-6 flex flex-col justify-between group"
                  >
                    <div>
                      {project.thumbnailUrl && (
                        <div className="h-44 rounded-xl overflow-hidden mb-4 border border-[#2e2614] bg-[#07070a]">
                          <img
                            src={project.thumbnailUrl}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <span className="badge-verified">CLIENT SOLUTION</span>
                      <h4 className="text-lg font-bold text-[#f4efe4] mb-2">{project.title}</h4>
                      <p className="text-xs text-[#a29c8c] leading-relaxed line-clamp-3 mb-4">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.technologies?.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="text-[10px] border border-[#2e2614] bg-[#07070a] text-[#a29c8c] px-2 py-0.5 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-[#2e2614] flex items-center justify-between">
                      <Link
                        to={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#e8b84a] hover:underline"
                      >
                        Project Details <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <div className="flex items-center gap-2">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#a29c8c] hover:text-[#e8b84a]"
                            title="Repository"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#a29c8c] hover:text-[#e8b84a]"
                            title="Live Demo"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Demonstration Concepts Grid */}
          <div>
            <div className="mb-6">
              <span className="badge-demo">DEMONSTRATION CONCEPTS</span>
              <h3 className="text-xl font-bold text-[#f4efe4] mt-2">Architecture Concepts & Interactive Prototypes</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDemos.map((p) => (
                <div
                  key={p.id}
                  className="card-gold p-6 flex flex-col justify-between group"
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

                    <span className="badge-demo">DEMONSTRATION CONCEPT</span>

                    <h4 className="text-lg font-bold text-[#f4efe4] mb-2 group-hover:text-[#e8b84a] transition-colors">
                      {p.title}
                    </h4>
                    <p className="text-xs text-[#a29c8c] leading-relaxed mb-4">{p.description}</p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {p.technologies.map((t) => (
                        <span
                          key={t}
                          className="text-[11px] border border-[#2e2614] bg-[#07070a] text-[#a29c8c] rounded-md px-2 py-0.5"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <Link
                      to="/#contact-us"
                      className="inline-flex items-center gap-1 text-xs text-[#e8b84a] font-semibold hover:underline"
                    >
                      Discuss a similar project →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {filteredDemos.length === 0 && dbProjects.length === 0 && (
            <div className="text-center py-16 card-gold max-w-md mx-auto p-8">
              <p className="text-sm text-[#a29c8c]">No projects match your search criteria.</p>
              <button
                onClick={() => {
                  setCategory('All');
                  setSearch('');
                }}
                className="btn-gold-outline text-xs mt-3"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
