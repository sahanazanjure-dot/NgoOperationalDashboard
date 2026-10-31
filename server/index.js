import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Database } from './data/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '..', 'dist');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging middleware
app.use((req, res, next) => {
  if (req.method !== 'GET' || !req.url.startsWith('/api/all')) {
    console.log(`[${new Date().toISOString().split('T')[1].slice(0, 8)}] ${req.method} ${req.url}`);
  }
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Reset to seed data
app.post('/api/reset', (req, res) => {
  try {
    const result = Database.reset();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Full state snapshot for high performance hydration
app.get('/api/all', (req, res) => {
  try {
    const data = Database.getAllData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Organization Routes
app.get('/api/organization', (req, res) => {
  res.json(Database.getOrganization());
});

app.put('/api/organization', (req, res) => {
  try {
    const updated = Database.updateOrganization(req.body, req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Projects
app.get('/api/projects', (req, res) => {
  res.json(Database.getProjects());
});

app.post('/api/projects', (req, res) => {
  try {
    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    const created = Database.createProject(req.body, user);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/projects/:id', (req, res) => {
  try {
    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    const updated = Database.updateProject(req.params.id, req.body, user);
    if (!updated) return res.status(404).json({ error: 'Project not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/projects/:id', (req, res) => {
  try {
    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    const success = Database.deleteProject(req.params.id, user);
    if (!success) return res.status(404).json({ error: 'Project not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Beneficiaries
app.get('/api/beneficiaries', (req, res) => {
  res.json(Database.getBeneficiaries());
});

app.post('/api/beneficiaries', (req, res) => {
  try {
    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    const created = Database.createBeneficiary(req.body, user);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/beneficiaries/:id', (req, res) => {
  try {
    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    const updated = Database.updateBeneficiary(req.params.id, req.body, user);
    if (!updated) return res.status(404).json({ error: 'Beneficiary not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/beneficiaries/:id', (req, res) => {
  try {
    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    const success = Database.deleteBeneficiary(req.params.id, user);
    if (!success) return res.status(404).json({ error: 'Beneficiary not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Staff
app.get('/api/staff', (req, res) => {
  res.json(Database.getStaff());
});

app.post('/api/staff', (req, res) => {
  try {
    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    const created = Database.createStaff(req.body, user);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/staff/:id', (req, res) => {
  try {
    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    const updated = Database.updateStaff(req.params.id, req.body, user);
    if (!updated) return res.status(404).json({ error: 'Staff member not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/staff/:id', (req, res) => {
  try {
    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    const success = Database.deleteStaff(req.params.id, user);
    if (!success) return res.status(404).json({ error: 'Staff member not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Donations
app.get('/api/donations', (req, res) => {
  res.json(Database.getDonations());
});

app.post('/api/donations', (req, res) => {
  try {
    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    const created = Database.createDonation(req.body, user);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/donations/:id', (req, res) => {
  try {
    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    const updated = Database.updateDonation(req.params.id, req.body, user);
    if (!updated) return res.status(404).json({ error: 'Donation not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/donations/:id', (req, res) => {
  try {
    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    const success = Database.deleteDonation(req.params.id, user);
    if (!success) return res.status(404).json({ error: 'Donation not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Expenses
app.get('/api/expenses', (req, res) => {
  res.json(Database.getExpenses());
});

app.post('/api/expenses', (req, res) => {
  try {
    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    const created = Database.createExpense(req.body, user);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/expenses/:id', (req, res) => {
  try {
    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    const updated = Database.updateExpense(req.params.id, req.body, user);
    if (!updated) return res.status(404).json({ error: 'Expense not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/expenses/:id/approve', (req, res) => {
  try {
    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    const { status } = req.body;
    const updated = Database.approveExpense(req.params.id, status || 'Approved', user);
    if (!updated) return res.status(404).json({ error: 'Expense not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/expenses/:id', (req, res) => {
  try {
    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    const success = Database.deleteExpense(req.params.id, user);
    if (!success) return res.status(404).json({ error: 'Expense not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Events
app.get('/api/events', (req, res) => {
  res.json(Database.getEvents());
});

app.post('/api/events', (req, res) => {
  try {
    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    const created = Database.createEvent(req.body, user);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/events/:id', (req, res) => {
  try {
    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    const updated = Database.updateEvent(req.params.id, req.body, user);
    if (!updated) return res.status(404).json({ error: 'Event not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/events/:id', (req, res) => {
  try {
    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    const success = Database.deleteEvent(req.params.id, user);
    if (!success) return res.status(404).json({ error: 'Event not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Inventory
app.get('/api/inventory', (req, res) => {
  res.json(Database.getInventory());
});

app.post('/api/inventory', (req, res) => {
  try {
    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    const created = Database.createInventory(req.body, user);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/inventory/:id', (req, res) => {
  try {
    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    const updated = Database.updateInventory(req.params.id, req.body, user);
    if (!updated) return res.status(404).json({ error: 'Item not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/inventory/:id/stock', (req, res) => {
  try {
    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    const { changeQty, reason } = req.body;
    const updated = Database.logStockMovement(req.params.id, changeQty, reason, user);
    if (!updated) return res.status(404).json({ error: 'Item not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/inventory/:id', (req, res) => {
  try {
    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    const success = Database.deleteInventory(req.params.id, user);
    if (!success) return res.status(404).json({ error: 'Item not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Tasks
app.get('/api/tasks', (req, res) => {
  res.json(Database.getTasks());
});

app.post('/api/tasks', (req, res) => {
  try {
    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    const created = Database.createTask(req.body, user);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/tasks/:id', (req, res) => {
  try {
    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    const updated = Database.updateTask(req.params.id, req.body, user);
    if (!updated) return res.status(404).json({ error: 'Task not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  try {
    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    const success = Database.deleteTask(req.params.id, user);
    if (!success) return res.status(404).json({ error: 'Task not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Audit Logs
app.get('/api/audit-logs', (req, res) => {
  res.json(Database.getAuditLogs());
});

// Bulk Import
app.post('/api/import', (req, res) => {
  try {
    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    const { moduleName, items } = req.body;
    if (!moduleName || !Array.isArray(items)) {
      return res.status(400).json({ error: 'moduleName and items array are required' });
    }
    const result = Database.bulkImport(moduleName, items, user);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Serve static build in production
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.url.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const server = app.listen(PORT, () => {
  console.log(`NGO Operational Dashboard API Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`[INFO] Port ${PORT} is already in use by active server instance. Continuing...`);
  } else {
    console.error('[ERROR] Server error:', err);
  }
});
