export type UserRole = 'Administrator' | 'Finance Manager' | 'Project Manager' | 'Staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  avatar: string;
  phone?: string;
}

export interface OrganizationBranch {
  id: string;
  name: string;
  city: string;
  state: string;
  manager: string;
  activeProjects: number;
}

export interface OrganizationDepartment {
  id: string;
  name: string;
  head: string;
  staffCount: number;
}

export interface ComplianceDocument {
  id: string;
  title: string;
  documentNumber: string;
  category: 'Legal' | 'Tax' | 'Compliance' | 'Audit';
  issueDate: string;
  expiryDate: string;
  status: 'Valid' | 'Expiring Soon' | 'Expired';
  issuingAuthority: string;
  verified: boolean;
}

export interface Organization {
  id: string;
  name: string;
  legalName: string;
  registrationNumber: string;
  fcraNumber: string;
  taxExemptionNumber: string;
  darpanId: string;
  foundedYear: number;
  mission: string;
  vision: string;
  primaryEmail: string;
  contactPhone: string;
  emergencyContact: string;
  website: string;
  headquarters: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  branches: OrganizationBranch[];
  departments: OrganizationDepartment[];
  documents: ComplianceDocument[];
  settings: {
    currencySymbol: string;
    currencyCode: string;
    fiscalYearStart: string;
    receiptPrefix: string;
    enableAutoAlerts: boolean;
    privacyLevel: string;
  };
}

export interface ProjectMilestone {
  id: string;
  title: string;
  completed: boolean;
  targetDate: string;
}

export interface Project {
  id: string;
  name: string;
  category: string;
  description: string;
  objectives: string;
  location: string;
  manager: string;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Planning' | 'Delayed' | 'Completed' | 'On Hold';
  beneficiariesCount: number;
  milestones: ProjectMilestone[];
  assignedStaff: string[];
  donorPartners: string[];
}

export interface Beneficiary {
  id: string;
  name: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  contact: string;
  location: string;
  category: string;
  assignedProject: string;
  registrationDate: string;
  assistanceCategory: string;
  status: 'Active' | 'Graduated' | 'Archived';
  servicesReceived: string[];
}

export interface StaffMember {
  id: string;
  name: string;
  type: 'Staff' | 'Volunteer';
  role: string;
  department: string;
  email: string;
  phone: string;
  status: 'Active' | 'On-Leave' | 'Inactive';
  joiningDate: string;
  skills: string[];
  assignedProjects: string[];
  hoursLoggedThisMonth: number;
}

export interface Donation {
  id: string;
  donorName: string;
  donorType: 'Corporate CSR' | 'Foundation' | 'Individual Philanthropist' | 'Individual Donor' | 'Online Portal' | 'Anonymous' | 'Government / Multilateral';
  email: string;
  phone: string;
  amount: number;
  date: string;
  paymentMethod: 'Wire Transfer' | 'Direct Bank Deposit' | 'Bank Transfer' | 'Cheque' | 'UPI / Stripe' | 'Payment Gateway' | 'Cash' | 'Direct Treasury Credit';
  purpose: string;
  projectAllocation: string;
  receiptNumber: string;
  transactionRef: string;
  taxExemptionIssued: boolean;
  status: 'Verified' | 'Pending' | 'Cancelled';
}

export interface Expense {
  id: string;
  project: string;
  category: 'Equipment & Supplies' | 'Supplies' | 'Medical Supplies' | 'Food & Relief' | 'Emergency Shelter' | 'Utilities & Fuel' | 'Honorarium & Training' | 'Training & Travel' | 'Facility & Rent' | 'Education & Skilling' | 'Travel & Fuel' | 'Vehicle Maintenance' | 'Administrative' | 'Miscellaneous';
  amount: number;
  date: string;
  vendor: string;
  paymentMethod: string;
  description: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvedBy: string | null;
  receiptRef: string;
  isDuplicateFlag?: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  type: 'Awareness Campaign' | 'Workshop & Competition' | 'Medical Camp' | 'Disaster Preparedness' | 'Community Outreach' | 'Exhibition & Market' | 'Career Fair' | 'Fundraiser';
  project: string;
  date: string;
  location: string;
  organizer: string;
  participantsCount: number;
  beneficiariesReached: number;
  budget: number;
  spent: number;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  outcomeSummary: string;
}

export interface InventoryItem {
  id: string;
  itemName: string;
  category: string;
  quantity: number;
  unit: string;
  location: string;
  reorderLevel: number;
  purchaseDate: string;
  supplier: string;
  unitCost: number;
  status: 'In Stock' | 'Low Stock' | 'Depleted';
}

export interface TaskItem {
  id: string;
  title: string;
  project: string;
  assignee: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Pending' | 'In Progress' | 'Review' | 'Completed';
  dueDate: string;
  estimatedHours: number;
  description: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'EXPORT' | 'IMPORT';
  module: string;
  recordId: string;
  details: string;
}

export interface SmartAlert {
  id: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  module: string;
  timestamp: string;
  actionText?: string;
  actionRoute?: string;
}
