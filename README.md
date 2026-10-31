# NGO Operational Dashboard — Enterprise Management Platform

A centralized, professional, and modern web application built exclusively for Non-Governmental Organizations (NGOs), charities, and social enterprises to manage their organizational data, programmatic activities, finances, projects, staff, beneficiaries, inventory, and compliance reports in one place.

---

## 🌟 Executive Summary & Impact

The **NGO Operational Dashboard** eliminates scattered spreadsheet silos, manual paperwork, and compliance anxiety by unifying:
- **Project & Milestone Tracking:** Live budget burn rates, completion percentages, and milestone checklists.
- **Beneficiary Registry:** Privacy-conscious records with role-based data masking, assistance history, and category tracking.
- **Donation & Grant Management:** Automated 80G/12A tax exemption receipt generator, CSR tracking, and campaign allocations.
- **Financial Vouchers & Expense Approvals:** Multi-level approval workflows, duplicate expense detection, and budget overrun flags.
- **Critical Resource Inventory:** Real-time stock movement logging (Stock In, Stock Out, Transfer) with automated reorder thresholds.
- **Excel & Spreadsheet Integration:** Export 9-worksheet Consolidated Master Workbooks (`.xlsx`), individual module sheets, and import records with strict row-by-row validation.
- **Smart Alerts Center & Data Quality Engine:** Live rule-based anomaly detection and data integrity scoring.
- **Audit Trail & Accountability:** Immutable logging of all create, update, approval, delete, import, and export operations.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend Framework** | React 19 + TypeScript | Component-based, fully type-safe UI architecture |
| **Build & Tooling** | Vite 8 + `@vitejs/plugin-react` | Ultra-fast HMR and optimized production bundling |
| **Styling & Design System** | Tailwind CSS v4 + Lucide Icons | Deep forest green accents (`#14532d`), off-white backdrop (`#f8faf9`), Inter typography |
| **Visualizations** | Recharts | Monthly cashflow area charts, project status donut charts, demographic bars |
| **Spreadsheet Engine** | SheetJS (`xlsx`) | Genuine multi-worksheet `.xlsx` generation, formatted currency, formulas, and CSV/XLSX import |
| **Backend & REST API** | Node.js + Express 5 | High-performance JSON RESTful API with CORS, logging, and error handling |
| **Data Persistence** | File-Backed JSON Store | Atomic filesystem writes with automated initial demo seeding and backup recovery |

---

## 👥 Demo User Accounts & Roles

The system supports role-based access control (RBAC) with pre-configured demo personas:

| Role | Demo User Name | Email | Permissions Overview |
|---|---|---|---|
| **Administrator** | Dr. Aarti Deshmukh | `admin@hopehorizon.org` | Full organization control, legal profile, master export, audit trail, user management |
| **Finance Manager** | Pooja Hegde | `finance@hopehorizon.org` | Expense voucher approvals, 80G donation receipts, budget allocations, financial audits |
| **Project Manager** | Kavita Sen | `pm@hopehorizon.org` | Project milestones, beneficiary enrollments, inventory movements, event coordination |
| **Staff / Volunteer** | Farhan Qureshi | `staff@hopehorizon.org` | Task execution, working hours logging; sensitive beneficiary details automatically masked |

> **Quick Role Switcher:** Switch between any of these roles in real time using the avatar dropdown in the top-right navigation bar to test permissions and privacy masking.

---

## 📊 Modules & Functional Capabilities

### 1. Overview Dashboard
- **8 KPI Cards:** Total Projects, Beneficiaries Served, Volunteers & Staff, Verified Donations, Incurred Expenses, Available Reserves, Upcoming Events, Impact Score.
- **Interactive Visualizations:**
  - Monthly Cashflow Area Chart (Donations vs Expenses).
  - Project Status Donut Chart (Active, Delayed, Completed, Planning).
  - Budget Utilization Progress Bars with overrun flags.
  - Beneficiary Assistance Category distribution.
- **Dynamic Filters:** Filter by Project, Operating Region, or Time Period (All Time, Current Month, Current Quarter, Fiscal Year). All charts and KPIs update synchronously.

### 2. Organization & Statutory Compliance
- Legal Trust credentials (80G, 12A, FCRA, Darpan ID, Trust Registration #).
- Operating branches and regional field bases.
- Departmental hierarchy and team leadership.
- Document registry with expiry countdowns (e.g. 80G renewal, Annual Audit).

### 3. Project Management
- Interactive Grid and Table views with search and category filters.
- Milestone tracking with toggleable checkoffs.
- Budget vs. expenditure monitoring with alert highlights for delayed projects or cost overruns.
- Assigned staff, donor partners, and beneficiary counts.

### 4. Beneficiary Management & Privacy
- Unique Beneficiary IDs (`BEN-2024-XXX`).
- Assistance category breakdown (Clean Water, Education, Healthcare, Food Security, Livelihood, Disaster Relief).
- **Privacy Masking Mode:** Masks sensitive phone numbers and locations for restricted roles.
- Service and assistance history log.

### 5. Staff & Volunteer Management
- Full-time staff vs volunteer separation.
- Skills tags, assigned projects, and contact directory.
- Working hours and volunteer attendance logging modal.

### 6. Donations & 80G Tax Receipts
- Contributions ledger with donor categorization (Corporate CSR, Foundation, Individual Philanthropist).
- **Printable & Downloadable Official 80G Tax Exemption Receipt:** Includes trust registration, legal disclaimers, earmarked project, transaction reference, and authorized signatory.

### 7. Expense Management & Budget Health
- Multi-tier approval workflow (Pending, Approved, Rejected) for Finance Managers and Administrators.
- Automatic duplicate disbursement detection.
- Project budget allocation comparison.

### 8. Events & Community Campaigns
- Track awareness summits, medical camps, and relief distribution drives.
- Log attendee counts, beneficiaries reached, budget spent, and verified outcomes.

### 9. Critical Resource Inventory
- Track supplies across regional warehouse depots.
- Automated low-stock alerts based on reorder thresholds.
- **Stock Movement Logging:** Log Stock In, Issue Out, or Transfers with audit reasons.

### 10. Tasks & Team Coordination
- Interactive **Kanban Board** (Pending, In Progress, Review, Completed) and Table view.
- Drag/click status transitions, priority badges (Urgent, High, Medium, Low), and due date tracking.

### 11. Reports & Operational Analytics
- Executive management summaries, financial statements, and project health briefs.
- Filter by custom reporting periods and projects.
- Print-optimized CSS layout and Excel export.

### 12. Data Import & Export Center
- **Consolidated Master Workbook (`.xlsx`):** Downloads a 9-worksheet workbook with summary totals, formatted numbers, and frozen headers.
- **Import Studio:** Upload `.xlsx` or `.csv` files for any module.
- Downloadable sample templates for every entity.
- Strict row-by-row validation with downloadable error reports.

### 13. Smart Alerts Center
- Live rule-based operational triggers for low stock, project deadline slippages, pending vouchers, and regulatory certificate renewals with 1-click resolution actions.

### 14. Data Quality Center
- Scans database for missing beneficiary contact details, potential duplicate donor titles, and unapproved expenses with integrity scoring.

### 15. Audit Logs
- Immutable audit trail capturing timestamp, user name, role, action (CREATE, UPDATE, DELETE, APPROVE, EXPORT, IMPORT), module, and detailed operation notes.

---

## 🚀 Getting Started & Installation

### Prerequisites
- **Node.js:** v18.0.0 or higher (Tested on Node v26)
- **npm:** v9.0.0 or higher

### Installation Steps

1. **Clone or Open the Repository:**
   ```bash
   cd c:\Users\sonal\Desktop\mp
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Build the Production Bundle:**
   ```bash
   npm run build
   ```

4. **Start the Application Server:**
   ```bash
   npm start
   ```
   The application and API will be live at:
   👉 **http://localhost:5001**

5. **Development Mode (Optional):**
   To run Vite with hot-module reloading and Express together:
   ```bash
   npm run dev:all
   ```
   - Frontend Vite Dev Server: `http://localhost:3000`
   - Backend Express API Server: `http://localhost:5001`

---

## 🔒 Security & Data Integrity

- **Role-Based Access Control:** Frontend UI controls and backend route handlers validate user roles.
- **Data Privacy Protection:** Personal contact details of beneficiaries are masked for non-administrative roles.
- **Audit Logging:** Every mutating transaction (create, edit, delete, approve, import) creates a persistent audit log entry.
- **Safe Import Validation:** Uploaded spreadsheets are parsed and validated row-by-row before any changes are committed.
- **Atomic Data Writes:** Persistent database updates are committed atomically to prevent corruption.

---

## 📄 License & Attribution

Developed for non-profit social impact organizations, humanitarian trusts, and community development charities.
All demo data and organizational identifiers are fictional illustrations designed for demonstration purposes.
