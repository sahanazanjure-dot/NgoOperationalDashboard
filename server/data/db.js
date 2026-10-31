import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  initialOrganization,
  initialProjects,
  initialBeneficiaries,
  initialStaff,
  initialDonations,
  initialExpenses,
  initialEvents,
  initialInventory,
  initialTasks,
  initialAuditLogs,
  demoUsers
} from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'database.json');

// In-memory cache + file sync
let db = null;

function getFreshData() {
  return {
    organization: JSON.parse(JSON.stringify(initialOrganization)),
    projects: JSON.parse(JSON.stringify(initialProjects)),
    beneficiaries: JSON.parse(JSON.stringify(initialBeneficiaries)),
    staff: JSON.parse(JSON.stringify(initialStaff)),
    donations: JSON.parse(JSON.stringify(initialDonations)),
    expenses: JSON.parse(JSON.stringify(initialExpenses)),
    events: JSON.parse(JSON.stringify(initialEvents)),
    inventory: JSON.parse(JSON.stringify(initialInventory)),
    tasks: JSON.parse(JSON.stringify(initialTasks)),
    auditLogs: JSON.parse(JSON.stringify(initialAuditLogs)),
    users: JSON.parse(JSON.stringify(demoUsers)),
    lastUpdated: new Date().toISOString()
  };
}

function initDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      if (content && content.trim().length > 10) {
        db = JSON.parse(content);
        return;
      }
    }
  } catch (err) {
    console.error('Error reading database file, re-initializing seed data:', err.message);
  }

  db = getFreshData();
  saveDB();
}

function saveDB() {
  try {
    db.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database file:', err.message);
  }
}

// Initialize on module load
initDB();

export const Database = {
  reset() {
    db = getFreshData();
    saveDB();
    return { success: true, message: 'Database reset to initial demo state' };
  },

  getAllData() {
    return db;
  },

  // Audit Log
  logAudit(userName, userRole, action, module, recordId, details) {
    const log = {
      id: `AUD-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      userName: userName || 'System User',
      userRole: userRole || 'Administrator',
      action,
      module,
      recordId: recordId || '-',
      details
    };
    db.auditLogs.unshift(log);
    // Keep max 500 audit logs
    if (db.auditLogs.length > 500) {
      db.auditLogs = db.auditLogs.slice(0, 500);
    }
    saveDB();
    return log;
  },

  getAuditLogs() {
    return db.auditLogs;
  },

  // Organization
  getOrganization() {
    return db.organization;
  },

  updateOrganization(data, user) {
    db.organization = { ...db.organization, ...data };
    this.logAudit(user?.name, user?.role, 'UPDATE', 'Organization', db.organization.id, 'Updated NGO profile and registration settings.');
    saveDB();
    return db.organization;
  },

  // Projects
  getProjects() {
    return db.projects;
  },

  createProject(data, user) {
    const id = data.id || `PRJ-${Math.floor(100 + Math.random() * 900)}`;
    const newProject = {
      ...data,
      id,
      budget: Number(data.budget) || 0,
      spent: Number(data.spent) || 0,
      beneficiariesCount: Number(data.beneficiariesCount) || 0,
      milestones: data.milestones || [],
      assignedStaff: data.assignedStaff || [],
      donorPartners: data.donorPartners || [],
      status: data.status || 'Active'
    };
    db.projects.unshift(newProject);
    this.logAudit(user?.name, user?.role, 'CREATE', 'Projects', id, `Created new project: ${newProject.name}`);
    saveDB();
    return newProject;
  },

  updateProject(id, data, user) {
    const index = db.projects.findIndex(p => p.id === id);
    if (index === -1) return null;
    db.projects[index] = {
      ...db.projects[index],
      ...data,
      id,
      budget: data.budget !== undefined ? Number(data.budget) : db.projects[index].budget,
      spent: data.spent !== undefined ? Number(data.spent) : db.projects[index].spent,
      beneficiariesCount: data.beneficiariesCount !== undefined ? Number(data.beneficiariesCount) : db.projects[index].beneficiariesCount
    };
    this.logAudit(user?.name, user?.role, 'UPDATE', 'Projects', id, `Updated project: ${db.projects[index].name}`);
    saveDB();
    return db.projects[index];
  },

  deleteProject(id, user) {
    const index = db.projects.findIndex(p => p.id === id);
    if (index === -1) return false;
    const deleted = db.projects.splice(index, 1)[0];
    this.logAudit(user?.name, user?.role, 'DELETE', 'Projects', id, `Deleted project: ${deleted.name}`);
    saveDB();
    return true;
  },

  // Beneficiaries
  getBeneficiaries() {
    return db.beneficiaries;
  },

  createBeneficiary(data, user) {
    const id = data.id || `BEN-2024-${String(db.beneficiaries.length + 1).padStart(3, '0')}`;
    const newBen = {
      ...data,
      id,
      age: Number(data.age) || 0,
      status: data.status || 'Active',
      registrationDate: data.registrationDate || new Date().toISOString().split('T')[0],
      servicesReceived: Array.isArray(data.servicesReceived) ? data.servicesReceived : (data.servicesReceived ? [data.servicesReceived] : [])
    };
    db.beneficiaries.unshift(newBen);
    this.logAudit(user?.name, user?.role, 'CREATE', 'Beneficiaries', id, `Registered beneficiary: ${newBen.name}`);
    saveDB();
    return newBen;
  },

  updateBeneficiary(id, data, user) {
    const index = db.beneficiaries.findIndex(b => b.id === id);
    if (index === -1) return null;
    db.beneficiaries[index] = {
      ...db.beneficiaries[index],
      ...data,
      id,
      age: data.age !== undefined ? Number(data.age) : db.beneficiaries[index].age
    };
    this.logAudit(user?.name, user?.role, 'UPDATE', 'Beneficiaries', id, `Updated beneficiary: ${db.beneficiaries[index].name}`);
    saveDB();
    return db.beneficiaries[index];
  },

  deleteBeneficiary(id, user) {
    const index = db.beneficiaries.findIndex(b => b.id === id);
    if (index === -1) return false;
    const deleted = db.beneficiaries.splice(index, 1)[0];
    this.logAudit(user?.name, user?.role, 'DELETE', 'Beneficiaries', id, `Archived/deleted beneficiary: ${deleted.name}`);
    saveDB();
    return true;
  },

  // Staff & Volunteers
  getStaff() {
    return db.staff;
  },

  createStaff(data, user) {
    const isVol = data.type === 'Volunteer';
    const id = data.id || `${isVol ? 'VOL' : 'STF'}-${String(db.staff.length + 1).padStart(3, '0')}`;
    const newStaff = {
      ...data,
      id,
      status: data.status || 'Active',
      hoursLoggedThisMonth: Number(data.hoursLoggedThisMonth) || 0,
      skills: Array.isArray(data.skills) ? data.skills : (data.skills ? data.skills.split(',').map(s => s.trim()) : []),
      assignedProjects: Array.isArray(data.assignedProjects) ? data.assignedProjects : []
    };
    db.staff.unshift(newStaff);
    this.logAudit(user?.name, user?.role, 'CREATE', 'Staff & Volunteers', id, `Added ${newStaff.type}: ${newStaff.name}`);
    saveDB();
    return newStaff;
  },

  updateStaff(id, data, user) {
    const index = db.staff.findIndex(s => s.id === id);
    if (index === -1) return null;
    db.staff[index] = {
      ...db.staff[index],
      ...data,
      id,
      hoursLoggedThisMonth: data.hoursLoggedThisMonth !== undefined ? Number(data.hoursLoggedThisMonth) : db.staff[index].hoursLoggedThisMonth
    };
    this.logAudit(user?.name, user?.role, 'UPDATE', 'Staff & Volunteers', id, `Updated staff profile: ${db.staff[index].name}`);
    saveDB();
    return db.staff[index];
  },

  deleteStaff(id, user) {
    const index = db.staff.findIndex(s => s.id === id);
    if (index === -1) return false;
    const deleted = db.staff.splice(index, 1)[0];
    this.logAudit(user?.name, user?.role, 'DELETE', 'Staff & Volunteers', id, `Removed staff member: ${deleted.name}`);
    saveDB();
    return true;
  },

  // Donations
  getDonations() {
    return db.donations;
  },

  createDonation(data, user) {
    const id = data.id || `DON-2024-${String(db.donations.length + 1).padStart(3, '0')}`;
    const receiptNumber = data.receiptNumber || `HH-REC-2024-${String(db.donations.length + 1).padStart(3, '0')}`;
    const newDonation = {
      ...data,
      id,
      amount: Number(data.amount) || 0,
      receiptNumber,
      date: data.date || new Date().toISOString().split('T')[0],
      status: data.status || 'Verified',
      taxExemptionIssued: data.taxExemptionIssued ?? true
    };
    db.donations.unshift(newDonation);
    this.logAudit(user?.name, user?.role, 'CREATE', 'Donations', id, `Recorded donation $${newDonation.amount} from ${newDonation.donorName} (${receiptNumber})`);
    saveDB();
    return newDonation;
  },

  updateDonation(id, data, user) {
    const index = db.donations.findIndex(d => d.id === id);
    if (index === -1) return null;
    db.donations[index] = {
      ...db.donations[index],
      ...data,
      id,
      amount: data.amount !== undefined ? Number(data.amount) : db.donations[index].amount
    };
    this.logAudit(user?.name, user?.role, 'UPDATE', 'Donations', id, `Updated donation record: ${id}`);
    saveDB();
    return db.donations[index];
  },

  deleteDonation(id, user) {
    const index = db.donations.findIndex(d => d.id === id);
    if (index === -1) return false;
    const deleted = db.donations.splice(index, 1)[0];
    this.logAudit(user?.name, user?.role, 'DELETE', 'Donations', id, `Deleted donation entry: ${id} ($${deleted.amount})`);
    saveDB();
    return true;
  },

  // Expenses
  getExpenses() {
    return db.expenses;
  },

  createExpense(data, user) {
    const id = data.id || `EXP-2024-${String(db.expenses.length + 1).padStart(3, '0')}`;
    const newExp = {
      ...data,
      id,
      amount: Number(data.amount) || 0,
      date: data.date || new Date().toISOString().split('T')[0],
      status: data.status || 'Pending',
      approvedBy: data.status === 'Approved' ? (data.approvedBy || user?.name || 'Administrator') : null,
      isDuplicateFlag: Boolean(data.isDuplicateFlag)
    };

    // Check for duplicate expense (same vendor and amount within 7 days)
    const duplicate = db.expenses.find(e =>
      e.vendor.toLowerCase() === newExp.vendor.toLowerCase() &&
      Math.abs(e.amount - newExp.amount) < 0.01 &&
      e.id !== id
    );
    if (duplicate) {
      newExp.isDuplicateFlag = true;
    }

    db.expenses.unshift(newExp);

    // If approved immediately, adjust project spent
    if (newExp.status === 'Approved' && newExp.project) {
      const proj = db.projects.find(p => p.id === newExp.project);
      if (proj) proj.spent = (proj.spent || 0) + newExp.amount;
    }

    this.logAudit(user?.name, user?.role, 'CREATE', 'Expenses', id, `Created expense voucher $${newExp.amount} for ${newExp.vendor}`);
    saveDB();
    return newExp;
  },

  updateExpense(id, data, user) {
    const index = db.expenses.findIndex(e => e.id === id);
    if (index === -1) return null;
    const old = db.expenses[index];
    db.expenses[index] = {
      ...old,
      ...data,
      id,
      amount: data.amount !== undefined ? Number(data.amount) : old.amount
    };
    this.logAudit(user?.name, user?.role, 'UPDATE', 'Expenses', id, `Updated expense voucher: ${id}`);
    saveDB();
    return db.expenses[index];
  },

  approveExpense(id, status, user) {
    const index = db.expenses.findIndex(e => e.id === id);
    if (index === -1) return null;
    const exp = db.expenses[index];
    exp.status = status;
    exp.approvedBy = status === 'Approved' ? (user?.name || 'Finance Manager') : null;

    if (status === 'Approved' && exp.project) {
      const proj = db.projects.find(p => p.id === exp.project);
      if (proj) proj.spent = (proj.spent || 0) + exp.amount;
    }

    this.logAudit(user?.name, user?.role, status === 'Approved' ? 'APPROVE' : 'REJECT', 'Expenses', id, `${status} expense voucher #${id} ($${exp.amount})`);
    saveDB();
    return exp;
  },

  deleteExpense(id, user) {
    const index = db.expenses.findIndex(e => e.id === id);
    if (index === -1) return false;
    const deleted = db.expenses.splice(index, 1)[0];
    this.logAudit(user?.name, user?.role, 'DELETE', 'Expenses', id, `Deleted expense voucher: ${id}`);
    saveDB();
    return true;
  },

  // Events
  getEvents() {
    return db.events;
  },

  createEvent(data, user) {
    const id = data.id || `EVT-2024-${String(db.events.length + 1).padStart(3, '0')}`;
    const newEvent = {
      ...data,
      id,
      participantsCount: Number(data.participantsCount) || 0,
      beneficiariesReached: Number(data.beneficiariesReached) || 0,
      budget: Number(data.budget) || 0,
      spent: Number(data.spent) || 0,
      status: data.status || 'Upcoming'
    };
    db.events.unshift(newEvent);
    this.logAudit(user?.name, user?.role, 'CREATE', 'Events & Activities', id, `Created event: ${newEvent.title}`);
    saveDB();
    return newEvent;
  },

  updateEvent(id, data, user) {
    const index = db.events.findIndex(e => e.id === id);
    if (index === -1) return null;
    db.events[index] = {
      ...db.events[index],
      ...data,
      id,
      participantsCount: data.participantsCount !== undefined ? Number(data.participantsCount) : db.events[index].participantsCount,
      beneficiariesReached: data.beneficiariesReached !== undefined ? Number(data.beneficiariesReached) : db.events[index].beneficiariesReached,
      budget: data.budget !== undefined ? Number(data.budget) : db.events[index].budget,
      spent: data.spent !== undefined ? Number(data.spent) : db.events[index].spent
    };
    this.logAudit(user?.name, user?.role, 'UPDATE', 'Events & Activities', id, `Updated event: ${db.events[index].title}`);
    saveDB();
    return db.events[index];
  },

  deleteEvent(id, user) {
    const index = db.events.findIndex(e => e.id === id);
    if (index === -1) return false;
    const deleted = db.events.splice(index, 1)[0];
    this.logAudit(user?.name, user?.role, 'DELETE', 'Events & Activities', id, `Deleted event: ${deleted.title}`);
    saveDB();
    return true;
  },

  // Inventory
  getInventory() {
    return db.inventory;
  },

  createInventory(data, user) {
    const id = data.id || `INV-${String(db.inventory.length + 1).padStart(3, '0')}`;
    const qty = Number(data.quantity) || 0;
    const reorder = Number(data.reorderLevel) || 5;
    const status = qty <= 0 ? 'Depleted' : (qty <= reorder ? 'Low Stock' : 'In Stock');

    const newItem = {
      ...data,
      id,
      quantity: qty,
      reorderLevel: reorder,
      unitCost: Number(data.unitCost) || 0,
      status
    };
    db.inventory.unshift(newItem);
    this.logAudit(user?.name, user?.role, 'CREATE', 'Inventory', id, `Added inventory item: ${newItem.itemName} (${qty} ${newItem.unit})`);
    saveDB();
    return newItem;
  },

  updateInventory(id, data, user) {
    const index = db.inventory.findIndex(i => i.id === id);
    if (index === -1) return null;
    const old = db.inventory[index];
    const qty = data.quantity !== undefined ? Number(data.quantity) : old.quantity;
    const reorder = data.reorderLevel !== undefined ? Number(data.reorderLevel) : old.reorderLevel;
    const status = qty <= 0 ? 'Depleted' : (qty <= reorder ? 'Low Stock' : 'In Stock');

    db.inventory[index] = {
      ...old,
      ...data,
      id,
      quantity: qty,
      reorderLevel: reorder,
      unitCost: data.unitCost !== undefined ? Number(data.unitCost) : old.unitCost,
      status
    };
    this.logAudit(user?.name, user?.role, 'UPDATE', 'Inventory', id, `Updated inventory item: ${db.inventory[index].itemName}`);
    saveDB();
    return db.inventory[index];
  },

  logStockMovement(id, changeQty, reason, user) {
    const index = db.inventory.findIndex(i => i.id === id);
    if (index === -1) return null;
    const item = db.inventory[index];
    const newQty = Math.max(0, item.quantity + Number(changeQty));
    const reorder = item.reorderLevel;
    item.quantity = newQty;
    item.status = newQty <= 0 ? 'Depleted' : (newQty <= reorder ? 'Low Stock' : 'In Stock');

    const direction = changeQty > 0 ? 'Received Stock In' : 'Issued Stock Out';
    this.logAudit(user?.name, user?.role, 'UPDATE', 'Inventory', id, `${direction}: ${Math.abs(changeQty)} ${item.unit} of ${item.itemName} (${reason || 'Standard movement'})`);
    saveDB();
    return item;
  },

  deleteInventory(id, user) {
    const index = db.inventory.findIndex(i => i.id === id);
    if (index === -1) return false;
    const deleted = db.inventory.splice(index, 1)[0];
    this.logAudit(user?.name, user?.role, 'DELETE', 'Inventory', id, `Deleted inventory item: ${deleted.itemName}`);
    saveDB();
    return true;
  },

  // Tasks
  getTasks() {
    return db.tasks;
  },

  createTask(data, user) {
    const id = data.id || `TSK-${String(db.tasks.length + 1).padStart(3, '0')}`;
    const newTask = {
      ...data,
      id,
      priority: data.priority || 'Medium',
      status: data.status || 'Pending',
      estimatedHours: Number(data.estimatedHours) || 8
    };
    db.tasks.unshift(newTask);
    this.logAudit(user?.name, user?.role, 'CREATE', 'Tasks', id, `Created task: ${newTask.title}`);
    saveDB();
    return newTask;
  },

  updateTask(id, data, user) {
    const index = db.tasks.findIndex(t => t.id === id);
    if (index === -1) return null;
    db.tasks[index] = {
      ...db.tasks[index],
      ...data,
      id,
      estimatedHours: data.estimatedHours !== undefined ? Number(data.estimatedHours) : db.tasks[index].estimatedHours
    };
    this.logAudit(user?.name, user?.role, 'UPDATE', 'Tasks', id, `Updated task: ${db.tasks[index].title} -> Status: ${db.tasks[index].status}`);
    saveDB();
    return db.tasks[index];
  },

  deleteTask(id, user) {
    const index = db.tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    const deleted = db.tasks.splice(index, 1)[0];
    this.logAudit(user?.name, user?.role, 'DELETE', 'Tasks', id, `Deleted task: ${deleted.title}`);
    saveDB();
    return true;
  },

  // Bulk Import
  bulkImport(moduleName, items, user) {
    let imported = 0;
    let skipped = 0;
    const errors = [];

    switch (moduleName) {
      case 'Projects':
        items.forEach((item, idx) => {
          if (!item.name) {
            errors.push({ row: idx + 1, error: 'Project name is required' });
            skipped++;
            return;
          }
          this.createProject(item, user);
          imported++;
        });
        break;

      case 'Beneficiaries':
        items.forEach((item, idx) => {
          if (!item.name) {
            errors.push({ row: idx + 1, error: 'Beneficiary name is required' });
            skipped++;
            return;
          }
          this.createBeneficiary(item, user);
          imported++;
        });
        break;

      case 'Staff & Volunteers':
        items.forEach((item, idx) => {
          if (!item.name || !item.email) {
            errors.push({ row: idx + 1, error: 'Staff name and email are required' });
            skipped++;
            return;
          }
          this.createStaff(item, user);
          imported++;
        });
        break;

      case 'Donations':
        items.forEach((item, idx) => {
          if (!item.donorName || !item.amount) {
            errors.push({ row: idx + 1, error: 'Donor name and amount are required' });
            skipped++;
            return;
          }
          this.createDonation(item, user);
          imported++;
        });
        break;

      case 'Expenses':
        items.forEach((item, idx) => {
          if (!item.vendor || !item.amount) {
            errors.push({ row: idx + 1, error: 'Vendor and amount are required' });
            skipped++;
            return;
          }
          this.createExpense(item, user);
          imported++;
        });
        break;

      case 'Inventory':
        items.forEach((item, idx) => {
          if (!item.itemName) {
            errors.push({ row: idx + 1, error: 'Item name is required' });
            skipped++;
            return;
          }
          this.createInventory(item, user);
          imported++;
        });
        break;

      case 'Tasks':
        items.forEach((item, idx) => {
          if (!item.title) {
            errors.push({ row: idx + 1, error: 'Task title is required' });
            skipped++;
            return;
          }
          this.createTask(item, user);
          imported++;
        });
        break;

      default:
        throw new Error(`Unsupported module for bulk import: ${moduleName}`);
    }

    this.logAudit(user?.name, user?.role, 'IMPORT', moduleName, 'BULK-IMPORT', `Imported ${imported} records, skipped ${skipped}`);
    return { imported, skipped, errors };
  }
};
