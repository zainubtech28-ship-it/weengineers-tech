import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { CompanySettingsData, TeamMemberItem } from '../types';
import { Shield, Sparkles, Award, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const OFFICIAL_TEAM_MEMBERS: TeamMemberItem[] = [
  // First row
  { _id: '1', name: 'SURESH R', designation: 'B.Tech Information Technology — 3rd Year', order: 1, isVisible: true },
  { _id: '2', name: 'MAHARAJA', designation: 'B.Tech Information Technology — 3rd Year', order: 2, isVisible: true },
  { _id: '3', name: 'SARANYA', designation: 'B.Tech Information Technology — 3rd Year', order: 3, isVisible: true },
  { _id: '4', name: 'DHANYA SHANKARI', designation: 'B.Tech Information Technology — 3rd Year', order: 4, isVisible: true },
  // Second row
  { _id: '5', name: 'ZAINUDEEN', designation: 'B.Tech Information Technology — 3rd Year', order: 5, isVisible: true },
  { _id: '6', name: 'BALANAVIN S', designation: 'B.Tech Information Technology — 3rd Year', order: 6, isVisible: true },
  { _id: '7', name: 'MAHESH', designation: 'B.Tech Information Technology — 3rd Year', order: 7, isVisible: true },
  { _id: '8', name: 'MATHIVANAN', designation: 'B.Tech Information Technology — 3rd Year', order: 8, isVisible: true },
  // Third row
  { _id: '9', name: 'VINOTH', designation: 'B.Tech Information Technology — 3rd Year', order: 9, isVisible: true },
  { _id: '10', name: 'ADSHAYAA', designation: 'B.Tech Information Technology — 3rd Year', order: 10, isVisible: true },
  { _id: '11', name: 'DEEPIKAA', designation: 'B.Tech Information Technology — 3rd Year', order: 11, isVisible: true },
  { _id: '12', name: 'DEVIKAA', designation: 'B.Tech Information Technology — 3rd Year', order: 12, isVisible: true },
  { _id: '13', name: 'ISHWARYALAKSHMI', designation: 'B.Tech Information Technology — 3rd Year', order: 13, isVisible: true },
];

export const AboutPage: React.FC = () => {
  const [settings, setSettings] = useState<CompanySettingsData | null>(null);
  const [team, setTeam] = useState<TeamMemberItem[]>(OFFICIAL_TEAM_MEMBERS);
  const [_loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, teamRes] = await Promise.all([
          api.getSettings(),
          api.getTeam(),
        ]);
        if (settingsRes.success) setSettings(settingsRes.settings);
        if (teamRes.success && Array.isArray(teamRes.team) && teamRes.team.length > 0) {
          const sorted = [...teamRes.team].sort((a, b) => (a.order || 0) - (b.order || 0));
          setTeam(sorted);
        }
      } catch (err) {
        console.error('Failed to load about page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="pt-28 pb-20 bg-slate-50/40 min-h-screen">
      {/* Header */}
      <section className="bg-white border-b border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="badge-primary mb-3">About WEENGINEERS TECH</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Engineering Precision. Digital Scale.
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 mb-3">
            "YOUR VISION. OUR MISSION. BEYOND EXPECTATIONS."
          </p>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {settings?.aboutStory ||
              'A premier IT enterprise engineering robust full-stack software, cloud infrastructures, and digital platforms built to power modern digital enterprises.'}
          </p>
        </div>
      </section>

      {/* Mission & Vision Pillars */}
      <section className="py-20 bg-slate-50/60 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="badge-primary">Strategic Philosophy</span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Architectural Integrity Meets Rapid Execution
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                At WEENGINEERS TECH, we don't believe in superficial code. Every platform we architect is rooted in long-term maintainability, rigorous security hygiene, and responsive, fluid user interfaces.
              </p>

              <div className="space-y-3.5 pt-2">
                {[
                  'Strict zero-compromise code quality and end-to-end testing standards',
                  'Client-centric agile delivery with predictable weekly velocity milestones',
                  'Enterprise-grade security, data protection, and performance guarantees',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="card-light p-6 space-y-2 border-l-4 border-l-brand-600">
                <Shield className="w-6 h-6 text-brand-600 mb-2" />
                <h4 className="font-bold text-slate-900 text-sm">Security By Design</h4>
                <p className="text-xs text-slate-500">Comprehensive vulnerability auditing and encrypted communications.</p>
              </div>

              <div className="card-light p-6 space-y-2 border-l-4 border-l-amber-500">
                <Sparkles className="w-6 h-6 text-amber-600 mb-2" />
                <h4 className="font-bold text-slate-900 text-sm">Modern Architecture</h4>
                <p className="text-xs text-slate-500">Scalable cloud-native stacks built for seamless horizontal growth.</p>
              </div>

              <div className="card-light p-6 space-y-2 border-l-4 border-l-emerald-500">
                <Cpu className="w-6 h-6 text-emerald-600 mb-2" />
                <h4 className="font-bold text-slate-900 text-sm">High Concurrency</h4>
                <p className="text-xs text-slate-500">Optimized database schemas and sub-second query performance.</p>
              </div>

              <div className="card-light p-6 space-y-2 border-l-4 border-l-indigo-500">
                <Award className="w-6 h-6 text-indigo-600 mb-2" />
                <h4 className="font-bold text-slate-900 text-sm">Dedicated SLA Support</h4>
                <p className="text-xs text-slate-500">Proactive uptime monitoring and continuous dependency updates.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="badge-primary">Our Team</span>
            <h2 className="text-3xl font-bold text-slate-900">Our Engineering Collective</h2>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
              "YOUR VISION. OUR MISSION. BEYOND EXPECTATIONS."
            </p>
            <p className="text-slate-600 text-sm">
              The dedicated student engineers powering software architecture, development, and innovation at WEENGINEERS TECH.
            </p>
          </div>

          {/* 13 Official Members Grid */}
          {team.length === 13 ? (
            <div className="space-y-6">
              {/* First row: 4 members */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {team.slice(0, 4).map((member, index) => (
                  <div
                    key={member._id || member.name}
                    className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 hover:border-brand-500 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[160px]"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-500 group-hover:scale-125 transition-transform" />
                        <span className="text-[11px] font-mono font-semibold text-slate-400 group-hover:text-brand-600 transition-colors">
                          #{String(member.order || index + 1).padStart(2, '0')}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight group-hover:text-brand-600 transition-colors">
                        {member.name}
                      </h3>

                      <p className="text-xs font-medium text-slate-600 mt-2 leading-relaxed">
                        B.Tech Information Technology — 3rd Year
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 group-hover:text-brand-500 transition-colors">
                        WEENGINEERS TECH
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Second row: 4 members (starts with ZAINUDEEN) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {team.slice(4, 8).map((member, index) => (
                  <div
                    key={member._id || member.name}
                    className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 hover:border-brand-500 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[160px]"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-500 group-hover:scale-125 transition-transform" />
                        <span className="text-[11px] font-mono font-semibold text-slate-400 group-hover:text-brand-600 transition-colors">
                          #{String(member.order || index + 5).padStart(2, '0')}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight group-hover:text-brand-600 transition-colors">
                        {member.name}
                      </h3>

                      <p className="text-xs font-medium text-slate-600 mt-2 leading-relaxed">
                        B.Tech Information Technology — 3rd Year
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 group-hover:text-brand-500 transition-colors">
                        WEENGINEERS TECH
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Third row: 5 members */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {team.slice(8, 13).map((member, index) => (
                  <div
                    key={member._id || member.name}
                    className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 hover:border-brand-500 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[160px]"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-500 group-hover:scale-125 transition-transform" />
                        <span className="text-[11px] font-mono font-semibold text-slate-400 group-hover:text-brand-600 transition-colors">
                          #{String(member.order || index + 9).padStart(2, '0')}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight group-hover:text-brand-600 transition-colors">
                        {member.name}
                      </h3>

                      <p className="text-xs font-medium text-slate-600 mt-2 leading-relaxed">
                        B.Tech Information Technology — 3rd Year
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 group-hover:text-brand-500 transition-colors">
                        WEENGINEERS TECH
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <div
                  key={member._id || member.name}
                  className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 hover:border-brand-500 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[160px]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-500 group-hover:scale-125 transition-transform" />
                      <span className="text-[11px] font-mono font-semibold text-slate-400 group-hover:text-brand-600 transition-colors">
                        #{String(member.order || index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight group-hover:text-brand-600 transition-colors">
                      {member.name}
                    </h3>

                    <p className="text-xs font-medium text-slate-600 mt-2 leading-relaxed">
                      B.Tech Information Technology — 3rd Year
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 group-hover:text-brand-500 transition-colors">
                      WEENGINEERS TECH
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-50 border-t border-brand-100">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Partner with WEENGINEERS TECH</h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Ready to bring architectural excellence to your next digital venture? Let's connect.
          </p>
          <Link to="/contact" className="btn-primary text-xs">
            Initiate Project Enquiry <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
};
