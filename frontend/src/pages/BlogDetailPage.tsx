import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { BlogPostItem } from '../types';
import { ArrowLeft, Clock, Calendar, ChevronRight, Share2 } from 'lucide-react';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<BlogPostItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return;
      try {
        const res = await api.getBlogBySlug(slug);
        if (res.success && res.blog) setBlog(res.blog);
      } catch (err) {
        console.error('Failed to load blog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-36 pb-20 text-center">
        <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-slate-500">Retrieving article...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="pt-36 pb-20 max-w-md mx-auto text-center px-4">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Article Not Found</h2>
        <Link to="/blog" className="btn-secondary text-xs">
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Insights Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20">
      {/* Header */}
      <section className="bg-slate-50/70 border-b border-slate-200/70 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link to="/" className="hover:text-brand-600">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/blog" className="hover:text-brand-600">Insights</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-800">{blog.title}</span>
          </div>

          <div className="space-y-4">
            <span className="badge-primary">{blog.category}</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {blog.title}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{blog.excerpt}</p>

            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-200">
              <span className="font-semibold text-slate-800">By {blog.author}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {blog.readTimeMinutes} min read
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {new Date(blog.publishedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {blog.coverImage && (
            <div className="h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
              <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed space-y-4 whitespace-pre-line">
            {blog.content}
          </div>

          <div className="pt-8 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1.5">
              {blog.tags?.map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                  #{t}
                </span>
              ))}
            </div>

            <Link to="/blog" className="btn-secondary text-xs">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to All Articles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
