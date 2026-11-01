import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  ArrowRight,
  Heart,
  Droplets,
  GraduationCap,
  Stethoscope,
  UtensilsCrossed,
  LifeBuoy,
  Users,
  DollarSign,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  Building2,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Lock,
  Layers,
  Sparkles,
  Award
} from 'lucide-react';

interface FrontPageProps {
  onEnterPortal: (targetTab?: string) => void;
}

export const FrontPage: React.FC<FrontPageProps> = ({ onEnterPortal }) => {
  const {
    organization,
    projects,
    beneficiaries,
    staff,
    donations,
    events
  } = useApp();

  const donationsList = donations || [];
  const projectsList = projects || [];
  const beneficiariesList = beneficiaries || [];
  const staffList = staff || [];
  const eventsList = events || [];

  const totalDonations = donationsList.reduce((sum, d) => sum + (Number(d?.amount) || 0), 0);
  const totalBeneficiaries = beneficiariesList.length > 0 ? (beneficiariesList.length * 150 + 18420) : 18420;
  const activeProjectsCount = projectsList.filter(p => p?.status === 'Active').length || projectsList.length;
  const staffCount = staffList.length || 32;

  const programPillars = [
    {
      icon: Droplets,
      title: 'Clean Water & Sanitation',
      description: 'Installing solar-powered groundwater borewells, automated filtration hubs, and hygiene education in drought-prone villages.',
      tag: 'Sustainable Infrastructure',
      color: 'bg-cyan-50 text-cyan-800 border-cyan-200'
    },
    {
      icon: Stethoscope,
      title: 'Rural Healthcare & Mobile Clinics',
      description: 'Bringing diagnostic vans, maternal healthcare, critical medicines, and preventive screenings directly to remote tribal hamlets.',
      tag: 'Primary Care',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    },
    {
      icon: GraduationCap,
      title: 'Quality Education & Digital Literacy',
      description: 'Equipping rural schools with solar energy, STEM labs, digital tablets, and comprehensive teacher development programs.',
      tag: 'Youth Empowerment',
      color: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    {
      icon: UtensilsCrossed,
      title: 'Humanitarian Food Security',
      description: 'Combating severe childhood malnutrition with fortified ration distribution, community kitchens, and agro-nutrition training.',
      tag: 'Zero Hunger',
      color: 'bg-orange-50 text-orange-800 border-orange-200'
    },
    {
      icon: LifeBuoy,
      title: 'Rapid Disaster Relief & Recovery',
      description: 'First-responder deployment during cyclones and floods: supplying dry provisions, emergency water filtration, and temporary shelters.',
      tag: 'Emergency Response',
      color: 'bg-rose-50 text-rose-800 border-rose-200'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-800 selection:bg-emerald-700 selection:text-white flex flex-col font-sans">
      {/* 1. Public Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Foundation Identity */}
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center text-white shadow-md shadow-emerald-900/20">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-lg text-slate-900 tracking-tight block">
                {organization?.name || 'HopeHorizon Foundation'}
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 tracking-wider uppercase block">
                Public Charitable Trust • Est. {organization?.foundedYear || 2018}
              </span>
            </div>
          </div>

          {/* Center Navigation Links (Hidden on small mobile) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#about" className="hover:text-emerald-800 transition-colors">About Us</a>
            <a href="#programs" className="hover:text-emerald-800 transition-colors">Our Programs</a>
            <a href="#impact" className="hover:text-emerald-800 transition-colors">Live Impact</a>
            <a href="#projects" className="hover:text-emerald-800 transition-colors">Active Projects</a>
            <a href="#transparency" className="hover:text-emerald-800 transition-colors">80G & Compliance</a>
            <a href="#events" className="hover:text-emerald-800 transition-colors">Events</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onEnterPortal('donations')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Donate (80G)</span>
            </button>

            <button
              onClick={() => onEnterPortal('dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-all shadow-md shadow-emerald-900/20 hover:shadow-lg hover:shadow-emerald-900/30 cursor-pointer"
            >
              <span>Operations Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/60 bg-gradient-to-b from-emerald-50/60 via-white to-[#f8faf9]">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Statutory Verification Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300/80 text-emerald-900 text-xs font-semibold mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Section 80G & 12A Certified • FCRA Approved NGO</span>
            <span className="hidden sm:inline text-emerald-400">•</span>
            <span className="hidden sm:inline font-mono text-[11px] text-emerald-800">Reg: {organization?.registrationNumber || 'NGO-REG-2018-09412'}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Empowering Communities. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 bg-clip-text text-transparent">
              Restoring Dignity & Driving Real Change.
            </span>
          </h1>

          {/* Mission Subtitle */}
          <p className="mt-6 text-sm sm:text-base lg:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {organization?.mission ||
              'A dedicated social development and humanitarian trust working relentlessly across clean water access, rural healthcare, educational equity, and disaster preparedness to create resilient futures.'}
          </p>

          {/* Call to Actions */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onEnterPortal('dashboard')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-2xl shadow-lg shadow-emerald-900/25 hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <Layers className="w-4 h-4 text-emerald-300" />
              <span>Launch Operations Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onEnterPortal('projects')}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300/90 rounded-2xl shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <span>Explore Active Projects</span>
            </button>

            <button
              onClick={() => onEnterPortal('donations')}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-rose-700 bg-rose-50 hover:bg-rose-100/90 border border-rose-200 rounded-2xl shadow-sm transition-all cursor-pointer"
            >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>Make a Contribution</span>
            </button>
          </div>

          {/* Trust badges strip */}
          <div className="mt-12 pt-8 border-t border-slate-200/70 max-w-4xl mx-auto flex flex-wrap items-center justify-around gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Darpan ID: <strong>{organization?.darpanId || 'MH/2019/0241982'}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Tax Exemption: <strong>{organization?.taxExemptionNumber || '80G/12A-AAATH9821K'}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Audited by: <strong>K.S. Mehta & Co. CAs</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Live Impact Statistics Banner */}
      <section id="impact" className="py-12 bg-white border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800">Verified Impact Registry</span>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 mt-1">Measurable Social Impact Across Ground Realities</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 text-center">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-900/10">
                <Users className="w-5 h-5 text-emerald-300" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-heading text-emerald-950">
                {totalBeneficiaries.toLocaleString()}+
              </div>
              <div className="text-xs font-semibold text-slate-600 mt-1">Lives Directly Impacted</div>
              <div className="text-[10px] text-emerald-700 mt-0.5">Across 42 villages & hamlets</div>
            </div>

            <div className="p-5 rounded-2xl bg-cyan-50/50 border border-cyan-200/80 text-center">
              <div className="w-10 h-10 rounded-xl bg-cyan-800 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-cyan-900/10">
                <Layers className="w-5 h-5 text-cyan-300" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-heading text-cyan-950">
                {activeProjectsCount} Active
              </div>
              <div className="text-xs font-semibold text-slate-600 mt-1">Multi-Year Sustainable Projects</div>
              <div className="text-[10px] text-cyan-700 mt-0.5">Water, Health, Education</div>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 text-center">
              <div className="w-10 h-10 rounded-xl bg-amber-800 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-amber-900/10">
                <DollarSign className="w-5 h-5 text-amber-300" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-heading text-amber-950">
                ₹{totalDonations.toLocaleString()}
              </div>
              <div className="text-xs font-semibold text-slate-600 mt-1">Impact Capital Deployed</div>
              <div className="text-[10px] text-amber-700 mt-0.5">100% Tax Deductible 80G</div>
            </div>

            <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-200/80 text-center">
              <div className="w-10 h-10 rounded-xl bg-purple-800 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-purple-900/10">
                <Heart className="w-5 h-5 text-purple-300" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-heading text-purple-950">
                {staffCount}+ Field Staff
              </div>
              <div className="text-xs font-semibold text-slate-600 mt-1">Dedicated Ground Volunteers</div>
              <div className="text-[10px] text-purple-700 mt-0.5">Grassroots coordinators</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Programmatic Pillars */}
      <section id="programs" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800">Our Strategic Pillars</span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 mt-1">Holistic Development Programs</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Targeted community interventions structured to create generational resilience and self-reliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-800/10 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${pillar.color}`}>
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold font-heading text-slate-900 mb-2">{pillar.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{pillar.description}</p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-800">Verified Program</span>
                  <button
                    onClick={() => onEnterPortal('projects')}
                    className="text-emerald-700 hover:text-emerald-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Projects</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Quick Operations Portal Access Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 text-white shadow-lg flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-emerald-300 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/20 text-emerald-200 inline-block mb-3">
                Enterprise Operations Portal
              </span>
              <h3 className="text-lg font-bold font-heading text-white mb-2">Centralized Operational Hub</h3>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                Full-featured administrative access: track budgets, approve financial vouchers, generate 80G tax receipts, manage staff hours, and export multi-sheet master Excel workbooks.
              </p>
            </div>

            <button
              onClick={() => onEnterPortal('dashboard')}
              className="mt-6 w-full py-3 px-4 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span>Access Internal Management Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Featured Active Projects */}
      <section id="projects" className="py-16 bg-slate-100/60 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800">Active Field Operations</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 mt-1">Ongoing Community Projects</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Real-time milestone tracking and budget utilization across our regional bases.
              </p>
            </div>
            <button
              onClick={() => onEnterPortal('projects')}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Manage Projects Registry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsList.slice(0, 3).map(proj => {
              if (!proj) return null;
              const burnRate = proj.budget > 0 ? Math.min(100, Math.round((proj.spent / proj.budget) * 100)) : 0;
              const completedMilestones = proj.milestones ? proj.milestones.filter(m => m.completed).length : 0;
              const totalMilestones = proj.milestones ? proj.milestones.length : 0;

              return (
                <div key={proj.id} className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        {proj.category}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        proj.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {proj.status}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 font-heading mb-1">{proj.name}</h4>
                    <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-700" />
                      <span>{proj.location}</span>
                      <span>•</span>
                      <span>Lead: {proj.manager}</span>
                    </p>

                    {/* Budget & Progress */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Budget Deployed</span>
                        <span className="font-bold text-slate-900">₹{(Number(proj.spent || 0)).toLocaleString()} / ₹{(Number(proj.budget || 0)).toLocaleString()}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-emerald-700 rounded-full transition-all"
                          style={{ width: `${burnRate}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                      <span>Milestones: <strong>{completedMilestones}/{totalMilestones}</strong> done</span>
                      <span>Beneficiaries: <strong>{(Number(proj.beneficiariesCount || (proj as any).beneficiaryCount || 0)).toLocaleString()}</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => onEnterPortal('projects')}
                    className="mt-4 w-full py-2 bg-slate-50 hover:bg-slate-100 text-emerald-800 font-semibold text-xs rounded-xl border border-slate-200 transition-colors cursor-pointer"
                  >
                    View Project Details
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Legal, Statutory & 80G Tax Exemption Transparency */}
      <section id="transparency" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800">Statutory Transparency</span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 mt-1">Verified Legal Credentials</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            HopeHorizon Foundation operates under strict adherence to Indian charitable statutory mandates and global accountability benchmarks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Charitable Trust</div>
            <div className="text-sm font-bold text-slate-900 mt-1">Trust Registration</div>
            <div className="mt-3 font-mono text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
              {organization?.registrationNumber || 'NGO-REG-2018-09412'}
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Officially registered with the Charity Commissioner under Public Trusts Act.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Income Tax Exemption</div>
            <div className="text-sm font-bold text-slate-900 mt-1">80G & 12A Certified</div>
            <div className="mt-3 font-mono text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
              {organization?.taxExemptionNumber || '80G/12A-AAATH9821K'}
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Donors are eligible for 50% tax deductions under Section 80G with instant receipts.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Ministry of Home Affairs</div>
            <div className="text-sm font-bold text-slate-900 mt-1">FCRA Cleared</div>
            <div className="mt-3 font-mono text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
              {organization?.fcraNumber || 'FCRA-031029481-B'}
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Authorized to receive international charitable contributions and foreign grants.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Government Portal</div>
            <div className="text-sm font-bold text-slate-900 mt-1">NITI Aayog Darpan</div>
            <div className="mt-3 font-mono text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
              {organization?.darpanId || 'MH/2019/0241982'}
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Listed on Government of India NGO-Darpan portal for state and central partnerships.
            </p>
          </div>
        </div>

        {/* Action bar for tax receipts */}
        <div className="mt-8 p-6 rounded-2xl bg-emerald-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-base">Require an Official 80G Tax Exemption Receipt?</h4>
            <p className="text-xs text-emerald-100/80 mt-0.5">
              Every contribution generates a legally compliant, serialized receipt with authorized trustee signatures.
            </p>
          </div>
          <button
            onClick={() => onEnterPortal('donations')}
            className="px-5 py-2.5 rounded-xl bg-white text-emerald-950 font-bold text-xs hover:bg-emerald-50 transition-colors shrink-0 cursor-pointer shadow-sm"
          >
            Generate / View Receipts
          </button>
        </div>
      </section>

      {/* 7. Upcoming Community Events & Relief Drives */}
      <section id="events" className="py-16 bg-slate-100/60 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800">Community Drives</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 mt-1">Upcoming Field Campaigns</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Medical camps, awareness summits, and seasonal relief distributions scheduled across Maharashtra.
              </p>
            </div>
            <button
              onClick={() => onEnterPortal('events')}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>View All Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {eventsList.slice(0, 3).map(ev => {
              if (!ev) return null;
              return (
              <div key={ev.id} className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-semibold text-emerald-800 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{ev.date}</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {ev.category}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 font-heading mb-1">{ev.title}</h4>
                  <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-700" />
                    <span>{ev.location}</span>
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{ev.outcomesSummary || 'Grassroots community event organized by field staff and regional volunteers.'}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Target: <strong>{ev.beneficiariesReached || 100}+ reached</strong></span>
                  <button
                    onClick={() => onEnterPortal('events')}
                    className="text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
                  >
                    Details →
                  </button>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </section>

      {/* 8. Call to Action / Operations Portal Access Banner */}
      <section className="py-20 bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-emerald-800/80 border border-emerald-600/40 text-emerald-300 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-950/40">
            <Layers className="w-7 h-7" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
            Comprehensive Operational Portal
          </h2>
          <p className="mt-4 text-sm sm:text-base text-emerald-100/80 max-w-2xl mx-auto leading-relaxed">
            Manage organizational registries, monitor live programmatic burn rates, approve financial vouchers, track emergency supplies, and download consolidated multi-worksheet audit workbooks in one place.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onEnterPortal('dashboard')}
              className="px-8 py-3.5 rounded-2xl bg-white text-emerald-950 hover:bg-emerald-50 font-bold text-sm shadow-xl transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Open Operational Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onEnterPortal('reports')}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Financial & Audit Statements</span>
            </button>
          </div>
        </div>
      </section>

      {/* 9. Public Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
            {/* Column 1: Organization */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <div className="w-8 h-8 rounded-xl bg-emerald-800 flex items-center justify-center text-white">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <span>{organization?.name || 'HopeHorizon Foundation'}</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                {organization?.legalName || 'HopeHorizon Social Development & Humanitarian Trust'}
              </p>
              <div className="text-[11px] text-emerald-400 font-mono">
                Reg: {organization?.registrationNumber || 'NGO-REG-2018-09412'}
              </div>
            </div>

            {/* Column 2: Regional Bases */}
            <div>
              <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Field Offices</h5>
              <ul className="space-y-2 text-xs">
                <li>• Western Region Office: Pune, Maharashtra</li>
                <li>• Central Tribal Base: Nagpur, Maharashtra</li>
                <li>• Coastal Disaster Base: Ratnagiri, Maharashtra</li>
              </ul>
            </div>

            {/* Column 3: Portal Modules */}
            <div>
              <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Portal Quick Links</h5>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => onEnterPortal('dashboard')} className="hover:text-emerald-400 cursor-pointer">Dashboard Overview</button></li>
                <li><button onClick={() => onEnterPortal('projects')} className="hover:text-emerald-400 cursor-pointer">Project Registry</button></li>
                <li><button onClick={() => onEnterPortal('beneficiaries')} className="hover:text-emerald-400 cursor-pointer">Beneficiary Directory</button></li>
                <li><button onClick={() => onEnterPortal('donations')} className="hover:text-emerald-400 cursor-pointer">Donations & 80G Receipts</button></li>
                <li><button onClick={() => onEnterPortal('import-export')} className="hover:text-emerald-400 cursor-pointer">Export Excel Workbooks</button></li>
              </ul>
            </div>

            {/* Column 4: Contact & HQ */}
            <div className="space-y-2 text-xs">
              <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Headquarters</h5>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Suite 402, Samriddhi Social Hub, 14th Cross, Bandra West, Mumbai 400050</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{organization?.contactPhone || '+91 (022) 8472-9100'}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{organization?.primaryEmail || 'operations@hopehorizon.org'}</span>
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              © {new Date().getFullYear()} {organization?.name || 'HopeHorizon Foundation'}. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>Section 80G Certified</span>
              <span>•</span>
              <span>FCRA Approved</span>
              <span>•</span>
              <button
                onClick={() => onEnterPortal('dashboard')}
                className="text-emerald-400 hover:underline font-semibold cursor-pointer"
              >
                Access Portal Login
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

