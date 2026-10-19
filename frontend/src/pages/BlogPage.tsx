import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { BlogPostItem } from '../types';
import { Search, Clock, ArrowRight, BookOpen } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPostItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.getBlogs({ search: search.trim() || undefined });
        if (res.success) setBlogs(res.blogs);
      } catch (err) {
        console.error('Failed to load blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [search]);

  return (
    <div className="pt-28 pb-20">
      {/* Header */}
      <section className="bg-slate-50/70 border-b border-slate-200/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="badge-primary mb-3">Engineering Insights</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Technical Perspectives & Architecture Notes
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            In-depth engineering articles on full-stack architecture, light design systems, database optimization, and modern software craftsmanship.
          </p>

          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search articles by title or topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 text-xs"
            />
          </div>
        </div>
      </section>

      {/* Blogs Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="card-light overflow-hidden flex flex-col justify-between hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                {blog.coverImage && (
                  <div className="h-48 overflow-hidden bg-slate-100">
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                      <span className="badge-primary text-[10px]">{blog.category}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {blog.readTimeMinutes} min read
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                      {blog.title}
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                      {blog.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {blog.tags?.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">By {blog.author}</span>
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800"
                    >
                      Read Article <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {blogs.length === 0 && (
            <div className="text-center py-16 card-light max-w-md mx-auto">
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No blog articles match that query.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
