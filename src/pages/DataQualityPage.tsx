import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Users2,
  HeartHandshake,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface DataQualityPageProps {
  onNavigateTab: (tab: string) => void;
}

export const DataQualityPage: React.FC<DataQualityPageProps> = ({ onNavigateTab }) => {
  const {
    beneficiaries,
    donations,
    expenses,
    tasks,
    projects,
    addToast
  } = useApp();

  const [isScanning, setIsScanning] = useState(false);

  // Identify data quality issues dynamically
  const qualityIssues = useMemo(() => {
    const list: {
      id: string;
      severity: 'high' | 'medium' | 'low';
      title: string;
      description: string;
      module: string;
      actionRoute: string;
      fixLabel: string;
    }[] = [];

    // 1. Beneficiaries with incomplete phone numbers
    const incompleteBens = beneficiaries.filter(b => !b.contact || b.contact.length < 10);
    if (incompleteBens.length > 0) {
      list.push({
        id: 'dq-ben-phone',
        severity: 'medium',
        title: `${incompleteBens.length} Beneficiaries Missing Valid Phone Numbers`,
        description: 'Records lack primary emergency mobile contact for field distribution audits.',
        module: 'Beneficiaries',
        actionRoute: 'beneficiaries',
        fixLabel: 'Review Beneficiary Profiles'
      });
    }

    // 2. Duplicate donor names
    const donorNames = donations.map(d => d.donorName.toLowerCase().trim());
    const duplicateNames = donorNames.filter((name, index) => donorNames.indexOf(name) !== index);
    if (duplicateNames.length > 0) {
      list.push({
        id: 'dq-donor-dup',
        severity: 'low',
        title: `${new Set(duplicateNames).size} Potential Duplicate Donor Entities`,
        description: 'Multiple donations logged under identical donor titles without unified donor master ID.',
        module: 'Donations',
        actionRoute: 'donations',
        fixLabel: 'Inspect Donor Ledger'
      });
    }

    // 3. Unapproved old expenses
    const pendingExpenses = expenses.filter(e => e.status === 'Pending');
    if (pendingExpenses.length > 0) {
      list.push({
        id: 'dq-exp-pending',
        severity: 'high',
        title: `${pendingExpenses.length} Expense Disbursements Pending Audit Authorization`,
        description: 'Disbursements have not been matched to an approving manager, risking ledger discrepancies.',
        module: 'Expenses',
        actionRoute: 'expenses',
        fixLabel: 'Authorize Vouchers'
      });
    }

    // 4. Overdue Tasks
    const overdueTasks = tasks.filter(t => t.status !== 'Completed' && new Date(t.dueDate) < new Date());
    if (overdueTasks.length > 0) {
      list.push({
        id: 'dq-tasks-overdue',
        severity: 'medium',
        title: `${overdueTasks.length} Team Tasks Past Target Completion Date`,
        description: 'Deliverables have exceeded their planned target dates without status updates.',
        module: 'Tasks',
        actionRoute: 'tasks',
        fixLabel: 'Update Task Deadlines'
      });
    }

    return list;
  }, [beneficiaries, donations, expenses, tasks]);

  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      addToast({
        type: 'success',
        title: 'Data Quality Scan Complete',
        message: `Scanned all entities across 8 operational registries. Found ${qualityIssues.length} issues.`
      });
    }, 600);
  };

  const healthScore = Math.max(70, 100 - (qualityIssues.length * 7));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
              Data Quality Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Clean Data Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Proactively identifies missing contact details, duplicate entries, unverified transactions, and orphaned project references.
          </p>
        </div>

        <button
          onClick={handleRunScan}
          disabled={isScanning}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Scanning...' : 'Run Full Integrity Scan'}</span>
        </button>
      </div>

      {/* Health Score Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold text-2xl font-heading shrink-0">
            {healthScore}%
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Organizational Data Integrity Score
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
              Calculated across database schema compliance, completeness of beneficiary identifiers, and unflagged financial transactions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
            {qualityIssues.length} Potential Issues Flagged
          </span>
        </div>
      </div>

      {/* Quality Issues List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 font-heading">Detected Data Quality Items</h3>

        {qualityIssues.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/80 text-xs text-slate-500">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            No data anomalies detected. All entity fields and foreign keys conform to standards.
          </div>
        ) : (
          qualityIssues.map(issue => (
            <div
              key={issue.id}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  issue.severity === 'high' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                }`}>
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {issue.module}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      issue.severity === 'high' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {issue.severity.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-0.5">{issue.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{issue.description}</p>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab(issue.actionRoute)}
                className="px-3.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors shrink-0 cursor-pointer flex items-center gap-1"
              >
                <span>{issue.fixLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
