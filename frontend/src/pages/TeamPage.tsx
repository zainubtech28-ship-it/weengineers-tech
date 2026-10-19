import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { TeamMemberItem } from '../types';

// The 13 official team members in exact specified order
const OFFICIAL_TEAM_MEMBERS: TeamMemberItem[] = [
  // First row:
  { _id: '1', name: 'SURESH R', designation: 'B.Tech Information Technology — 3rd Year', order: 1, isVisible: true },
  { _id: '2', name: 'MAHARAJA', designation: 'B.Tech Information Technology — 3rd Year', order: 2, isVisible: true },
  { _id: '3', name: 'SARANYA', designation: 'B.Tech Information Technology — 3rd Year', order: 3, isVisible: true },
  { _id: '4', name: 'DHANYA SHANKARI', designation: 'B.Tech Information Technology — 3rd Year', order: 4, isVisible: true },
  // Second row:
  { _id: '5', name: 'ZAINUDEEN', designation: 'B.Tech Information Technology — 3rd Year', order: 5, isVisible: true },
  { _id: '6', name: 'BALANAVIN S', designation: 'B.Tech Information Technology — 3rd Year', order: 6, isVisible: true },
  { _id: '7', name: 'MAHESH', designation: 'B.Tech Information Technology — 3rd Year', order: 7, isVisible: true },
  { _id: '8', name: 'MATHIVANAN', designation: 'B.Tech Information Technology — 3rd Year', order: 8, isVisible: true },
  // Third row:
  { _id: '9', name: 'VINOTH', designation: 'B.Tech Information Technology — 3rd Year', order: 9, isVisible: true },
  { _id: '10', name: 'ADSHAYAA', designation: 'B.Tech Information Technology — 3rd Year', order: 10, isVisible: true },
  { _id: '11', name: 'DEEPIKAA', designation: 'B.Tech Information Technology — 3rd Year', order: 11, isVisible: true },
  { _id: '12', name: 'DEVIKAA', designation: 'B.Tech Information Technology — 3rd Year', order: 12, isVisible: true },
  { _id: '13', name: 'ISHWARYALAKSHMI', designation: 'B.Tech Information Technology — 3rd Year', order: 13, isVisible: true },
];

export const TeamPage: React.FC = () => {
  const [team, setTeam] = useState<TeamMemberItem[]>(OFFICIAL_TEAM_MEMBERS);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await api.getTeam();
        if (res.success && Array.isArray(res.team) && res.team.length > 0) {
          // Sort by order ascending to maintain official sequence
          const sorted = [...res.team].sort((a, b) => (a.order || 0) - (b.order || 0));
          setTeam(sorted);
        }
      } catch (err) {
        // Fallback to official team list if network error
        setTeam(OFFICIAL_TEAM_MEMBERS);
      }
    };
    fetchTeam();
  }, []);

  const renderCard = (member: TeamMemberItem, displayIndex: number) => (
    <div
      key={member._id || member.name}
      className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 hover:border-brand-500 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between min-h-[160px]"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-500 group-hover:scale-125 transition-transform" />
          <span className="text-[11px] font-mono font-semibold text-slate-400 group-hover:text-brand-600 transition-colors">
            #{String(member.order || displayIndex + 1).padStart(2, '0')}
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
  );

  return (
    <div className="pt-28 pb-20 bg-slate-50/40 min-h-screen">
      {/* Header */}
      <section className="bg-white border-b border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="badge-primary mb-3">Our Engineering Collective</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Meet Our Team
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 mb-3">
            "YOUR VISION. OUR MISSION. BEYOND EXPECTATIONS."
          </p>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            The engineering minds powering WEENGINEERS TECH, delivering technical precision, scalable architecture, and modern full-stack excellence.
          </p>
        </div>
      </section>

      {/* Team Cards Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {team.length === 13 ? (
            <div className="space-y-6">
              {/* First row: 4 members */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {team.slice(0, 4).map((member, idx) => renderCard(member, idx))}
              </div>

              {/* Second row: 4 members (starts with ZAINUDEEN) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {team.slice(4, 8).map((member, idx) => renderCard(member, idx + 4))}
              </div>

              {/* Third row: 5 members */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {team.slice(8, 13).map((member, idx) => renderCard(member, idx + 8))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {team.map((member, idx) => renderCard(member, idx))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
