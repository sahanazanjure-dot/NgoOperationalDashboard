import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  Edit,
  Trash2,
  ChevronRight,
  ArrowRight,
  Kanban
} from 'lucide-react';
import { TaskItem } from '../types';
import { exportModuleExcel } from '../utils/excelExport';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const TasksPage: React.FC = () => {
  const { tasks, projects, staff, addTask, updateTask, deleteTask, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [project, setProject] = useState(projects[0]?.id || 'PRJ-101');
  const [assignee, setAssignee] = useState(staff[0]?.name || 'Dr. Aarti Deshmukh');
  const [priority, setPriority] = useState<TaskItem['priority']>('Medium');
  const [status, setStatus] = useState<TaskItem['status']>('Pending');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0]);
  const [estimatedHours, setEstimatedHours] = useState<number>(12);
  const [description, setDescription] = useState('');

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.assignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter;
      const matchProj = projectFilter === 'all' || t.project === projectFilter;
      return matchSearch && matchPriority && matchProj;
    });
  }, [tasks, searchQuery, priorityFilter, projectFilter]);

  const handleExportExcel = () => {
    const exportData = filteredTasks.map(t => ({
      'Task ID': t.id,
      'Task Title': t.title,
      'Project': t.project,
      'Assignee': t.assignee,
      'Priority': t.priority,
      'Status': t.status,
      'Due Date': t.dueDate,
      'Estimated Hours': t.estimatedHours,
      'Description': t.description
    }));
    exportModuleExcel('Tasks_and_Coordination', exportData);
  };

  const handleOpenCreate = () => {
    setTitle('');
    setProject(projects[0]?.id || 'PRJ-101');
    setAssignee(staff[0]?.name || 'Dr. Aarti Deshmukh');
    setPriority('Medium');
    setStatus('Pending');
    setDueDate(new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0]);
    setEstimatedHours(8);
    setDescription('');
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (t: TaskItem) => {
    setEditingTask(t);
    setTitle(t.title);
    setProject(t.project);
    setAssignee(t.assignee);
    setPriority(t.priority);
    setStatus(t.status);
    setDueDate(t.dueDate);
    setEstimatedHours(t.estimatedHours);
    setDescription(t.description);
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: Partial<TaskItem> = {
      title,
      project,
      assignee,
      priority,
      status,
      dueDate,
      estimatedHours: Number(estimatedHours),
      description
    };

    if (editingTask) {
      await updateTask(editingTask.id, data);
      setEditingTask(null);
    } else {
      await addTask(data);
      setCreateModalOpen(false);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskItem['status']) => {
    await updateTask(taskId, { status: newStatus });
  };

  const kanbanColumns: { status: TaskItem['status']; label: string; color: string }[] = [
    { status: 'Pending', label: 'To Do / Pending', color: 'bg-slate-100 text-slate-800' },
    { status: 'In Progress', label: 'In Progress', color: 'bg-blue-50 text-blue-800' },
    { status: 'Review', label: 'Review & Audit', color: 'bg-amber-50 text-amber-800' },
    { status: 'Completed', label: 'Completed', color: 'bg-emerald-50 text-emerald-800' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
              Tasks & Team Coordination
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {tasks.filter(t => t.status !== 'Completed').length} Pending Tasks
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Program deliverables, audit filing schedules, supply restocking tasks, and staff accountability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs cursor-pointer"
            title="Download formatted tasks workbook (.xlsx)"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Tasks</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search task title, assignee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-medium"
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Project Filter */}
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-medium"
          >
            <option value="all">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.id} - {p.name.slice(0, 18)}...</option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs ml-auto">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-2.5 py-1 rounded-lg ${viewMode === 'kanban' ? 'bg-white font-semibold shadow-2xs text-slate-900' : 'text-slate-500'}`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded-lg ${viewMode === 'table' ? 'bg-white font-semibold shadow-2xs text-slate-900' : 'text-slate-500'}`}
            >
              Table View
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {kanbanColumns.map(col => {
            const columnTasks = filteredTasks.filter(t => t.status === col.status);

            return (
              <div key={col.status} className="bg-slate-100/70 rounded-2xl p-3 border border-slate-200/80 flex flex-col min-h-[500px]">
                <div className="flex items-center justify-between pb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-800 font-heading">{col.label}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 bg-white rounded-full text-slate-600 border border-slate-200">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto pr-0.5">
                  {columnTasks.map(task => {
                    const isUrgent = task.priority === 'Urgent';

                    return (
                      <div
                        key={task.id}
                        className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all space-y-2.5"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-mono font-bold text-slate-400">{task.project}</span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            isUrgent ? 'bg-rose-100 text-rose-800' :
                            task.priority === 'High' ? 'bg-amber-100 text-amber-800' :
                            task.priority === 'Medium' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {task.priority}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 leading-snug">{task.title}</h4>

                        {task.description && (
                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                          <div className="flex items-center gap-1.5 font-medium text-slate-700">
                            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold flex items-center justify-center">
                              {task.assignee.slice(0, 2).toUpperCase()}
                            </div>
                            <span className="truncate max-w-[90px]">{task.assignee.split(' ')[0]}</span>
                          </div>

                          <div className="flex items-center gap-1 text-[10px]">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{task.dueDate}</span>
                          </div>
                        </div>

                        {/* Quick Status Transition Buttons */}
                        <div className="flex items-center justify-between pt-1 text-[10px]">
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task.id, e.target.value as any)}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 text-slate-600 font-medium cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Review">Review</option>
                            <option value="Completed">Completed</option>
                          </select>

                          <div className="flex items-center gap-1">
                            <button onClick={() => handleOpenEdit(task)} className="p-1 hover:text-slate-900 cursor-pointer">
                              <Edit className="w-3 h-3" />
                            </button>
                            <button onClick={() => setDeleteId(task.id)} className="p-1 hover:text-rose-600 cursor-pointer">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
                  <th className="py-3 px-4">Task Title</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Assignee</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredTasks.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{t.title}</div>
                      <div className="text-[10px] text-slate-400">{t.description}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium">{t.project}</td>
                    <td className="py-3 px-4">{t.assignee}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        t.priority === 'Urgent' ? 'bg-rose-100 text-rose-800' :
                        t.priority === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full">
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{t.dueDate}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button onClick={() => handleOpenEdit(t)} className="p-1 hover:text-slate-900 cursor-pointer">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteId(t.id)} className="p-1 hover:text-rose-600 cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Task Modal */}
      {(createModalOpen || editingTask) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-4 font-heading">
              {editingTask ? 'Edit Task Deliverable' : 'Create Team Task'}
            </h3>

            <form onSubmit={handleSaveTask} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. File Quarterly FCRA Form 4"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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

                <div>
                  <label className="font-semibold text-slate-700">Assignee *</label>
                  <select
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  >
                    {staff.map(s => (
                      <option key={s.id} value={s.name}>{s.name} ({s.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Priority Level</label>
                  <select
                    value={priority}
                    onChange={(e: any) => setPriority(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Description & Deliverables</label>
                <textarea
                  rows={2}
                  placeholder="Steps to execute and verification criteria..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => { setCreateModalOpen(false); setEditingTask(null); }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-semibold hover:bg-emerald-900 cursor-pointer"
                >
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Delete Team Task"
        message="Are you sure you want to delete this task deliverable?"
        confirmLabel="Delete Task"
        onConfirm={async () => {
          if (deleteId) {
            await deleteTask(deleteId);
            setDeleteId(null);
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
