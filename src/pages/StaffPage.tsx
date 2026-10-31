import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users2,
  Plus,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Calendar,
  Clock,
  Sparkles,
  Edit,
  Trash2,
  Award,
  CheckCircle,
  Briefcase
} from 'lucide-react';
import { StaffMember } from '../types';
import { exportModuleExcel } from '../utils/excelExport';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const StaffPage: React.FC = () => {
  const { staff, projects, addStaff, updateStaff, deleteStaff, currentUser } = useApp();

  const [typeTab, setTypeTab] = useState<'all' | 'Staff' | 'Volunteer'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [logHoursStaff, setLogHoursStaff] = useState<StaffMember | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<'Staff' | 'Volunteer'>('Staff');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('Water & Environmental Health');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<StaffMember['status']>('Active');
  const [skills, setSkills] = useState('');
  const [hoursToAdd, setHoursToAdd] = useState<number>(8);

  const filteredStaff = useMemo(() => {
    return staff.filter(s => {
      const matchType = typeTab === 'all' || s.type === typeTab;
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.skills.some(sk => sk.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchDept = departmentFilter === 'all' || s.department === departmentFilter;
      const matchStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchType && matchSearch && matchDept && matchStatus;
    });
  }, [staff, typeTab, searchQuery, departmentFilter, statusFilter]);

  const handleExportExcel = () => {
    const exportData = filteredStaff.map(s => ({
      'ID': s.id,
      'Name': s.name,
      'Type': s.type,
      'Role / Designation': s.role,
      'Department': s.department,
      'Email': s.email,
      'Phone': s.phone,
      'Status': s.status,
      'Joining Date': s.joiningDate,
      'Hours Logged (Month)': s.hoursLoggedThisMonth,
      'Skills': s.skills.join(', '),
      'Assigned Projects': s.assignedProjects.join(', ')
    }));
    exportModuleExcel('Staff_and_Volunteers', exportData);
  };

  const handleOpenCreate = () => {
    setName('');
    setType('Staff');
    setRole('Program Officer');
    setDepartment('Community Education & Youth');
    setEmail('');
    setPhone('+91 98200 ');
    setStatus('Active');
    setSkills('Community Outreach, Logistics');
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (s: StaffMember) => {
    setEditingStaff(s);
    setName(s.name);
    setType(s.type);
    setRole(s.role);
    setDepartment(s.department);
    setEmail(s.email);
    setPhone(s.phone);
    setStatus(s.status);
    setSkills(s.skills.join(', '));
  };

  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: Partial<StaffMember> = {
      name,
      type,
      role,
      department,
      email,
      phone,
      status,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      assignedProjects: editingStaff ? editingStaff.assignedProjects : [projects[0]?.id || 'PRJ-101'],
      hoursLoggedThisMonth: editingStaff ? editingStaff.hoursLoggedThisMonth : 0
    };

    if (editingStaff) {
      await updateStaff(editingStaff.id, data);
      setEditingStaff(null);
    } else {
      await addStaff(data);
      setCreateModalOpen(false);
    }
  };

  const handleCommitHours = async () => {
    if (!logHoursStaff) return;
    const newTotal = logHoursStaff.hoursLoggedThisMonth + Number(hoursToAdd);
    await updateStaff(logHoursStaff.id, { hoursLoggedThisMonth: newTotal });
    setLogHoursStaff(null);
  };

  const isAuthorized = currentUser.role === 'Administrator' || currentUser.role === 'Project Manager';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
              Staff & Volunteers
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {staff.length} Team Members
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Personnel profiles, volunteer hours logging, departmental allocation, and project assignments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs cursor-pointer"
            title="Download formatted staff directory (.xlsx)"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Directory</span>
          </button>

          {isAuthorized && (
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Member</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium w-full sm:w-auto">
          <button
            onClick={() => setTypeTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              typeTab === 'all' ? 'bg-white font-semibold text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Personnel ({staff.length})
          </button>
          <button
            onClick={() => setTypeTab('Staff')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              typeTab === 'Staff' ? 'bg-white font-semibold text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Full-time Staff ({staff.filter(s => s.type === 'Staff').length})
          </button>
          <button
            onClick={() => setTypeTab('Volunteer')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              typeTab === 'Volunteer' ? 'bg-white font-semibold text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Volunteers ({staff.filter(s => s.type === 'Volunteer').length})
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, role, skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-800"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On-Leave">On-Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Staff Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStaff.map(member => (
          <div
            key={member.id}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm text-white ${
                    member.type === 'Staff' ? 'bg-emerald-800' : 'bg-teal-700'
                  }`}>
                    {member.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">{member.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{member.role}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  member.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                  member.status === 'On-Leave' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {member.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 mt-2">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{member.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono">{member.phone}</span>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
                {member.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <Clock className="w-3.5 h-3.5 text-emerald-700" />
                <span>{member.hoursLoggedThisMonth} hrs (Month)</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setLogHoursStaff(member)}
                  className="px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg cursor-pointer"
                >
                  Log Hours
                </button>
                {isAuthorized && (
                  <>
                    <button
                      onClick={() => handleOpenEdit(member)}
                      className="p-1 hover:text-slate-900 rounded-lg cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(member.id)}
                      className="p-1 hover:text-rose-600 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Log Hours Modal */}
      {logHoursStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 font-heading mb-2">Log Working Hours</h3>
            <p className="text-xs text-slate-500 mb-4">
              Add verified service or volunteer hours for <strong className="text-slate-800">{logHoursStaff.name}</strong>.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Hours to Add</label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={hoursToAdd}
                  onChange={(e) => setHoursToAdd(Number(e.target.value))}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                />
              </div>
              <p className="text-[11px] text-slate-400">Current Monthly Total: {logHoursStaff.hoursLoggedThisMonth} hours</p>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 mt-4">
              <button
                onClick={() => setLogHoursStaff(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCommitHours}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Save Hours
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Member Modal */}
      {(createModalOpen || editingStaff) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-4 font-heading">
              {editingStaff ? 'Edit Member Profile' : 'Add Personnel Profile'}
            </h3>

            <form onSubmit={handleSaveStaff} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="font-semibold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Role Type *</label>
                  <select
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  >
                    <option value="Staff">Full-time Staff</option>
                    <option value="Volunteer">Volunteer</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Designation / Role *</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="col-span-2">
                  <label className="font-semibold text-slate-700">Department *</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  >
                    <option value="Water & Environmental Health">Water & Environmental Health</option>
                    <option value="Community Education & Youth">Community Education & Youth</option>
                    <option value="Rural Healthcare & Nutrition">Rural Healthcare & Nutrition</option>
                    <option value="Disaster Preparedness & Relief">Disaster Preparedness & Relief</option>
                    <option value="Finance, Compliance & Grants">Finance, Compliance & Grants</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="col-span-2">
                  <label className="font-semibold text-slate-700">Skills (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. First Aid, Counseling, Python"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => { setCreateModalOpen(false); setEditingStaff(null); }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-semibold hover:bg-emerald-900 cursor-pointer"
                >
                  {editingStaff ? 'Save Changes' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Remove Staff / Volunteer Member"
        message="Are you sure you want to remove this member profile from the active directory?"
        confirmLabel="Remove Member"
        onConfirm={async () => {
          if (deleteId) {
            await deleteStaff(deleteId);
            setDeleteId(null);
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
