// Comprehensive realistic seed data for HopeHorizon Foundation
// Fictional social development and humanitarian NGO

export const initialOrganization = {
  id: "org-001",
  name: "HopeHorizon Foundation",
  legalName: "HopeHorizon Social Development & Humanitarian Trust",
  registrationNumber: "NGO-REG-2018-09412",
  fcraNumber: "FCRA-031029481-B",
  taxExemptionNumber: "80G/12A-AAATH9821K",
  darpanId: "MH/2019/0241982",
  foundedYear: 2018,
  mission: "Empowering vulnerable communities through sustainable clean water access, quality education, rural healthcare, food security, and rapid disaster relief.",
  vision: "A resilient world where every individual has dignity, equitable access to basic essentials, and opportunities to thrive.",
  primaryEmail: "operations@hopehorizon.org",
  contactPhone: "+91 (022) 8472-9100",
  emergencyContact: "+91 98201 44921",
  website: "https://www.hopehorizon.org",
  headquarters: {
    address: "Suite 402, Samriddhi Social Hub, 14th Cross, Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400050",
    country: "India"
  },
  branches: [
    { id: "br-1", name: "Western Region Field Office", city: "Pune", state: "Maharashtra", manager: "Dr. Aarti Deshmukh", activeProjects: 3 },
    { id: "br-2", name: "Central Tribal Outreach Base", city: "Nagpur", state: "Maharashtra", manager: "Rajeshwar Rao", activeProjects: 2 },
    { id: "br-3", name: "Coastal Disaster Response Unit", city: "Ratnagiri", state: "Maharashtra", manager: "Meera Fernandez", activeProjects: 2 }
  ],
  departments: [
    { id: "dept-1", name: "Water & Environmental Health", head: "Dr. Aarti Deshmukh", staffCount: 6 },
    { id: "dept-2", name: "Community Education & Youth", head: "Kavita Sen", staffCount: 8 },
    { id: "dept-3", name: "Rural Healthcare & Nutrition", head: "Dr. Vikram Sethi", staffCount: 7 },
    { id: "dept-4", name: "Disaster Preparedness & Relief", head: "Captain (Retd) Arjun Nair", staffCount: 5 },
    { id: "dept-5", name: "Finance, Compliance & Grants", head: "Pooja Hegde", staffCount: 4 }
  ],
  documents: [
    { id: "doc-1", title: "Trust Registration Certificate", documentNumber: "TR-8921/2018", category: "Legal", issueDate: "2018-04-12", expiryDate: "2028-04-11", status: "Valid", issuingAuthority: "Charity Commissioner", verified: true },
    { id: "doc-2", title: "12A Tax Exemption Certificate", documentNumber: "12A-CIT-E/2019", category: "Tax", issueDate: "2019-06-20", expiryDate: "2029-06-19", status: "Valid", issuingAuthority: "Income Tax Dept", verified: true },
    { id: "doc-3", title: "80G Donor Tax Exemption Renewal", documentNumber: "80G-AACT-9018", category: "Tax", issueDate: "2021-08-15", expiryDate: "2026-11-30", status: "Expiring Soon", issuingAuthority: "Income Tax Dept", verified: true },
    { id: "doc-4", title: "FCRA Foreign Contribution Clearance", documentNumber: "FCRA-REG-03102", category: "Compliance", issueDate: "2022-01-10", expiryDate: "2027-01-09", status: "Valid", issuingAuthority: "Ministry of Home Affairs", verified: true },
    { id: "doc-5", title: "Annual Statutory Audit Report FY24", documentNumber: "AUD-FY24-FINAL", category: "Audit", issueDate: "2024-09-30", expiryDate: "2025-09-30", status: "Valid", issuingAuthority: "K.S. Mehta & Co. Chartered Accountants", verified: true }
  ],
  settings: {
    currencySymbol: "$",
    currencyCode: "USD",
    fiscalYearStart: "April 01",
    receiptPrefix: "HH-REC-2024-",
    enableAutoAlerts: true,
    privacyLevel: "Role-Restricted"
  }
};

export const initialProjects = [
  {
    id: "PRJ-101",
    name: "JalDhara Clean Water & Solar Borewells",
    category: "Clean Water & Sanitation",
    description: "Installing deep solar-powered borewells, biological water filtration systems, and community water committees across 14 drought-prone rural hamlets.",
    objectives: "Provide 12,000+ villagers with arsenic-free clean drinking water and reduce waterborne diseases by 85%.",
    location: "Marathwada District (Rural Maharashtra)",
    manager: "Dr. Aarti Deshmukh",
    budget: 85000,
    spent: 61400,
    startDate: "2024-01-15",
    endDate: "2024-11-30",
    status: "Active",
    beneficiariesCount: 12400,
    milestones: [
      { id: "m-1", title: "Geological survey & aquifer mapping", completed: true, targetDate: "2024-02-28" },
      { id: "m-2", title: "Drilling 14 solar borewells", completed: true, targetDate: "2024-05-15" },
      { id: "m-3", title: "Install UV & dual-media filter units", completed: true, targetDate: "2024-08-30" },
      { id: "m-4", title: "Handover to village Paani Panchayats", completed: false, targetDate: "2024-11-30" }
    ],
    assignedStaff: ["Dr. Aarti Deshmukh", "Rajeshwar Rao", "Ananya Sen"],
    donorPartners: ["Global Water Trust", "TechCorp CSR Foundation"]
  },
  {
    id: "PRJ-102",
    name: "Sakhi Girls STEM & Digital Literacy Initiative",
    category: "Education & Skilling",
    description: "Equipping 18 government-aided secondary schools with modern computer labs, solar power backup, and trained female instructors teaching coding and robotics.",
    objectives: "Bridge the gender digital divide for 3,500 adolescent girls and enable 80% to achieve digital certification.",
    location: "Pune Suburban & Semi-urban Centers",
    manager: "Kavita Sen",
    budget: 65000,
    spent: 52300,
    startDate: "2023-09-01",
    endDate: "2024-12-31",
    status: "Active",
    beneficiariesCount: 3650,
    milestones: [
      { id: "m-1", title: "School MOU sign-offs & lab room prep", completed: true, targetDate: "2023-11-15" },
      { id: "m-2", title: "Hardware delivery (360 refurbished laptops)", completed: true, targetDate: "2024-01-30" },
      { id: "m-3", title: "Cohort 1 & 2 Python & Web basics completed", completed: true, targetDate: "2024-06-30" },
      { id: "m-4", title: "Annual STEM exhibition and project showcase", completed: false, targetDate: "2024-12-15" }
    ],
    assignedStaff: ["Kavita Sen", "Sneha Kulkarni", "Tariq Mansoori"],
    donorPartners: ["EmpowerHer International", "Cognizant Foundation"]
  },
  {
    id: "PRJ-103",
    name: "Sanjeevani Mobile Rural Clinics & Maternal Health",
    category: "Healthcare & Nutrition",
    description: "Two fully equipped mobile health vans staffed with doctors, midwives, and diagnostic kits visiting remote tribal settlements on a weekly fixed schedule.",
    objectives: "Deliver prenatal checkups, immunization, chronic disease management, and emergency transport for expectant mothers.",
    location: "Melghat Tribal Belt (Amravati)",
    manager: "Dr. Vikram Sethi",
    budget: 98000,
    spent: 88400,
    startDate: "2023-06-01",
    endDate: "2024-10-31",
    status: "Delayed",
    beneficiariesCount: 8900,
    milestones: [
      { id: "m-1", title: "Custom vehicle fabrication & medical licensing", completed: true, targetDate: "2023-08-15" },
      { id: "m-2", title: "Baseline health registry for 45 villages", completed: true, targetDate: "2023-10-30" },
      { id: "m-3", title: "4,000 prenatal checkups milestone", completed: true, targetDate: "2024-05-10" },
      { id: "m-4", title: "Monsoon mobile clinic outreach run", completed: false, targetDate: "2024-09-30" }
    ],
    assignedStaff: ["Dr. Vikram Sethi", "Sister Reena Thomas", "Gopal Shinde"],
    donorPartners: ["Starlight Health Foundation", "Rotary International District 3141"]
  },
  {
    id: "PRJ-104",
    name: "Coastal Cyclone & Monsoon Emergency Relief",
    category: "Disaster Response",
    description: "Rapid deployment of dry food kits, water purification tablets, hygiene kits, and temporary tarpaulin shelters to fishing hamlets affected by severe storms.",
    objectives: "Provide immediate 14-day relief supplies to 2,500 displaced families within 48 hours of warning.",
    location: "Konkan Coastline (Ratnagiri & Sindhudurg)",
    manager: "Captain (Retd) Arjun Nair",
    budget: 45000,
    spent: 42100,
    startDate: "2024-06-01",
    endDate: "2024-09-30",
    status: "Completed",
    beneficiariesCount: 7800,
    milestones: [
      { id: "m-1", title: "Pre-position 2,000 emergency ration kits", completed: true, targetDate: "2024-06-10" },
      { id: "m-2", title: "Relief camp deployments during Cyclone Ashani", completed: true, targetDate: "2024-07-20" },
      { id: "m-3", title: "Water chlorination drive across 32 villages", completed: true, targetDate: "2024-08-15" },
      { id: "m-4", title: "Post-disaster rehabilitation & damage report", completed: true, targetDate: "2024-09-25" }
    ],
    assignedStaff: ["Captain (Retd) Arjun Nair", "Meera Fernandez", "Devendra Joshi"],
    donorPartners: ["Disaster Emergency Committee", "Individual Micro-donors"]
  },
  {
    id: "PRJ-105",
    name: "Annapurna Community Nutrition & Urban Food Bank",
    category: "Food Security",
    description: "Daily prepared meal distribution and fortified grocery packs for daily-wage migrant families, homeless elderly, and urban slum creches.",
    objectives: "Serve 250,000 hot wholesome meals annually and reduce childhood malnutrition indicators in intervention slums.",
    location: "Dharavi & Govandi, Mumbai",
    manager: "Meera Fernandez",
    budget: 72000,
    spent: 59200,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "Active",
    beneficiariesCount: 18500,
    milestones: [
      { id: "m-1", title: "Centralized kitchen renovation & FSSAI license", completed: true, targetDate: "2024-02-15" },
      { id: "m-2", title: "Establish 8 localized distribution pods", completed: true, targetDate: "2024-04-10" },
      { id: "m-3", title: "100,000 meals distributed milestone", completed: true, targetDate: "2024-07-01" },
      { id: "m-4", title: "Winter hunger relief drive rollout", completed: false, targetDate: "2024-11-15" }
    ],
    assignedStaff: ["Meera Fernandez", "Farhan Qureshi", "Sunita Bai"],
    donorPartners: ["Robin Hood Army Network", "Zomato Feeding India Grant"]
  },
  {
    id: "PRJ-106",
    name: "Vanya Sustainable Agroforestry & Tribal Livelihoods",
    category: "Livelihood & Environment",
    description: "Training 600 tribal women farmers in native honey harvesting, moringa cultivation, bamboo handicraft making, and direct-to-consumer cooperative marketing.",
    objectives: "Increase average household income by 40% while regenerating 150 hectares of degraded forest buffer lands.",
    location: "Gadchiroli & Chandrapur Forest Zones",
    manager: "Rajeshwar Rao",
    budget: 54000,
    spent: 24800,
    startDate: "2024-03-01",
    endDate: "2025-02-28",
    status: "Active",
    beneficiariesCount: 2400,
    milestones: [
      { id: "m-1", title: "Cooperative self-help groups formed (24 SHGs)", completed: true, targetDate: "2024-04-30" },
      { id: "m-2", title: "Scientific beekeeping & nursery training", completed: true, targetDate: "2024-07-20" },
      { id: "m-3", title: "First batch certified wild honey extraction", completed: false, targetDate: "2024-11-10" },
      { id: "m-4", title: "Eco-packaging launch & craft exhibition", completed: false, targetDate: "2025-01-25" }
    ],
    assignedStaff: ["Rajeshwar Rao", "Laxmi Madavi", "Kiran Varma"],
    donorPartners: ["NABARD Tribal Development Fund", "EcoGreen Capital"]
  },
  {
    id: "PRJ-107",
    name: "Punarvas Orphan & Foster Youth Transitional Housing",
    category: "Child Welfare",
    description: "Providing safe transitional accommodation, mental health counseling, vocational mentoring, and life skills coaching for youths aging out of shelter homes.",
    objectives: "Assist 60 care-leavers annually to attain financial independence and formal employment.",
    location: "Thane Urban Center",
    manager: "Kavita Sen",
    budget: 48000,
    spent: 49200,
    startDate: "2023-11-01",
    endDate: "2024-10-31",
    status: "Delayed",
    beneficiariesCount: 140,
    milestones: [
      { id: "m-1", title: "Facility lease & safety certification", completed: true, targetDate: "2023-12-20" },
      { id: "m-2", title: "Intake of Cohort 1 (30 young adults)", completed: true, targetDate: "2024-02-15" },
      { id: "m-3", title: "Vocational job placements secured for 80%", completed: true, targetDate: "2024-07-30" },
      { id: "m-4", title: "Independent living transition review", completed: false, targetDate: "2024-10-15" }
    ],
    assignedStaff: ["Kavita Sen", "Devendra Joshi"],
    donorPartners: ["GiveIndia Fellowship", "HDFC Parivartan"]
  }
];

export const initialBeneficiaries = [
  { id: "BEN-2024-001", name: "Sunita Ramesh Gavit", age: 34, gender: "Female", contact: "+91 98210 54109", location: "Marathwada, Hamlet 4", category: "Clean Water & Sanitation", assignedProject: "PRJ-101", registrationDate: "2024-01-20", assistanceCategory: "Water Access", status: "Active", servicesReceived: ["Borewell Water Card", "Sanitation Hygiene Kit", "Paani Committee Member"] },
  { id: "BEN-2024-002", name: "Ananya Prakash Shinde", age: 15, gender: "Female", contact: "+91 97654 32180", location: "Pune Suburban Ward 8", category: "Education", assignedProject: "PRJ-102", registrationDate: "2023-09-12", assistanceCategory: "STEM Skilling", status: "Active", servicesReceived: ["Laptop Access", "Python Coding Level 1", "School Stationary Kit"] },
  { id: "BEN-2024-003", name: "Rameshwar Tukaram Patil", age: 58, gender: "Male", contact: "+91 94220 89123", location: "Marathwada, Khardi", category: "Clean Water & Sanitation", assignedProject: "PRJ-101", registrationDate: "2024-01-22", assistanceCategory: "Water Access", status: "Active", servicesReceived: ["Bio-sand Filter", "Community Well Beneficiary"] },
  { id: "BEN-2024-004", name: "Lalita Mangesh Korgaonkar", age: 26, gender: "Female", contact: "+91 98231 44502", location: "Melghat Tribal Colony 12", category: "Healthcare", assignedProject: "PRJ-103", registrationDate: "2023-10-05", assistanceCategory: "Maternal Health", status: "Active", servicesReceived: ["Prenatal Care (4 visits)", "Iron & Folic Supplements", "Safe Institutional Delivery Voucher"] },
  { id: "BEN-2024-005", name: "Shaikh Abdul Rehmaan", age: 48, gender: "Male", contact: "+91 99201 88314", location: "Govandi Slums, Mumbai", category: "Food Security", assignedProject: "PRJ-105", registrationDate: "2024-01-14", assistanceCategory: "Nutrition & Ration", status: "Active", servicesReceived: ["Monthly Grain Rations", "Hot Meal Distribution"] },
  { id: "BEN-2024-006", name: "Kusum Bai Madavi", age: 42, gender: "Female", contact: "+91 94031 77102", location: "Gadchiroli Forest Hamlet", category: "Livelihood", assignedProject: "PRJ-106", registrationDate: "2024-03-10", assistanceCategory: "Agroforestry", status: "Active", servicesReceived: ["Beehive Box Unit", "Moringa Saplings (50)", "SHG Micro-loan Assistance"] },
  { id: "BEN-2024-007", name: "Rohit Dattatray Jadhav", age: 19, gender: "Male", contact: "+91 91580 23419", location: "Thane Care Home", category: "Child Welfare", assignedProject: "PRJ-107", registrationDate: "2023-11-15", assistanceCategory: "Youth Transition", status: "Active", servicesReceived: ["Transitional Housing", "Electrician Diploma Course", "Stipend Support"] },
  { id: "BEN-2024-008", name: "Pratibha Suresh Divekar", age: 16, gender: "Female", contact: "+91 98221 00293", location: "Pune District High School", category: "Education", assignedProject: "PRJ-102", registrationDate: "2023-09-18", assistanceCategory: "STEM Skilling", status: "Active", servicesReceived: ["Digital Literacy Certificate", "Robotics Kit Access"] },
  { id: "BEN-2024-009", name: "Vishnu Govind Dhuri", age: 52, gender: "Male", contact: "+91 94211 65432", location: "Ratnagiri Coastal Village", category: "Disaster Response", assignedProject: "PRJ-104", registrationDate: "2024-06-12", assistanceCategory: "Emergency Relief", status: "Active", servicesReceived: ["Waterproof Tarpaulin Tent", "Dry Food Rations (14 days)", "Water Purifier Tablets"] },
  { id: "BEN-2024-010", name: "Fatima Bi Qureshi", age: 64, gender: "Female", contact: "+91 98199 12048", location: "Dharavi Sector 5, Mumbai", category: "Food Security", assignedProject: "PRJ-105", registrationDate: "2024-02-01", assistanceCategory: "Nutrition & Ration", status: "Active", servicesReceived: ["Daily Hot Meal Token", "Geriatric Health Screening"] },
  { id: "BEN-2024-011", name: "Santosh Bhikaji More", age: 39, gender: "Male", contact: "+91 97632 88471", location: "Marathwada, Hamlet 9", category: "Clean Water & Sanitation", assignedProject: "PRJ-101", registrationDate: "2024-02-14", assistanceCategory: "Water Access", status: "Active", servicesReceived: ["Solar Pump Water Supply", "Household Soak Pit Kit"] },
  { id: "BEN-2024-012", name: "Kiran Soma Atram", age: 29, gender: "Female", contact: "+91 94055 33219", location: "Gadchiroli Tribal Block", category: "Livelihood", assignedProject: "PRJ-106", registrationDate: "2024-03-25", assistanceCategory: "Agroforestry", status: "Active", servicesReceived: ["Honey Harvesting Toolset", "Organic Certification Training"] },
  { id: "BEN-2024-013", name: "Aarav Santosh Wagh", age: 7, gender: "Male", contact: "+91 98230 99482", location: "Melghat Tribal Center", category: "Healthcare", assignedProject: "PRJ-103", registrationDate: "2023-11-02", assistanceCategory: "Child Health", status: "Active", servicesReceived: ["Malnutrition Rehabilitation (SAM)", "Nutrient Paste Packs", "Vaccination Completion"] },
  { id: "BEN-2024-014", name: "Zoya Parveen Khan", age: 14, gender: "Female", contact: "+91 99208 45612", location: "Pune East School", category: "Education", assignedProject: "PRJ-102", registrationDate: "2023-10-01", assistanceCategory: "STEM Skilling", status: "Active", servicesReceived: ["Computer Lab Access", "English Communication Class"] },
  { id: "BEN-2024-015", name: "Gajanan Narayan Bondre", age: 61, gender: "Male", contact: "+91 94228 11984", location: "Amravati District", category: "Healthcare", assignedProject: "PRJ-103", registrationDate: "2023-12-10", assistanceCategory: "Chronic Care", status: "Active", servicesReceived: ["Hypertension Medication", "Mobile Clinic Checkup"] },
  { id: "BEN-2024-016", name: "Pooja Vasant Kadam", age: 21, gender: "Female", contact: "+91 91588 77291", location: "Thane Support Facility", category: "Child Welfare", assignedProject: "PRJ-107", registrationDate: "2023-11-20", assistanceCategory: "Youth Transition", status: "Active", servicesReceived: ["Hospitality Assistant Training", "Resume & Interview Coaching"] },
  { id: "BEN-2024-017", name: "Suhasini Dilip Sawant", age: 44, gender: "Female", contact: "+91 98218 34910", location: "Sindhudurg Coast", category: "Disaster Response", assignedProject: "PRJ-104", registrationDate: "2024-06-15", assistanceCategory: "Emergency Relief", status: "Active", servicesReceived: ["Emergency Family Survival Kit", "Solar Lantern"] },
  { id: "BEN-2024-018", name: "Devdas Bhiva Kokate", age: 36, gender: "Male", contact: "+91 97660 55198", location: "Marathwada, Hamlet 12", category: "Clean Water & Sanitation", assignedProject: "PRJ-101", registrationDate: "2024-03-01", assistanceCategory: "Water Access", status: "Active", servicesReceived: ["Drip Irrigation Subsidy Kit", "Water Card"] },
  { id: "BEN-2024-019", name: "Parvati Ramji Uike", age: 31, gender: "Female", contact: "+91 94042 88109", location: "Chandrapur Forest Buffer", category: "Livelihood", assignedProject: "PRJ-106", registrationDate: "2024-04-05", assistanceCategory: "Agroforestry", status: "Active", servicesReceived: ["Bamboo Craft Loom", "Exhibition Stall Subsidy"] },
  { id: "BEN-2024-020", name: "Akash Manik Pawar", age: 18, gender: "Male", contact: "+91 98229 01472", location: "Govandi Slums, Mumbai", category: "Education", assignedProject: "PRJ-102", registrationDate: "2024-01-10", assistanceCategory: "STEM Skilling", status: "Active", servicesReceived: ["Hardware Repair Training", "Tool Starter Kit"] },
  { id: "BEN-2024-021", name: "Meena Chandrakant Joshi", age: 28, gender: "Female", contact: "+91 98205 61728", location: "Melghat Village 3", category: "Healthcare", assignedProject: "PRJ-103", registrationDate: "2024-02-18", assistanceCategory: "Maternal Health", status: "Active", servicesReceived: ["Ultrasound Screening", "Postnatal Nutrition Kit"] },
  { id: "BEN-2024-022", name: "Baburao Ganpat Gawli", age: 72, gender: "Male", contact: "+91 94231 99012", location: "Dharavi Transit Camp", category: "Food Security", assignedProject: "PRJ-105", registrationDate: "2024-03-12", assistanceCategory: "Nutrition & Ration", status: "Active", servicesReceived: ["Home Meal Delivery for Senior Citizen"] }
];

export const initialStaff = [
  { id: "STF-001", name: "Dr. Aarti Deshmukh", type: "Staff", role: "Director of Programs & Water Lead", department: "Water & Environmental Health", email: "aarti.deshmukh@hopehorizon.org", phone: "+91 98201 12345", status: "Active", joiningDate: "2019-03-01", skills: ["Hydrology", "Project Leadership", "Community Organizing", "M&E"], assignedProjects: ["PRJ-101"], hoursLoggedThisMonth: 168 },
  { id: "STF-002", name: "Pooja Hegde", type: "Staff", role: "Chief Finance & Grants Manager", department: "Finance, Compliance & Grants", email: "pooja.hegde@hopehorizon.org", phone: "+91 98202 23456", status: "Active", joiningDate: "2020-01-15", skills: ["Statutory Audit", "FCRA Compliance", "Budget Planning", "Grant Accounting"], assignedProjects: ["PRJ-101", "PRJ-102", "PRJ-103", "PRJ-105"], hoursLoggedThisMonth: 160 },
  { id: "STF-003", name: "Kavita Sen", type: "Staff", role: "Education & Youth Program Manager", department: "Community Education & Youth", email: "kavita.sen@hopehorizon.org", phone: "+91 98203 34567", status: "Active", joiningDate: "2020-08-01", skills: ["STEM Pedagogy", "Curriculum Design", "Teacher Training", "Child Safeguarding"], assignedProjects: ["PRJ-102", "PRJ-107"], hoursLoggedThisMonth: 172 },
  { id: "STF-004", name: "Dr. Vikram Sethi", type: "Staff", role: "Chief Medical Officer", department: "Rural Healthcare & Nutrition", email: "vikram.sethi@hopehorizon.org", phone: "+91 98204 45678", status: "Active", joiningDate: "2021-04-10", skills: ["Public Health", "Epidemiology", "Mobile Clinic Protocols", "Maternal Care"], assignedProjects: ["PRJ-103"], hoursLoggedThisMonth: 176 },
  { id: "STF-005", name: "Captain (Retd) Arjun Nair", type: "Staff", role: "Disaster Logistics & Field Operations Lead", department: "Disaster Preparedness & Relief", email: "arjun.nair@hopehorizon.org", phone: "+91 98205 56789", status: "Active", joiningDate: "2021-11-01", skills: ["Rapid Response Logistics", "Crisis Management", "Supply Chain", "Search & Rescue"], assignedProjects: ["PRJ-104"], hoursLoggedThisMonth: 154 },
  { id: "STF-006", name: "Rajeshwar Rao", type: "Staff", role: "Tribal Livelihoods Coordinator", department: "Water & Environmental Health", email: "rajeshwar.rao@hopehorizon.org", phone: "+91 98206 67890", status: "Active", joiningDate: "2022-02-15", skills: ["Agroforestry", "Cooperative Governance", "Tribal Languages", "Microfinance"], assignedProjects: ["PRJ-101", "PRJ-106"], hoursLoggedThisMonth: 164 },
  { id: "STF-007", name: "Meera Fernandez", type: "Staff", role: "Community Outreach & Food Bank Officer", department: "Disaster Preparedness & Relief", email: "meera.f@hopehorizon.org", phone: "+91 98207 78901", status: "Active", joiningDate: "2022-09-01", skills: ["Food Safety", "Slum Community Mobilization", "Inventory Management"], assignedProjects: ["PRJ-104", "PRJ-105"], hoursLoggedThisMonth: 158 },
  { id: "VOL-001", name: "Sneha Kulkarni", type: "Volunteer", role: "Volunteer STEM Mentor & Instructor", department: "Community Education & Youth", email: "sneha.k@outlook.com", phone: "+91 97651 88290", status: "Active", joiningDate: "2023-01-10", skills: ["Python", "Scratch Programming", "Web Design"], assignedProjects: ["PRJ-102"], hoursLoggedThisMonth: 44 },
  { id: "VOL-002", name: "Sister Reena Thomas", type: "Volunteer", role: "Volunteer Nurse Practitioner", department: "Rural Healthcare & Nutrition", email: "reena.thomas@gmail.com", phone: "+91 98230 45610", status: "Active", joiningDate: "2023-05-15", skills: ["Prenatal Care", "Immunization", "First Aid"], assignedProjects: ["PRJ-103"], hoursLoggedThisMonth: 56 },
  { id: "VOL-003", name: "Farhan Qureshi", type: "Volunteer", role: "Volunteer Food Logistics Driver", department: "Disaster Preparedness & Relief", email: "farhan.q@gmail.com", phone: "+91 99204 77123", status: "Active", joiningDate: "2023-08-20", skills: ["Commercial Driving", "Warehouse Handling", "Route Optimization"], assignedProjects: ["PRJ-105"], hoursLoggedThisMonth: 38 },
  { id: "VOL-004", name: "Devendra Joshi", type: "Volunteer", role: "Disaster Relief Volunteer", department: "Disaster Preparedness & Relief", email: "devendra.j@yahoo.com", phone: "+91 98211 99021", status: "Active", joiningDate: "2024-02-01", skills: ["Emergency Aid", "Tent Pitching", "Amateur Radio"], assignedProjects: ["PRJ-104", "PRJ-107"], hoursLoggedThisMonth: 32 },
  { id: "VOL-005", name: "Tariq Mansoori", type: "Volunteer", role: "Tech Support Volunteer", department: "Community Education & Youth", email: "tariq.m@gmail.com", phone: "+91 97640 12894", status: "On-Leave", joiningDate: "2023-11-10", skills: ["Hardware Repair", "Linux", "Networking"], assignedProjects: ["PRJ-102"], hoursLoggedThisMonth: 12 }
];

export const initialDonations = [
  { id: "DON-2024-001", donorName: "TechCorp Global CSR Foundation", donorType: "Corporate CSR", email: "csr@techcorpglobal.com", phone: "+1 (415) 890-1200", amount: 45000, date: "2024-01-10", paymentMethod: "Wire Transfer", purpose: "Solar borewells infrastructure grant", projectAllocation: "PRJ-101", receiptNumber: "HH-REC-2024-001", transactionRef: "TXN-WIRE-982103", taxExemptionIssued: true, status: "Verified" },
  { id: "DON-2024-002", donorName: "EmpowerHer International Fund", donorType: "Foundation", email: "grants@empowerher.org", phone: "+44 20 7946 0912", amount: 35000, date: "2024-01-28", paymentMethod: "Direct Bank Deposit", purpose: "Girls STEM labs and computer procurement", projectAllocation: "PRJ-102", receiptNumber: "HH-REC-2024-002", transactionRef: "TXN-BACS-441209", taxExemptionIssued: true, status: "Verified" },
  { id: "DON-2024-003", donorName: "Rotary District 3141 Charitable Trust", donorType: "Foundation", email: "treasurer@rotary3141.org", phone: "+91 22 2640 1928", amount: 28000, date: "2024-02-14", paymentMethod: "Cheque", purpose: "Mobile medical van diagnostics equipment", projectAllocation: "PRJ-103", receiptNumber: "HH-REC-2024-003", transactionRef: "CHQ-HDFC-009842", taxExemptionIssued: true, status: "Verified" },
  { id: "DON-2024-004", donorName: "Vikram & Sunita Oberoi Family Trust", donorType: "Individual Philanthropist", email: "oberoi.trust@gmail.com", phone: "+91 98200 44100", amount: 12500, date: "2024-02-25", paymentMethod: "Bank Transfer (NEFT)", purpose: "General operating & community nutrition", projectAllocation: "PRJ-105", receiptNumber: "HH-REC-2024-004", transactionRef: "NEFT-ICIC-2938104", taxExemptionIssued: true, status: "Verified" },
  { id: "DON-2024-005", donorName: "Global Disaster Response Fund", donorType: "Foundation", email: "relief@globaldisaster.org", phone: "+1 (202) 555-0199", amount: 25000, date: "2024-06-05", paymentMethod: "Wire Transfer", purpose: "Cyclone monsoon pre-positioning relief kits", projectAllocation: "PRJ-104", receiptNumber: "HH-REC-2024-005", transactionRef: "TXN-WIRE-771920", taxExemptionIssued: true, status: "Verified" },
  { id: "DON-2024-006", donorName: "Zomato Feeding India CSR Partner", donorType: "Corporate CSR", email: "partnerships@feedingindia.org", phone: "+91 11 4123 9900", amount: 20000, date: "2024-03-01", paymentMethod: "Bank Transfer (RTGS)", purpose: "Urban slum meal distribution kitchen subsidies", projectAllocation: "PRJ-105", receiptNumber: "HH-REC-2024-006", transactionRef: "RTGS-AXIS-910283", taxExemptionIssued: true, status: "Verified" },
  { id: "DON-2024-007", donorName: "NABARD Rural Innovation Grant", donorType: "Government / Multilateral", email: "grants@nabard.gov.in", phone: "+91 22 2653 9200", amount: 30000, date: "2024-03-20", paymentMethod: "Direct Treasury Credit", purpose: "Tribal agroforestry and honey value-chain", projectAllocation: "PRJ-106", receiptNumber: "HH-REC-2024-007", transactionRef: "RBI-GOV-554109", taxExemptionIssued: true, status: "Verified" },
  { id: "DON-2024-008", donorName: "Cognizant Outreach CSR Initiative", donorType: "Corporate CSR", email: "outreach@cognizant.com", phone: "+91 44 4209 6000", amount: 18000, date: "2024-04-12", paymentMethod: "Bank Transfer", purpose: "Refurbished laptops & STEM coding bootcamps", projectAllocation: "PRJ-102", receiptNumber: "HH-REC-2024-008", transactionRef: "TXN-CITI-882103", taxExemptionIssued: true, status: "Verified" },
  { id: "DON-2024-009", donorName: "Anand Mahindra CSR Fellowship", donorType: "Corporate CSR", email: "fellowships@mahindra.com", phone: "+91 22 2490 1441", amount: 15000, date: "2024-04-29", paymentMethod: "Bank Transfer", purpose: "Youth transitional housing support", projectAllocation: "PRJ-107", receiptNumber: "HH-REC-2024-009", transactionRef: "TXN-KOTAK-334190", taxExemptionIssued: true, status: "Verified" },
  { id: "DON-2024-010", donorName: "Dr. Cyrus S. Poonawalla Charity", donorType: "Individual Philanthropist", email: "charity@poonawallagroup.com", phone: "+91 20 2699 3900", amount: 30000, date: "2024-05-18", paymentMethod: "Cheque", purpose: "Rural immunization cold chain maintenance", projectAllocation: "PRJ-103", receiptNumber: "HH-REC-2024-010", transactionRef: "CHQ-BOI-772910", taxExemptionIssued: true, status: "Verified" },
  { id: "DON-2024-011", donorName: "Aditi & Rahul Sharma", donorType: "Individual Donor", email: "aditi.sharma99@gmail.com", phone: "+91 98204 88129", amount: 2500, date: "2024-06-15", paymentMethod: "UPI / Stripe", purpose: "Community food bank sponsorship", projectAllocation: "PRJ-105", receiptNumber: "HH-REC-2024-011", transactionRef: "UPI-4182901289", taxExemptionIssued: true, status: "Verified" },
  { id: "DON-2024-012", donorName: "EcoGreen Capital Partners", donorType: "Corporate CSR", email: "impact@ecogreencap.com", phone: "+1 (212) 809-5500", amount: 15000, date: "2024-07-04", paymentMethod: "Wire Transfer", purpose: "Degraded land regeneration & nursery saplings", projectAllocation: "PRJ-106", receiptNumber: "HH-REC-2024-012", transactionRef: "TXN-WIRE-449102", taxExemptionIssued: true, status: "Verified" },
  { id: "DON-2024-013", donorName: "Anonymous Donor Community Circle", donorType: "Anonymous", email: "donor.circle@protonmail.com", phone: "Confidential", amount: 10000, date: "2024-07-22", paymentMethod: "Bank Transfer", purpose: "Unrestricted NGO emergency pool", projectAllocation: "PRJ-104", receiptNumber: "HH-REC-2024-013", transactionRef: "TXN-NEFT-901844", taxExemptionIssued: false, status: "Verified" },
  { id: "DON-2024-014", donorName: "Dr. Farrokh E. Udwadia Memorial Trust", donorType: "Foundation", email: "udwadia.trust@gmail.com", phone: "+91 22 2363 8011", amount: 22000, date: "2024-08-10", paymentMethod: "Cheque", purpose: "Mobile medical van ultrasound upgrade", projectAllocation: "PRJ-103", receiptNumber: "HH-REC-2024-014", transactionRef: "CHQ-SUT-192840", taxExemptionIssued: true, status: "Verified" },
  { id: "DON-2024-015", donorName: "GiveIndia Crowdfunding Cohort", donorType: "Online Portal", email: "support@giveindia.org", phone: "+91 80 4718 1900", amount: 18400, date: "2024-08-30", paymentMethod: "Payment Gateway", purpose: "14 Solar borewells clean water fund", projectAllocation: "PRJ-101", receiptNumber: "HH-REC-2024-015", transactionRef: "RAZOR-PAY-8812039", taxExemptionIssued: true, status: "Verified" },
  { id: "DON-2024-016", donorName: "Kalyan Jewellers CSR Wing", donorType: "Corporate CSR", email: "csr@kalyanjewellers.net", phone: "+91 487 243 7333", amount: 12000, date: "2024-09-15", paymentMethod: "Bank Transfer", purpose: "Youth employability certification fees", projectAllocation: "PRJ-107", receiptNumber: "HH-REC-2024-016", transactionRef: "TXN-SIBL-901824", taxExemptionIssued: true, status: "Verified" },
  { id: "DON-2024-017", donorName: "Priya & Siddharth Roy", donorType: "Individual Donor", email: "sroy.invest@gmail.com", phone: "+91 98211 44019", amount: 3500, date: "2024-10-02", paymentMethod: "UPI / Stripe", purpose: "Childhood nutrition daily meals", projectAllocation: "PRJ-105", receiptNumber: "HH-REC-2024-017", transactionRef: "UPI-8841029410", taxExemptionIssued: true, status: "Verified" }
];

export const initialExpenses = [
  { id: "EXP-2024-001", project: "PRJ-101", category: "Equipment & Supplies", amount: 24500, date: "2024-02-18", vendor: "SuryaShakti Solar Pumps Ltd.", paymentMethod: "Bank Transfer", description: "Purchase and installation of 7 heavy-duty submersible solar pump sets", status: "Approved", approvedBy: "Pooja Hegde", receiptRef: "INV-SURYA-8910", isDuplicateFlag: false },
  { id: "EXP-2024-002", project: "PRJ-101", category: "Supplies", amount: 14800, date: "2024-04-12", vendor: "AquaPure Filter Tech Pvt Ltd", paymentMethod: "Bank Transfer", description: "Dual-media sand & carbon filters, UV purifiers and chlorination dosing units", status: "Approved", approvedBy: "Pooja Hegde", receiptRef: "INV-AP-4401", isDuplicateFlag: false },
  { id: "EXP-2024-003", project: "PRJ-102", category: "Equipment & Supplies", amount: 28400, date: "2024-01-20", vendor: "GreenByte IT Solutions", paymentMethod: "Bank Transfer", description: "180 refurbished enterprise laptops with warranty and Linux operating systems", status: "Approved", approvedBy: "Pooja Hegde", receiptRef: "INV-GB-1029", isDuplicateFlag: false },
  { id: "EXP-2024-004", project: "PRJ-102", category: "Honorarium & Training", amount: 9600, date: "2024-05-15", vendor: "CodeCraft Educator Network", paymentMethod: "Bank Transfer", description: "Trainer stipends for 6 female computer science instructors across 18 schools (Quarter 1)", status: "Approved", approvedBy: "Pooja Hegde", receiptRef: "VOUCH-TRN-041", isDuplicateFlag: false },
  { id: "EXP-2024-005", project: "PRJ-103", category: "Equipment & Supplies", amount: 42000, date: "2023-07-25", vendor: "Mahindra & Mahindra Special Vehicles", paymentMethod: "Wire Transfer", description: "Custom fabrication of 2 heavy-duty all-terrain 4x4 mobile health clinic ambulances", status: "Approved", approvedBy: "Pooja Hegde", receiptRef: "INV-MM-78210", isDuplicateFlag: false },
  { id: "EXP-2024-006", project: "PRJ-103", category: "Medical Supplies", amount: 16500, date: "2024-03-10", vendor: "Cipla Lifesciences & Jan Aushadhi", paymentMethod: "Bank Transfer", description: "Bulk emergency medicines, iron tablets, diagnostic strips, and neonatal monitors", status: "Approved", approvedBy: "Pooja Hegde", receiptRef: "INV-CIP-99201", isDuplicateFlag: false },
  { id: "EXP-2024-007", project: "PRJ-104", category: "Food & Relief", amount: 22000, date: "2024-06-12", vendor: "Maharashtra State Civil Supplies", paymentMethod: "Bank Transfer", description: "Emergency grain ration packs (rice, lentils, oil, iodized salt) for 2,000 cyclone survivors", status: "Approved", approvedBy: "Pooja Hegde", receiptRef: "INV-MSCS-8819", isDuplicateFlag: false },
  { id: "EXP-2024-008", project: "PRJ-104", category: "Emergency Shelter", amount: 11400, date: "2024-06-20", vendor: "Konkan Polymers & Tarpaulins", paymentMethod: "Bank Transfer", description: "High-density heavy-duty waterproof tarpaulin sheets and bamboo stakes", status: "Approved", approvedBy: "Pooja Hegde", receiptRef: "INV-KP-3329", isDuplicateFlag: false },
  { id: "EXP-2024-009", project: "PRJ-105", category: "Food & Relief", amount: 27800, date: "2024-04-18", vendor: "APMC Grain Wholesalers Vashi", paymentMethod: "Bank Transfer", description: "Bulk food supplies for community kitchen: flour, pulses, cooking oil, spices (Q2)", status: "Approved", approvedBy: "Pooja Hegde", receiptRef: "INV-APMC-9041", isDuplicateFlag: false },
  { id: "EXP-2024-010", project: "PRJ-105", category: "Utilities & Fuel", amount: 6200, date: "2024-06-30", vendor: "Bharat Petroleum Commercial LPG", paymentMethod: "Bank Transfer", description: "Commercial kitchen LPG cylinders (45 units) and delivery logistics", status: "Approved", approvedBy: "Pooja Hegde", receiptRef: "INV-BPCL-10492", isDuplicateFlag: false },
  { id: "EXP-2024-011", project: "PRJ-106", category: "Equipment & Supplies", amount: 11200, date: "2024-04-22", vendor: "Vidarbha Agro Equipment Centre", paymentMethod: "Bank Transfer", description: "Langstroth scientific wooden beehive boxes (120 units) & protective veil suits", status: "Approved", approvedBy: "Pooja Hegde", receiptRef: "INV-VA-40192", isDuplicateFlag: false },
  { id: "EXP-2024-012", project: "PRJ-106", category: "Training & Travel", amount: 5400, date: "2024-07-15", vendor: "Tribal Research Institute Pune", paymentMethod: "Cheque", description: "Field master trainers honorarium and botanical nursery field travel allowances", status: "Approved", approvedBy: "Pooja Hegde", receiptRef: "INV-TRI-8812", isDuplicateFlag: false },
  { id: "EXP-2024-013", project: "PRJ-107", category: "Facility & Rent", amount: 21000, date: "2024-03-01", vendor: "Thane Real Estate Holdings", paymentMethod: "Bank Transfer", description: "6-month lease rental and security deposit for transitional residential hostel", status: "Approved", approvedBy: "Pooja Hegde", receiptRef: "RENT-TH-2024-Q1", isDuplicateFlag: false },
  { id: "EXP-2024-014", project: "PRJ-107", category: "Education & Skilling", amount: 14500, date: "2024-06-28", vendor: "Don Bosco Skill Mission Institute", paymentMethod: "Bank Transfer", description: "Vocational course fees for 22 youth in electrical maintenance and retail logistics", status: "Approved", approvedBy: "Pooja Hegde", receiptRef: "INV-DBSM-9941", isDuplicateFlag: false },
  { id: "EXP-2024-015", project: "PRJ-101", category: "Travel & Fuel", amount: 3800, date: "2024-08-14", vendor: "Marathwada Rural Transport Fleet", paymentMethod: "Corporate Card", description: "Hydrology survey team diesel fuel and 4x4 vehicle rental for 14 remote hamlet visits", status: "Pending", approvedBy: null, receiptRef: "FUEL-MRT-9018", isDuplicateFlag: false },
  { id: "EXP-2024-016", project: "PRJ-103", category: "Vehicle Maintenance", amount: 4800, date: "2024-09-02", vendor: "Amravati Auto Care & Diesel", paymentMethod: "Bank Transfer", description: "Quarterly engine overhaul, shock absorber replacement, and tire rotation for Mobile Clinic Van #1", status: "Pending", approvedBy: null, receiptRef: "INV-AAC-4019", isDuplicateFlag: false },
  { id: "EXP-2024-017", project: "PRJ-105", category: "Food & Relief", amount: 8900, date: "2024-09-25", vendor: "Metro Cash & Carry", paymentMethod: "Bank Transfer", description: "Emergency supply of baby formula, fortified cereal, and hygiene soap for slum creches", status: "Pending", approvedBy: null, receiptRef: "INV-MCC-77102", isDuplicateFlag: false }
];

export const initialEvents = [
  { id: "EVT-2024-001", title: "World Water Day: Community Water Rights Summit", type: "Awareness Campaign", project: "PRJ-101", date: "2024-03-22", location: "Jalna Community Hall, Marathwada", organizer: "Dr. Aarti Deshmukh", participantsCount: 450, beneficiariesReached: 1200, budget: 3500, spent: 3100, status: "Completed", outcomeSummary: "14 village Paani Panchayats signed water management charters and received testing kits." },
  { id: "EVT-2024-002", title: "SheCodes Annual STEM Girls Hackathon", type: "Workshop & Competition", project: "PRJ-102", date: "2024-06-15", location: "Pune City Innovation Center", organizer: "Kavita Sen", participantsCount: 220, beneficiariesReached: 400, budget: 4800, spent: 4400, status: "Completed", outcomeSummary: "48 coding projects presented by adolescent girls; 12 received university mentorship offers." },
  { id: "EVT-2024-003", title: "Melghat Intensive Tribal Maternal Health Camp", type: "Medical Camp", project: "PRJ-103", date: "2024-07-22", location: "Dharni Primary Health Center, Amravati", organizer: "Dr. Vikram Sethi", participantsCount: 380, beneficiariesReached: 380, budget: 6200, spent: 5800, status: "Completed", outcomeSummary: "142 pregnant women screened; 18 high-risk pregnancies referred to district specialty hospital." },
  { id: "EVT-2024-004", title: "Cyclone Preparedness & First-Aid Simulation", type: "Disaster Preparedness", project: "PRJ-104", date: "2024-05-28", location: "Ratnagiri Port Fishermen Association", organizer: "Captain (Retd) Arjun Nair", participantsCount: 160, beneficiariesReached: 600, budget: 2800, spent: 2600, status: "Completed", outcomeSummary: "Fishermen trained in VHF radio distress protocols, life-jacket usage, and emergency food preservation." },
  { id: "EVT-2024-005", title: "Dharavi World Food Day Nutrition Carnival", type: "Community Outreach", project: "PRJ-105", date: "2024-10-16", location: "Kumbharwada Ground, Dharavi", organizer: "Meera Fernandez", participantsCount: 1200, beneficiariesReached: 3200, budget: 5500, spent: 5200, status: "Completed", outcomeSummary: "Distributed 3,000 warm high-protein meal bowls and conducted 450 pediatric growth screenings." },
  { id: "EVT-2024-006", title: "Forest Harvest Honey & Moringa Showcase", type: "Exhibition & Market", project: "PRJ-106", date: "2024-11-20", location: "Nagpur Central Organic Expo Grounds", organizer: "Rajeshwar Rao", participantsCount: 500, beneficiariesReached: 800, budget: 4200, spent: 1200, status: "Upcoming", outcomeSummary: "Scheduled to showcase 1,200 jars of certified wild honey and handloom bamboo crafts directly to buyers." },
  { id: "EVT-2024-007", title: "Youth Career Fair & Corporate Interview Day", type: "Career Fair", project: "PRJ-107", date: "2024-11-28", location: "Thane Social Innovation Hub", organizer: "Kavita Sen", participantsCount: 80, beneficiariesReached: 120, budget: 3200, spent: 800, status: "Upcoming", outcomeSummary: "15 corporate hiring partners confirmed to conduct walk-in interviews for care-leavers." }
];

export const initialInventory = [
  { id: "INV-001", itemName: "Submersible Solar Pump Kits (3HP)", category: "Water & Sanitation", quantity: 5, unit: "units", location: "Pune Central Warehouse", reorderLevel: 2, purchaseDate: "2024-02-10", supplier: "SuryaShakti Ltd", unitCost: 3500, status: "In Stock" },
  { id: "INV-002", itemName: "Dual-Media Sand & Carbon Filter Media", category: "Water & Sanitation", quantity: 8, unit: "sacks (50kg)", location: "Pune Central Warehouse", reorderLevel: 10, purchaseDate: "2024-03-15", supplier: "AquaPure Filter Tech", unitCost: 45, status: "Low Stock" },
  { id: "INV-003", itemName: "Refurbished Education Laptops (Core i5)", category: "Educational Supplies", quantity: 45, unit: "units", location: "Pune IT Hub", reorderLevel: 20, purchaseDate: "2024-01-18", supplier: "GreenByte IT", unitCost: 155, status: "In Stock" },
  { id: "INV-004", itemName: "Arduino & STEM Robotics Student Kits", category: "Educational Supplies", quantity: 12, unit: "kits", location: "Pune IT Hub", reorderLevel: 25, purchaseDate: "2024-02-28", supplier: "StemRobo Edutech", unitCost: 65, status: "Low Stock" },
  { id: "INV-005", itemName: "Portable Doppler Ultrasound Scanner", category: "Medical Equipment", quantity: 2, unit: "units", location: "Amravati Mobile Health Unit", reorderLevel: 1, purchaseDate: "2023-08-10", supplier: "GE Healthcare India", unitCost: 4200, status: "In Stock" },
  { id: "INV-006", itemName: "Ready-to-Use Therapeutic Food (RUTF)", category: "Nutrition & Relief", quantity: 320, unit: "pouches", location: "Melghat Field Clinic", reorderLevel: 500, purchaseDate: "2024-05-12", supplier: "NutriLife Food Solutions", unitCost: 2.5, status: "Low Stock" },
  { id: "INV-007", itemName: "Waterproof Heavy-Duty Tarpaulins (24x18 ft)", category: "Disaster Relief", quantity: 85, unit: "sheets", location: "Ratnagiri Disaster Depot", reorderLevel: 100, purchaseDate: "2024-06-08", supplier: "Konkan Polymers", unitCost: 35, status: "Low Stock" },
  { id: "INV-008", itemName: "Water Purification Tablets (10,000 tabs/box)", category: "Disaster Relief", quantity: 18, unit: "boxes", location: "Ratnagiri Disaster Depot", reorderLevel: 10, purchaseDate: "2024-06-10", supplier: "Medilink Healthcare", unitCost: 40, status: "In Stock" },
  { id: "INV-009", itemName: "Commercial Grain Fortified Flour (Atta)", category: "Food Bank", quantity: 140, unit: "bags (25kg)", location: "Dharavi Kitchen Store", reorderLevel: 50, purchaseDate: "2024-08-20", supplier: "APMC Wholesalers", unitCost: 22, status: "In Stock" },
  { id: "INV-010", itemName: "Refined Sunflower Cooking Oil (15L Tins)", category: "Food Bank", quantity: 28, unit: "tins", location: "Dharavi Kitchen Store", reorderLevel: 15, purchaseDate: "2024-08-22", supplier: "Adani Wilmar Supplies", unitCost: 26, status: "In Stock" },
  { id: "INV-011", itemName: "Scientific Wooden Beehive Boxes", category: "Agroforestry", quantity: 40, unit: "boxes", location: "Nagpur Agro Hub", reorderLevel: 15, purchaseDate: "2024-04-10", supplier: "Vidarbha Agro Equipment", unitCost: 60, status: "In Stock" },
  { id: "INV-012", itemName: "High-Graft Moringa Seedling Saplings", category: "Agroforestry", quantity: 650, unit: "saplings", location: "Chandrapur Nursery", reorderLevel: 200, purchaseDate: "2024-05-01", supplier: "Forest Dept Nursery", unitCost: 1.2, status: "In Stock" }
];

export const initialTasks = [
  { id: "TSK-001", title: "Complete Q3 Water Quality Lab Testing for 14 Hamlets", project: "PRJ-101", assignee: "Dr. Aarti Deshmukh", priority: "High", status: "In Progress", dueDate: "2024-11-05", estimatedHours: 24, description: "Collect water samples from newly installed borewells and test for fluorides, nitrates, and microbial pathogens." },
  { id: "TSK-002", title: "Finalize Annual 80G Tax Exemption Renewal Documentation", project: "PRJ-101", assignee: "Pooja Hegde", priority: "Urgent", status: "In Progress", dueDate: "2024-11-15", estimatedHours: 40, description: "Collate audited financial statements, trustee affidavits, and activity reports for submission to Income Tax authorities." },
  { id: "TSK-003", title: "Deploy 45 Laptops to 3 Rural Secondary Schools", project: "PRJ-102", assignee: "Sneha Kulkarni", priority: "Medium", status: "Pending", dueDate: "2024-11-20", estimatedHours: 16, description: "Configure student profiles, install offline educational coding software, and ensure solar battery power sync." },
  { id: "TSK-004", title: "Submit FCRA Quarterly Foreign Receipt Declaration", project: "PRJ-102", assignee: "Pooja Hegde", priority: "Urgent", status: "Completed", dueDate: "2024-10-15", estimatedHours: 12, description: "File official online form FC-4 with Ministry of Home Affairs for grants received from TechCorp and EmpowerHer." },
  { id: "TSK-005", title: "Schedule Van Engine Servicing and Diagnostic Calibration", project: "PRJ-103", assignee: "Dr. Vikram Sethi", priority: "High", status: "In Progress", dueDate: "2024-11-08", estimatedHours: 8, description: "Coordinate with Amravati Auto Care for scheduled 4x4 maintenance before winter tribal circuit tour." },
  { id: "TSK-006", title: "Compile Cyclone Monsoon Relief Post-Operation Impact Report", project: "PRJ-104", assignee: "Captain (Retd) Arjun Nair", priority: "Medium", status: "Completed", dueDate: "2024-10-25", estimatedHours: 30, description: "Consolidate village beneficiary registers, photographic evidence, and local authority clearance letters for donors." },
  { id: "TSK-007", title: "Inspect Dharavi Central Kitchen Food Safety & Pest Control", project: "PRJ-105", assignee: "Meera Fernandez", priority: "High", status: "In Progress", dueDate: "2024-11-02", estimatedHours: 6, description: "Routine FSSAI sanitation inspection, grain silo moisture check, and deep cleaning protocol validation." },
  { id: "TSK-008", title: "Coordinate Wild Honey Organic Certification Inspection", project: "PRJ-106", assignee: "Rajeshwar Rao", priority: "Medium", status: "Pending", dueDate: "2024-11-18", estimatedHours: 20, description: "Host PGS-India organic inspector at Gadchiroli cooperative to certify non-timber forest produce." },
  { id: "TSK-009", title: "Conduct One-on-One Career Mentoring for 15 Care-Leavers", project: "PRJ-107", assignee: "Kavita Sen", priority: "Medium", status: "In Progress", dueDate: "2024-11-12", estimatedHours: 18, description: "Review resume drafts, practice interview questions, and assess independent living housing plans." },
  { id: "TSK-010", title: "Restock Emergency Water Purification Tablets & Tarpaulins", project: "PRJ-104", assignee: "Farhan Qureshi", priority: "Low", status: "Pending", dueDate: "2024-11-25", estimatedHours: 10, description: "Raise purchase requisition to replenish low stock at Ratnagiri disaster response depot." },
  { id: "TSK-011", title: "Prepare Trustee Board Meeting Operational Briefing", project: "PRJ-101", assignee: "Dr. Aarti Deshmukh", priority: "High", status: "Pending", dueDate: "2024-11-10", estimatedHours: 14, description: "Prepare slide deck highlighting project progress, fund utilization, and 2025 strategic expansion roadmap." }
];

export const initialAuditLogs = [
  { id: "AUD-1001", timestamp: "2024-10-28T09:15:22Z", userName: "Dr. Aarti Deshmukh", userRole: "Administrator", action: "UPDATE", module: "Projects", recordId: "PRJ-101", details: "Updated project milestone: 'Install UV & dual-media filter units' marked as Completed." },
  { id: "AUD-1002", timestamp: "2024-10-27T14:30:10Z", userName: "Pooja Hegde", userRole: "Finance Manager", action: "APPROVE", module: "Expenses", recordId: "EXP-2024-014", details: "Approved expense voucher #EXP-2024-014 ($14,500 for vocational course fees)." },
  { id: "AUD-1003", timestamp: "2024-10-26T11:45:00Z", userName: "Pooja Hegde", userRole: "Finance Manager", action: "CREATE", module: "Donations", recordId: "DON-2024-017", details: "Recorded online donation #DON-2024-017 ($3,500 from Priya & Siddharth Roy)." },
  { id: "AUD-1004", timestamp: "2024-10-25T16:20:45Z", userName: "Kavita Sen", userRole: "Project Manager", action: "CREATE", module: "Beneficiaries", recordId: "BEN-2024-022", details: "Registered new beneficiary: Baburao Ganpat Gawli (Dharavi Transit Camp)." },
  { id: "AUD-1005", timestamp: "2024-10-24T10:05:18Z", userName: "Dr. Aarti Deshmukh", userRole: "Administrator", action: "EXPORT", module: "Master Data", recordId: "GLOBAL-EXPORT", details: "Exported Consolidated NGO Master Workbook (.xlsx) with all 9 modules." },
  { id: "AUD-1006", timestamp: "2024-10-22T13:12:33Z", userName: "Captain (Retd) Arjun Nair", userRole: "Staff", action: "UPDATE", module: "Inventory", recordId: "INV-007", details: "Issued 35 tarpaulin sheets for emergency distribution; stock status changed to Low Stock." }
];

export const demoUsers = [
  { id: "USR-001", name: "Dr. Aarti Deshmukh", email: "admin@hopehorizon.org", role: "Administrator", title: "Executive Director & Program Head", avatar: "AD", phone: "+91 98201 12345" },
  { id: "USR-002", name: "Pooja Hegde", email: "finance@hopehorizon.org", role: "Finance Manager", title: "Chief Financial & Grants Officer", avatar: "PH", phone: "+91 98202 23456" },
  { id: "USR-003", name: "Kavita Sen", email: "pm@hopehorizon.org", role: "Project Manager", title: "Senior Project Lead", avatar: "KS", phone: "+91 98203 34567" },
  { id: "USR-004", name: "Farhan Qureshi", email: "staff@hopehorizon.org", role: "Staff", title: "Field Operations & Logistics Officer", avatar: "FQ", phone: "+91 99204 77123" }
];
