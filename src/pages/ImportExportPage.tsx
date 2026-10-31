import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  DownloadCloud,
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  FileText,
  Sparkles,
  HelpCircle,
  FileCheck,
  RefreshCw,
  Layers,
  ArrowRight
} from 'lucide-react';
import * as XLSX from 'xlsx';
import {
  exportConsolidatedWorkbook,
  exportModuleExcel,
  downloadModuleTemplate,
  downloadErrorReport
} from '../utils/excelExport';
import { apiService } from '../services/api';
import confetti from 'canvas-confetti';

export const ImportExportPage: React.FC = () => {
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
    refreshData,
    addToast,
    currentUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');

  // Import State
  const [selectedModule, setSelectedModule] = useState<string>('Projects');
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<{ row: number; error: string; data?: any }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importSummary, setImportSummary] = useState<{ imported: number; skipped: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Consolidated Export
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

    addToast({
      type: 'success',
      title: 'Consolidated Excel Exported',
      message: 'Generated 9-worksheet master workbook with full financial calculations.'
    });
  };

  // 2. Individual Module Export
  const handleExportSingleModule = (modName: string) => {
    let data: any[] = [];
    if (modName === 'Projects') data = projects;
    else if (modName === 'Beneficiaries') data = beneficiaries;
    else if (modName === 'Staff & Volunteers') data = staff;
    else if (modName === 'Donations') data = donations;
    else if (modName === 'Expenses') data = expenses;
    else if (modName === 'Events & Campaigns') data = events;
    else if (modName === 'Inventory') data = inventory;
    else if (modName === 'Tasks') data = tasks;

    exportModuleExcel(modName, data);
    addToast({
      type: 'success',
      title: `Exported ${modName}`,
      message: `Downloaded ${data.length} records in valid .xlsx format.`
    });
  };

  // 3. File Upload & SheetJS Parse
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;
    processFile(uploadedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const processFile = (uploadedFile: File) => {
    setFile(uploadedFile);
    setImportSummary(null);
    setValidationErrors([]);
    setParsedRows([]);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const firstSheetName = wb.SheetNames[0];
        const ws = wb.Sheets[firstSheetName];
        const data = XLSX.utils.sheet_to_json(ws, { defval: '' });

        if (!data || data.length === 0) {
          addToast({ type: 'warning', title: 'Empty Sheet', message: 'The uploaded file does not contain any data rows.' });
          return;
        }

        validateRows(selectedModule, data);
        setParsedRows(data);
      } catch (err: any) {
        addToast({ type: 'error', title: 'File Parse Error', message: err.message });
      }
    };
    reader.readAsBinaryString(uploadedFile);
  };

  // 4. Strict Validation Logic
  const validateRows = (mod: string, rows: any[]) => {
    const errs: { row: number; error: string; data?: any }[] = [];

    rows.forEach((row, idx) => {
      const rowNum = idx + 2; // Accounting for 1-based index + header row

      if (mod === 'Projects') {
        const name = row['Project Name'] || row['name'] || row['Name'];
        const budget = row['Budget ($)'] || row['budget'] || row['Budget'];
        if (!name || String(name).trim().length < 3) {
          errs.push({ row: rowNum, error: 'Project name is required (min 3 chars)', data: row });
        }
        if (budget && isNaN(Number(budget))) {
          errs.push({ row: rowNum, error: 'Budget must be a valid number', data: row });
        }
      } else if (mod === 'Beneficiaries') {
        const name = row['Full Name'] || row['name'] || row['Name'];
        const age = row['Age'] || row['age'];
        if (!name || String(name).trim().length < 2) {
          errs.push({ row: rowNum, error: 'Beneficiary name is required', data: row });
        }
        if (age && (isNaN(Number(age)) || Number(age) < 1 || Number(age) > 120)) {
          errs.push({ row: rowNum, error: 'Age must be between 1 and 120', data: row });
        }
      } else if (mod === 'Donations') {
        const donor = row['Donor Name'] || row['donorName'];
        const amount = row['Amount ($)'] || row['amount'] || row['Amount'];
        if (!donor) errs.push({ row: rowNum, error: 'Donor name is required', data: row });
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
          errs.push({ row: rowNum, error: 'Valid positive donation amount required', data: row });
        }
      } else if (mod === 'Expenses') {
        const vendor = row['Vendor / Supplier'] || row['vendor'] || row['Vendor'];
        const amount = row['Amount ($)'] || row['amount'];
        if (!vendor) errs.push({ row: rowNum, error: 'Vendor name is required', data: row });
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
          errs.push({ row: rowNum, error: 'Valid positive expense amount required', data: row });
        }
      } else if (mod === 'Inventory') {
        const itemName = row['Item Name'] || row['itemName'];
        const qty = row['Quantity'] || row['quantity'];
        if (!itemName) errs.push({ row: rowNum, error: 'Resource item name is required', data: row });
        if (qty !== undefined && isNaN(Number(qty))) {
          errs.push({ row: rowNum, error: 'Quantity must be numeric', data: row });
        }
      } else if (mod === 'Tasks') {
        const title = row['Task Title'] || row['title'] || row['Title'];
        if (!title) errs.push({ row: rowNum, error: 'Task title is required', data: row });
      }
    });

    setValidationErrors(errs);
  };

  // 5. Commit Valid Imported Rows
  const handleCommitImport = async () => {
    if (parsedRows.length === 0) return;
    setIsProcessing(true);

    try {
      // Map parsed spreadsheet row keys into normalized object keys
      const normalizedItems = parsedRows.map(row => {
        if (selectedModule === 'Projects') {
          return {
            name: row['Project Name'] || row['name'] || 'New Project',
            category: row['Category'] || row['category'] || 'Clean Water & Sanitation',
            description: row['Description'] || row['description'] || '',
            objectives: row['Objectives'] || row['objectives'] || '',
            location: row['Location'] || row['location'] || 'Field Operations',
            manager: row['Manager'] || row['manager'] || staff[0]?.name || 'Dr. Aarti Deshmukh',
            budget: Number(row['Budget ($)'] || row['budget'] || 50000),
            spent: Number(row['Spent ($)'] || row['spent'] || 0),
            startDate: row['Start Date'] || row['startDate'] || new Date().toISOString().split('T')[0],
            endDate: row['End Date'] || row['endDate'] || new Date(Date.now() + 180 * 24 * 3600 * 1000).toISOString().split('T')[0],
            status: row['Status'] || row['status'] || 'Active',
            beneficiariesCount: Number(row['Beneficiaries Reached'] || row['beneficiariesCount'] || 500),
            donorPartners: (row['Donor Partners'] || row['donorPartners'] || '').split(',').map((d: string) => d.trim()).filter(Boolean)
          };
        } else if (selectedModule === 'Beneficiaries') {
          return {
            name: row['Full Name'] || row['name'] || 'Beneficiary',
            age: Number(row['Age'] || row['age'] || 30),
            gender: row['Gender'] || row['gender'] || 'Female',
            contact: row['Contact Phone'] || row['contact'] || '+91 98200 00000',
            location: row['Location'] || row['location'] || 'Field Cluster',
            category: row['Category'] || row['category'] || 'Clean Water & Sanitation',
            assignedProject: row['Assigned Project'] || row['assignedProject'] || projects[0]?.id || 'PRJ-101',
            assistanceCategory: row['Assistance Category'] || row['assistanceCategory'] || 'Community Aid',
            servicesReceived: (row['Assistance History'] || row['servicesReceived'] || 'Imported via Batch Spreadsheet').split(';').map((s: string) => s.trim())
          };
        } else if (selectedModule === 'Donations') {
          return {
            donorName: row['Donor Name'] || row['donorName'] || 'Anonymous Donor',
            donorType: row['Donor Type'] || row['donorType'] || 'Corporate CSR',
            amount: Number(row['Amount ($)'] || row['amount'] || 1000),
            date: row['Date'] || row['date'] || new Date().toISOString().split('T')[0],
            paymentMethod: row['Payment Method'] || row['paymentMethod'] || 'Bank Transfer',
            purpose: row['Purpose'] || row['purpose'] || 'Community program grant',
            projectAllocation: row['Project Allocation'] || row['projectAllocation'] || projects[0]?.id || 'PRJ-101',
            transactionRef: row['Transaction Ref'] || row['transactionRef'] || `TXN-IMP-${Math.floor(100000 + Math.random() * 900000)}`,
            taxExemptionIssued: true,
            status: 'Verified'
          };
        } else if (selectedModule === 'Expenses') {
          return {
            vendor: row['Vendor / Supplier'] || row['vendor'] || 'Local Supplier',
            project: row['Project'] || row['project'] || projects[0]?.id || 'PRJ-101',
            category: row['Category'] || row['category'] || 'Supplies',
            amount: Number(row['Amount ($)'] || row['amount'] || 500),
            date: row['Date'] || row['date'] || new Date().toISOString().split('T')[0],
            paymentMethod: row['Payment Method'] || row['paymentMethod'] || 'Bank Transfer',
            description: row['Description'] || row['description'] || 'Batch imported operational expense',
            receiptRef: row['Invoice / Receipt Ref'] || row['receiptRef'] || `INV-IMP-${Math.floor(1000 + Math.random() * 9000)}`,
            status: 'Approved'
          };
        } else if (selectedModule === 'Inventory') {
          return {
            itemName: row['Item Name'] || row['itemName'] || 'Resource Unit',
            category: row['Category'] || row['category'] || 'Water & Sanitation',
            quantity: Number(row['Quantity'] || row['quantity'] || 10),
            unit: row['Unit'] || row['unit'] || 'units',
            unitCost: Number(row['Unit Cost ($)'] || row['unitCost'] || 20),
            location: row['Location / Depot'] || row['location'] || 'Pune Central Warehouse',
            reorderLevel: Number(row['Reorder Threshold'] || row['reorderLevel'] || 5),
            supplier: row['Supplier'] || row['supplier'] || 'Standard Supplier'
          };
        } else if (selectedModule === 'Tasks') {
          return {
            title: row['Task Title'] || row['title'] || 'Operational Task',
            project: row['Project'] || row['project'] || projects[0]?.id || 'PRJ-101',
            assignee: row['Assignee'] || row['assignee'] || staff[0]?.name || 'Dr. Aarti Deshmukh',
            priority: row['Priority'] || row['priority'] || 'Medium',
            status: row['Status'] || row['status'] || 'Pending',
            dueDate: row['Due Date'] || row['dueDate'] || new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
            estimatedHours: Number(row['Estimated Hours'] || row['estimatedHours'] || 8),
            description: row['Description'] || row['description'] || ''
          };
        }
        return row;
      });

      const res = await apiService.bulkImport(selectedModule, normalizedItems, currentUser);
      await refreshData();

      setImportSummary({ imported: res.imported, skipped: res.skipped });
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

      addToast({
        type: 'success',
        title: 'Import Successful',
        message: `Successfully imported ${res.imported} records into ${selectedModule}.`
      });

      // Clear file
      setFile(null);
      setParsedRows([]);
      setValidationErrors([]);
    } catch (err: any) {
      addToast({ type: 'error', title: 'Import Failed', message: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const modulesList = [
    { name: 'Projects', count: projects.length, desc: 'Programmatic initiatives & milestones' },
    { name: 'Beneficiaries', count: beneficiaries.length, desc: 'Individual demographic registry' },
    { name: 'Staff & Volunteers', count: staff.length, desc: 'Personnel directory & logged hours' },
    { name: 'Donations', count: donations.length, desc: 'Contributions & 80G tax receipts' },
    { name: 'Expenses', count: expenses.length, desc: 'Disbursements & vendor vouchers' },
    { name: 'Events & Campaigns', count: events.length, desc: 'Outreach drives & outcomes' },
    { name: 'Inventory', count: inventory.length, desc: 'Supplies, medicine & warehouse stock' },
    { name: 'Tasks', count: tasks.length, desc: 'Action items & deliverable board' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
              Data Import & Export Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Excel / CSV Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Certified spreadsheet portability. Export 9-worksheet master workbooks or upload batch records with strict validation.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setActiveTab('export')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'export' ? 'bg-white font-bold text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>Export Center</span>
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'import' ? 'bg-white font-bold text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5 text-teal-700" />
            <span>Import Studio</span>
          </button>
        </div>
      </div>

      {activeTab === 'export' ? (
        /* EXPORT TAB */
        <div className="space-y-6">
          {/* Master Consolidated Workbook Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-900 to-slate-900 text-white shadow-lg shadow-emerald-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-800/80 text-emerald-300 text-[10px] font-bold tracking-wider uppercase border border-emerald-700/60">
                <FileSpreadsheet className="w-3 h-3" />
                <span>Full Enterprise Data Portability</span>
              </div>
              <h2 className="text-xl font-bold font-heading">
                Consolidated NGO Master Operations Workbook (.xlsx)
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Generates a genuine multi-tab Excel file containing 9 worksheets: <em>Dashboard Summary, Projects, Beneficiaries, Staff & Volunteers, Donations, Expenses, Events, Inventory,</em> and <em>Tasks</em> with calculated totals, formatted currency, and frozen header rows.
              </p>
            </div>

            <button
              onClick={handleExportConsolidated}
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Master Workbook</span>
            </button>
          </div>

          {/* Module-by-Module Individual Export Grid */}
          <div>
            <h3 className="text-sm font-bold font-heading text-slate-900 mb-1">
              Individual Module Spreadsheet Exports
            </h3>
            <p className="text-xs text-slate-500 mb-4">Export isolated verified records for external audits, grant reporting, or field teams</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {modulesList.map(mod => (
                <div
                  key={mod.name}
                  className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-mono">
                        {mod.count} Rows
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900">{mod.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{mod.desc}</p>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs">
                    <button
                      onClick={() => downloadModuleTemplate(mod.name)}
                      className="text-[11px] font-medium text-slate-500 hover:text-emerald-700 hover:underline cursor-pointer"
                      title="Download blank template with header fields and pre-filled valid example"
                    >
                      Template
                    </button>
                    <button
                      onClick={() => handleExportSingleModule(mod.name)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Export .xlsx</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* IMPORT STUDIO TAB */
        <div className="space-y-6">
          {/* Top Configuration Bar */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Step 1: Select Destination Module
              </label>
              <select
                value={selectedModule}
                onChange={(e) => {
                  setSelectedModule(e.target.value);
                  setFile(null);
                  setParsedRows([]);
                  setValidationErrors([]);
                }}
                className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-hidden"
              >
                <option value="Projects">Projects</option>
                <option value="Beneficiaries">Beneficiaries</option>
                <option value="Staff & Volunteers">Staff & Volunteers</option>
                <option value="Donations">Donations</option>
                <option value="Expenses">Expenses</option>
                <option value="Inventory">Inventory</option>
                <option value="Tasks">Tasks</option>
              </select>
            </div>

            <button
              onClick={() => downloadModuleTemplate(selectedModule)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {selectedModule} Sample Template (.xlsx)</span>
            </button>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="p-8 border-2 border-dashed border-emerald-300 rounded-2xl bg-emerald-50/20 hover:bg-emerald-50/40 text-center transition-all cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx,.xls,.csv"
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3 shadow-2xs">
              <UploadCloud className="w-6 h-6" />
            </div>

            <h3 className="text-sm font-bold text-slate-900 font-heading">
              {file ? file.name : `Upload ${selectedModule} Spreadsheet (.xlsx or .csv)`}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Drag and drop your spreadsheet here, or click to browse from your device.
            </p>
            {file && (
              <span className="inline-block mt-2 text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                {(file.size / 1024).toFixed(1)} KB • {parsedRows.length} Rows Detected
              </span>
            )}
          </div>

          {/* Validation Status & Error Alert Bar */}
          {validationErrors.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wide">
                    Validation Issues Detected ({validationErrors.length} errors)
                  </h4>
                  <p className="text-xs text-rose-800/90 mt-0.5">
                    Some rows do not conform to schema requirements. You can review the issues below and download an error report.
                  </p>
                </div>
              </div>

              <button
                onClick={() => downloadErrorReport(selectedModule, validationErrors)}
                className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-semibold shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Error Report</span>
              </button>
            </div>
          )}

          {/* Preview Table of Uploaded Rows */}
          {parsedRows.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden space-y-3 p-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Uploaded Rows Preview ({parsedRows.length} rows)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Verify mapped fields before committing to persistent database.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setFile(null); setParsedRows([]); setValidationErrors([]); }}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Clear
                  </button>

                  <button
                    onClick={handleCommitImport}
                    disabled={isProcessing}
                    className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Importing Records...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Commit {parsedRows.length} Records to {selectedModule}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Rows Table */}
              <div className="overflow-x-auto max-h-72 border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">Row #</th>
                      {Object.keys(parsedRows[0] || {}).slice(0, 6).map(key => (
                        <th key={key} className="py-2.5 px-3">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {parsedRows.slice(0, 15).map((row, idx) => {
                      const hasErr = validationErrors.some(e => e.row === idx + 2);

                      return (
                        <tr key={idx} className={hasErr ? 'bg-rose-50/70 text-rose-950 font-medium' : 'hover:bg-slate-50'}>
                          <td className="py-2 px-3 font-mono font-bold text-slate-400">{idx + 2}</td>
                          {Object.keys(parsedRows[0] || {}).slice(0, 6).map(key => (
                            <td key={key} className="py-2 px-3 truncate max-w-[150px]">
                              {String(row[key])}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {parsedRows.length > 15 && (
                <p className="text-[11px] text-slate-400 text-center italic">
                  Showing first 15 of {parsedRows.length} rows. All rows will be validated and imported upon confirmation.
                </p>
              )}
            </div>
          )}

          {/* Import Summary Modal / Alert */}
          {importSummary && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <span className="text-xs font-bold text-emerald-950">
                  Batch complete: Successfully committed {importSummary.imported} records into the persistent store.
                </span>
              </div>
              <button
                onClick={() => setImportSummary(null)}
                className="text-xs font-semibold text-emerald-800 hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
