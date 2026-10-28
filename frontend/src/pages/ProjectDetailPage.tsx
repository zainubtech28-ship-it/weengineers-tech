import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { ProjectItem } from '../types';
import {
  ChevronRight,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  Cpu,
  Layers,
  Star,
  Award,
} from 'lucide-react';
import { Github } from '../components/ui/SocialIcons';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<ProjectItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    const fetchProject = async () => {
      if (!slug) return;
      try {
        const res = await api.getProjectBySlug(slug);
        if (res.success && res.project) {
          setProject(res.project);
          setActiveImage(res.project.thumbnailUrl);
        }
      } catch (err: any) {
        setError(err.message || 'Project not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-36 pb-20 text-center bg-[#07070a] text-[#f4efe4] min-h-screen">
        <div className="w-8 h-8 border-2 border-[#e8b84a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-[#a29c8c]">Retrieving project specifications...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="pt-36 pb-20 max-w-md mx-auto text-center px-4 bg-[#07070a] text-[#f4efe4] min-h-screen">
        <h2 className="text-xl font-bold text-[#f4efe4] mb-2">Project Not Found</h2>
        <p className="text-xs text-[#a29c8c] mb-6">{error || 'The requested project could not be loaded.'}</p>
        <Link to="/projects" className="btn-gold-outline text-xs">
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-[#07070a] text-[#f4efe4] min-h-screen">
      {/* Breadcrumb & Header */}
      <section className="border-b border-[#2e2614] py-12 bg-[#07070a]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center gap-2 text-xs text-[#a29c8c] mb-6">
            <Link to="/" className="hover:text-[#e8b84a]">WHAT ARE WE</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/projects" className="hover:text-[#e8b84a]">OUR PROJECTS</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-[#f4efe4]">{project.title}</span>
          </div>

          <div className="max-w-4xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge-primary">{project.category}</span>
              {project.clientIndustry && (
                <span className="badge-neutral">{project.clientIndustry}</span>
              )}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#f4efe4] tracking-tight">
              {project.title}
            </h1>
            <p className="text-[#a29c8c] text-base leading-relaxed">
              {project.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-gold text-xs font-bold"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Launch Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-gold-outline text-xs font-semibold"
                >
                  <Github className="w-3.5 h-3.5" /> View Public Repository
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-[#0d0d11]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left 8 columns: Screenshots & Details */}
            <div className="lg:col-span-8 space-y-12">
              {/* Media Preview Gallery */}
              <div className="space-y-4">
                <div className="h-80 sm:h-96 rounded-2xl overflow-hidden bg-[#07070a] border border-[#2e2614] shadow-sm">
                  <img
                    src={activeImage}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {project.screenshots && project.screenshots.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {project.screenshots.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(img)}
                        className={`w-20 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                          activeImage === img ? 'border-[#e8b84a] ring-2 ring-[#e8b84a]/20' : 'border-[#2e2614] opacity-70'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Full Description */}
              {project.fullDescription && (
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-[#f4efe4]">Project Overview</h2>
                  <p className="text-[#a29c8c] text-sm leading-relaxed whitespace-pre-line">
                    {project.fullDescription}
                  </p>
                </div>
              )}

              {/* Problem & Solution (Case Study Format) */}
              {(project.problemStatement || project.solution) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.problemStatement && (
                    <div className="card-gold p-6 border-l-4 border-l-red-500 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-red-400">The Challenge</span>
                      <h3 className="text-base font-bold text-[#f4efe4]">Problem Statement</h3>
                      <p className="text-xs text-[#a29c8c] leading-relaxed">{project.problemStatement}</p>
                    </div>
                  )}

                  {project.solution && (
                    <div className="card-gold p-6 border-l-4 border-l-[#e8b84a] space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#e8b84a]">The Engineering</span>
                      <h3 className="text-base font-bold text-[#f4efe4]">Proposed Solution</h3>
                      <p className="text-xs text-[#a29c8c] leading-relaxed">{project.solution}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Measurable Results */}
              {project.measurableResults && project.measurableResults.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-[#f4efe4]">Measurable Technical Outcomes</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.measurableResults.map((result, i) => (
                      <div key={i} className="card-gold p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-[#e8b84a] flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-[#f4efe4] font-medium leading-relaxed">{result}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Client Feedback */}
              {project.clientFeedback && project.clientFeedback.comment && (
                <div className="card-gold p-6 border border-[#a87a1c]/40 space-y-3">
                  <div className="flex items-center gap-1 text-[#e8b84a]">
                    {[...Array(project.clientFeedback.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#e8b84a] text-[#e8b84a]" />
                    ))}
                  </div>
                  <p className="text-xs text-[#f4efe4] italic leading-relaxed">
                    "{project.clientFeedback.comment}"
                  </p>
                  <p className="text-xs font-bold text-[#f4efe4]">
                    {project.clientFeedback.clientName}
                    {project.clientFeedback.clientCompany && (
                      <span className="font-normal text-[#a29c8c]"> — {project.clientFeedback.clientCompany}</span>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Right 4 columns: Specifications Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="card-gold p-6 space-y-6">
                <h3 className="font-heading font-bold text-[#f4efe4] text-base pb-3 border-b border-[#2e2614]">
                  Project Specifications
                </h3>

                <div>
                  <span className="text-xs font-semibold text-[#a29c8c] uppercase tracking-wider block mb-1">
                    Discipline
                  </span>
                  <span className="text-xs font-bold text-[#f4efe4]">{project.category}</span>
                </div>

                {project.clientIndustry && (
                  <div>
                    <span className="text-xs font-semibold text-[#a29c8c] uppercase tracking-wider block mb-1">
                      Industry Sector
                    </span>
                    <span className="text-xs font-bold text-[#f4efe4]">{project.clientIndustry}</span>
                  </div>
                )}

                <div>
                  <span className="text-xs font-semibold text-[#a29c8c] uppercase tracking-wider block mb-2">
                    Technologies Utilized
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies?.map((tech) => (
                      <span key={tech} className="px-2.5 py-1 rounded-lg border border-[#2e2614] bg-[#07070a] text-[#a29c8c] text-xs font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#2e2614]">
                  <Link
                    to="/#contact-us"
                    className="w-full btn-gold py-2.5 text-xs font-bold flex items-center justify-center gap-2"
                  >
                    Build Something Similar
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
