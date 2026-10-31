import React from 'react';
import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  HeartHandshake,
  Users2,
  DollarSign,
  Receipt,
  CalendarCheck,
  Boxes,
  CheckSquare,
  FileSpreadsheet,
  DownloadCloud,
  BellRing,
  Sparkles,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen
}) => {
  const { organization, currentUser, smartAlerts, resetToDemo } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'organization', label: 'Organization & Legal', icon: Building2 },
    { id: 'projects', label: 'Project Management', icon: FolderKanban },
    { id: 'beneficiaries', label: 'Beneficiary Registry', icon: HeartHandshake },
    { id: 'staff', label: 'Staff & Volunteers', icon: Users2 },
    { id: 'donations', label: 'Donations & Grants', icon: DollarSign },
    { id: 'expenses', label: 'Expenses & Budgets', icon: Receipt },
    { id: 'events', label: 'Events & Campaigns', icon: CalendarCheck },
    { id: 'inventory', label: 'Inventory & Supplies', icon: Boxes },
    { id: 'tasks', label: 'Tasks & Team Board', icon: CheckSquare },
    { id: 'reports', label: 'Reports & Statements', icon: FileSpreadsheet },
    { id: 'import-export', label: 'Data Import & Export', icon: DownloadCloud, highlight: true },
    { id: 'alerts', label: 'Smart Alerts Center', icon: BellRing, badge: smartAlerts.length },
    { id: 'data-quality', label: 'Data Quality Center', icon: Sparkles },
    { id: 'audit-logs', label: 'Audit Trail Logs', icon: History },
    { id: 'settings', label: 'Settings & Security', icon: Settings },
  ];

  const handleSelect = (id: string) => {
    setCurrentTab(id);
    if (mobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white border-r border-slate-200/90 shadow-sm transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-68'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-17 px-4 border-b border-slate-100">
          <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => handleSelect('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center text-white shadow-md shadow-emerald-900/20 shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="font-heading font-bold text-base text-slate-900 tracking-tight truncate block">
                  {organization?.name || 'HopeHorizon'}
                </span>
                <span className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider block">
                  Operations Portal
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Current Active Role Ribbon */}
        {!collapsed ? (
          <div className="mx-3 my-2.5 px-3 py-2 rounded-xl bg-emerald-50/70 border border-emerald-200/60 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <div className="truncate">
                <div className="text-[10px] uppercase font-semibold text-emerald-800 tracking-wider">Active Role</div>
                <div className="text-xs font-semibold text-slate-900 truncate">{currentUser.role}</div>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-emerald-200/70 text-emerald-900 px-1.5 py-0.5 rounded font-medium">Demo</span>
          </div>
        ) : (
          <div className="mx-auto my-2 w-3 h-3 rounded-full bg-emerald-600" title={`Active Role: ${currentUser.role}`} />
        )}

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {navItems.map(item => {
            const isActive = currentTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-sm shadow-emerald-900/20 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                } ${item.highlight && !isActive ? 'border border-dashed border-teal-300 bg-teal-50/40 text-teal-900' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-4.5 h-4.5 shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? 'text-emerald-300' : item.highlight ? 'text-teal-700' : 'text-slate-400 group-hover:text-slate-700'
                }`} />

                {!collapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}

                {!collapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white text-emerald-900' : 'bg-rose-500 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}

                {collapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          {!collapsed ? (
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="text-[11px] font-mono text-slate-400">v2.4 Enterprise</span>
              <button
                onClick={resetToDemo}
                className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 hover:text-emerald-700 hover:bg-white px-2 py-1 rounded-lg border border-slate-200/80 transition-all cursor-pointer shadow-2xs"
                title="Restore default realistic demo records"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Demo</span>
              </button>
            </div>
          ) : (
            <button
              onClick={resetToDemo}
              className="w-full flex justify-center p-2 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
              title="Reset Demo Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
