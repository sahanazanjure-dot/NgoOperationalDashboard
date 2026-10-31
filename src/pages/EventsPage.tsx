import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarCheck,
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  MapPin,
  User,
  DollarSign,
  Users,
  Target,
  Sparkles,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-react';
import { EventItem } from '../types';
import { exportModuleExcel } from '../utils/excelExport';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const EventsPage: React.FC = () => {
  const { events, projects, staff, addEvent, updateEvent, deleteEvent, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventItem['type']>('Awareness Campaign');
  const [project, setProject] = useState(projects[0]?.id || 'PRJ-101');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [organizer, setOrganizer] = useState(staff[0]?.name || 'Dr. Aarti Deshmukh');
  const [participantsCount, setParticipantsCount] = useState<number>(200);
  const [beneficiariesReached, setBeneficiariesReached] = useState<number>(500);
  const [budget, setBudget] = useState<number>(3000);
  const [spent, setSpent] = useState<number>(2500);
  const [status, setStatus] = useState<EventItem['status']>('Upcoming');
  const [outcomeSummary, setOutcomeSummary] = useState('');

  const filteredEvents = useMemo(() => {
    return events.filter(ev => {
      const matchSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.outcomeSummary.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || ev.status === statusFilter;
      const matchType = typeFilter === 'all' || ev.type === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [events, searchQuery, statusFilter, typeFilter]);

  const handleExportExcel = () => {
    const exportData = filteredEvents.map(ev => ({
      'Event ID': ev.id,
      'Event Title': ev.title,
      'Event Type': ev.type,
      'Associated Project': ev.project,
      'Date': ev.date,
      'Location': ev.location,
      'Organizer': ev.organizer,
      'Participants': ev.participantsCount,
      'Beneficiaries Reached': ev.beneficiariesReached,
      'Budget ($)': ev.budget,
      'Spent ($)': ev.spent,
      'Status': ev.status,
      'Outcomes': ev.outcomeSummary
    }));
    exportModuleExcel('Events_and_Campaigns', exportData);
  };

  const handleOpenCreate = () => {
    setTitle('');
    setType('Awareness Campaign');
    setProject(projects[0]?.id || 'PRJ-101');
    setDate(new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0]);
    setLocation('Community Field Center');
    setOrganizer(staff[0]?.name || 'Dr. Aarti Deshmukh');
    setParticipantsCount(250);
    setBeneficiariesReached(600);
    setBudget(3500);
    setSpent(0);
    setStatus('Upcoming');
    setOutcomeSummary('');
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (ev: EventItem) => {
    setEditingEvent(ev);
    setTitle(ev.title);
    setType(ev.type);
    setProject(ev.project);
    setDate(ev.date);
    setLocation(ev.location);
    setOrganizer(ev.organizer);
    setParticipantsCount(ev.participantsCount);
    setBeneficiariesReached(ev.beneficiariesReached);
    setBudget(ev.budget);
    setSpent(ev.spent);
    setStatus(ev.status);
    setOutcomeSummary(ev.outcomeSummary);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: Partial<EventItem> = {
      title,
      type,
      project,
      date,
      location,
      organizer,
      participantsCount: Number(participantsCount),
      beneficiariesReached: Number(beneficiariesReached),
      budget: Number(budget),
      spent: Number(spent),
      status,
      outcomeSummary
    };

    if (editingEvent) {
      await updateEvent(editingEvent.id, data);
      setEditingEvent(null);
    } else {
      await addEvent(data);
      setCreateModalOpen(false);
    }
  };

  const isAuthorized = currentUser.role === 'Administrator' || currentUser.role === 'Project Manager';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
              Events & Community Campaigns
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {events.length} Drives Conducted
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Awareness summits, medical camps, donation drives, workshops, and verified outcome summaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs cursor-pointer"
            title="Export event logs to Excel (.xlsx)"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Events</span>
          </button>

          {isAuthorized && (
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Event</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search events, outcomes, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="Upcoming">Upcoming Events</option>
            <option value="Completed">Completed Drives</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-medium"
          >
            <option value="all">All Campaign Types</option>
            <option value="Awareness Campaign">Awareness Campaign</option>
            <option value="Workshop & Competition">Workshop & Competition</option>
            <option value="Medical Camp">Medical Camp</option>
            <option value="Disaster Preparedness">Disaster Preparedness</option>
            <option value="Community Outreach">Community Outreach</option>
            <option value="Exhibition & Market">Exhibition & Market</option>
            <option value="Career Fair">Career Fair</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.map(ev => {
          const isUpcoming = ev.status === 'Upcoming';

          return (
            <div
              key={ev.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {ev.type}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isUpcoming ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {ev.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 font-heading leading-snug">
                  {ev.title}
                </h3>

                <div className="space-y-1.5 text-xs text-slate-600 mt-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-800">{ev.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{ev.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Lead: {ev.organizer}</span>
                  </div>
                </div>

                {/* Outcome summary box */}
                {ev.outcomeSummary && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Verified Outcome
                    </span>
                    <p className="text-slate-700 leading-relaxed text-[11px]">{ev.outcomeSummary}</p>
                  </div>
                )}

                {/* Impact Metrics */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase block">Participants</span>
                    <span className="font-bold text-slate-900">{ev.participantsCount.toLocaleString()}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-100">
                    <span className="text-[10px] text-emerald-700 uppercase block font-semibold">Beneficiaries</span>
                    <span className="font-bold text-emerald-950">{ev.beneficiariesReached.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100 text-xs">
                <span className="text-slate-500 font-medium">
                  Budget: ${ev.budget.toLocaleString()} (${ev.spent.toLocaleString()} spent)
                </span>

                {isAuthorized && (
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleOpenEdit(ev)} className="p-1 hover:text-slate-900 cursor-pointer">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteId(ev.id)} className="p-1 hover:text-rose-600 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Event Modal */}
      {(createModalOpen || editingEvent) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-4 font-heading">
              {editingEvent ? 'Edit Community Event' : 'Schedule Community Event / Drive'}
            </h3>

            <form onSubmit={handleSaveEvent} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. World Water Day Village Summit"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Campaign Type *</label>
                  <select
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  >
                    <option value="Awareness Campaign">Awareness Campaign</option>
                    <option value="Workshop & Competition">Workshop & Competition</option>
                    <option value="Medical Camp">Medical Camp</option>
                    <option value="Disaster Preparedness">Disaster Preparedness</option>
                    <option value="Community Outreach">Community Outreach</option>
                    <option value="Exhibition & Market">Exhibition & Market</option>
                    <option value="Career Fair">Career Fair</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Project *</label>
                  <select
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.id} - {p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Location Venue *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Lead Organizer</label>
                  <select
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  >
                    {staff.map(s => (
                      <option key={s.id} value={s.name}>{s.name} ({s.role})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Status</label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Attendees / Participants</label>
                  <input
                    type="number"
                    min={0}
                    value={participantsCount}
                    onChange={(e) => setParticipantsCount(Number(e.target.value))}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Beneficiaries Impacted</label>
                  <input
                    type="number"
                    min={0}
                    value={beneficiariesReached}
                    onChange={(e) => setBeneficiariesReached(Number(e.target.value))}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Event Budget ($)</label>
                  <input
                    type="number"
                    min={0}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Actual Spent ($)</label>
                  <input
                    type="number"
                    min={0}
                    value={spent}
                    onChange={(e) => setSpent(Number(e.target.value))}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Outcome Summary & Impact Milestones</label>
                <textarea
                  rows={2}
                  placeholder="Key resolutions, supplies distributed, or clinic diagnostic results..."
                  value={outcomeSummary}
                  onChange={(e) => setOutcomeSummary(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => { setCreateModalOpen(false); setEditingEvent(null); }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-semibold hover:bg-emerald-900 cursor-pointer"
                >
                  {editingEvent ? 'Save Changes' : 'Schedule Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Cancel & Delete Event"
        message="Are you sure you want to cancel and delete this event record?"
        confirmLabel="Delete Event"
        onConfirm={async () => {
          if (deleteId) {
            await deleteEvent(deleteId);
            setDeleteId(null);
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
