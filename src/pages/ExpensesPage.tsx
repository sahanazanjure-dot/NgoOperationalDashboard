import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Building,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  Sparkles,
  Edit,
  Trash2,
  Check,
  X,
  CreditCard,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Expense } from '../types';
import { exportModuleExcel } from '../utils/excelExport';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const ExpensesPage: React.FC = () => {
  const { expenses, projects, addExpense, updateExpense, approveExpense, deleteExpense, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [project, setProject] = useState(projects[0]?.id || 'PRJ-101');
  const [category, setCategory] = useState<Expense['category']>('Equipment & Supplies');
  const [amount, setAmount] = useState<number>(1200);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [vendor, setVendor] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [description, setDescription] = useState('');
  const [receiptRef, setReceiptRef] = useState('');

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const matchSearch = e.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.receiptRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || e.status === statusFilter;
      const matchCat = categoryFilter === 'all' || e.category === categoryFilter;
      const matchProj = projectFilter === 'all' || e.project === projectFilter;
      return matchSearch && matchStatus && matchCat && matchProj;
    });
  }, [expenses, searchQuery, statusFilter, categoryFilter, projectFilter]);

  const totalSpent = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + (e.status === 'Approved' ? e.amount : 0), 0);
  }, [filteredExpenses]);

  const pendingAmount = useMemo(() => {
    return filteredExpenses.filter(e => e.status === 'Pending').reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const totalPages = Math.ceil(filteredExpenses.length / pageSize) || 1;
  const paginatedExpenses = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredExpenses.slice(start, start + pageSize);
  }, [filteredExpenses, currentPage]);

  const handleExportExcel = () => {
    const exportData = filteredExpenses.map(e => ({
      'Expense Voucher #': e.id,
      'Project': e.project,
      'Category': e.category,
      'Amount (₹)': e.amount,
      'Date': e.date,
      'Vendor / Supplier': e.vendor,
      'Payment Method': e.paymentMethod,
      'Description': e.description,
      'Status': e.status,
      'Approved By': e.approvedBy || 'Pending',
      'Invoice / Receipt Ref': e.receiptRef,
      'Duplicate Flag': e.isDuplicateFlag ? 'FLAGGED' : 'No'
    }));
    exportData.push({
      'Expense Voucher #': 'TOTAL',
      'Project': '-',
      'Category': '-',
      'Amount (₹)': totalSpent,
      'Date': '-',
      'Vendor / Supplier': 'TOTAL APPROVED EXPENDITURE',
      'Payment Method': '-',
      'Description': '-',
      'Status': '-',
      'Approved By': '-',
      'Invoice / Receipt Ref': '-',
      'Duplicate Flag': '-'
    });
    exportModuleExcel('Expenses_and_Vouchers', exportData);
  };

  const handleOpenCreate = () => {
    setProject(projects[0]?.id || 'PRJ-101');
    setCategory('Supplies');
    setAmount(2500);
    setDate(new Date().toISOString().split('T')[0]);
    setVendor('');
    setPaymentMethod('Bank Transfer');
    setDescription('');
    setReceiptRef(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (e: Expense) => {
    setEditingExpense(e);
    setProject(e.project);
    setCategory(e.category);
    setAmount(e.amount);
    setDate(e.date);
    setVendor(e.vendor);
    setPaymentMethod(e.paymentMethod);
    setDescription(e.description);
    setReceiptRef(e.receiptRef);
  };

  const handleSaveExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: Partial<Expense> = {
      project,
      category,
      amount: Number(amount),
      date,
      vendor,
      paymentMethod,
      description,
      receiptRef,
      status: 'Pending'
    };

    if (editingExpense) {
      await updateExpense(editingExpense.id, data);
      setEditingExpense(null);
    } else {
      await addExpense(data);
      setCreateModalOpen(false);
    }
  };

  const isFinanceOrAdmin = currentUser.role === 'Administrator' || currentUser.role === 'Finance Manager';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
              Expenses & Budget Health
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              ₹{totalSpent.toLocaleString()} Approved
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Audit-tracked disbursements, voucher approvals, duplicate expense detection, and project budget health.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs cursor-pointer"
            title="Export expense ledger to Excel (.xlsx)"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Expenses</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Approved Disbursements</span>
          <div className="text-2xl font-bold font-heading text-slate-900 mt-1">₹{totalSpent.toLocaleString()}</div>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">Legitimate programmatic expense</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Pending Review Vouchers</span>
          <div className="text-2xl font-bold font-heading text-amber-700 mt-1">₹{pendingAmount.toLocaleString()}</div>
          <p className="text-[11px] text-amber-800 font-medium mt-1">
            {expenses.filter(e => e.status === 'Pending').length} Vouchers awaiting Finance approval
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Suspicious / Duplicate Flags</span>
          <div className="text-2xl font-bold font-heading text-rose-700 mt-1">
            {expenses.filter(e => e.isDuplicateFlag).length}
          </div>
          <p className="text-[11px] text-rose-600 font-medium mt-1">Automatic fraud prevention scan active</p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search vendor, invoice #, voucher ID..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-medium"
          >
            <option value="all">All Approval Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending Review</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* Project Filter */}
          <select
            value={projectFilter}
            onChange={(e) => { setProjectFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-medium"
          >
            <option value="all">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.id} - {p.name.slice(0, 20)}...</option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-medium"
          >
            <option value="all">All Expense Categories</option>
            <option value="Equipment & Supplies">Equipment & Supplies</option>
            <option value="Supplies">Supplies</option>
            <option value="Medical Supplies">Medical Supplies</option>
            <option value="Food & Relief">Food & Relief</option>
            <option value="Honorarium & Training">Honorarium & Training</option>
            <option value="Facility & Rent">Facility & Rent</option>
            <option value="Travel & Fuel">Travel & Fuel</option>
            <option value="Vehicle Maintenance">Vehicle Maintenance</option>
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Voucher ID & Date</th>
                <th className="py-3 px-4">Vendor / Payee</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Amount (₹)</th>
                <th className="py-3 px-4">Approval Status</th>
                <th className="py-3 px-4">Invoice / Receipt</th>
                <th className="py-3 px-4 text-right">Workflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedExpenses.map(expense => (
                <tr key={expense.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-slate-900">{expense.id}</div>
                    <div className="text-[10px] text-slate-400">{expense.date}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                      {expense.vendor}
                      {expense.isDuplicateFlag && (
                        <span className="text-[9px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded" title="Duplicate vendor/amount detected">
                          Duplicate Flag
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[220px]">{expense.description}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                      {expense.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-600">
                    {expense.project}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-sm text-slate-900">
                      ₹{expense.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      expense.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                      expense.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {expense.status}
                    </span>
                    {expense.approvedBy && (
                      <div className="text-[9px] text-slate-400 mt-0.5">By {expense.approvedBy}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">
                    {expense.receiptRef}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      {isFinanceOrAdmin && expense.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => approveExpense(expense.id, 'Approved')}
                            className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg cursor-pointer transition-colors"
                            title="Approve Voucher"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => approveExpense(expense.id, 'Rejected')}
                            className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg cursor-pointer transition-colors"
                            title="Reject Voucher"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {isFinanceOrAdmin && (
                        <>
                          <button onClick={() => handleOpenEdit(expense)} className="p-1 hover:text-slate-900 cursor-pointer">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDeleteId(expense.id)} className="p-1 hover:text-rose-600 cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-xs text-slate-500">
          <span>
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredExpenses.length)} of {filteredExpenses.length} records
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-medium text-slate-700">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Record / Edit Expense Modal */}
      {(createModalOpen || editingExpense) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-4 font-heading">
              {editingExpense ? 'Edit Expense Voucher' : 'Record Programmatic Expense'}
            </h3>

            <form onSubmit={handleSaveExpense} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Vendor / Supplier / Payee *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Hardware Supplies"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Allocated Project *</label>
                  <select
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.id} - {p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Disbursement Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Expense Category *</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  >
                    <option value="Equipment & Supplies">Equipment & Supplies</option>
                    <option value="Supplies">Supplies</option>
                    <option value="Medical Supplies">Medical Supplies</option>
                    <option value="Food & Relief">Food & Relief</option>
                    <option value="Honorarium & Training">Honorarium & Training</option>
                    <option value="Facility & Rent">Facility & Rent</option>
                    <option value="Travel & Fuel">Travel & Fuel</option>
                    <option value="Vehicle Maintenance">Vehicle Maintenance</option>
                    <option value="Administrative">Administrative</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Payment Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  >
                    <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                    <option value="Wire Transfer">Wire Transfer</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Corporate Card">Corporate Card</option>
                    <option value="Cash">Cash Voucher</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Invoice / Bill Reference #</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. INV-90210"
                    value={receiptRef}
                    onChange={(e) => setReceiptRef(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Disbursement Purpose / Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail goods delivered or service performed..."
                  className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => { setCreateModalOpen(false); setEditingExpense(null); }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-semibold hover:bg-emerald-900 cursor-pointer"
                >
                  {editingExpense ? 'Save Changes' : 'Submit Voucher for Approval'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Delete Expense Voucher"
        message="Are you sure you want to delete this expense record? This will adjust financial ledger balances and project budget spent counters."
        confirmLabel="Delete Voucher"
        onConfirm={async () => {
          if (deleteId) {
            await deleteExpense(deleteId);
            setDeleteId(null);
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
