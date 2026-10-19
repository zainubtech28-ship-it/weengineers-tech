import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { EnquiryItem } from '../../types';
import {
  Inbox,
  Search,
  CheckCircle,
  FileSpreadsheet,
  Clock,
  MessageSquare,
  X,
  Mail,
  Phone,
  Building,
  User,
  Send,
} from 'lucide-react';

export const AdminEnquiriesPage: React.FC = () => {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Detail & Note Modal
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);
  const [newNote, setNewNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminEnquiries({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: search.trim() || undefined,
      });
      if (res.success) setEnquiries(res.enquiries);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  const handleStatusChange = async (enquiryId: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await api.updateEnquiryStatus(enquiryId, newStatus);
      if (res.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e._id === enquiryId ? res.enquiry : e))
        );
        if (selectedEnquiry && selectedEnquiry._id === enquiryId) {
          setSelectedEnquiry(res.enquiry);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedEnquiry) return;
    try {
      const res = await api.addEnquiryNote(selectedEnquiry._id, newNote.trim());
      if (res.success) {
        setSelectedEnquiry(res.enquiry);
        setEnquiries((prev) =>
          prev.map((item) => (item._id === selectedEnquiry._id ? res.enquiry : item))
        );
        setNewNote('');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to add note.');
    }
  };

  const statuses = [
    'New',
    'Contacted',
    'Qualified',
    'Proposal Sent',
    'In Progress',
    'Completed',
    'Rejected',
  ];

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Client Enquiries & Pipeline</h1>
          <p className="text-xs text-slate-500">Track client inbound leads, manage status milestones, and record team notes</p>
        </div>

        <a
          href="/api/v1/admin/enquiries/export"
          download
          className="btn-secondary text-xs py-2 px-4 self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Export All Enquiries (CSV)
        </a>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, ref code, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 text-xs py-2"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
              statusFilter === 'all' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            All
          </button>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === st ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="card-light overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Reference</th>
                <th className="p-4">Client</th>
                <th className="p-4">Service</th>
                <th className="p-4">Budget / Timeline</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enquiries.map((enq) => (
                <tr key={enq._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono font-bold text-brand-700">{enq.referenceCode}</td>
                  <td className="p-4">
                    <span className="font-bold text-slate-900 block">{enq.fullName}</span>
                    <span className="text-[11px] text-slate-400 block">{enq.email}</span>
                    {enq.companyName && (
                      <span className="text-[10px] text-slate-500 font-medium">{enq.companyName}</span>
                    )}
                  </td>
                  <td className="p-4 text-slate-700 font-medium">{enq.service}</td>
                  <td className="p-4 text-slate-500">
                    <span className="block">{enq.budget || 'Unspecified'}</span>
                    <span className="text-[10px] text-slate-400">{enq.timeline || 'Flexible'}</span>
                  </td>
                  <td className="p-4">
                    <select
                      value={enq.status}
                      disabled={updatingStatus}
                      onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-500"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-slate-400">
                    {new Date(enq.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedEnquiry(enq)}
                      className="btn-secondary text-[11px] py-1 px-3"
                    >
                      Inspect Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dossier & Internal Notes Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div>
                <span className="badge-primary mb-1">Enquiry Reference</span>
                <h3 className="font-heading font-bold text-slate-900 text-lg">
                  {selectedEnquiry.referenceCode} — {selectedEnquiry.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 text-xs">
              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-slate-400 block mb-0.5">Email Address:</span>
                  <a href={`mailto:${selectedEnquiry.email}`} className="font-bold text-brand-600 hover:underline">
                    {selectedEnquiry.email}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Phone / WhatsApp:</span>
                  <span className="font-bold text-slate-800">{selectedEnquiry.phone || 'None provided'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Company / Entity:</span>
                  <span className="font-bold text-slate-800">{selectedEnquiry.companyName || 'Individual'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Contact Method:</span>
                  <span className="font-bold text-slate-800 capitalize">{selectedEnquiry.preferredContactMethod}</span>
                </div>
              </div>

              {/* Project Description */}
              <div>
                <span className="font-bold text-slate-900 uppercase tracking-wider block mb-1">
                  Submitted Project Specifications:
                </span>
                <p className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedEnquiry.description}
                </p>
              </div>

              {/* Status Update Bar */}
              <div className="p-4 rounded-xl bg-brand-50/60 border border-brand-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-brand-900 block">Current Operational Status:</span>
                  <span className="text-brand-700 text-[11px]">Updating this status immediately syncs the client tracker</span>
                </div>
                <select
                  value={selectedEnquiry.status}
                  onChange={(e) => handleStatusChange(selectedEnquiry._id, e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-brand-200 bg-white font-bold text-xs text-brand-800 cursor-pointer shadow-sm"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Internal Notes History */}
              <div>
                <span className="font-bold text-slate-900 uppercase tracking-wider block mb-2">
                  Internal Engineering & Proposal Notes ({selectedEnquiry.internalNotes?.length || 0})
                </span>

                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                  {selectedEnquiry.internalNotes?.length === 0 ? (
                    <p className="text-slate-400 italic">No internal notes logged yet.</p>
                  ) : (
                    selectedEnquiry.internalNotes?.map((note, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-800">{note.authorName}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(note.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{note.note}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Record an internal note, meeting outcome, or proposal link..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="input-field text-xs flex-1"
                  />
                  <button type="submit" className="btn-primary text-xs py-2 px-4 whitespace-nowrap">
                    <Send className="w-3 h-3" /> Save Note
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
