import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  FolderKanban,
  CheckCircle2,
  Users,
  HeartHandshake,
  DollarSign,
  IndianRupee,
  Activity,
  TrendingUp,
  Receipt,
  Wallet,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  ChevronRight,
  Clock,
  Sparkles,
  Award
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface DashboardPageProps {
  onNavigateTab: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigateTab }) => {
  const {
    organization,
    projects,
    beneficiaries,
    staff,
    donations,
    expenses,
    events,
    tasks,
    smartAlerts,
    dateRange,
    setDateRange,
    selectedProjectFilter,
    setSelectedProjectFilter,
    selectedLocationFilter,
    setSelectedLocationFilter
  } = useApp();

  // Distinct locations for filter dropdown
  const uniqueLocations = useMemo(() => {
    const locs = new Set<string>();
    projects.forEach(p => locs.add(p.location));
    return Array.from(locs);
  }, [projects]);

  // Apply filters to data
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchProject = selectedProjectFilter === 'all' || p.id === selectedProjectFilter;
      const matchLocation = selectedLocationFilter === 'all' || p.location === selectedLocationFilter;
      return matchProject && matchLocation;
    });
  }, [projects, selectedProjectFilter, selectedLocationFilter]);

  const filteredDonations = useMemo(() => {
    return donations.filter(d => {
      const matchProject = selectedProjectFilter === 'all' || d.projectAllocation === selectedProjectFilter;
      let matchDate = true;
      if (dateRange === 'month') {
        const dDate = new Date(d.date);
        const now = new Date();
        matchDate = dDate.getMonth() === now.getMonth() && dDate.getFullYear() === now.getFullYear();
      } else if (dateRange === 'quarter') {
        const dDate = new Date(d.date);
        matchDate = dDate >= new Date('2024-07-01');
      } else if (dateRange === 'year') {
        matchDate = d.date.startsWith('2024');
      }
      return matchProject && matchDate;
    });
  }, [donations, selectedProjectFilter, dateRange]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const matchProject = selectedProjectFilter === 'all' || e.project === selectedProjectFilter;
      let matchDate = true;
      if (dateRange === 'month') {
        const eDate = new Date(e.date);
        const now = new Date();
        matchDate = eDate.getMonth() === now.getMonth() && eDate.getFullYear() === now.getFullYear();
      } else if (dateRange === 'quarter') {
        const eDate = new Date(e.date);
        matchDate = eDate >= new Date('2024-07-01');
      } else if (dateRange === 'year') {
        matchDate = e.date.startsWith('2024');
      }
      return matchProject && matchDate;
    });
  }, [expenses, selectedProjectFilter, dateRange]);

  // KPI Calculations
  const totalProjectsCount = filteredProjects.length;
  const activeProjectsCount = filteredProjects.filter(p => p.status === 'Active').length;
  const completedProjectsCount = filteredProjects.filter(p => p.status === 'Completed').length;
  const planningProjectsCount = filteredProjects.filter(p => p.status === 'Planning').length;
  const delayedProjectsCount = filteredProjects.filter(p => p.status === 'Delayed').length;
  const totalBeneficiariesCount = filteredProjects.reduce((sum, p) => sum + p.beneficiariesCount, 0);
  const totalVolunteersStaffCount = staff.filter(s => s.status === 'Active').length;
  const totalDonationsReceived = filteredDonations.reduce((sum, d) => sum + (d.status === 'Verified' ? d.amount : 0), 0);
  const totalExpensesIncurred = filteredExpenses.reduce((sum, e) => sum + (e.status === 'Approved' ? e.amount : 0), 0);
  const availableFunds = totalDonationsReceived - totalExpensesIncurred;
  const upcomingEventsCount = events.filter(e => e.status === 'Upcoming').length;
  const activeTasksCount = tasks.filter(t => t.status === 'In Progress' || t.status === 'Pending').length;
  const totalOngoingActivities = activeProjectsCount + upcomingEventsCount + activeTasksCount;

  // Chart Data: Monthly Cashflow (Donations vs Expenses)
  const cashflowData = [
    { month: 'Jan', donations: 80000, expenses: 52900 },
    { month: 'Feb', donations: 40500, expenses: 38200 },
    { month: 'Mar', donations: 50000, expenses: 43500 },
    { month: 'Apr', donations: 33000, expenses: 39000 },
    { month: 'May', donations: 30000, expenses: 22000 },
    { month: 'Jun', donations: 27500, expenses: 48000 },
    { month: 'Jul', donations: 25000, expenses: 18000 },
    { month: 'Aug', donations: 40400, expenses: 24000 },
    { month: 'Sep', donations: 12000, expenses: 23000 },
    { month: 'Oct', donations: 28500, expenses: 16000 },
  ];

  // Chart Data: Project Status Distribution
  const projectStatusData = [
    { name: 'Active', value: projects.filter(p => p.status === 'Active').length, color: '#15803d' },
    { name: 'Delayed', value: projects.filter(p => p.status === 'Delayed').length, color: '#f59e0b' },
    { name: 'Completed', value: projects.filter(p => p.status === 'Completed').length, color: '#0284c7' },
    { name: 'Planning', value: projects.filter(p => p.status === 'Planning').length, color: '#94a3b8' },
  ];

  // Beneficiaries by Category
  const beneficiaryCategoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    beneficiaries.forEach(b => {
      counts[b.category] = (counts[b.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [beneficiaries]);

  const COLORS = ['#15803d', '#0d9488', '#0284c7', '#d97706', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Page Title & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
              Operational Overview
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Live Operations
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time organizational performance, fund health, project milestones, and impact metrics.
          </p>
        </div>

        {/* Dynamic Filters Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Project Filter */}
          <select
            value={selectedProjectFilter}
            onChange={(e) => setSelectedProjectFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 shadow-2xs"
          >
            <option value="all">All Projects ({projects.length})</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name.slice(0, 26)}...</option>
            ))}
          </select>

          {/* Location Filter */}
          <select
            value={selectedLocationFilter}
            onChange={(e) => setSelectedLocationFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 shadow-2xs"
          >
            <option value="all">All Operating Regions</option>
            {uniqueLocations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          {/* Quick Date Range */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 shadow-2xs"
          >
            <option value="all">All Time</option>
            <option value="month">Current Month</option>
            <option value="quarter">Current Quarter (Q3)</option>
            <option value="year">Fiscal Year 2024</option>
          </select>
        </div>
      </div>

      {/* Smart Alerts Banner (If any high priority alerts exist) */}
      {smartAlerts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 shadow-2xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Action Required: {smartAlerts[0].title}
              </h4>
              <p className="text-xs text-amber-900/90 mt-0.5">
                {smartAlerts[0].description}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab(smartAlerts[0].actionRoute || 'alerts')}
            className="px-3 py-1.5 rounded-xl bg-amber-900 text-white text-xs font-semibold hover:bg-amber-950 transition-colors shrink-0 cursor-pointer"
          >
            {smartAlerts[0].actionText || 'Review Alerts'}
          </button>
        </div>
      )}

      {/* NGO Operations Overview Header & 4 Hero Cards */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading tracking-tight">
                NGO Operations Overview
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live operational command center tracking active projects, registered beneficiaries, philanthropic capital, and ground initiatives.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Live Central Operations
          </span>
        </div>

        {/* The 4 Clear Overview Cards for NGO Operations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Projects */}
          <div
            onClick={() => onNavigateTab('projects')}
            className="p-5 rounded-xl bg-gradient-to-b from-white via-slate-50/40 to-emerald-50/20 border border-slate-200/90 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Total Projects
                </span>
                <div className="p-2.5 rounded-xl bg-emerald-100/70 text-emerald-800 group-hover:bg-emerald-700 group-hover:text-white transition-all shadow-xs">
                  <FolderKanban className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
                {totalProjectsCount}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{activeProjectsCount} Active On-Ground</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                {completedProjectsCount} Completed • {planningProjectsCount} Planning
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-800 group-hover:text-emerald-900">
              <span>Explore Projects</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Total Beneficiaries */}
          <div
            onClick={() => onNavigateTab('beneficiaries')}
            className="p-5 rounded-xl bg-gradient-to-b from-white via-slate-50/40 to-blue-50/20 border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Total Beneficiaries
                </span>
                <div className="p-2.5 rounded-xl bg-blue-100/70 text-blue-800 group-hover:bg-blue-700 group-hover:text-white transition-all shadow-xs">
                  <HeartHandshake className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
                {totalBeneficiariesCount.toLocaleString()}+
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-blue-700 font-semibold">
                <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                <span>Verified Field Reach</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Across 14 Districts & 42 Rural Hamlets
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-800 group-hover:text-blue-900">
              <span>Beneficiary Registry</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Funds Received */}
          <div
            onClick={() => onNavigateTab('donations')}
            className="p-5 rounded-xl bg-gradient-to-b from-white via-slate-50/40 to-amber-50/20 border border-slate-200/90 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Funds Received
                </span>
                <div className="p-2.5 rounded-xl bg-amber-100/70 text-amber-800 group-hover:bg-amber-700 group-hover:text-white transition-all shadow-xs">
                  <IndianRupee className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
                ₹{totalDonationsReceived.toLocaleString()}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-700 font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                <span>{filteredDonations.length} Verified Grants</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                100% Tax-Exempt Section 80G Compliant
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-800 group-hover:text-amber-900">
              <span>Donation Ledger</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Ongoing Activities */}
          <div
            onClick={() => onNavigateTab('events')}
            className="p-5 rounded-xl bg-gradient-to-b from-white via-slate-50/40 to-purple-50/20 border border-slate-200/90 hover:border-purple-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Ongoing Activities
                </span>
                <div className="p-2.5 rounded-xl bg-purple-100/70 text-purple-800 group-hover:bg-purple-700 group-hover:text-white transition-all shadow-xs">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
                {totalOngoingActivities}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-purple-700 font-semibold">
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                <span>Active Ground Operations</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                {activeProjectsCount} Projects • {upcomingEventsCount} Drives • {activeTasksCount} Tasks
              </p>
            </div>
            <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-800 group-hover:text-purple-900">
              <span>Activity Calendar</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Operational Health Indicators Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Expenses Incurred */}
        <div
          onClick={() => onNavigateTab('expenses')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium text-slate-600">Disbursements (Spend)</span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-700">
              <Receipt className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold font-heading text-slate-900">
            ₹{totalExpensesIncurred.toLocaleString()}
          </div>
          <span className="text-[11px] text-rose-600 font-medium">89.4% Direct Program Spend</span>
        </div>

        {/* Available Reserves */}
        <div
          onClick={() => onNavigateTab('expenses')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium text-slate-600">Available Reserves</span>
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold font-heading text-slate-900">
            ₹{availableFunds.toLocaleString()}
          </div>
          <span className="text-[11px] text-teal-700 font-medium">Liquid Operational Buffer</span>
        </div>

        {/* Volunteers & Staff */}
        <div
          onClick={() => onNavigateTab('staff')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium text-slate-600">Staff & Volunteers</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold font-heading text-slate-900">
            {totalVolunteersStaffCount} Active
          </div>
          <span className="text-[11px] text-blue-700 font-medium">1,120+ Volunteer Hours Logged</span>
        </div>

        {/* Impact Transparency Rating */}
        <div
          onClick={() => onNavigateTab('reports')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium text-slate-600">Social Impact Rating</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold font-heading text-slate-900">
            96.8 / 100
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">Highest Trust Score</span>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Cashflow Chart (2 Cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">Monthly Financial Cashflow</h3>
              <p className="text-xs text-slate-500">Donations Received vs Project Expenses (₹ INR)</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span className="text-slate-600">Donations</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-slate-600">Expenses</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashflowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#15803d" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#15803d" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip
                  formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, '']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Area type="monotone" dataKey="donations" stroke="#15803d" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDonations)" />
                <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorExpenses)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Status Donut Chart (1 Col) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">Project Status Distribution</h3>
              <p className="text-xs text-slate-500">Pipeline health across active portfolio</p>
            </div>
            <button
              onClick={() => onNavigateTab('projects')}
              className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-0.5"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [value, 'Projects']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold font-heading text-slate-900">{projects.length}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Total</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-100">
            {projectStatusData.map(item => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 truncate">{item.name}</span>
                <span className="font-bold text-slate-900 ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row: Budget Health Monitor & Beneficiaries Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Health Monitor (Progress Bars) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">Budget Utilization by Project</h3>
              <p className="text-xs text-slate-500">Tracking planned allocations vs disbursements</p>
            </div>
            <button
              onClick={() => onNavigateTab('expenses')}
              className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-0.5"
            >
              <span>Manage Budgets</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {projects.slice(0, 5).map(p => {
              const utilPercent = p.budget > 0 ? Math.min(Math.round((p.spent / p.budget) * 100), 100) : 0;
              const isOver = p.spent > p.budget;

              return (
                <div key={p.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="font-semibold text-slate-800 truncate max-w-sm">
                      {p.name}
                    </div>
                    <div className="text-slate-500 shrink-0">
                      <span className={`font-bold ${isOver ? 'text-rose-600' : 'text-slate-900'}`}>
                        ₹{p.spent.toLocaleString()}
                      </span>
                      <span> / ₹{p.budget.toLocaleString()}</span>
                      <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        isOver ? 'bg-rose-100 text-rose-700' : utilPercent > 80 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {utilPercent}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        isOver ? 'bg-rose-600' : utilPercent > 80 ? 'bg-amber-500' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${utilPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Beneficiaries by Category */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">Assistance Categories</h3>
              <p className="text-xs text-slate-500">Demographic reach breakdown</p>
            </div>
            <button
              onClick={() => onNavigateTab('beneficiaries')}
              className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-0.5"
            >
              <span>View Roster</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={beneficiaryCategoryData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value: any) => [value, 'Registered']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="value" fill="#0d9488" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Third Row: Recent Activity & Upcoming Team Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Organizational Activities Feed */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">Live Operational Activity Feed</h3>
              <p className="text-xs text-slate-500">Audit trail of transactions, milestones & registrations</p>
            </div>
            <button
              onClick={() => onNavigateTab('audit-logs')}
              className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-0.5"
            >
              <span>Full Audit Logs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {donations.slice(0, 3).map(d => (
              <div key={d.id} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800 truncate">{d.donorName}</span>
                    <span className="text-[11px] font-bold text-emerald-700">₹{d.amount.toLocaleString()}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">{d.purpose} • {d.date}</p>
                </div>
              </div>
            ))}

            {expenses.slice(0, 2).map(e => (
              <div key={e.id} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="p-2 rounded-lg bg-rose-100 text-rose-700 shrink-0">
                  <Receipt className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800 truncate">{e.vendor}</span>
                    <span className="text-[11px] font-bold text-rose-600">₹{e.amount.toLocaleString()}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">{e.description} • {e.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines & Event Calendar */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">Upcoming Deadlines & Community Drives</h3>
              <p className="text-xs text-slate-500">Critical deliverables and outreach events</p>
            </div>
            <button
              onClick={() => onNavigateTab('tasks')}
              className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-0.5"
            >
              <span>Task Board</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {tasks.filter(t => t.status !== 'Completed').slice(0, 3).map(task => (
              <div key={task.id} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800 truncate">{task.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      task.priority === 'Urgent' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Assigned to {task.assignee} • Due: {task.dueDate}
                  </p>
                </div>
              </div>
            ))}

            {events.slice(0, 2).map(ev => (
              <div key={ev.id} className="flex items-start gap-3 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <div className="p-2 rounded-lg bg-emerald-200/80 text-emerald-900 shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-950 truncate">{ev.title}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-white px-1.5 py-0.5 rounded border border-emerald-200">
                      {ev.date}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800/80 mt-0.5 truncate">{ev.location} • {ev.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
