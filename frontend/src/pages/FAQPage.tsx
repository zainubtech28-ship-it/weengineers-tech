import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { FAQItem } from '../types';
import { HelpCircle, ChevronDown, ArrowRight } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const res = await api.getFAQs();
        if (res.success) {
          setFaqs(res.faqs);
          // Open first 2 by default
          const initialOpen: Record<string, boolean> = {};
          res.faqs.slice(0, 2).forEach((f) => (initialOpen[f._id] = true));
          setOpenIds(initialOpen);
        }
      } catch (err) {
        console.error('Failed to load FAQs:', err);
      }
    };
    fetchFAQs();
  }, []);

  const toggle = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = ['All', 'General', 'Process', 'Security', 'Support'];

  const filtered = faqs.filter(
    (f) => activeCategory === 'All' || f.category === activeCategory
  );

  return (
    <div className="pt-28 pb-20">
      {/* Header */}
      <section className="bg-slate-50/70 border-b border-slate-200/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="badge-primary mb-3">Knowledge & Transparency</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Direct answers regarding our architectural standards, intellectual property ownership, security safeguards, and ongoing maintenance.
          </p>
        </div>
      </section>

      {/* FAQs List */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeCategory === c
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filtered.map((faq) => {
              const isOpen = openIds[faq._id];
              return (
                <div
                  key={faq._id}
                  className="card-light border border-slate-200/90 overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggle(faq._id)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-brand-600 flex-shrink-0" />
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Still have questions */}
          <div className="text-center pt-12">
            <h3 className="font-bold text-slate-900 text-base mb-1">Have a Unique Question?</h3>
            <p className="text-xs text-slate-500 mb-4">
              Our engineering team is ready to provide complete clarity on your specific constraints.
            </p>
            <Link to="/contact" className="btn-primary text-xs">
              Reach Out Directly <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
