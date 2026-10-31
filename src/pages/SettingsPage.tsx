import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Shield,
  Key,
  Database,
  RefreshCw,
  CheckCircle2,
  Lock,
  UserCheck,
  Building,
  Sliders,
  DollarSign
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { organization, updateOrg, availableUsers, currentUser, switchUserRole, resetToDemo, addToast } = useApp();

  const [currencySymbol, setCurrencySymbol] = useState(organization?.settings?.currencySymbol || '$');
  const [receiptPrefix, setReceiptPrefix] = useState(organization?.settings?.receiptPrefix || 'HH-REC-2024-');
  const [fiscalYearStart, setFiscalYearStart] = useState(organization?.settings?.fiscalYearStart || 'April 01');
  const [privacyLevel, setPrivacyLevel] = useState(organization?.settings?.privacyLevel || 'Role-Restricted');

  // Change password simulation
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization) return;
    await updateOrg({
      settings: {
        ...organization.settings,
        currencySymbol,
        receiptPrefix,
        fiscalYearStart,
        privacyLevel
      }
    });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setOldPass('');
    setNewPass('');
    addToast({
      type: 'success',
      title: 'Credentials Updated',
      message: 'Administrative password updated for active session account.'
    });
  };

  const permissionsMatrix = [
    { module: 'Overview Dashboard & Analytics', Admin: true, Finance: true, PM: true, Staff: true },
    { module: 'Organization Legal & Registration', Admin: true, Finance: false, PM: false, Staff: false },
    { module: 'Projects & Milestones Creation', Admin: true, Finance: false, PM: true, Staff: false },
    { module: 'Beneficiary Sensitive Data (Unmasked)', Admin: true, Finance: true, PM: true, Staff: false },
    { module: 'Donations & Official Receipts', Admin: true, Finance: true, PM: false, Staff: false },
    { module: 'Expense Voucher Approval', Admin: true, Finance: true, PM: false, Staff: false },
    { module: 'Events & Campaigns Management', Admin: true, Finance: false, PM: true, Staff: true },
    { module: 'Inventory Stock In / Out Operations', Admin: true, Finance: false, PM: true, Staff: true },
    { module: 'Consolidated Excel Master Export', Admin: true, Finance: true, PM: true, Staff: false },
    { module: 'Audit Logs Review', Admin: true, Finance: true, PM: false, Staff: false }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
              Settings & Access Controls
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Enterprise Configuration
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Role-based access permissions, system formatting preferences, security credentials, and demo data management.
          </p>
        </div>
      </div>

      {/* Grid of Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System & Formatting Preferences */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 mb-4">
            <Sliders className="w-4 h-4 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900 font-heading">Financial & Receipt Preferences</h3>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700">Official Currency Symbol</label>
              <input
                type="text"
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="w-full mt-1 p-2 border border-slate-200 rounded-xl font-mono text-sm"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700">Donation Receipt Number Prefix</label>
              <input
                type="text"
                value={receiptPrefix}
                onChange={(e) => setReceiptPrefix(e.target.value)}
                className="w-full mt-1 p-2 border border-slate-200 rounded-xl font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Prefix applied to generated 80G receipts</span>
            </div>

            <div>
              <label className="font-semibold text-slate-700">Fiscal Year Cycle Start</label>
              <select
                value={fiscalYearStart}
                onChange={(e) => setFiscalYearStart(e.target.value)}
                className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
              >
                <option value="April 01">April 01 (India / UK standard)</option>
                <option value="January 01">January 01 (Calendar year standard)</option>
                <option value="July 01">July 01</option>
                <option value="October 01">October 01 (US Federal standard)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700">Beneficiary Data Privacy Policy</label>
              <select
                value={privacyLevel}
                onChange={(e) => setPrivacyLevel(e.target.value)}
                className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
              >
                <option value="Role-Restricted">Role-Restricted (Mask phone/address for Staff/Volunteers)</option>
                <option value="Strict Confidentiality">Strict Confidentiality (Admin only unmask)</option>
                <option value="Open Community">Open Internal Directory</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-semibold cursor-pointer shadow-2xs"
              >
                Save Preferences
              </button>
            </div>
          </form>
        </div>

        {/* Password & Security Credentials */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-4 h-4 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900 font-heading">Security & Password Management</h3>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Active Account</span>
                <span className="font-semibold text-slate-800">{currentUser.name}</span>
                <span className="text-[11px] text-slate-500 block font-mono">{currentUser.email}</span>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {currentUser.role}
              </span>
            </div>

            <div>
              <label className="font-semibold text-slate-700">Current Password</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700">New Password</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold cursor-pointer shadow-2xs"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Role-Based Permissions Matrix */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-heading">Role-Based Access Control (RBAC) Matrix</h3>
            <p className="text-xs text-slate-500">Authorized capability boundaries enforced across the application</p>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Enforced
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">System Module / Operation</th>
                <th className="py-2.5 px-3 text-center">Administrator</th>
                <th className="py-2.5 px-3 text-center">Finance Manager</th>
                <th className="py-2.5 px-3 text-center">Project Manager</th>
                <th className="py-2.5 px-3 text-center">Staff / Volunteer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {permissionsMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60">
                  <td className="py-2.5 px-3 font-medium text-slate-800">{item.module}</td>
                  <td className="py-2.5 px-3 text-center">
                    {item.Admin ? <span className="text-emerald-700 font-bold">✓ Full</span> : <span className="text-slate-300">-</span>}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {item.Finance ? <span className="text-emerald-700 font-bold">✓ Full</span> : <span className="text-slate-300">-</span>}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {item.PM ? <span className="text-emerald-700 font-bold">✓ Full</span> : <span className="text-slate-300">-</span>}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {item.Staff ? <span className="text-emerald-700 font-bold">✓ Limited</span> : <span className="text-slate-300">-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Database Reset & Demo Restore */}
      <div className="p-6 rounded-2xl bg-rose-50/60 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-rose-950 font-heading">Reset Demo Operational Database</h4>
          <p className="text-xs text-rose-800/80 mt-0.5 max-w-xl">
            Restores all 7 projects, 22 beneficiaries, 12 staff members, 17 donations, 17 expenses, and inventory items to their pristine demo state.
          </p>
        </div>

        <button
          onClick={resetToDemo}
          className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs shadow-xs transition-colors shrink-0 cursor-pointer flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>
    </div>
  );
};
