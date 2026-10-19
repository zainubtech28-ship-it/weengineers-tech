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
      <div className="pt-36 pb-20 text-center">
        <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-slate-500">Retrieving project specifications...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="pt-36 pb-20 max-w-md mx-auto text-center px-4">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Project Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">{error || 'The requested project could not be loaded.'}</p>
        <Link to="/projects" className="btn-secondary text-xs">
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20">
      {/* Breadcrumb & Header */}
      <section className="bg-slate-50/70 border-b border-slate-200/70 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link to="/" className="hover:text-brand-600">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/projects" className="hover:text-brand-600">Projects</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-800">{project.title}</span>
          </div>

          <div className="max-w-4xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge-primary">{project.category}</span>
              {project.clientIndustry && (
                <span className="badge-neutral">{project.clientIndustry}</span>
              )}
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              {project.title}
            </h1>
            <p className="text-slate-600 text-base leading-relaxed">
              {project.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary text-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Launch Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary text-xs"
                >
                  <Github className="w-3.5 h-3.5" /> View Public Repository
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left 8 columns: Screenshots & Details */}
            <div className="lg:col-span-8 space-y-12">
              {/* Media Preview Gallery */}
              <div className="space-y-4">
                <div className="h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
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
                          activeImage === img ? 'border-brand-600 ring-2 ring-brand-500/20' : 'border-slate-200 opacity-70'
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
                  <h2 className="text-2xl font-bold text-slate-900">Project Overview</h2>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                    {project.fullDescription}
                  </p>
                </div>
              )}

              {/* Problem & Solution (Case Study Format) */}
              {(project.problemStatement || project.solution) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.problemStatement && (
                    <div className="card-light p-6 border-l-4 border-l-red-500 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-red-600">The Challenge</span>
                      <h3 className="text-base font-bold text-slate-900">Problem Statement</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{project.problemStatement}</p>
                    </div>
                  )}

                  {project.solution && (
                    <div className="card-light p-6 border-l-4 border-l-emerald-500 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">The Engineering</span>
                      <h3 className="text-base font-bold text-slate-900">Proposed Solution</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{project.solution}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Measurable Results */}
              {project.measurableResults && project.measurableResults.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900">Measurable Technical Outcomes</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.measurableResults.map((result, i) => (
                      <div key={i} className="card-light p-4 flex items-start gap-3 bg-slate-50/70">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-700 font-medium leading-relaxed">{result}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Client Feedback */}
              {project.clientFeedback && project.clientFeedback.comment && (
                <div className="card-light p-6 bg-amber-50/50 border border-amber-200/80 space-y-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(project.clientFeedback.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    "{project.clientFeedback.comment}"
                  </p>
                  <p className="text-xs font-bold text-slate-900">
                    {project.clientFeedback.clientName}
                    {project.clientFeedback.clientCompany && (
                      <span className="font-normal text-slate-500"> — {project.clientFeedback.clientCompany}</span>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Right 4 columns: Specifications Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="card-light p-6 space-y-6">
                <h3 className="font-heading font-bold text-slate-900 text-base pb-3 border-b border-slate-100">
                  Project Specifications
                </h3>

                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Discipline
                  </span>
                  <span className="text-xs font-bold text-slate-800">{project.category}</span>
                </div>

                {project.clientIndustry && (
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Industry Sector
                    </span>
                    <span className="text-xs font-bold text-slate-800">{project.clientIndustry}</span>
                  </div>
                )}

                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Technologies Utilized
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies?.map((tech) => (
                      <span key={tech} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    to="/contact"
                    className="w-full btn-primary py-2.5 text-xs font-semibold flex items-center justify-center gap-2"
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
