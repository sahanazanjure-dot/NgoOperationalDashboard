import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  FileCheck2,
  MapPin,
  Users2,
  ShieldCheck,
  Edit,
  Plus,
  AlertTriangle,
  ExternalLink,
  Calendar,
  CheckCircle,
  Clock,
  Sparkles,
  Phone,
  Mail,
  Globe
} from 'lucide-react';
import { ComplianceDocument } from '../types';

export const OrganizationPage: React.FC = () => {
  const { organization, updateOrg, currentUser } = useApp();

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [addDocOpen, setAddDocOpen] = useState(false);

  // Profile Form State
  const [name, setName] = useState(organization?.name || '');
  const [legalName, setLegalName] = useState(organization?.legalName || '');
  const [registrationNumber, setRegistrationNumber] = useState(organization?.registrationNumber || '');
  const [fcraNumber, setFcraNumber] = useState(organization?.fcraNumber || '');
  const [taxExemptionNumber, setTaxExemptionNumber] = useState(organization?.taxExemptionNumber || '');
  const [mission, setMission] = useState(organization?.mission || '');
  const [primaryEmail, setPrimaryEmail] = useState(organization?.primaryEmail || '');
  const [contactPhone, setContactPhone] = useState(organization?.contactPhone || '');
  const [website, setWebsite] = useState(organization?.website || '');

  // Doc Form State
  const [docTitle, setDocTitle] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [docCategory, setDocCategory] = useState<'Legal' | 'Tax' | 'Compliance' | 'Audit'>('Legal');
  const [docExpiry, setDocExpiry] = useState('');
  const [docAuthority, setDocAuthority] = useState('');

  if (!organization) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateOrg({
      name,
      legalName,
      registrationNumber,
      fcraNumber,
      taxExemptionNumber,
      mission,
      primaryEmail,
      contactPhone,
      website
    });
    setEditProfileOpen(false);
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc: ComplianceDocument = {
      id: `doc-${Date.now()}`,
      title: docTitle,
      documentNumber: docNumber,
      category: docCategory,
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: docExpiry,
      status: 'Valid',
      issuingAuthority: docAuthority,
      verified: true
    };
    await updateOrg({
      documents: [...(organization.documents || []), newDoc]
    });
    setDocTitle('');
    setDocNumber('');
    setDocExpiry('');
    setDocAuthority('');
    setAddDocOpen(false);
  };

  const isAuthorized = currentUser.role === 'Administrator';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
              Organization & Compliance
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Verified NGO
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official NGO trust legal credentials, branch headquarters, departments, and regulatory certificates.
          </p>
        </div>

        {isAuthorized && (
          <button
            onClick={() => setEditProfileOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Profile Details</span>
          </button>
        )}
      </div>

      {/* Main NGO Profile Overview Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center text-white shadow-md text-2xl font-bold font-heading">
              {organization.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-heading text-slate-900">{organization.name}</h2>
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-xs text-slate-500 font-medium">{organization.legalName}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {organization.primaryEmail}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {organization.contactPhone}
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <a href={organization.website} target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline">
                    {organization.website}
                  </a>
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs shrink-0 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Reg Number</span>
              <span className="font-semibold text-slate-800 font-mono">{organization.registrationNumber}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Darpan ID</span>
              <span className="font-semibold text-slate-800 font-mono">{organization.darpanId}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">80G / 12A Exemption</span>
              <span className="font-semibold text-emerald-700 font-mono">{organization.taxExemptionNumber}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">FCRA Clearance</span>
              <span className="font-semibold text-blue-700 font-mono">{organization.fcraNumber}</span>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              Organizational Mission
            </h4>
            <p className="text-xs text-emerald-950/80 mt-1.5 leading-relaxed">{organization.mission}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              Organizational Vision
            </h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{organization.vision}</p>
          </div>
        </div>
      </div>

      {/* Compliance Documents & Expiry Tracker */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold font-heading text-slate-900">
              Statutory Documents & Expiry Reminders
            </h3>
            <p className="text-xs text-slate-500">Legal filings, tax exemption certificates, and mandatory audit records</p>
          </div>
          {isAuthorized && (
            <button
              onClick={() => setAddDocOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Document</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {organization.documents.map(doc => {
            const isExpiring = doc.status === 'Expiring Soon';

            return (
              <div
                key={doc.id}
                className={`p-4 rounded-xl border transition-all ${
                  isExpiring
                    ? 'bg-amber-50/70 border-amber-300'
                    : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                    {doc.category}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isExpiring ? 'bg-amber-200 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {doc.status}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 truncate">{doc.title}</h4>
                <div className="text-[11px] font-mono text-slate-500 mt-0.5">#{doc.documentNumber}</div>
                <div className="text-[11px] text-slate-600 mt-2">Authority: {doc.issuingAuthority}</div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200/60 text-[11px]">
                  <span className="text-slate-400">Valid Till:</span>
                  <span className={`font-semibold flex items-center gap-1 ${isExpiring ? 'text-amber-800 font-bold' : 'text-slate-700'}`}>
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {doc.expiryDate}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Operating Branches & Departments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Branches & Operating Locations */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold font-heading text-slate-900">Regional Field Bases</h3>
              <p className="text-xs text-slate-500">Operating hubs across operational states</p>
            </div>
            <MapPin className="w-4 h-4 text-emerald-700" />
          </div>

          <div className="space-y-3">
            {organization.branches.map(branch => (
              <div key={branch.id} className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{branch.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{branch.city}, {branch.state} • Manager: {branch.manager}</p>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  {branch.activeProjects} Projects
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Departments & Teams */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold font-heading text-slate-900">Departments & Divisions</h3>
              <p className="text-xs text-slate-500">Programmatic units and team leadership</p>
            </div>
            <Users2 className="w-4 h-4 text-emerald-700" />
          </div>

          <div className="space-y-3">
            {organization.departments.map(dept => (
              <div key={dept.id} className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{dept.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Head: {dept.head}</p>
                </div>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  {dept.staffCount} Staff
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-4">Edit Organization Profile</h3>
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full mt-1 p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Legal Trust Name</label>
                  <input
                    type="text"
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    required
                    className="w-full mt-1 p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Registration #</label>
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">FCRA Registration</label>
                  <input
                    type="text"
                    value={fcraNumber}
                    onChange={(e) => setFcraNumber(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">80G / 12A Exemption</label>
                  <input
                    type="text"
                    value={taxExemptionNumber}
                    onChange={(e) => setTaxExemptionNumber(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Primary Email</label>
                  <input
                    type="email"
                    value={primaryEmail}
                    onChange={(e) => setPrimaryEmail(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Contact Phone</label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Website URL</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Mission Statement</label>
                <textarea
                  rows={3}
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditProfileOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-semibold hover:bg-emerald-900"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Document Modal */}
      {addDocOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-4">Add Compliance Document</h3>
            <form onSubmit={handleAddDocument} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. CSR-1 Certificate"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  required
                  className="w-full mt-1 p-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Document Number / Ref</label>
                <input
                  type="text"
                  placeholder="e.g. CSR-2024-991"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  required
                  className="w-full mt-1 p-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Category</label>
                <select
                  value={docCategory}
                  onChange={(e: any) => setDocCategory(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-xl"
                >
                  <option value="Legal">Legal</option>
                  <option value="Tax">Tax</option>
                  <option value="Compliance">Compliance</option>
                  <option value="Audit">Audit</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700">Expiry / Renewal Date</label>
                <input
                  type="date"
                  value={docExpiry}
                  onChange={(e) => setDocExpiry(e.target.value)}
                  required
                  className="w-full mt-1 p-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Issuing Authority</label>
                <input
                  type="text"
                  placeholder="e.g. Ministry of Corporate Affairs"
                  value={docAuthority}
                  onChange={(e) => setDocAuthority(e.target.value)}
                  required
                  className="w-full mt-1 p-2 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setAddDocOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-semibold hover:bg-emerald-900"
                >
                  Add Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
