import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  DollarSign,
  Plus,
  Search,
  Filter,
  Download,
  Receipt,
  FileCheck2,
  Calendar,
  Building,
  User,
  CreditCard,
  Printer,
  Sparkles,
  Edit,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Donation } from '../types';
import { exportModuleExcel } from '../utils/excelExport';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const DonationsPage: React.FC = () => {
  const { donations, projects, organization, addDonation, updateDonation, deleteDonation, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [donorTypeFilter, setDonorTypeFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);
  const [receiptDonation, setReceiptDonation] = useState<Donation | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [donorName, setDonorName] = useState('');
  const [donorType, setDonorType] = useState<Donation['donorType']>('Corporate CSR');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState<number>(5000);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<Donation['paymentMethod']>('Bank Transfer');
  const [purpose, setPurpose] = useState('');
  const [projectAllocation, setProjectAllocation] = useState(projects[0]?.id || 'PRJ-101');
  const [transactionRef, setTransactionRef] = useState('');
  const [taxExemptionIssued, setTaxExemptionIssued] = useState(true);

  const filteredDonations = useMemo(() => {
    return donations.filter(d => {
      const matchSearch = d.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.transactionRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.purpose.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = donorTypeFilter === 'all' || d.donorType === donorTypeFilter;
      const matchProj = projectFilter === 'all' || d.projectAllocation === projectFilter;
      const matchPayment = paymentMethodFilter === 'all' || d.paymentMethod === paymentMethodFilter;
      return matchSearch && matchType && matchProj && matchPayment;
    });
  }, [donations, searchQuery, donorTypeFilter, projectFilter, paymentMethodFilter]);

  const totalRaised = useMemo(() => {
    return filteredDonations.reduce((sum, d) => sum + (d.status === 'Verified' ? d.amount : 0), 0);
  }, [filteredDonations]);

  const totalPages = Math.ceil(filteredDonations.length / pageSize) || 1;
  const paginatedDonations = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDonations.slice(start, start + pageSize);
  }, [filteredDonations, currentPage]);

  const handleExportExcel = () => {
    const exportData = filteredDonations.map(d => ({
      'Receipt #': d.receiptNumber,
      'Donor Name': d.donorName,
      'Donor Type': d.donorType,
      'Amount ($)': d.amount,
      'Date': d.date,
      'Payment Method': d.paymentMethod,
      'Purpose': d.purpose,
      'Project Allocation': d.projectAllocation,
      'Transaction Ref': d.transactionRef,
      '80G Tax Exemption Issued': d.taxExemptionIssued ? 'Yes' : 'No',
      'Status': d.status
    }));
    exportData.push({
      'Receipt #': 'TOTAL',
      'Donor Name': 'TOTAL VERIFIED DONATIONS',
      'Donor Type': '-',
      'Amount ($)': totalRaised,
      'Date': '-',
      'Payment Method': '-',
      'Purpose': '-',
      'Project Allocation': '-',
      'Transaction Ref': '-',
      '80G Tax Exemption Issued': '-',
      'Status': '-'
    });
    exportModuleExcel('Donations_and_Grants', exportData);
  };

  const handleOpenCreate = () => {
    setDonorName('');
    setDonorType('Corporate CSR');
    setEmail('');
    setPhone('');
    setAmount(10000);
    setDate(new Date().toISOString().split('T')[0]);
    setPaymentMethod('Bank Transfer');
    setPurpose('Community water infrastructure support');
    setProjectAllocation(projects[0]?.id || 'PRJ-101');
    setTransactionRef(`TXN-${Math.floor(100000 + Math.random() * 900000)}`);
    setTaxExemptionIssued(true);
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (d: Donation) => {
    setEditingDonation(d);
    setDonorName(d.donorName);
    setDonorType(d.donorType);
    setEmail(d.email);
    setPhone(d.phone);
    setAmount(d.amount);
    setDate(d.date);
    setPaymentMethod(d.paymentMethod);
    setPurpose(d.purpose);
    setProjectAllocation(d.projectAllocation);
    setTransactionRef(d.transactionRef);
    setTaxExemptionIssued(d.taxExemptionIssued);
  };

  const handleSaveDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: Partial<Donation> = {
      donorName,
      donorType,
      email,
      phone,
      amount: Number(amount),
      date,
      paymentMethod,
      purpose,
      projectAllocation,
      transactionRef,
      taxExemptionIssued,
      status: 'Verified'
    };

    if (editingDonation) {
      await updateDonation(editingDonation.id, data);
      setEditingDonation(null);
    } else {
      await addDonation(data);
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
              Donations & Fundraising
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              ${totalRaised.toLocaleString()} Raised
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Verified donor contributions, official 80G receipt numbering, CSR grants, and transaction ledger.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs cursor-pointer"
            title="Download formatted Excel donation registry (.xlsx)"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Donations</span>
          </button>

          {isFinanceOrAdmin && (
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Record Donation</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Filtered Donations Received</span>
          <div className="text-2xl font-bold font-heading text-slate-900 mt-1">${totalRaised.toLocaleString()}</div>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1">Across {filteredDonations.length} Contributions</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Average Contribution</span>
          <div className="text-2xl font-bold font-heading text-slate-900 mt-1">
            ${filteredDonations.length > 0 ? Math.round(totalRaised / filteredDonations.length).toLocaleString() : 0}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Institutional & Individual Philanthropy</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Top Supporter Type</span>
          <div className="text-2xl font-bold font-heading text-emerald-800 mt-1">Corporate CSR</div>
          <p className="text-[11px] text-slate-500 mt-1">TechCorp, EmpowerHer & Rotary</p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search donor name, receipt #, txn ref..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Donor Type Filter */}
          <select
            value={donorTypeFilter}
            onChange={(e) => { setDonorTypeFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-medium"
          >
            <option value="all">All Donor Types</option>
            <option value="Corporate CSR">Corporate CSR</option>
            <option value="Foundation">Foundation</option>
            <option value="Individual Philanthropist">Individual Philanthropist</option>
            <option value="Individual Donor">Individual Donor</option>
            <option value="Government / Multilateral">Government / Grant</option>
            <option value="Online Portal">Online Portal</option>
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

          {/* Payment Method Filter */}
          <select
            value={paymentMethodFilter}
            onChange={(e) => { setPaymentMethodFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-medium"
          >
            <option value="all">All Payment Methods</option>
            <option value="Wire Transfer">Wire Transfer</option>
            <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
            <option value="Cheque">Cheque</option>
            <option value="UPI / Stripe">UPI / Stripe</option>
            <option value="Payment Gateway">Payment Gateway</option>
          </select>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Receipt # & Date</th>
                <th className="py-3 px-4">Donor / Partner</th>
                <th className="py-3 px-4">Donor Type</th>
                <th className="py-3 px-4">Project Allocation</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Amount ($)</th>
                <th className="py-3 px-4">80G Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedDonations.map(donation => (
                <tr key={donation.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-slate-900">{donation.receiptNumber}</div>
                    <div className="text-[10px] text-slate-400">{donation.date}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{donation.donorName}</div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[200px]">{donation.purpose}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                      {donation.donorType}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-600">
                    {donation.projectAllocation}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <div>{donation.paymentMethod}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{donation.transactionRef}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-sm text-emerald-800">
                      ${donation.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      80G Certified
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => setReceiptDonation(donation)}
                        className="px-2 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg cursor-pointer flex items-center gap-1"
                        title="View printable tax exemption receipt"
                      >
                        <Receipt className="w-3 h-3" />
                        <span>Receipt</span>
                      </button>
                      {isFinanceOrAdmin && (
                        <>
                          <button onClick={() => handleOpenEdit(donation)} className="p-1 hover:text-slate-900 cursor-pointer">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDeleteId(donation.id)} className="p-1 hover:text-rose-600 cursor-pointer">
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
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredDonations.length)} of {filteredDonations.length} records
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

      {/* Official Printable Receipt Modal */}
      {receiptDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-8 shadow-2xl relative border border-slate-200">
            <div className="no-print flex items-center justify-between pb-4 mb-4 border-b">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Official Donation Receipt Preview</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-emerald-800 text-white rounded-xl text-xs font-semibold hover:bg-emerald-900 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button onClick={() => setReceiptDonation(null)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">✕</button>
              </div>
            </div>

            {/* Official Receipt Content */}
            <div className="border-2 border-emerald-900/30 p-6 rounded-2xl relative bg-emerald-50/20">
              <div className="text-center pb-4 border-b border-emerald-900/20">
                <h2 className="text-xl font-bold font-heading text-emerald-950">{organization?.name}</h2>
                <p className="text-[11px] text-slate-600 font-medium">{organization?.legalName}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{organization?.headquarters?.address}, {organization?.headquarters?.city} - {organization?.headquarters?.postalCode}</p>
                <div className="flex items-center justify-center gap-3 text-[10px] font-mono text-emerald-900 mt-2 font-semibold">
                  <span>Reg: {organization?.registrationNumber}</span>
                  <span>•</span>
                  <span>80G/12A: {organization?.taxExemptionNumber}</span>
                  <span>•</span>
                  <span>FCRA: {organization?.fcraNumber}</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-3 text-xs border-b border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">RECEIPT NUMBER</span>
                  <span className="font-mono font-bold text-emerald-900">{receiptDonation.receiptNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">DATE RECEIVED</span>
                  <span className="font-semibold text-slate-800">{receiptDonation.date}</span>
                </div>
              </div>

              <div className="py-4 space-y-2 text-xs">
                <p className="text-slate-700">
                  Received with heartfelt gratitude from:
                </p>
                <div className="text-base font-bold text-slate-900 font-heading bg-white p-3 rounded-xl border border-slate-200/60">
                  {receiptDonation.donorName}
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-600">The sum of:</span>
                  <span className="text-xl font-bold text-emerald-900 font-heading">${receiptDonation.amount.toLocaleString()} USD</span>
                </div>
                <div className="text-[11px] text-slate-500 pt-1">
                  <strong>Earmarked For:</strong> {receiptDonation.purpose} (Project: {receiptDonation.projectAllocation})
                </div>
                <div className="text-[11px] text-slate-500">
                  <strong>Transaction Reference:</strong> {receiptDonation.transactionRef} via {receiptDonation.paymentMethod}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-900/20 flex items-end justify-between text-xs">
                <div>
                  <p className="text-[10px] text-slate-400 italic max-w-xs">
                    * Contributions qualify for tax exemption under section 80G of the Income Tax Act. Computer-generated receipt; no physical signature required.
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-script text-lg text-emerald-950 font-serif">Pooja Hegde</div>
                  <div className="text-[10px] font-semibold text-slate-600 uppercase border-t border-slate-300 pt-1">Authorized Signatory</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Record / Edit Donation Modal */}
      {(createModalOpen || editingDonation) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-4 font-heading">
              {editingDonation ? 'Edit Donation Entry' : 'Record Donor Contribution'}
            </h3>

            <form onSubmit={handleSaveDonation} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Donor Name or Organization *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tata Trusts or Aditi Sharma"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Donor Category *</label>
                  <select
                    value={donorType}
                    onChange={(e: any) => setDonorType(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  >
                    <option value="Corporate CSR">Corporate CSR</option>
                    <option value="Foundation">Philanthropic Foundation</option>
                    <option value="Individual Philanthropist">Individual Philanthropist</option>
                    <option value="Individual Donor">Individual Donor</option>
                    <option value="Government / Multilateral">Government / Multilateral</option>
                    <option value="Online Portal">Online Crowdfunding</option>
                    <option value="Anonymous">Anonymous Donor</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Contribution Amount ($) *</label>
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
                  <label className="font-semibold text-slate-700">Payment Method *</label>
                  <select
                    value={paymentMethod}
                    onChange={(e: any) => setPaymentMethod(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  >
                    <option value="Wire Transfer">Wire Transfer</option>
                    <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                    <option value="Cheque">Cheque</option>
                    <option value="UPI / Stripe">UPI / Stripe</option>
                    <option value="Payment Gateway">Payment Gateway</option>
                    <option value="Cash">Cash Deposit</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Date Received</label>
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
                  <label className="font-semibold text-slate-700">Project Allocation *</label>
                  <select
                    value={projectAllocation}
                    onChange={(e) => setProjectAllocation(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.id} - {p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Transaction Reference #</label>
                  <input
                    type="text"
                    placeholder="e.g. TXN-WIRE-9910"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Donation Purpose / Grant Earmark</label>
                <input
                  type="text"
                  placeholder="e.g. Borewell solar pump procurement"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="taxExempt"
                  checked={taxExemptionIssued}
                  onChange={(e) => setTaxExemptionIssued(e.target.checked)}
                  className="rounded text-emerald-800 focus:ring-emerald-700"
                />
                <label htmlFor="taxExempt" className="font-medium text-slate-700 cursor-pointer">
                  Generate 80G Tax Exemption Certificate for this contribution
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => { setCreateModalOpen(false); setEditingDonation(null); }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-semibold hover:bg-emerald-900 cursor-pointer"
                >
                  {editingDonation ? 'Save Changes' : 'Record Contribution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Delete Donation Voucher"
        message="Are you sure you want to delete this donation record? This will adjust financial ledger balances and audit history."
        confirmLabel="Delete Voucher"
        onConfirm={async () => {
          if (deleteId) {
            await deleteDonation(deleteId);
            setDeleteId(null);
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
