import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  HeartHandshake,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  EyeOff,
  User,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  Sparkles,
  Edit,
  Trash2,
  Lock,
  ShieldAlert,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Beneficiary } from '../types';
import { exportModuleExcel } from '../utils/excelExport';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const BeneficiariesPage: React.FC = () => {
  const { beneficiaries, projects, addBeneficiary, updateBeneficiary, deleteBeneficiary, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [privacyMasking, setPrivacyMasking] = useState<boolean>(currentUser.role === 'Staff');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingBen, setEditingBen] = useState<Beneficiary | null>(null);
  const [historyBen, setHistoryBen] = useState<Beneficiary | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<Beneficiary['gender']>('Female');
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Clean Water & Sanitation');
  const [assignedProject, setAssignedProject] = useState(projects[0]?.id || 'PRJ-101');
  const [assistanceCategory, setAssistanceCategory] = useState('Water Access');
  const [newServiceItem, setNewServiceItem] = useState('');

  const filteredBeneficiaries = useMemo(() => {
    return beneficiaries.filter(b => {
      const matchSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.contact.includes(searchQuery);
      const matchCat = categoryFilter === 'all' || b.category === categoryFilter;
      const matchProj = projectFilter === 'all' || b.assignedProject === projectFilter;
      const matchGender = genderFilter === 'all' || b.gender === genderFilter;
      return matchSearch && matchCat && matchProj && matchGender;
    });
  }, [beneficiaries, searchQuery, categoryFilter, projectFilter, genderFilter]);

  const totalPages = Math.ceil(filteredBeneficiaries.length / pageSize) || 1;
  const paginatedBeneficiaries = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBeneficiaries.slice(start, start + pageSize);
  }, [filteredBeneficiaries, currentPage]);

  const handleExportExcel = () => {
    const isMasked = privacyMasking || currentUser.role === 'Staff';
    const exportData = filteredBeneficiaries.map(b => ({
      'Beneficiary ID': b.id,
      'Full Name': b.name,
      'Age': b.age,
      'Gender': b.gender,
      'Contact Phone': isMasked ? '***-***-' + b.contact.slice(-4) : b.contact,
      'Location': b.location,
      'Category': b.category,
      'Assigned Project': b.assignedProject,
      'Registration Date': b.registrationDate,
      'Status': b.status,
      'Assistance History': b.servicesReceived.join('; ')
    }));
    exportModuleExcel('Beneficiaries', exportData);
  };

  const handleOpenCreate = () => {
    setName('');
    setAge(28);
    setGender('Female');
    setContact('+91 98200 ');
    setLocation('Rural Maharashtra');
    setCategory('Clean Water & Sanitation');
    setAssignedProject(projects[0]?.id || 'PRJ-101');
    setAssignedCategory('Water Access');
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (b: Beneficiary) => {
    setEditingBen(b);
    setName(b.name);
    setAge(b.age);
    setGender(b.gender);
    setContact(b.contact);
    setLocation(b.location);
    setCategory(b.category);
    setAssignedProject(b.assignedProject);
    setAssistanceCategory(b.assistanceCategory);
  };

  const handleSaveBeneficiary = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: Partial<Beneficiary> = {
      name,
      age: Number(age),
      gender,
      contact,
      location,
      category,
      assignedProject,
      assistanceCategory,
      servicesReceived: editingBen ? editingBen.servicesReceived : ['Initial Intake & Registration Verification']
    };

    if (editingBen) {
      await updateBeneficiary(editingBen.id, data);
      setEditingBen(null);
    } else {
      await addBeneficiary(data);
      setCreateModalOpen(false);
    }
  };

  const handleAddServiceItem = async () => {
    if (!newServiceItem.trim() || !historyBen) return;
    const updatedServices = [...historyBen.servicesReceived, newServiceItem.trim()];
    await updateBeneficiary(historyBen.id, { servicesReceived: updatedServices });
    setHistoryBen({ ...historyBen, servicesReceived: updatedServices });
    setNewServiceItem('');
  };

  const isRestrictedRole = currentUser.role === 'Staff';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
              Beneficiary Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {beneficiaries.length} Registered Individuals
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Privacy-conscious demographic registry, service distribution history, and category tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Privacy Toggle */}
          <button
            onClick={() => setPrivacyMasking(!privacyMasking)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors shadow-2xs cursor-pointer ${
              privacyMasking
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-white text-slate-700 border-slate-200'
            }`}
            title="Toggle privacy masking for sensitive phone numbers and locations"
          >
            {privacyMasking ? <EyeOff className="w-3.5 h-3.5 text-amber-700" /> : <Eye className="w-3.5 h-3.5 text-slate-500" />}
            <span>Privacy Mask: {privacyMasking ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs cursor-pointer"
            title="Download formatted Excel registry"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Registry</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register Beneficiary</span>
          </button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, ID (BEN-...), phone, location..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="all">All Assistance Types</option>
            <option value="Clean Water & Sanitation">Clean Water</option>
            <option value="Education">Education</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Food Security">Food Security</option>
            <option value="Livelihood">Livelihood</option>
            <option value="Disaster Response">Disaster Relief</option>
            <option value="Child Welfare">Child Welfare</option>
          </select>

          {/* Project Filter */}
          <select
            value={projectFilter}
            onChange={(e) => { setProjectFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="all">All Assigned Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.id} - {p.name.slice(0, 20)}...</option>
            ))}
          </select>

          {/* Gender Filter */}
          <select
            value={genderFilter}
            onChange={(e) => { setGenderFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="all">All Genders</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Beneficiaries Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Beneficiary ID & Name</th>
                <th className="py-3 px-4">Age / Gender</th>
                <th className="py-3 px-4">Assistance Category</th>
                <th className="py-3 px-4">Assigned Project</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Services Given</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedBeneficiaries.map(ben => {
                const isMasked = privacyMasking || isRestrictedRole;
                const displayPhone = isMasked ? '•••• •••• ' + ben.contact.slice(-4) : ben.contact;

                return (
                  <tr key={ben.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{ben.name}</div>
                      <div className="text-[10px] text-emerald-800 font-mono font-bold">{ben.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span>{ben.age} yrs • {ben.gender}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                        {ben.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-600">
                      {ben.assignedProject}
                    </td>
                    <td className="py-3 px-4">
                      <div className="truncate max-w-[140px] text-slate-600">{ben.location}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {displayPhone}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setHistoryBen(ben)}
                        className="text-[11px] font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                      >
                        <span>{ben.servicesReceived.length} Service Logs</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setHistoryBen(ben)}
                          className="px-2 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg cursor-pointer"
                        >
                          History
                        </button>
                        <button
                          onClick={() => handleOpenEdit(ben)}
                          className="p-1 hover:text-slate-900 rounded-lg cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(ben.id)}
                          className="p-1 hover:text-rose-600 rounded-lg cursor-pointer"
                          title="Archive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-xs text-slate-500">
          <span>
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredBeneficiaries.length)} of {filteredBeneficiaries.length} records
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-medium text-slate-700">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Service Assistance History Modal */}
      {historyBen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {historyBen.id}
                </span>
                <h3 className="text-base font-bold text-slate-900 font-heading mt-1">{historyBen.name}</h3>
                <p className="text-xs text-slate-500">{historyBen.location} • Category: {historyBen.category}</p>
              </div>
              <button onClick={() => setHistoryBen(null)} className="p-1 text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <h4 className="font-semibold text-slate-800">Assistance & Aid Logged</h4>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {historyBen.servicesReceived.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-slate-800 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              {/* Add New Service Note */}
              <div className="pt-3 border-t border-slate-100">
                <label className="font-semibold text-slate-700 block mb-1">Log New Service or Aid Handover</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Issued 30-day Ration Pack"
                    value={newServiceItem}
                    onChange={(e) => setNewServiceItem(e.target.value)}
                    className="flex-1 p-2 border border-slate-200 rounded-xl text-xs"
                  />
                  <button
                    onClick={handleAddServiceItem}
                    className="px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-semibold cursor-pointer"
                  >
                    Add Log
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 mt-4">
              <button
                onClick={() => setHistoryBen(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register / Edit Beneficiary Modal */}
      {(createModalOpen || editingBen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-4 font-heading">
              {editingBen ? 'Edit Beneficiary Record' : 'Register New Beneficiary'}
            </h3>

            <form onSubmit={handleSaveBeneficiary} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Savitri Devi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Age *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Gender *</label>
                  <select
                    value={gender}
                    onChange={(e: any) => setGender(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Contact Phone *</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98200 12345"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Location / Hamlet *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Melghat Tribal Settlement"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Assistance Program Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                >
                  <option value="Clean Water & Sanitation">Clean Water & Sanitation</option>
                  <option value="Education">Education</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Food Security">Food Security</option>
                  <option value="Livelihood">Livelihood</option>
                  <option value="Disaster Response">Disaster Response</option>
                  <option value="Child Welfare">Child Welfare</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Associated Project *</label>
                <select
                  value={assignedProject}
                  onChange={(e) => setAssignedProject(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.id} - {p.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => { setCreateModalOpen(false); setEditingBen(null); }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-semibold hover:bg-emerald-900"
                >
                  {editingBen ? 'Save Changes' : 'Register Beneficiary'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Archive Beneficiary Record"
        message="Are you sure you want to archive this beneficiary? The record will be removed from the active operational registry."
        confirmLabel="Archive Record"
        onConfirm={async () => {
          if (deleteId) {
            await deleteBeneficiary(deleteId);
            setDeleteId(null);
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
