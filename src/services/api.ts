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
  User
} from '../types';
import { fallbackData } from '../data/fallbackData';

const API_BASE = '/api';
const LOCAL_STORAGE_KEY = 'ngo_dashboard_local_state';

function getLocalState(): any {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  return JSON.parse(JSON.stringify(fallbackData));
}

function saveLocalState(state: any) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // ignore
  }
}

function getHeaders(user?: User | null): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (user) {
    headers['x-user'] = JSON.stringify({
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email
    });
  }
  return headers;
}

export const apiService = {
  async fetchAllData(): Promise<{
    organization: Organization;
    projects: Project[];
    beneficiaries: Beneficiary[];
    staff: StaffMember[];
    donations: Donation[];
    expenses: Expense[];
    events: EventItem[];
    inventory: InventoryItem[];
    tasks: TaskItem[];
    auditLogs: AuditLog[];
    users: User[];
  }> {
    try {
      const res = await fetch(`${API_BASE}/all`);
      if (!res.ok) throw new Error('API server returned error');
      return await res.json();
    } catch {
      return getLocalState();
    }
  },

  async resetData(): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${API_BASE}/reset`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to reset database');
      return await res.json();
    } catch {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      return { success: true, message: 'Reset to demo' };
    }
  },

  // Organization
  async updateOrganization(data: Partial<Organization>, user?: User): Promise<Organization> {
    try {
      const res = await fetch(`${API_BASE}/organization`, {
        method: 'PUT',
        headers: getHeaders(user),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update organization');
      return await res.json();
    } catch {
      const state = getLocalState();
      state.organization = { ...state.organization, ...data };
      saveLocalState(state);
      return state.organization;
    }
  },

  // Projects
  async createProject(data: Partial<Project>, user?: User): Promise<Project> {
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: getHeaders(user),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create project');
      return await res.json();
    } catch {
      const state = getLocalState();
      const newProj = {
        id: `PRJ-${Date.now()}`,
        name: data.name || 'New Project',
        category: data.category || 'Education',
        status: data.status || 'Planning',
        budget: Number(data.budget) || 0,
        spent: Number(data.spent) || 0,
        startDate: data.startDate || new Date().toISOString().split('T')[0],
        endDate: data.endDate || new Date().toISOString().split('T')[0],
        location: data.location || 'Maharashtra',
        manager: data.manager || 'Dr. Aarti Deshmukh',
        donorPartner: data.donorPartner || 'Global Giving',
        beneficiaryCount: Number(data.beneficiaryCount) || 0,
        milestones: data.milestones || []
      } as Project;
      state.projects.unshift(newProj);
      saveLocalState(state);
      return newProj;
    }
  },

  async updateProject(id: string, data: Partial<Project>, user?: User): Promise<Project> {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'PUT',
        headers: getHeaders(user),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update project');
      return await res.json();
    } catch {
      const state = getLocalState();
      const idx = state.projects.findIndex((p: any) => p.id === id);
      if (idx !== -1) {
        state.projects[idx] = { ...state.projects[idx], ...data };
        saveLocalState(state);
        return state.projects[idx];
      }
      return data as Project;
    }
  },

  async deleteProject(id: string, user?: User): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'DELETE',
        headers: getHeaders(user),
      });
      if (!res.ok) throw new Error('Failed to delete project');
      return true;
    } catch {
      const state = getLocalState();
      state.projects = state.projects.filter((p: any) => p.id !== id);
      saveLocalState(state);
      return true;
    }
  },

  // Beneficiaries
  async createBeneficiary(data: Partial<Beneficiary>, user?: User): Promise<Beneficiary> {
    try {
      const res = await fetch(`${API_BASE}/beneficiaries`, {
        method: 'POST',
        headers: getHeaders(user),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to register beneficiary');
      return await res.json();
    } catch {
      const state = getLocalState();
      const newBen = {
        id: `BEN-${Date.now()}`,
        name: data.name || '',
        age: Number(data.age) || 30,
        gender: data.gender || 'Female',
        contactPhone: data.contactPhone || '',
        location: data.location || '',
        enrolledDate: data.enrolledDate || new Date().toISOString().split('T')[0],
        category: data.category || 'Education',
        status: data.status || 'Active',
        assignedProject: data.assignedProject || '',
        servicesReceived: data.servicesReceived || []
      } as Beneficiary;
      state.beneficiaries.unshift(newBen);
      saveLocalState(state);
      return newBen;
    }
  },

  async updateBeneficiary(id: string, data: Partial<Beneficiary>, user?: User): Promise<Beneficiary> {
    try {
      const res = await fetch(`${API_BASE}/beneficiaries/${id}`, {
        method: 'PUT',
        headers: getHeaders(user),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update beneficiary');
      return await res.json();
    } catch {
      const state = getLocalState();
      const idx = state.beneficiaries.findIndex((b: any) => b.id === id);
      if (idx !== -1) {
        state.beneficiaries[idx] = { ...state.beneficiaries[idx], ...data };
        saveLocalState(state);
        return state.beneficiaries[idx];
      }
      return data as Beneficiary;
    }
  },

  async deleteBeneficiary(id: string, user?: User): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/beneficiaries/${id}`, {
        method: 'DELETE',
        headers: getHeaders(user),
      });
      if (!res.ok) throw new Error('Failed to delete beneficiary');
      return true;
    } catch {
      const state = getLocalState();
      state.beneficiaries = state.beneficiaries.filter((b: any) => b.id !== id);
      saveLocalState(state);
      return true;
    }
  },

  // Staff
  async createStaff(data: Partial<StaffMember>, user?: User): Promise<StaffMember> {
    try {
      const res = await fetch(`${API_BASE}/staff`, {
        method: 'POST',
        headers: getHeaders(user),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to add staff member');
      return await res.json();
    } catch {
      const state = getLocalState();
      const newStaff = {
        id: `STF-${Date.now()}`,
        name: data.name || '',
        role: data.role || 'Staff',
        title: data.title || '',
        department: data.department || '',
        email: data.email || '',
        phone: data.phone || '',
        joinDate: data.joinDate || new Date().toISOString().split('T')[0],
        status: data.status || 'Active',
        assignedProjects: data.assignedProjects || [],
        skills: data.skills || [],
        totalVolunteerHours: Number(data.totalVolunteerHours) || 0
      } as StaffMember;
      state.staff.unshift(newStaff);
      saveLocalState(state);
      return newStaff;
    }
  },

  async updateStaff(id: string, data: Partial<StaffMember>, user?: User): Promise<StaffMember> {
    try {
      const res = await fetch(`${API_BASE}/staff/${id}`, {
        method: 'PUT',
        headers: getHeaders(user),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update staff member');
      return await res.json();
    } catch {
      const state = getLocalState();
      const idx = state.staff.findIndex((s: any) => s.id === id);
      if (idx !== -1) {
        state.staff[idx] = { ...state.staff[idx], ...data };
        saveLocalState(state);
        return state.staff[idx];
      }
      return data as StaffMember;
    }
  },

  async deleteStaff(id: string, user?: User): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/staff/${id}`, {
        method: 'DELETE',
        headers: getHeaders(user),
      });
      if (!res.ok) throw new Error('Failed to remove staff member');
      return true;
    } catch {
      const state = getLocalState();
      state.staff = state.staff.filter((s: any) => s.id !== id);
      saveLocalState(state);
      return true;
    }
  },

  // Donations
  async createDonation(data: Partial<Donation>, user?: User): Promise<Donation> {
    try {
      const res = await fetch(`${API_BASE}/donations`, {
        method: 'POST',
        headers: getHeaders(user),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to record donation');
      return await res.json();
    } catch {
      const state = getLocalState();
      const newDon = {
        id: `DON-${Date.now()}`,
        donorName: data.donorName || '',
        donorType: data.donorType || 'Individual',
        email: data.email || '',
        phone: data.phone || '',
        amount: Number(data.amount) || 0,
        currency: data.currency || 'USD',
        date: data.date || new Date().toISOString().split('T')[0],
        paymentMethod: data.paymentMethod || 'Bank Transfer',
        allocatedProject: data.allocatedProject || '',
        receiptNumber: data.receiptNumber || `REC-${Date.now()}`,
        taxExemptionClaimed: !!data.taxExemptionClaimed,
        panNumber: data.panNumber || ''
      } as Donation;
      state.donations.unshift(newDon);
      saveLocalState(state);
      return newDon;
    }
  },

  async updateDonation(id: string, data: Partial<Donation>, user?: User): Promise<Donation> {
    try {
      const res = await fetch(`${API_BASE}/donations/${id}`, {
        method: 'PUT',
        headers: getHeaders(user),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update donation');
      return await res.json();
    } catch {
      const state = getLocalState();
      const idx = state.donations.findIndex((d: any) => d.id === id);
      if (idx !== -1) {
        state.donations[idx] = { ...state.donations[idx], ...data };
        saveLocalState(state);
        return state.donations[idx];
      }
      return data as Donation;
    }
  },

  async deleteDonation(id: string, user?: User): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/donations/${id}`, {
        method: 'DELETE',
        headers: getHeaders(user),
      });
      if (!res.ok) throw new Error('Failed to delete donation');
      return true;
    } catch {
      const state = getLocalState();
      state.donations = state.donations.filter((d: any) => d.id !== id);
      saveLocalState(state);
      return true;
    }
  },

  // Expenses
  async createExpense(data: Partial<Expense>, user?: User): Promise<Expense> {
    try {
      const res = await fetch(`${API_BASE}/expenses`, {
        method: 'POST',
        headers: getHeaders(user),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to record expense');
      return await res.json();
    } catch {
      const state = getLocalState();
      const newExp = {
        id: `EXP-${Date.now()}`,
        voucherNumber: data.voucherNumber || `VCH-${Date.now()}`,
        category: data.category || 'Operations',
        description: data.description || '',
        amount: Number(data.amount) || 0,
        currency: data.currency || 'USD',
        date: data.date || new Date().toISOString().split('T')[0],
        allocatedProject: data.allocatedProject || '',
        paidTo: data.paidTo || '',
        paymentMethod: data.paymentMethod || 'Bank Transfer',
        status: data.status || 'Pending',
        approvedBy: data.approvedBy || '',
        receiptAttached: !!data.receiptAttached
      } as Expense;
      state.expenses.unshift(newExp);
      saveLocalState(state);
      return newExp;
    }
  },

  async updateExpense(id: string, data: Partial<Expense>, user?: User): Promise<Expense> {
    try {
      const res = await fetch(`${API_BASE}/expenses/${id}`, {
        method: 'PUT',
        headers: getHeaders(user),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update expense');
      return await res.json();
    } catch {
      const state = getLocalState();
      const idx = state.expenses.findIndex((e: any) => e.id === id);
      if (idx !== -1) {
        state.expenses[idx] = { ...state.expenses[idx], ...data };
        saveLocalState(state);
        return state.expenses[idx];
      }
      return data as Expense;
    }
  },

  async approveExpense(id: string, status: 'Approved' | 'Rejected', user?: User): Promise<Expense> {
    try {
      const res = await fetch(`${API_BASE}/expenses/${id}/approve`, {
        method: 'PATCH',
        headers: getHeaders(user),
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update approval status');
      return await res.json();
    } catch {
      const state = getLocalState();
      const idx = state.expenses.findIndex((e: any) => e.id === id);
      if (idx !== -1) {
        state.expenses[idx].status = status;
        state.expenses[idx].approvedBy = user?.name || 'Administrator';
        saveLocalState(state);
        return state.expenses[idx];
      }
      return { id, status } as any;
    }
  },

  async deleteExpense(id: string, user?: User): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/expenses/${id}`, {
        method: 'DELETE',
        headers: getHeaders(user),
      });
      if (!res.ok) throw new Error('Failed to delete expense');
      return true;
    } catch {
      const state = getLocalState();
      state.expenses = state.expenses.filter((e: any) => e.id !== id);
      saveLocalState(state);
      return true;
    }
  },

  // Events
  async createEvent(data: Partial<EventItem>, user?: User): Promise<EventItem> {
    try {
      const res = await fetch(`${API_BASE}/events`, {
        method: 'POST',
        headers: getHeaders(user),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create event');
      return await res.json();
    } catch {
      const state = getLocalState();
      const newEv = {
        id: `EV-${Date.now()}`,
        title: data.title || '',
        category: data.category || 'Awareness',
        date: data.date || new Date().toISOString().split('T')[0],
        location: data.location || '',
        leadCoordinator: data.leadCoordinator || '',
        budget: Number(data.budget) || 0,
        actualSpent: Number(data.actualSpent) || 0,
        attendeesCount: Number(data.attendeesCount) || 0,
        beneficiariesReached: Number(data.beneficiariesReached) || 0,
        status: data.status || 'Planned',
        outcomesSummary: data.outcomesSummary || ''
      } as EventItem;
      state.events.unshift(newEv);
      saveLocalState(state);
      return newEv;
    }
  },

  async updateEvent(id: string, data: Partial<EventItem>, user?: User): Promise<EventItem> {
    try {
      const res = await fetch(`${API_BASE}/events/${id}`, {
        method: 'PUT',
        headers: getHeaders(user),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update event');
      return await res.json();
    } catch {
      const state = getLocalState();
      const idx = state.events.findIndex((e: any) => e.id === id);
      if (idx !== -1) {
        state.events[idx] = { ...state.events[idx], ...data };
        saveLocalState(state);
        return state.events[idx];
      }
      return data as EventItem;
    }
  },

  async deleteEvent(id: string, user?: User): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/events/${id}`, {
        method: 'DELETE',
        headers: getHeaders(user),
      });
      if (!res.ok) throw new Error('Failed to delete event');
      return true;
    } catch {
      const state = getLocalState();
      state.events = state.events.filter((e: any) => e.id !== id);
      saveLocalState(state);
      return true;
    }
  },

  // Inventory
  async createInventory(data: Partial<InventoryItem>, user?: User): Promise<InventoryItem> {
    try {
      const res = await fetch(`${API_BASE}/inventory`, {
        method: 'POST',
        headers: getHeaders(user),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create inventory item');
      return await res.json();
    } catch {
      const state = getLocalState();
      const newInv = {
        id: `INV-${Date.now()}`,
        itemName: data.itemName || '',
        category: data.category || 'Supplies',
        quantity: Number(data.quantity) || 0,
        unit: data.unit || 'units',
        reorderLevel: Number(data.reorderLevel) || 10,
        unitCost: Number(data.unitCost) || 0,
        location: data.location || '',
        donorFunded: data.donorFunded || 'Unrestricted',
        lastRestockedDate: new Date().toISOString().split('T')[0],
        notes: data.notes || ''
      } as InventoryItem;
      state.inventory.unshift(newInv);
      saveLocalState(state);
      return newInv;
    }
  },

  async updateInventory(id: string, data: Partial<InventoryItem>, user?: User): Promise<InventoryItem> {
    try {
      const res = await fetch(`${API_BASE}/inventory/${id}`, {
        method: 'PUT',
        headers: getHeaders(user),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update inventory item');
      return await res.json();
    } catch {
      const state = getLocalState();
      const idx = state.inventory.findIndex((i: any) => i.id === id);
      if (idx !== -1) {
        state.inventory[idx] = { ...state.inventory[idx], ...data };
        saveLocalState(state);
        return state.inventory[idx];
      }
      return data as InventoryItem;
    }
  },

  async logStockMovement(id: string, changeQty: number, reason: string, user?: User): Promise<InventoryItem> {
    try {
      const res = await fetch(`${API_BASE}/inventory/${id}/stock`, {
        method: 'PATCH',
        headers: getHeaders(user),
        body: JSON.stringify({ changeQty, reason }),
      });
      if (!res.ok) throw new Error('Failed to log stock movement');
      return await res.json();
    } catch {
      const state = getLocalState();
      const idx = state.inventory.findIndex((i: any) => i.id === id);
      if (idx !== -1) {
        state.inventory[idx].quantity = Math.max(0, state.inventory[idx].quantity + changeQty);
        saveLocalState(state);
        return state.inventory[idx];
      }
      return { id, quantity: 0 } as any;
    }
  },

  async deleteInventory(id: string, user?: User): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/inventory/${id}`, {
        method: 'DELETE',
        headers: getHeaders(user),
      });
      if (!res.ok) throw new Error('Failed to delete inventory item');
      return true;
    } catch {
      const state = getLocalState();
      state.inventory = state.inventory.filter((i: any) => i.id !== id);
      saveLocalState(state);
      return true;
    }
  },

  // Tasks
  async createTask(data: Partial<TaskItem>, user?: User): Promise<TaskItem> {
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: getHeaders(user),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create task');
      return await res.json();
    } catch {
      const state = getLocalState();
      const newTask = {
        id: `TSK-${Date.now()}`,
        title: data.title || '',
        description: data.description || '',
        status: data.status || 'Pending',
        priority: data.priority || 'Medium',
        assignedTo: data.assignedTo || '',
        associatedProject: data.associatedProject || '',
        dueDate: data.dueDate || new Date().toISOString().split('T')[0],
        createdDate: new Date().toISOString().split('T')[0]
      } as TaskItem;
      state.tasks.unshift(newTask);
      saveLocalState(state);
      return newTask;
    }
  },

  async updateTask(id: string, data: Partial<TaskItem>, user?: User): Promise<TaskItem> {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: getHeaders(user),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update task');
      return await res.json();
    } catch {
      const state = getLocalState();
      const idx = state.tasks.findIndex((t: any) => t.id === id);
      if (idx !== -1) {
        state.tasks[idx] = { ...state.tasks[idx], ...data };
        saveLocalState(state);
        return state.tasks[idx];
      }
      return data as TaskItem;
    }
  },

  async deleteTask(id: string, user?: User): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE',
        headers: getHeaders(user),
      });
      if (!res.ok) throw new Error('Failed to delete task');
      return true;
    } catch {
      const state = getLocalState();
      state.tasks = state.tasks.filter((t: any) => t.id !== id);
      saveLocalState(state);
      return true;
    }
  },

  // Bulk Import
  async bulkImport(moduleName: string, items: any[], user?: User): Promise<{ imported: number; skipped: number; errors: any[] }> {
    try {
      const res = await fetch(`${API_BASE}/import`, {
        method: 'POST',
        headers: getHeaders(user),
        body: JSON.stringify({ moduleName, items }),
      });
      if (!res.ok) throw new Error('Failed to complete bulk import');
      return await res.json();
    } catch {
      const state = getLocalState();
      if (Array.isArray(state[moduleName])) {
        state[moduleName] = [...items, ...state[moduleName]];
        saveLocalState(state);
      }
      return { imported: items.length, skipped: 0, errors: [] };
    }
  }
};
