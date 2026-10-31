import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  Download,
  Shield,
  UserCheck,
  ChevronDown,
  X,
  ExternalLink,
  Calendar,
  Filter,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { exportConsolidatedWorkbook } from '../../utils/excelExport';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  onNavigateTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu, onNavigateTab }) => {
  const {
    currentUser,
    switchUserRole,
    availableUsers,
    organization,
    projects,
    beneficiaries,
    staff,
    donations,
    expenses,
    events,
    inventory,
    tasks,
    smartAlerts,
    dateRange,
    setDateRange,
    selectedProjectFilter,
    setSelectedProjectFilter,
    globalSearchQuery,
    setGlobalSearchQuery
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const roleRef = useRef<HTMLDivElement>(null);
  const alertsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setRoleDropdownOpen(false);
      }
      if (alertsRef.current && !alertsRef.current.contains(event.target as Node)) {
        setAlertsOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered search results
  const searchResults = React.useMemo(() => {
    if (!globalSearchQuery.trim() || globalSearchQuery.length < 2) return null;
    const q = globalSearchQuery.toLowerCase();

    const matchedProjects = projects.filter(p => p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)).slice(0, 3);
    const matchedBeneficiaries = beneficiaries.filter(b => b.name.toLowerCase().includes(q) || b.id.toLowerCase().includes(q)).slice(0, 3);
    const matchedDonations = donations.filter(d => d.donorName.toLowerCase().includes(q) || d.receiptNumber.toLowerCase().includes(q)).slice(0, 3);
    const matchedInventory = inventory.filter(i => i.itemName.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)).slice(0, 3);

    return {
      projects: matchedProjects,
      beneficiaries: matchedBeneficiaries,
      donations: matchedDonations,
      inventory: matchedInventory,
      totalCount: matchedProjects.length + matchedBeneficiaries.length + matchedDonations.length + matchedInventory.length
    };
  }, [globalSearchQuery, projects, beneficiaries, donations, inventory]);

  const handleExportConsolidated = () => {
    if (!organization) return;
    exportConsolidatedWorkbook({
      organization,
      projects,
      beneficiaries,
      staff,
      donations,
      expenses,
      events,
      inventory,
      tasks
    }, currentUser.role);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-17 px-4 sm:px-6 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      {/* Left: Mobile Toggle & Global Filters */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar with Live Popover */}
        <div ref={searchRef} className="relative hidden md:block w-64 lg:w-80">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search projects, beneficiaries, donors..."
              value={globalSearchQuery}
              onChange={(e) => setGlobalSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-slate-800 placeholder-slate-400 transition-all"
            />
            {globalSearchQuery && (
              <button
                onClick={() => setGlobalSearchQuery('')}
                className="absolute right-2.5 p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {searchFocused && searchResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <span>Search Matches ({searchResults.totalCount})</span>
                <span className="font-normal text-slate-400">Esc to close</span>
              </div>

              {searchResults.totalCount === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400">
                  No records matching "{globalSearchQuery}"
                </div>
              ) : (
                <div className="space-y-3">
                  {searchResults.projects.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 uppercase px-1">Projects</span>
                      {searchResults.projects.map(p => (
                        <div
                          key={p.id}
                          onClick={() => { onNavigateTab('projects'); setSearchFocused(false); }}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-xs"
                        >
                          <span className="font-medium text-slate-800">{p.name}</span>
                          <span className="text-[10px] text-slate-400">{p.location}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.beneficiaries.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 uppercase px-1">Beneficiaries</span>
                      {searchResults.beneficiaries.map(b => (
                        <div
                          key={b.id}
                          onClick={() => { onNavigateTab('beneficiaries'); setSearchFocused(false); }}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-xs"
                        >
                          <span className="font-medium text-slate-800">{b.name}</span>
                          <span className="text-[10px] font-mono text-slate-500">{b.id}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.donations.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 uppercase px-1">Donations</span>
                      {searchResults.donations.map(d => (
                        <div
                          key={d.id}
                          onClick={() => { onNavigateTab('donations'); setSearchFocused(false); }}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-xs"
                        >
                          <span className="font-medium text-slate-800">{d.donorName}</span>
                          <span className="text-[11px] font-semibold text-emerald-700">${d.amount.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Global Date Filter Pill */}
        <div className="hidden xl:flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl text-xs font-medium text-slate-600 border border-slate-200/60">
          <Calendar className="w-3.5 h-3.5 ml-1.5 text-slate-400" />
          <button
            onClick={() => setDateRange('all')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              dateRange === 'all' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'hover:text-slate-900'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setDateRange('month')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              dateRange === 'month' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'hover:text-slate-900'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setDateRange('quarter')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              dateRange === 'quarter' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'hover:text-slate-900'
            }`}
          >
            This Qtr
          </button>
          <button
            onClick={() => setDateRange('year')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              dateRange === 'year' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'hover:text-slate-900'
            }`}
          >
            FY 2024
          </button>
        </div>
      </div>

      {/* Right: Quick Actions, Notifications, Role Switcher, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Fast Consolidated Excel Export */}
        <button
          onClick={handleExportConsolidated}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-300/80 rounded-xl transition-all shadow-2xs cursor-pointer"
          title="Download genuine 9-sheet Excel workbook with all organization records"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
          <span>Export Master Excel</span>
        </button>

        {/* Smart Alerts Bell Notification */}
        <div ref={alertsRef} className="relative">
          <button
            onClick={() => setAlertsOpen(!alertsOpen)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Smart operational alerts"
          >
            <Bell className="w-5 h-5" />
            {smartAlerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
              </span>
            )}
          </button>

          {alertsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-slate-900">Operational Alerts</h4>
                  <span className="text-[11px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                    {smartAlerts.length} Active
                  </span>
                </div>
                <button
                  onClick={() => { onNavigateTab('alerts'); setAlertsOpen(false); }}
                  className="text-xs font-semibold text-emerald-700 hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="mt-3 space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {smartAlerts.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500">
                    <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                    All operational metrics and compliance in order.
                  </div>
                ) : (
                  smartAlerts.slice(0, 5).map(alert => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        if (alert.actionRoute) onNavigateTab(alert.actionRoute);
                        setAlertsOpen(false);
                      }}
                      className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100/90 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {alert.module}
                        </span>
                        <span className="text-[10px] text-slate-400">{alert.timestamp}</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 mt-1">{alert.title}</div>
                      <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{alert.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher Dropdown */}
        <div ref={roleRef} className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/80 text-xs font-medium text-slate-800 transition-colors cursor-pointer"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-800 text-white font-bold text-[10px] flex items-center justify-center">
              {currentUser.avatar}
            </div>
            <div className="hidden sm:block text-left">
              <span className="block font-semibold leading-tight">{currentUser.name}</span>
              <span className="block text-[10px] text-emerald-700 leading-tight">{currentUser.role}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in">
              <div className="px-3 py-2 border-b border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Switch Active Role (Demo)</span>
                <p className="text-xs text-slate-600 mt-0.5">Test role-based permissions & privacy masking</p>
              </div>

              <div className="mt-1 space-y-1">
                {availableUsers.map(u => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUserRole(u.role);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                      currentUser.role === u.role
                        ? 'bg-emerald-50 text-emerald-900 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                      {u.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{u.name}</div>
                      <div className="text-[10px] text-slate-500">{u.role}</div>
                    </div>
                    {currentUser.role === u.role && (
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 px-3 py-1 flex items-center justify-between text-[11px] text-slate-400">
                <span>Org ID: {organization?.registrationNumber || 'NGO-REG'}</span>
                <button
                  onClick={() => { onNavigateTab('settings'); setRoleDropdownOpen(false); }}
                  className="text-emerald-700 font-medium hover:underline"
                >
                  Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
