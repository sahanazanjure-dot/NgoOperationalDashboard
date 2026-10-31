import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  FolderKanban,
  CheckCircle2,
  Users,
  HeartHandshake,
  DollarSign,
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
  const totalBeneficiariesCount = filteredProjects.reduce((sum, p) => sum + p.beneficiariesCount, 0);
  const totalVolunteersStaffCount = staff.filter(s => s.status === 'Active').length;
  const totalDonationsReceived = filteredDonations.reduce((sum, d) => sum + (d.status === 'Verified' ? d.amount : 0), 0);
  const totalExpensesIncurred = filteredExpenses.reduce((sum, e) => sum + (e.status === 'Approved' ? e.amount : 0), 0);
  const availableFunds = totalDonationsReceived - totalExpensesIncurred;
  const upcomingEventsCount = events.filter(e => e.status === 'Upcoming').length;

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

      {/* 8 Primary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 1. Total Projects */}
        <div
          onClick={() => onNavigateTab('projects')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Total Projects</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 group-hover:scale-110 transition-transform">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-heading text-slate-900">{totalProjectsCount}</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="font-semibold">{activeProjectsCount} Active Initiatives</span>
          </div>
        </div>

        {/* 2. Beneficiaries Served */}
        <div
          onClick={() => onNavigateTab('beneficiaries')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Total Beneficiaries</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700 group-hover:scale-110 transition-transform">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-heading text-slate-900">{totalBeneficiariesCount.toLocaleString()}</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-blue-700">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="font-semibold">Across 14 Districts</span>
          </div>
        </div>

        {/* 3. Volunteers & Staff */}
        <div
          onClick={() => onNavigateTab('staff')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Staff & Volunteers</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-800 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-heading text-slate-900">{totalVolunteersStaffCount}</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-teal-700">
            <span className="font-medium">1,120+ Volunteer Hours Logged</span>
          </div>
        </div>

        {/* 4. Total Donations Received */}
        <div
          onClick={() => onNavigateTab('donations')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Donations Received</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 group-hover:scale-110 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-heading text-slate-900">${totalDonationsReceived.toLocaleString()}</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-700 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>17 Verified Grants</span>
          </div>
        </div>

        {/* 5. Total Expenses */}
        <div
          onClick={() => onNavigateTab('expenses')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Total Expenses</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-700 group-hover:scale-110 transition-transform">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-heading text-slate-900">${totalExpensesIncurred.toLocaleString()}</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-rose-700">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>89.4% Program Ratio</span>
          </div>
        </div>

        {/* 6. Available Funds */}
        <div
          onClick={() => onNavigateTab('expenses')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Available Reserves</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700 group-hover:scale-110 transition-transform">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-heading text-slate-900">${availableFunds.toLocaleString()}</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-purple-700">
            <span className="font-semibold">Healthy Liquidity Buffer</span>
          </div>
        </div>

        {/* 7. Upcoming Events */}
        <div
          onClick={() => onNavigateTab('events')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Upcoming Events</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700 group-hover:scale-110 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-heading text-slate-900">{upcomingEventsCount}</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-700">
            <span>2 Campaigns this month</span>
          </div>
        </div>

        {/* 8. NGO Impact Score */}
        <div
          onClick={() => onNavigateTab('reports')}
          className="p-4 rounded-2xl bg-gradient-to-br from-emerald-900 to-slate-900 text-white shadow-md shadow-emerald-950/20 hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-emerald-300 mb-2">
            <span className="text-xs font-medium text-emerald-200">Social Impact Rating</span>
            <Award className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
          </div>
          <div className="text-2xl font-bold font-heading text-white">96.8 / 100</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-300 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>High Transparency Index</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Cashflow Chart (2 Cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">Monthly Financial Cashflow</h3>
              <p className="text-xs text-slate-500">Donations Received vs Project Expenses ($ USD)</p>
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
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
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
                        ${p.spent.toLocaleString()}
                      </span>
                      <span> / ${p.budget.toLocaleString()}</span>
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
                    <span className="text-[11px] font-bold text-emerald-700">${d.amount.toLocaleString()}</span>
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
                    <span className="text-[11px] font-bold text-rose-600">${e.amount.toLocaleString()}</span>
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
