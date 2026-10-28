import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { CompanySettingsData, TeamMemberItem } from '../types';
import { Shield, Sparkles, Award, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const OFFICIAL_TEAM_MEMBERS: TeamMemberItem[] = [
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

const PRINCIPLES = [
  'Architecture-First Planning',
  'Clean and Maintainable Code',
  'Security by Design',
  'Scalable System Architecture',
  'Continuous Improvement',
  'User-Centered Product Thinking',
];

const STEPS = [
  { num: '01 Discover', text: 'Understand the business goals, requirements, and users.' },
  { num: '02 Strategize', text: 'Define architecture, technical direction, and delivery milestones.' },
  { num: '03 Design', text: 'Create user flows, wireframes, and polished interface designs.' },
  { num: '04 Engineer', text: 'Develop, integrate, test, and optimize the solution.' },
  { num: '05 Launch & Evolve', text: 'Deploy, monitor, maintain, and improve the product.' },
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
    <div className="pt-28 pb-20 bg-[#07070a] text-[#f4efe4] min-h-screen">
      {/* Header */}
      <section className="border-b border-[#2e2614] py-16 bg-[#07070a]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="lbl mb-2">WHO WE ARE</span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            Bridging Deep Engineering With <span className="gold">Product Thinking</span>
          </h1>
          <p className="text-[#a29c8c] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            {settings?.aboutStory ||
              'WEENGINEERS TECH is a software engineering and technology solutions company focused on building reliable, scalable, and meaningful digital products. We combine thoughtful design, modern engineering practices, and emerging technologies to transform ideas into real-world solutions.'}
          </p>
        </div>
      </section>

      {/* How We Work & Core Engineering Principles */}
      <section className="py-20 border-b border-[#2e2614] bg-[#0d0d11]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left 7 Columns */}
            <div className="lg:col-span-7 space-y-6">
              <span className="lbl">HOW WE WORK</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#f4efe4]">
                From Concept to Production
              </h2>
              <div className="space-y-4 pt-2">
                {STEPS.map((step) => (
                  <div key={step.num} className="border-l-2 border-[#a87a1c] pl-5 py-1.5 hover:border-[#e8b84a] transition-colors">
                    <b className="text-[#e8b84a] text-sm tracking-wider uppercase block">{step.num}</b>
                    <span className="text-[#a29c8c] text-sm leading-relaxed">{step.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 5 Columns: Panel */}
            <div className="lg:col-span-5">
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
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-20 bg-[#07070a]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
            <span className="lbl">OUR TEAM</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#f4efe4]">Our Engineering Collective</h2>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#e8b84a]">
              "YOUR VISION. OUR MISSION. BEYOND EXPECTATIONS."
            </p>
            <p className="text-[#a29c8c] text-sm">
              The dedicated student engineers powering software architecture, development, and innovation at WEENGINEERS TECH.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div
                key={member._id || member.name}
                className="card-gold p-6 flex flex-col justify-between min-h-[170px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#e8b84a]" />
                    <span className="text-[11px] font-mono font-semibold text-[#a87a1c]">
                      #{String(member.order || index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#f4efe4] tracking-tight">
                    {member.name}
                  </h3>

                  <p className="text-xs font-medium text-[#a29c8c] mt-2 leading-relaxed">
                    B.Tech Information Technology — 3rd Year
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#2e2614] flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#a29c8c]">
                    WEENGINEERS TECH
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0d0d11] border-t border-[#2e2614] text-center">
        <div className="max-w-3xl mx-auto px-6 space-y-4">
          <h2 className="text-3xl font-extrabold text-[#f4efe4]">Let’s build something together.</h2>
          <p className="text-[#a29c8c] text-sm max-w-xl mx-auto">
            Ready to bring architectural excellence to your next digital venture? Let's connect.
          </p>
          <div className="pt-2">
            <Link to="/#contact-us" className="btn-gold text-xs">
              Talk to Our Team <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
