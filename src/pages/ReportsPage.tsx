import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Filter,
  BarChart3,
  CheckCircle2,
  TrendingUp,
  FileText,
  Clock,
  Sparkles,
  PieChart,
  ShieldCheck,
  Building2,
  DollarSign,
  HeartHandshake,
  Layers
} from 'lucide-react';
import { exportConsolidatedWorkbook, exportModuleExcel } from '../utils/excelExport';

export const ReportsPage: React.FC = () => {
  const {
    organization,
    projects,
    beneficiaries,
    staff,
    donations,
    expenses,
    events,
    inventory,
    tasks,
    currentUser
  } = useApp();

  const [reportType, setReportType] = useState<
    'Executive' | 'Financial' | 'Projects' | 'Beneficiaries' | 'Donations' | 'Expenses' | 'Inventory'
  >('Executive');

  const [selectedPeriod, setSelectedPeriod] = useState('FY 2024 (Annual)');
  const [selectedProject, setSelectedProject] = useState('all');

  // Report History Simulation State
  const [reportHistory, setReportHistory] = useState([
    { id: 'REP-01', name: 'Annual Statutory Trustee Management Brief', date: '2024-10-25', format: 'Excel (.xlsx)', user: 'Dr. Aarti Deshmukh' },
    { id: 'REP-02', name: 'FCRA Foreign Inward Grants Audit Statement', date: '2024-10-15', format: 'Excel (.xlsx)', user: 'Pooja Hegde' },
    { id: 'REP-03', name: 'Konkan Cyclone Post-Relief Outcome Report', date: '2024-09-30', format: 'Print / PDF', user: 'Captain Arjun Nair' },
  ]);

  // Aggregate Metrics
  const totalDonations = donations.reduce((sum, d) => sum + (d.status === 'Verified' ? d.amount : 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.status === 'Approved' ? e.amount : 0), 0);
  const totalBeneficiaries = beneficiaries.length;
  const activeProjectsCount = projects.filter(p => p.status === 'Active').length;

  const handleDownloadExcel = () => {
    if (!organization) return;
    if (reportType === 'Executive') {
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
    } else {
      let dataToExport: any[] = [];
      if (reportType === 'Donations') dataToExport = donations;
      else if (reportType === 'Expenses') dataToExport = expenses;
      else if (reportType === 'Projects') dataToExport = projects;
      else if (reportType === 'Beneficiaries') dataToExport = beneficiaries;
      else if (reportType === 'Inventory') dataToExport = inventory;
      else dataToExport = donations;

      exportModuleExcel(reportType, dataToExport);
    }

    // Add to report history
    setReportHistory(prev => [
      {
        id: `REP-${String(prev.length + 1).padStart(2, '0')}`,
        name: `${reportType} Statement & Report`,
        date: new Date().toISOString().split('T')[0],
        format: 'Excel (.xlsx)',
        user: currentUser.name
      },
      ...prev
    ]);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
              Reports & Operational Analytics
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Audit-Ready
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generate formal donor statements, trustee briefs, statutory compliance summaries, and export real spreadsheets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleDownloadExcel}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Report Controls Panel */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['Executive', 'Financial', 'Projects', 'Beneficiaries', 'Donations', 'Expenses', 'Inventory'] as const).map(type => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                reportType === type
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-slate-100/80 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              {type === 'Executive' ? '★ Executive Brief' : `${type} Report`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-medium"
          >
            <option value="FY 2024 (Annual)">FY 2024 (Annual)</option>
            <option value="Q3 2024 (Jul - Sep)">Q3 2024 (Jul - Sep)</option>
            <option value="Q2 2024 (Apr - Jun)">Q2 2024 (Apr - Jun)</option>
            <option value="Current Month">Current Month</option>
          </select>
        </div>
      </div>

      {/* Formatted Report Presentation View (Printable) */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        {/* Formal Report Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b-2 border-slate-900/10 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-900 text-white flex items-center justify-center font-bold text-xl font-heading shadow-md">
              HH
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800">
                Official Operational Report
              </span>
              <h2 className="text-xl font-bold font-heading text-slate-900">
                {reportType === 'Executive' ? 'Executive Management Summary' : `${reportType} Operations Statement`}
              </h2>
              <p className="text-xs text-slate-500">{organization?.name} • Reg: {organization?.registrationNumber}</p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs">
            <div className="font-semibold text-slate-800">Period: {selectedPeriod}</div>
            <div className="text-slate-400 text-[11px] mt-0.5">Generated: {new Date().toLocaleDateString()}</div>
            <div className="text-[11px] text-emerald-700 font-mono mt-0.5">Ref: NGO-REP-2024-Q3</div>
          </div>
        </div>

        {/* Executive Summary Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Funds Raised</span>
            <span className="text-xl font-bold text-emerald-900 font-heading">₹{totalDonations.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Verified Donor Receipts</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Disbursements</span>
            <span className="text-xl font-bold text-rose-700 font-heading">₹{totalExpenses.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Audited Programmatic Spend</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Net Available Reserve</span>
            <span className="text-xl font-bold text-purple-900 font-heading">₹{(totalDonations - totalExpenses).toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Liquid Operational Buffer</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Beneficiaries</span>
            <span className="text-xl font-bold text-blue-900 font-heading">{totalBeneficiaries.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Direct Aid Beneficiaries</span>
          </div>
        </div>

        {/* Dynamic Detailed Table Based on Selected Tab */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 font-heading uppercase tracking-wide">
              {reportType === 'Executive' ? 'Active Projects Operational Health' : `${reportType} Detailed Records`}
            </h3>
            <span className="text-xs text-slate-400">All amounts in INR (₹)</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Project / Item</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Location / Region</th>
                  <th className="py-2.5 px-3">Allocated Budget</th>
                  <th className="py-2.5 px-3">Actual Spent</th>
                  <th className="py-2.5 px-3">Burn %</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {projects.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{p.name}</td>
                    <td className="py-2.5 px-3">{p.category}</td>
                    <td className="py-2.5 px-3 text-slate-500">{p.location}</td>
                    <td className="py-2.5 px-3 font-mono font-medium">₹{p.budget.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-mono font-semibold">₹{p.spent.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-semibold">
                      {p.budget > 0 ? `${Math.round((p.spent / p.budget) * 100)}%` : '0%'}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Verification and Trustee Declaration */}
        <div className="pt-6 border-t border-slate-200/80 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-500">
          <div>
            <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Auditor Certification</h5>
            <p className="mt-1 text-[11px] leading-relaxed">
              We certify that these operational statements are drawn from official double-entry ledger vouchers, verified bank receipts, and authenticated beneficiary field enrollments in compliance with 80G and FCRA regulations.
            </p>
          </div>
          <div className="flex items-center justify-end gap-6 text-right">
            <div>
              <div className="font-script text-base text-slate-900 font-serif">Dr. Aarti Deshmukh</div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Executive Director</span>
            </div>
            <div>
              <div className="font-script text-base text-slate-900 font-serif">Pooja Hegde</div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Chief Finance Officer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Report Generation History Log */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 font-heading mb-1">Archived Report Generation History</h3>
        <p className="text-xs text-slate-500 mb-3">Audit trail of formal statements compiled and downloaded</p>

        <div className="space-y-2">
          {reportHistory.map(item => (
            <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-200/60 text-xs">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                <div>
                  <div className="font-semibold text-slate-800">{item.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">Compiled by {item.user} • {item.date}</div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-white text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                {item.format}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
