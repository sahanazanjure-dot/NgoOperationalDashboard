import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BellRing,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Boxes,
  FolderKanban,
  Receipt,
  FileCheck2,
  CheckSquare
} from 'lucide-react';

interface AlertsPageProps {
  onNavigateTab: (tab: string) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({ onNavigateTab }) => {
  const { smartAlerts } = useApp();

  const getModuleIcon = (mod: string) => {
    switch (mod) {
      case 'Inventory': return Boxes;
      case 'Projects': return FolderKanban;
      case 'Expenses': return Receipt;
      case 'Organization': return FileCheck2;
      case 'Tasks': return CheckSquare;
      default: return AlertCircle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
              Smart Alerts Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
              {smartAlerts.length} Active Operational Triggers
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Rule-based threshold alerts for critical inventory depletion, project deadline slippages, pending disbursements, and statutory certificate renewals.
          </p>
        </div>
      </div>

      {/* Alerts Grid */}
      {smartAlerts.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-2xs">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-heading">All Systems Operational</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No critical resource deficits, delayed deliverables, or statutory compliance document expirations found.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {smartAlerts.map(alert => {
            const Icon = getModuleIcon(alert.module);
            const isDanger = alert.type === 'danger';

            return (
              <div
                key={alert.id}
                className={`p-5 rounded-2xl bg-white border shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:shadow-md ${
                  isDanger ? 'border-rose-200 ring-1 ring-rose-100' : 'border-amber-200 ring-1 ring-amber-100'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-2xl shrink-0 ${
                    isDanger ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {alert.module}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[10px] font-medium text-slate-500">{alert.timestamp}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 font-heading mt-0.5">
                      {alert.title}
                    </h3>

                    <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                      {alert.description}
                    </p>
                  </div>
                </div>

                {alert.actionRoute && (
                  <button
                    onClick={() => onNavigateTab(alert.actionRoute!)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-2xs shrink-0 cursor-pointer"
                  >
                    <span>{alert.actionText || 'Take Action'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
