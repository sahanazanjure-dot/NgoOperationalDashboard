import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Organization,
  Project,
  Beneficiary,
  StaffMember,
  Donation,
  Expense,
  EventItem,
  InventoryItem,
  TaskItem,
  AuditLog,
  User,
  SmartAlert
} from '../types';
import { apiService } from '../services/api';
import { fallbackData } from '../data/fallbackData';
import confetti from 'canvas-confetti';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface AppContextType {
  // Current user & Auth
  currentUser: User;
  switchUserRole: (role: User['role']) => void;
  availableUsers: User[];
  
  // Data entities
  organization: Organization | null;
  projects: Project[];
  beneficiaries: Beneficiary[];
  staff: StaffMember[];
  donations: Donation[];
  expenses: Expense[];
  events: EventItem[];
  inventory: InventoryItem[];
  tasks: TaskItem[];
  auditLogs: AuditLog[];
  
  // Loading & sync
  isLoading: boolean;
  refreshData: () => Promise<void>;
  resetToDemo: () => Promise<void>;

  // Global filters
  dateRange: 'all' | 'month' | 'quarter' | 'year';
  setDateRange: (range: 'all' | 'month' | 'quarter' | 'year') => void;
  selectedProjectFilter: string;
  setSelectedProjectFilter: (projId: string) => void;
  selectedLocationFilter: string;
  setSelectedLocationFilter: (loc: string) => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;

  // Alerts & Data Quality
  smartAlerts: SmartAlert[];
  
  // Notifications
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // CRUD actions
  updateOrg: (data: Partial<Organization>) => Promise<void>;
  addProject: (data: Partial<Project>) => Promise<Project>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  addBeneficiary: (data: Partial<Beneficiary>) => Promise<Beneficiary>;
  updateBeneficiary: (id: string, data: Partial<Beneficiary>) => Promise<void>;
  deleteBeneficiary: (id: string) => Promise<void>;

  addStaff: (data: Partial<StaffMember>) => Promise<StaffMember>;
  updateStaff: (id: string, data: Partial<StaffMember>) => Promise<void>;
  deleteStaff: (id: string) => Promise<void>;

  addDonation: (data: Partial<Donation>) => Promise<Donation>;
  updateDonation: (id: string, data: Partial<Donation>) => Promise<void>;
  deleteDonation: (id: string) => Promise<void>;

  addExpense: (data: Partial<Expense>) => Promise<Expense>;
  updateExpense: (id: string, data: Partial<Expense>) => Promise<void>;
  approveExpense: (id: string, status: 'Approved' | 'Rejected') => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;

  addEvent: (data: Partial<EventItem>) => Promise<EventItem>;
  updateEvent: (id: string, data: Partial<EventItem>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;

  addInventory: (data: Partial<InventoryItem>) => Promise<InventoryItem>;
  updateInventory: (id: string, data: Partial<InventoryItem>) => Promise<void>;
  logStockMovement: (id: string, changeQty: number, reason: string) => Promise<void>;
  deleteInventory: (id: string) => Promise<void>;

  addTask: (data: Partial<TaskItem>) => Promise<TaskItem>;
  updateTask: (id: string, data: Partial<TaskItem>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>({
    id: "USR-001",
    name: "Dr. Aarti Deshmukh",
    email: "admin@hopehorizon.org",
    role: "Administrator",
    title: "Executive Director & Program Head",
    avatar: "AD",
    phone: "+91 98201 12345"
  });

  const [availableUsers, setAvailableUsers] = useState<User[]>([
    { id: "USR-001", name: "Dr. Aarti Deshmukh", email: "admin@hopehorizon.org", role: "Administrator", title: "Executive Director & Program Head", avatar: "AD", phone: "+91 98201 12345" },
    { id: "USR-002", name: "Pooja Hegde", email: "finance@hopehorizon.org", role: "Finance Manager", title: "Chief Financial & Grants Officer", avatar: "PH", phone: "+91 98202 23456" },
    { id: "USR-003", name: "Kavita Sen", email: "pm@hopehorizon.org", role: "Project Manager", title: "Senior Project Lead", avatar: "KS", phone: "+91 98203 34567" },
    { id: "USR-004", name: "Farhan Qureshi", email: "staff@hopehorizon.org", role: "Staff", title: "Field Operations & Logistics Officer", avatar: "FQ", phone: "+91 99204 77123" }
  ]);

  const [organization, setOrganization] = useState<Organization>(fallbackData.organization as any);
  const [projects, setProjects] = useState<Project[]>(fallbackData.projects as any);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(fallbackData.beneficiaries as any);
  const [staff, setStaff] = useState<StaffMember[]>(fallbackData.staff as any);
  const [donations, setDonations] = useState<Donation[]>(fallbackData.donations as any);
  const [expenses, setExpenses] = useState<Expense[]>(fallbackData.expenses as any);
  const [events, setEvents] = useState<EventItem[]>(fallbackData.events as any);
  const [inventory, setInventory] = useState<InventoryItem[]>(fallbackData.inventory as any);
  const [tasks, setTasks] = useState<TaskItem[]>(fallbackData.tasks as any);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(fallbackData.auditLogs as any);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Global filters
  const [dateRange, setDateRange] = useState<'all' | 'month' | 'quarter' | 'year'>('all');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>('all');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>('all');
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const switchUserRole = (role: User['role']) => {
    const matched = availableUsers.find(u => u.role === role);
    if (matched) {
      setCurrentUser(matched);
      addToast({
        type: 'info',
        title: 'Switched Role',
        message: `Active session role: ${role} (${matched.name})`
      });
    }
  };

  const refreshData = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.fetchAllData();
      if (data) {
        if (data.organization) setOrganization(data.organization);
        if (Array.isArray(data.projects)) setProjects(data.projects);
        if (Array.isArray(data.beneficiaries)) setBeneficiaries(data.beneficiaries);
        if (Array.isArray(data.staff)) setStaff(data.staff);
        if (Array.isArray(data.donations)) setDonations(data.donations);
        if (Array.isArray(data.expenses)) setExpenses(data.expenses);
        if (Array.isArray(data.events)) setEvents(data.events);
        if (Array.isArray(data.inventory)) setInventory(data.inventory);
        if (Array.isArray(data.tasks)) setTasks(data.tasks);
        if (Array.isArray(data.auditLogs)) setAuditLogs(data.auditLogs);
        if (Array.isArray(data.users) && data.users.length > 0) {
          setAvailableUsers(data.users);
        }
      }
    } catch (err: any) {
      console.warn('Backend unavailable, operating seamlessly in static cached mode:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDemo = async () => {
    try {
      await apiService.resetData();
      await refreshData();
      addToast({
        type: 'success',
        title: 'Database Reset',
        message: 'All modules restored to initial verified demo state.'
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Reset Failed',
        message: err.message
      });
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Rule-based Smart Alerts
  const smartAlerts = useMemo<SmartAlert[]>(() => {
    const alerts: SmartAlert[] = [];
    const invList = inventory || [];
    const projList = projects || [];
    const expList = expenses || [];
    const taskList = tasks || [];

    // 1. Low Inventory Alerts
    invList.forEach(item => {
      if (item && item.quantity <= item.reorderLevel) {
        alerts.push({
          id: `alert-inv-${item.id}`,
          type: item.quantity === 0 ? 'danger' : 'warning',
          title: `Low Stock: ${item.itemName}`,
          description: `Remaining quantity is ${item.quantity} ${item.unit} (reorder point: ${item.reorderLevel}). Located at ${item.location}.`,
          module: 'Inventory',
          timestamp: 'Live Monitor',
          actionText: 'Restock Item',
          actionRoute: 'inventory'
        });
      }
    });

    // 2. Delayed or High Utilization Projects
    projList.forEach(p => {
      if (!p) return;
      if (p.status === 'Delayed') {
        alerts.push({
          id: `alert-prj-${p.id}`,
          type: 'danger',
          title: `Delayed Project: ${p.name}`,
          description: `Project is behind schedule. Milestone completion required before ${p.endDate}. Manager: ${p.manager}.`,
          module: 'Projects',
          timestamp: 'Schedule Alert',
          actionText: 'Review Milestones',
          actionRoute: 'projects'
        });
      } else if (p.spent > p.budget) {
        alerts.push({
          id: `alert-budget-${p.id}`,
          type: 'warning',
          title: `Budget Overrun: ${p.name}`,
          description: `Expenditure ($${p.spent.toLocaleString()}) exceeds allocated budget ($${p.budget.toLocaleString()}).`,
          module: 'Projects',
          timestamp: 'Financial Alert',
          actionText: 'Inspect Budget',
          actionRoute: 'expenses'
        });
      }
    });

    // 3. Pending Expenses needing approval
    const pendingExpenses = expList.filter(e => e && e.status === 'Pending');
    if (pendingExpenses.length > 0) {
      const pendingTotal = pendingExpenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
      alerts.push({
        id: 'alert-exp-pending',
        type: 'warning',
        title: `${pendingExpenses.length} Expenses Awaiting Approval`,
        description: `Total pending disbursements: $${pendingTotal.toLocaleString()}. Review and authorize vouchers.`,
        module: 'Expenses',
        timestamp: 'Audit Required',
        actionText: 'Review Vouchers',
        actionRoute: 'expenses'
      });
    }

    // 4. Expiring Compliance Documents
    organization?.documents?.forEach(doc => {
      if (doc && doc.status === 'Expiring Soon') {
        alerts.push({
          id: `alert-doc-${doc.id}`,
          type: 'warning',
          title: `Compliance Expiry: ${doc.title}`,
          description: `${doc.title} (#${doc.documentNumber}) is due for regulatory renewal on ${doc.expiryDate}.`,
          module: 'Organization',
          timestamp: 'Regulatory Due',
          actionText: 'View Document',
          actionRoute: 'organization'
        });
      }
    });

    // 5. Overdue / Urgent Tasks
    const urgentTasks = taskList.filter(t => t && t.priority === 'Urgent' && t.status !== 'Completed');
    if (urgentTasks.length > 0) {
      alerts.push({
        id: 'alert-urgent-tasks',
        type: 'danger',
        title: `${urgentTasks.length} Urgent Priority Tasks Pending`,
        description: `Immediate team coordination needed: ${urgentTasks.map(t => t.title).slice(0, 2).join(', ')}...`,
        module: 'Tasks',
        timestamp: 'High Priority',
        actionText: 'Open Task Board',
        actionRoute: 'tasks'
      });
    }

    return alerts;
  }, [inventory, projects, expenses, organization, tasks]);

  // CRUD Implementations
  const updateOrg = async (data: Partial<Organization>) => {
    const updated = await apiService.updateOrganization(data, currentUser);
    setOrganization(updated);
    addToast({ type: 'success', title: 'Organization Updated', message: 'NGO details and settings saved successfully.' });
  };

  const addProject = async (data: Partial<Project>) => {
    const created = await apiService.createProject(data, currentUser);
    setProjects(prev => [created, ...prev]);
    addToast({ type: 'success', title: 'Project Created', message: `${created.name} initiated with $${created.budget} budget.` });
    return created;
  };

  const updateProject = async (id: string, data: Partial<Project>) => {
    const updated = await apiService.updateProject(id, data, currentUser);
    setProjects(prev => prev.map(p => p.id === id ? updated : p));
    addToast({ type: 'success', title: 'Project Updated', message: `${updated.name} updated successfully.` });
  };

  const deleteProject = async (id: string) => {
    await apiService.deleteProject(id, currentUser);
    setProjects(prev => prev.filter(p => p.id !== id));
    addToast({ type: 'info', title: 'Project Removed', message: 'Project record deleted from system.' });
  };

  const addBeneficiary = async (data: Partial<Beneficiary>) => {
    const created = await apiService.createBeneficiary(data, currentUser);
    setBeneficiaries(prev => [created, ...prev]);
    addToast({ type: 'success', title: 'Beneficiary Registered', message: `${created.name} (${created.id}) added to registry.` });
    return created;
  };

  const updateBeneficiary = async (id: string, data: Partial<Beneficiary>) => {
    const updated = await apiService.updateBeneficiary(id, data, currentUser);
    setBeneficiaries(prev => prev.map(b => b.id === id ? updated : b));
    addToast({ type: 'success', title: 'Beneficiary Record Updated', message: `Details for ${updated.name} saved.` });
  };

  const deleteBeneficiary = async (id: string) => {
    await apiService.deleteBeneficiary(id, currentUser);
    setBeneficiaries(prev => prev.filter(b => b.id !== id));
    addToast({ type: 'info', title: 'Beneficiary Archived', message: 'Record removed from active directory.' });
  };

  const addStaff = async (data: Partial<StaffMember>) => {
    const created = await apiService.createStaff(data, currentUser);
    setStaff(prev => [created, ...prev]);
    addToast({ type: 'success', title: 'Team Member Added', message: `${created.name} registered as ${created.role}.` });
    return created;
  };

  const updateStaff = async (id: string, data: Partial<StaffMember>) => {
    const updated = await apiService.updateStaff(id, data, currentUser);
    setStaff(prev => prev.map(s => s.id === id ? updated : s));
    addToast({ type: 'success', title: 'Staff Profile Updated', message: `${updated.name}'s records updated.` });
  };

  const deleteStaff = async (id: string) => {
    await apiService.deleteStaff(id, currentUser);
    setStaff(prev => prev.filter(s => s.id !== id));
    addToast({ type: 'info', title: 'Staff Member Removed', message: 'Profile removed from directory.' });
  };

  const addDonation = async (data: Partial<Donation>) => {
    const created = await apiService.createDonation(data, currentUser);
    setDonations(prev => [created, ...prev]);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    addToast({ type: 'success', title: 'Donation Recorded', message: `Donation of $${created.amount} received from ${created.donorName}. Receipt: ${created.receiptNumber}` });
    return created;
  };

  const updateDonation = async (id: string, data: Partial<Donation>) => {
    const updated = await apiService.updateDonation(id, data, currentUser);
    setDonations(prev => prev.map(d => d.id === id ? updated : d));
    addToast({ type: 'success', title: 'Donation Record Updated', message: `Receipt ${updated.receiptNumber} updated.` });
  };

  const deleteDonation = async (id: string) => {
    await apiService.deleteDonation(id, currentUser);
    setDonations(prev => prev.filter(d => d.id !== id));
    addToast({ type: 'info', title: 'Donation Deleted', message: 'Transaction voucher removed.' });
  };

  const addExpense = async (data: Partial<Expense>) => {
    const created = await apiService.createExpense(data, currentUser);
    setExpenses(prev => [created, ...prev]);
    addToast({ type: 'success', title: 'Expense Recorded', message: `Voucher #${created.id} for $${created.amount} submitted.` });
    return created;
  };

  const updateExpense = async (id: string, data: Partial<Expense>) => {
    const updated = await apiService.updateExpense(id, data, currentUser);
    setExpenses(prev => prev.map(e => e.id === id ? updated : e));
    addToast({ type: 'success', title: 'Expense Updated', message: `Voucher #${updated.id} updated.` });
  };

  const approveExpense = async (id: string, status: 'Approved' | 'Rejected') => {
    const updated = await apiService.approveExpense(id, status, currentUser);
    setExpenses(prev => prev.map(e => e.id === id ? updated : e));
    // Also refresh projects so project spent counter updates
    const refreshed = await apiService.fetchAllData();
    setProjects(refreshed.projects);
    addToast({
      type: status === 'Approved' ? 'success' : 'warning',
      title: `Expense ${status}`,
      message: `Voucher #${id} ($${updated.amount}) marked as ${status}.`
    });
  };

  const deleteExpense = async (id: string) => {
    await apiService.deleteExpense(id, currentUser);
    setExpenses(prev => prev.filter(e => e.id !== id));
    addToast({ type: 'info', title: 'Expense Deleted', message: 'Expense record deleted.' });
  };

  const addEvent = async (data: Partial<EventItem>) => {
    const created = await apiService.createEvent(data, currentUser);
    setEvents(prev => [created, ...prev]);
    addToast({ type: 'success', title: 'Event Created', message: `${created.title} scheduled for ${created.date}.` });
    return created;
  };

  const updateEvent = async (id: string, data: Partial<EventItem>) => {
    const updated = await apiService.updateEvent(id, data, currentUser);
    setEvents(prev => prev.map(ev => ev.id === id ? updated : ev));
    addToast({ type: 'success', title: 'Event Updated', message: `${updated.title} updated.` });
  };

  const deleteEvent = async (id: string) => {
    await apiService.deleteEvent(id, currentUser);
    setEvents(prev => prev.filter(ev => ev.id !== id));
    addToast({ type: 'info', title: 'Event Removed', message: 'Event cancelled and removed.' });
  };

  const addInventory = async (data: Partial<InventoryItem>) => {
    const created = await apiService.createInventory(data, currentUser);
    setInventory(prev => [created, ...prev]);
    addToast({ type: 'success', title: 'Inventory Added', message: `${created.itemName} (${created.quantity} ${created.unit}) added.` });
    return created;
  };

  const updateInventory = async (id: string, data: Partial<InventoryItem>) => {
    const updated = await apiService.updateInventory(id, data, currentUser);
    setInventory(prev => prev.map(i => i.id === id ? updated : i));
    addToast({ type: 'success', title: 'Inventory Updated', message: `${updated.itemName} record updated.` });
  };

  const logStockMovement = async (id: string, changeQty: number, reason: string) => {
    const updated = await apiService.logStockMovement(id, changeQty, reason, currentUser);
    setInventory(prev => prev.map(i => i.id === id ? updated : i));
    addToast({
      type: 'info',
      title: 'Stock Updated',
      message: `${changeQty > 0 ? '+' : ''}${changeQty} ${updated.unit} logged for ${updated.itemName}. New balance: ${updated.quantity}`
    });
  };

  const deleteInventory = async (id: string) => {
    await apiService.deleteInventory(id, currentUser);
    setInventory(prev => prev.filter(i => i.id !== id));
    addToast({ type: 'info', title: 'Item Removed', message: 'Inventory item removed from registry.' });
  };

  const addTask = async (data: Partial<TaskItem>) => {
    const created = await apiService.createTask(data, currentUser);
    setTasks(prev => [created, ...prev]);
    addToast({ type: 'success', title: 'Task Created', message: `Task "${created.title}" assigned to ${created.assignee}.` });
    return created;
  };

  const updateTask = async (id: string, data: Partial<TaskItem>) => {
    const updated = await apiService.updateTask(id, data, currentUser);
    setTasks(prev => prev.map(t => t.id === id ? updated : t));
    addToast({ type: 'success', title: 'Task Updated', message: `Task "${updated.title}" updated.` });
  };

  const deleteTask = async (id: string) => {
    await apiService.deleteTask(id, currentUser);
    setTasks(prev => prev.filter(t => t.id !== id));
    addToast({ type: 'info', title: 'Task Deleted', message: 'Task removed.' });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchUserRole,
        availableUsers,
        organization,
        projects,
        beneficiaries,
        staff,
        donations,
        expenses,
        events,
        inventory,
        tasks,
        auditLogs,
        isLoading,
        refreshData,
        resetToDemo,
        dateRange,
        setDateRange,
        selectedProjectFilter,
        setSelectedProjectFilter,
        selectedLocationFilter,
        setSelectedLocationFilter,
        globalSearchQuery,
        setGlobalSearchQuery,
        smartAlerts,
        toasts,
        addToast,
        removeToast,
        updateOrg,
        addProject,
        updateProject,
        deleteProject,
        addBeneficiary,
        updateBeneficiary,
        deleteBeneficiary,
        addStaff,
        updateStaff,
        deleteStaff,
        addDonation,
        updateDonation,
        deleteDonation,
        addExpense,
        updateExpense,
        approveExpense,
        deleteExpense,
        addEvent,
        updateEvent,
        deleteEvent,
        addInventory,
        updateInventory,
        logStockMovement,
        deleteInventory,
        addTask,
        updateTask,
        deleteTask
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
