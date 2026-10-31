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

const API_BASE = '/api';

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
    const res = await fetch(`${API_BASE}/all`);
    if (!res.ok) throw new Error('Failed to fetch full application state');
    return res.json();
  },

  async resetData(): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/reset`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset database');
    return res.json();
  },

  // Organization
  async updateOrganization(data: Partial<Organization>, user?: User): Promise<Organization> {
    const res = await fetch(`${API_BASE}/organization`, {
      method: 'PUT',
      headers: getHeaders(user),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update organization');
    return res.json();
  },

  // Projects
  async createProject(data: Partial<Project>, user?: User): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: getHeaders(user),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
  },

  async updateProject(id: string, data: Partial<Project>, user?: User): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: getHeaders(user),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update project');
    return res.json();
  },

  async deleteProject(id: string, user?: User): Promise<boolean> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: getHeaders(user),
    });
    if (!res.ok) throw new Error('Failed to delete project');
    return true;
  },

  // Beneficiaries
  async createBeneficiary(data: Partial<Beneficiary>, user?: User): Promise<Beneficiary> {
    const res = await fetch(`${API_BASE}/beneficiaries`, {
      method: 'POST',
      headers: getHeaders(user),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to register beneficiary');
    return res.json();
  },

  async updateBeneficiary(id: string, data: Partial<Beneficiary>, user?: User): Promise<Beneficiary> {
    const res = await fetch(`${API_BASE}/beneficiaries/${id}`, {
      method: 'PUT',
      headers: getHeaders(user),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update beneficiary');
    return res.json();
  },

  async deleteBeneficiary(id: string, user?: User): Promise<boolean> {
    const res = await fetch(`${API_BASE}/beneficiaries/${id}`, {
      method: 'DELETE',
      headers: getHeaders(user),
    });
    if (!res.ok) throw new Error('Failed to delete beneficiary');
    return true;
  },

  // Staff
  async createStaff(data: Partial<StaffMember>, user?: User): Promise<StaffMember> {
    const res = await fetch(`${API_BASE}/staff`, {
      method: 'POST',
      headers: getHeaders(user),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add staff member');
    return res.json();
  },

  async updateStaff(id: string, data: Partial<StaffMember>, user?: User): Promise<StaffMember> {
    const res = await fetch(`${API_BASE}/staff/${id}`, {
      method: 'PUT',
      headers: getHeaders(user),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update staff member');
    return res.json();
  },

  async deleteStaff(id: string, user?: User): Promise<boolean> {
    const res = await fetch(`${API_BASE}/staff/${id}`, {
      method: 'DELETE',
      headers: getHeaders(user),
    });
    if (!res.ok) throw new Error('Failed to remove staff member');
    return true;
  },

  // Donations
  async createDonation(data: Partial<Donation>, user?: User): Promise<Donation> {
    const res = await fetch(`${API_BASE}/donations`, {
      method: 'POST',
      headers: getHeaders(user),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to record donation');
    return res.json();
  },

  async updateDonation(id: string, data: Partial<Donation>, user?: User): Promise<Donation> {
    const res = await fetch(`${API_BASE}/donations/${id}`, {
      method: 'PUT',
      headers: getHeaders(user),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update donation');
    return res.json();
  },

  async deleteDonation(id: string, user?: User): Promise<boolean> {
    const res = await fetch(`${API_BASE}/donations/${id}`, {
      method: 'DELETE',
      headers: getHeaders(user),
    });
    if (!res.ok) throw new Error('Failed to delete donation');
    return true;
  },

  // Expenses
  async createExpense(data: Partial<Expense>, user?: User): Promise<Expense> {
    const res = await fetch(`${API_BASE}/expenses`, {
      method: 'POST',
      headers: getHeaders(user),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to record expense');
    return res.json();
  },

  async updateExpense(id: string, data: Partial<Expense>, user?: User): Promise<Expense> {
    const res = await fetch(`${API_BASE}/expenses/${id}`, {
      method: 'PUT',
      headers: getHeaders(user),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update expense');
    return res.json();
  },

  async approveExpense(id: string, status: 'Approved' | 'Rejected', user?: User): Promise<Expense> {
    const res = await fetch(`${API_BASE}/expenses/${id}/approve`, {
      method: 'PATCH',
      headers: getHeaders(user),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update approval status');
    return res.json();
  },

  async deleteExpense(id: string, user?: User): Promise<boolean> {
    const res = await fetch(`${API_BASE}/expenses/${id}`, {
      method: 'DELETE',
      headers: getHeaders(user),
    });
    if (!res.ok) throw new Error('Failed to delete expense');
    return true;
  },

  // Events
  async createEvent(data: Partial<EventItem>, user?: User): Promise<EventItem> {
    const res = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: getHeaders(user),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create event');
    return res.json();
  },

  async updateEvent(id: string, data: Partial<EventItem>, user?: User): Promise<EventItem> {
    const res = await fetch(`${API_BASE}/events/${id}`, {
      method: 'PUT',
      headers: getHeaders(user),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update event');
    return res.json();
  },

  async deleteEvent(id: string, user?: User): Promise<boolean> {
    const res = await fetch(`${API_BASE}/events/${id}`, {
      method: 'DELETE',
      headers: getHeaders(user),
    });
    if (!res.ok) throw new Error('Failed to delete event');
    return true;
  },

  // Inventory
  async createInventory(data: Partial<InventoryItem>, user?: User): Promise<InventoryItem> {
    const res = await fetch(`${API_BASE}/inventory`, {
      method: 'POST',
      headers: getHeaders(user),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create inventory item');
    return res.json();
  },

  async updateInventory(id: string, data: Partial<InventoryItem>, user?: User): Promise<InventoryItem> {
    const res = await fetch(`${API_BASE}/inventory/${id}`, {
      method: 'PUT',
      headers: getHeaders(user),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update inventory item');
    return res.json();
  },

  async logStockMovement(id: string, changeQty: number, reason: string, user?: User): Promise<InventoryItem> {
    const res = await fetch(`${API_BASE}/inventory/${id}/stock`, {
      method: 'PATCH',
      headers: getHeaders(user),
      body: JSON.stringify({ changeQty, reason }),
    });
    if (!res.ok) throw new Error('Failed to log stock movement');
    return res.json();
  },

  async deleteInventory(id: string, user?: User): Promise<boolean> {
    const res = await fetch(`${API_BASE}/inventory/${id}`, {
      method: 'DELETE',
      headers: getHeaders(user),
    });
    if (!res.ok) throw new Error('Failed to delete inventory item');
    return true;
  },

  // Tasks
  async createTask(data: Partial<TaskItem>, user?: User): Promise<TaskItem> {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: getHeaders(user),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create task');
    return res.json();
  },

  async updateTask(id: string, data: Partial<TaskItem>, user?: User): Promise<TaskItem> {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: getHeaders(user),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update task');
    return res.json();
  },

  async deleteTask(id: string, user?: User): Promise<boolean> {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
      headers: getHeaders(user),
    });
    if (!res.ok) throw new Error('Failed to delete task');
    return true;
  },

  // Bulk Import
  async bulkImport(moduleName: string, items: any[], user?: User): Promise<{ imported: number; skipped: number; errors: any[] }> {
    const res = await fetch(`${API_BASE}/import`, {
      method: 'POST',
      headers: getHeaders(user),
      body: JSON.stringify({ moduleName, items }),
    });
    if (!res.ok) throw new Error('Failed to complete bulk import');
    return res.json();
  }
};
