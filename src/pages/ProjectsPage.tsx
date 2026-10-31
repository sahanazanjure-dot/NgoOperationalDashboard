import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  MapPin,
  User,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  Users,
  Layers,
  ChevronRight,
  ExternalLink,
  Target
} from 'lucide-react';
import { Project, ProjectMilestone } from '../types';
import { exportModuleExcel } from '../utils/excelExport';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const ProjectsPage: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject, currentUser, staff } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Clean Water & Sanitation');
  const [description, setDescription] = useState('');
  const [objectives, setObjectives] = useState('');
  const [location, setLocation] = useState('');
  const [manager, setManager] = useState('');
  const [budget, setBudget] = useState<number>(50000);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<Project['status']>('Active');
  const [beneficiariesCount, setBeneficiariesCount] = useState<number>(1000);
  const [donorPartners, setDonorPartners] = useState('');

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.objectives.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.manager.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
      return matchSearch && matchStatus && matchCat;
    });
  }, [projects, searchQuery, statusFilter, categoryFilter]);

  const handleExportExcel = () => {
    const exportData = filteredProjects.map(p => ({
      'Project ID': p.id,
      'Project Name': p.name,
      'Category': p.category,
      'Location': p.location,
      'Manager': p.manager,
      'Budget ($)': p.budget,
      'Spent ($)': p.spent,
      'Utilization %': p.budget > 0 ? `${((p.spent / p.budget) * 100).toFixed(1)}%` : '0%',
      'Start Date': p.startDate,
      'End Date': p.endDate,
      'Status': p.status,
      'Beneficiaries Reached': p.beneficiariesCount,
      'Donor Partners': p.donorPartners.join(', ')
    }));
    exportModuleExcel('Projects', exportData);
  };

  const handleOpenCreate = () => {
    setName('');
    setCategory('Clean Water & Sanitation');
    setDescription('');
    setObjectives('');
    setLocation('');
    setManager(staff[0]?.name || 'Dr. Aarti Deshmukh');
    setBudget(50000);
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(new Date(Date.now() + 180 * 24 * 3600 * 1000).toISOString().split('T')[0]);
    setStatus('Active');
    setBeneficiariesCount(1500);
    setDonorPartners('');
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (p: Project) => {
    setEditingProject(p);
    setName(p.name);
    setCategory(p.category);
    setDescription(p.description);
    setObjectives(p.objectives);
    setLocation(p.location);
    setManager(p.manager);
    setBudget(p.budget);
    setStartDate(p.startDate);
    setEndDate(p.endDate);
    setStatus(p.status);
    setBeneficiariesCount(p.beneficiariesCount);
    setDonorPartners(p.donorPartners.join(', '));
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: Partial<Project> = {
      name,
      category,
      description,
      objectives,
      location,
      manager,
      budget: Number(budget),
      startDate,
      endDate,
      status,
      beneficiariesCount: Number(beneficiariesCount),
      donorPartners: donorPartners.split(',').map(d => d.trim()).filter(Boolean)
    };

    if (editingProject) {
      await updateProject(editingProject.id, data);
      setEditingProject(null);
    } else {
      await addProject(data);
      setCreateModalOpen(false);
    }
  };

  const handleToggleMilestone = async (project: Project, milestoneId: string) => {
    const updatedMilestones = project.milestones.map(m =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    await updateProject(project.id, { milestones: updatedMilestones });
    if (detailProject && detailProject.id === project.id) {
      setDetailProject({ ...detailProject, milestones: updatedMilestones });
    }
  };

  const isFinanceOrAdmin = currentUser.role === 'Administrator' || currentUser.role === 'Project Manager';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
              Project Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {projects.length} Total Projects
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track programmatic milestones, budget burn rates, donor allocations, and community impact.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs cursor-pointer"
            title="Export filtered project records to Excel (.xlsx)"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Excel</span>
          </button>

          {isFinanceOrAdmin && (
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Project</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search projects, manager, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Delayed">Delayed</option>
            <option value="Completed">Completed</option>
            <option value="Planning">Planning</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="all">All Categories</option>
            <option value="Clean Water & Sanitation">Clean Water</option>
            <option value="Education & Skilling">Education</option>
            <option value="Healthcare & Nutrition">Healthcare</option>
            <option value="Disaster Response">Disaster Response</option>
            <option value="Food Security">Food Security</option>
            <option value="Livelihood & Environment">Livelihood</option>
          </select>

          {/* View toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs ml-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded-lg ${viewMode === 'grid' ? 'bg-white font-semibold shadow-2xs text-slate-900' : 'text-slate-500'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded-lg ${viewMode === 'table' ? 'bg-white font-semibold shadow-2xs text-slate-900' : 'text-slate-500'}`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map(project => {
            const utilPercent = project.budget > 0 ? Math.round((project.spent / project.budget) * 100) : 0;
            const isOverBudget = project.spent > project.budget;
            const isDelayed = project.status === 'Delayed';
            const completedMilestones = project.milestones.filter(m => m.completed).length;

            return (
              <div
                key={project.id}
                className={`p-5 rounded-2xl bg-white border shadow-2xs hover:shadow-md transition-all flex flex-col justify-between ${
                  isDelayed
                    ? 'border-amber-300 ring-1 ring-amber-200'
                    : isOverBudget
                    ? 'border-rose-300 ring-1 ring-rose-200'
                    : 'border-slate-200/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                      {project.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      project.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                      project.status === 'Delayed' ? 'bg-amber-100 text-amber-800' :
                      project.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {project.status}
                    </span>
                  </div>

                  <h3
                    onClick={() => setDetailProject(project)}
                    className="text-base font-bold text-slate-900 hover:text-emerald-700 cursor-pointer font-heading tracking-tight"
                  >
                    {project.name}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-[130px]">{project.location}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-[120px]">{project.manager}</span>
                    </span>
                  </div>

                  {/* Milestones Checkpoint */}
                  <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="font-semibold text-slate-700">Milestones Progress</span>
                      <span className="text-slate-500">{completedMilestones} / {project.milestones.length} Done</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div
                        className="bg-emerald-700 h-1.5 rounded-full"
                        style={{ width: `${project.milestones.length > 0 ? (completedMilestones / project.milestones.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Budget & Spend Progress */}
                  <div className="mt-3 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Expenditure</span>
                      <span className={`font-semibold ${isOverBudget ? 'text-rose-600 font-bold' : 'text-slate-800'}`}>
                        ${project.spent.toLocaleString()} / ${project.budget.toLocaleString()} ({utilPercent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full ${isOverBudget ? 'bg-rose-600' : utilPercent > 80 ? 'bg-amber-500' : 'bg-emerald-600'}`}
                        style={{ width: `${Math.min(utilPercent, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100 text-xs">
                  <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-emerald-700" />
                    {project.beneficiariesCount.toLocaleString()} Impacted
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setDetailProject(project)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Milestones
                    </button>
                    {isFinanceOrAdmin && (
                      <>
                        <button
                          onClick={() => handleOpenEdit(project)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(project.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Manager & Region</th>
                  <th className="py-3 px-4">Budget</th>
                  <th className="py-3 px-4">Spent</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Impact</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredProjects.map(project => (
                  <tr key={project.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{project.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{project.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                        {project.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div>{project.manager}</div>
                      <div className="text-[10px] text-slate-400">{project.location}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold">${project.budget.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${project.spent > project.budget ? 'text-rose-600 font-bold' : 'text-slate-800'}`}>
                        ${project.spent.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        project.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                        project.status === 'Delayed' ? 'bg-amber-100 text-amber-800' :
                        project.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium">{project.beneficiariesCount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setDetailProject(project)}
                          className="px-2 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg"
                        >
                          Details
                        </button>
                        {isFinanceOrAdmin && (
                          <>
                            <button onClick={() => handleOpenEdit(project)} className="p-1 hover:text-slate-900">
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setDeleteId(project.id)} className="p-1 hover:text-rose-600">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Project Milestones Detail Modal */}
      {detailProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {detailProject.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 font-heading mt-1">{detailProject.name}</h3>
                <p className="text-xs text-slate-500">{detailProject.location} • Lead: {detailProject.manager}</p>
              </div>
              <button
                onClick={() => setDetailProject(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <h4 className="font-semibold text-slate-800">Objectives & Impact Target</h4>
                <p className="text-slate-600 mt-1 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {detailProject.objectives}
                </p>
              </div>

              {/* Milestones Checklist */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-slate-800">Program Milestones Checklist</h4>
                  <span className="text-[11px] text-slate-500">Click circle to check off completion</span>
                </div>
                <div className="space-y-2">
                  {detailProject.milestones.map(m => (
                    <div
                      key={m.id}
                      onClick={() => handleToggleMilestone(detailProject, m.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        m.completed ? 'bg-emerald-50/60 border-emerald-200' : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          m.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                        }`}>
                          {m.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <span className={`font-medium ${m.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                          {m.title}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">Target: {m.targetDate}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Donor Partners & Assigned Staff */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Donor Partners</span>
                  <p className="font-medium text-slate-800 mt-0.5">{detailProject.donorPartners.join(', ') || 'General Pool'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Assigned Staff</span>
                  <p className="font-medium text-slate-800 mt-0.5">{detailProject.assignedStaff.join(', ') || detailProject.manager}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-5 border-t border-slate-100 mt-5">
              <button
                onClick={() => setDetailProject(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Project Modal */}
      {(createModalOpen || editingProject) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-4 font-heading">
              {editingProject ? 'Edit Project' : 'Create New NGO Project'}
            </h3>

            <form onSubmit={handleSaveProject} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700">Project Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rural Clean Water Initiative Phase 2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  >
                    <option value="Clean Water & Sanitation">Clean Water & Sanitation</option>
                    <option value="Education & Skilling">Education & Skilling</option>
                    <option value="Healthcare & Nutrition">Healthcare & Nutrition</option>
                    <option value="Disaster Response">Disaster Response</option>
                    <option value="Food Security">Food Security</option>
                    <option value="Livelihood & Environment">Livelihood & Environment</option>
                    <option value="Child Welfare">Child Welfare</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Lead Project Manager *</label>
                  <select
                    value={manager}
                    onChange={(e) => setManager(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  >
                    {staff.map(s => (
                      <option key={s.id} value={s.name}>{s.name} ({s.role})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Target Location / Hamlets *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marathwada District"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Approved Budget ($ USD) *</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Estimated Completion Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Status</label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  >
                    <option value="Active">Active</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Completed">Completed</option>
                    <option value="Planning">Planning</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Beneficiaries Target</label>
                  <input
                    type="number"
                    value={beneficiariesCount}
                    onChange={(e) => setBeneficiariesCount(Number(e.target.value))}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700">Donor Partners (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. TechCorp Foundation, Rotary International"
                    value={donorPartners}
                    onChange={(e) => setDonorPartners(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700">Project Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700">Objectives & Measurable Targets</label>
                  <textarea
                    rows={2}
                    value={objectives}
                    onChange={(e) => setObjectives(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => { setCreateModalOpen(false); setEditingProject(null); }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-semibold hover:bg-emerald-900"
                >
                  {editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Delete Project Record"
        message="Are you sure you want to delete this project? All associated budget tracking and milestone entries will be archived."
        confirmLabel="Delete Project"
        onConfirm={async () => {
          if (deleteId) {
            await deleteProject(deleteId);
            setDeleteId(null);
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
