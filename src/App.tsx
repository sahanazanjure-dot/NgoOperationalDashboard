import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { ToastContainer } from './components/common/ToastContainer';

// Module Pages
import { FrontPage } from './pages/FrontPage';
import { DashboardPage } from './pages/DashboardPage';
import { OrganizationPage } from './pages/OrganizationPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { BeneficiariesPage } from './pages/BeneficiariesPage';
import { StaffPage } from './pages/StaffPage';
import { DonationsPage } from './pages/DonationsPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { EventsPage } from './pages/EventsPage';
import { InventoryPage } from './pages/InventoryPage';
import { TasksPage } from './pages/TasksPage';
import { ReportsPage } from './pages/ReportsPage';
import { ImportExportPage } from './pages/ImportExportPage';
import { AlertsPage } from './pages/AlertsPage';
import { DataQualityPage } from './pages/DataQualityPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { isLoading, organization } = useApp();
  const [currentTab, setCurrentTab] = useState<string>('front-page');
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const renderActiveTab = () => {
    switch (currentTab) {
      case 'front-page':
        return <FrontPage onEnterPortal={(targetTab) => setCurrentTab(targetTab || 'dashboard')} />;
      case 'dashboard':
        return <DashboardPage onNavigateTab={setCurrentTab} />;
      case 'organization':
        return <OrganizationPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'beneficiaries':
        return <BeneficiariesPage />;
      case 'staff':
        return <StaffPage />;
      case 'donations':
        return <DonationsPage />;
      case 'expenses':
        return <ExpensesPage />;
      case 'events':
        return <EventsPage />;
      case 'inventory':
        return <InventoryPage />;
      case 'tasks':
        return <TasksPage />;
      case 'reports':
        return <ReportsPage />;
      case 'import-export':
        return <ImportExportPage />;
      case 'alerts':
        return <AlertsPage onNavigateTab={setCurrentTab} />;
      case 'data-quality':
        return <DataQualityPage onNavigateTab={setCurrentTab} />;
      case 'audit-logs':
        return <AuditLogsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigateTab={setCurrentTab} />;
    }
  };

  if (isLoading && !organization) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8faf9] text-slate-800">
        <div className="w-12 h-12 rounded-2xl bg-emerald-800 flex items-center justify-center text-white shadow-lg animate-pulse mb-4">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
        <h2 className="text-base font-bold font-heading text-slate-900">Loading NGO Operations Portal...</h2>
        <p className="text-xs text-slate-500 mt-1">Connecting to persistent backend & hydrating registries...</p>
      </div>
    );
  }

  // Full-width Public Front Page View
  if (currentTab === 'front-page') {
    return (
      <div className="min-h-screen bg-[#f8faf9] text-slate-800 flex flex-col selection:bg-emerald-700 selection:text-white">
        <FrontPage onEnterPortal={(targetTab) => setCurrentTab(targetTab || 'dashboard')} />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-800 flex flex-col selection:bg-emerald-700 selection:text-white">
      {/* Collapsible Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'lg:pl-20' : 'lg:pl-68'}`}>
        {/* Sticky Top Navbar */}
        <Navbar
          onToggleMobileMenu={() => setMobileOpen(!mobileOpen)}
          onNavigateTab={setCurrentTab}
        />

        {/* Dynamic Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {renderActiveTab()}
        </main>

        {/* Footer */}
        <footer className="no-print mt-auto py-5 px-6 border-t border-slate-200/80 bg-white/70 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="font-semibold text-slate-700">{organization?.name || 'HopeHorizon Foundation'}</span>
            <span>•</span>
            <span className="font-mono text-[11px] text-slate-400">Reg: {organization?.registrationNumber}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>80G / 12A Certified</span>
            <span>•</span>
            <span>FCRA Approved</span>
            <span>•</span>
            <span className="text-emerald-700 font-medium">Enterprise NGO Platform v2.4</span>
          </div>
        </footer>
      </div>

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
