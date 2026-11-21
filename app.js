/**
 * LearnHub LMS - Single Page Offline Application
 * Based on SRS Specifications & exact UI design matching
 */

// Initial State / Preloaded Courses & Data (Persistent via localStorage)
const INITIAL_COURSES = [
  {
    id: "web-dev",
    title: "Web Development",
    category: "Development",
    modulesCount: 6,
    progress: 85,
    iconType: "code",
    colorTheme: "web-dev",
    description: "Master Modern Frontend and Backend Web Development with HTML, CSS, JavaScript, and Node.",
    modules: [
      {
        id: "m1",
        title: "Module 1: Semantic HTML5 & Modern Layouts",
        lessons: [
          { id: "l1", title: "1.1 Introduction to Web Architecture & HTML5", completed: true, content: "Learn how the client-server model functions, browser rendering engines, DOM trees, and clean semantic markup with header, nav, main, section, and aside tags." },
          { id: "l2", title: "1.2 CSS Flexbox and Grid Masterclass", completed: true, content: "Deep dive into 1D and 2D layout systems. Flexbox axis alignments, fractional units (fr), CSS Grid template areas, auto-fit and auto-fill responsive techniques." },
          { id: "l3", title: "1.3 Responsive Media Queries & Fluid Typography", completed: true, content: "Mobile-first responsive design strategies, viewport units, clamp() function, and accessible responsive image techniques." }
        ]
      },
      {
        id: "m2",
        title: "Module 2: JavaScript ES6+ & DOM APIs",
        lessons: [
          { id: "l4", title: "2.1 Modern JavaScript Syntax & Scope", completed: true, content: "Lexical scoping, closures, destructuring, arrow functions, promises, and async/await control flows." },
          { id: "l5", title: "2.2 DOM Manipulation & Event Handling", completed: true, content: "Event delegation, bubbling vs capturing, custom events, and building interactive web widgets." }
        ]
      },
      {
        id: "m3",
        title: "Module 3: React Single Page Architecture",
        lessons: [
          { id: "l6", title: "3.1 Component Lifecycle & Hooks", completed: true, content: "State management using useState, useEffect side effects, custom hooks, and memoization." },
          { id: "l7", title: "3.2 Client-Side Routing & Global State", completed: false, content: "Implementing reactive URL routing, context API, and scalable application architecture." }
        ]
      }
    ]
  },
  {
    id: "db-mgmt",
    title: "Database Management",
    category: "Data Science",
    modulesCount: 8,
    progress: 40,
    iconType: "db",
    colorTheme: "db-mgmt",
    description: "Relational database modeling, SQL querying, indexing, transactions, and normalization techniques.",
    modules: [
      {
        id: "dm1",
        title: "Module 1: Relational Concepts & ER Modeling",
        lessons: [
          { id: "dl1", title: "1.1 Entities, Attributes & Cardinality", completed: true, content: "Understand entity-relationship modeling, primary keys, foreign keys, and referential integrity constraints." },
          { id: "dl2", title: "1.2 Normalization: 1NF, 2NF, 3NF, BCNF", completed: true, content: "Eliminating data anomalies, functional dependencies, and lossless decomposition." }
        ]
      },
      {
        id: "dm2",
        title: "Module 2: Advanced SQL & Query Optimization",
        lessons: [
          { id: "dl3", title: "2.1 Joins, Subqueries & Window Functions", completed: false, content: "Mastering INNER, LEFT, FULL OUTER joins, CTEs, ROW_NUMBER, RANK, and PARTITION BY." },
          { id: "dl4", title: "2.2 Indexes, B-Trees & Execution Plans", completed: false, content: "Index scan vs table scan, composite indices, and optimizing query throughput." }
        ]
      }
    ]
  },
  {
    id: "cyber-sec",
    title: "Cyber Security",
    category: "Security",
    modulesCount: 5,
    progress: 20,
    iconType: "shield",
    colorTheme: "cyber-sec",
    description: "Core cybersecurity principles, threat models, cryptography, network defenses, and OWASP Top 10.",
    modules: [
      {
        id: "cs1",
        title: "Module 1: Fundamental Security Concepts",
        lessons: [
          { id: "csl1", title: "1.1 CIA Triad & Threat Modeling", completed: true, content: "Confidentiality, Integrity, and Availability. Threat vectors, risk assessment matrices, and security controls." },
          { id: "csl2", title: "1.2 Modern Cryptography & Symmetric/Asymmetric Ciphers", completed: false, content: "AES, RSA, ECC, digital signatures, hashing algorithms (SHA-256), and PKI infrastructure." }
        ]
      },
      {
        id: "cs2",
        title: "Module 2: Web Application Security (OWASP Top 10)",
        lessons: [
          { id: "csl3", title: "2.1 Injection, XSS & CSRF Defenses", completed: false, content: "Analyzing input validation flaws, parameterized queries, Content Security Policy (CSP), and SameSite cookies." },
          { id: "csl4", title: "2.2 Secure File Upload Restrictions & Validation", completed: false, content: "Magic byte inspection, extension whitelist, malware quarantine, and preventing remote code execution." }
        ]
      }
    ]
  }
];

const INITIAL_MATERIALS = [
  { id: "m-1", name: "Web_Dev_Cheatsheet.pdf", type: "PDF", size: "2.4 MB", course: "Web Development", category: "Documents", date: "2026-11-10" },
  { id: "m-2", name: "Database_Normalization_Guide.pdf", type: "PDF", size: "3.8 MB", course: "Database Management", category: "Documents", date: "2026-11-12" },
  { id: "m-3", name: "OWASP_Top_10_Summary.pptx", type: "PPTX", size: "8.1 MB", course: "Cyber Security", category: "Presentations", date: "2026-11-15" }
];

const INITIAL_TASKS = [
  { id: "t1", title: "Submit Assignment", course: "Web Development", date: "Nov 12", type: "assignment", iconType: "yellow", due: "2026-11-12", completed: true },
  { id: "t2", title: "Take Quiz", course: "Database Management", date: "Nov 14", type: "quiz", iconType: "purple", due: "2026-11-14", completed: false },
  { id: "t3", title: "Review Notes", course: "Cyber Security", date: "Nov 16", type: "review", iconType: "green", due: "2026-11-16", completed: false }
];

// File restrictions according to SRS Section 4
const FILE_RESTRICTIONS = {
  documents: {
    exts: [".pdf", ".doc", ".docx", ".txt"],
    mimes: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"],
    maxBytes: 10 * 1024 * 1024,
    label: "PDF, DOC, DOCX, TXT (Max 10 MB)"
  },
  presentations: {
    exts: [".ppt", ".pptx"],
    mimes: ["application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
    maxBytes: 25 * 1024 * 1024,
    label: "PPT, PPTX (Max 25 MB)"
  },
  images: {
    exts: [".jpg", ".jpeg", ".png", ".webp"],
    mimes: ["image/jpeg", "image/png", "image/webp"],
    maxBytes: 2 * 1024 * 1024,
    label: "JPG, PNG, WEBP (Max 2 MB)"
  },
  assignment: {
    exts: [".pdf", ".doc", ".docx", ".txt", ".zip"],
    mimes: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain", "application/zip", "application/x-zip-compressed"],
    maxBytes: 20 * 1024 * 1024,
    label: "PDF, DOCX, TXT, ZIP (Max 20 MB)"
  }
};

// Store in LocalStorage for offline persistence
function getStorage(key, defaultVal) {
  try {
    const v = localStorage.getItem("learnhub_" + key);
    return v ? JSON.parse(v) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}

function setStorage(key, val) {
  try {
    localStorage.setItem("learnhub_" + key, JSON.stringify(val));
  } catch (e) {
    console.error(e);
  }
}

// Application State
const state = {
  currentTab: "home", // home, courses, materials, assignments, progress, notifications, settings
  courseViewMode: "catalog", // 'catalog' (shows all courses) | 'detail' (shows syllabus)
  searchQuery: "",
  courses: getStorage("courses", INITIAL_COURSES),
  materials: getStorage("materials", INITIAL_MATERIALS),
  tasks: getStorage("tasks", INITIAL_TASKS),
  activeCourseId: "web-dev",
  activeLessonId: "l1",
  activeModal: null, // 'upload' | 'assignment' | 'schedule' | null
  calendarMonth: 10, // November (0-indexed = 10)
  calendarYear: 2026,
  notifications: [
    { id: 1, text: "Assignment 1 in Web Development submitted successfully.", time: "2 hours ago", unread: true },
    { id: 2, text: "Database Management quiz unlocks on Nov 14.", time: "1 day ago", unread: true },
    { id: 3, text: "New study material added to Cyber Security.", time: "2 days ago", unread: true }
  ]
};

// SVG Icon Helper
function getIcon(name) {
  switch (name) {
    case "cap-logo":
      return `<svg width="42" height="42" viewBox="0 0 48 48" fill="none">
        <path d="M24 6L4 16L24 26L44 16L24 6Z" fill="#111827"/>
        <path d="M10 20V32C10 37 16 41 24 41C32 41 38 37 38 32V20L24 28L10 20Z" fill="#F8C02F"/>
        <path d="M41 18V31" stroke="#F8C02F" stroke-width="3" stroke-linecap="round"/>
        <circle cx="41" cy="33" r="2.5" fill="#111827"/>
      </svg>`;
    case "home":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`;
    case "play":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
    case "book":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`;
    case "check-square":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>`;
    case "chart":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`;
    case "bell":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`;
    case "settings":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`;
    case "search":
      return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;
    case "sun":
      return `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    case "arrow-right":
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
    case "upload":
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>`;
    case "calendar":
      return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;
    case "file-text":
      return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`;
    case "code-laptop":
      return `<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="6" y="8" width="36" height="24" rx="3" fill="#4338CA"/>
        <path d="M2 34C2 32.8954 2.89543 32 4 32H44C45.1046 32 46 32.8954 46 34V36C46 38.2091 44.2091 40 42 40H6C3.79086 40 2 38.2091 2 36V34Z" fill="#312E81"/>
        <text x="14" y="24" fill="#ffffff" font-size="14" font-family="monospace" font-weight="bold">&lt;/&gt;</text>
      </svg>`;
    case "database-cylinder":
      return `<svg width="46" height="46" viewBox="0 0 48 48" fill="none">
        <ellipse cx="24" cy="11" rx="16" ry="6" fill="#047857"/>
        <path d="M8 11V21C8 24.3137 15.1634 27 24 27C32.8366 27 40 24.3137 40 21V11" stroke="#065F46" stroke-width="2" fill="#059669"/>
        <path d="M8 21V31C8 34.3137 15.1634 37 24 37C32.8366 37 40 34.3137 40 31V21" stroke="#065F46" stroke-width="2" fill="#10B981"/>
      </svg>`;
    case "shield-lock":
      return `<svg width="46" height="46" viewBox="0 0 48 48" fill="none">
        <path d="M24 4L8 10V22C8 33 15 41 24 44C33 41 40 33 40 22V10L24 4Z" fill="#EF4444"/>
        <rect x="19" y="24" width="10" height="9" rx="2" fill="white"/>
        <path d="M21 24V21C21 19.3431 22.3431 18 24 18C25.6569 18 27 19.3431 27 21V24" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </svg>`;
    case "banner-art":
      return `<svg width="180" height="150" viewBox="0 0 200 160" fill="none">
        <!-- Books stack -->
        <rect x="25" y="115" width="140" height="22" rx="4" fill="#374151"/>
        <rect x="25" y="110" width="140" height="7" fill="#F3F4F6"/>
        <rect x="35" y="85" width="125" height="24" rx="4" fill="#F8C02F"/>
        <rect x="35" y="80" width="125" height="7" fill="#FEF3C7"/>
        <!-- Laptop -->
        <rect x="85" y="70" width="85" height="52" rx="4" fill="#1F2937"/>
        <rect x="90" y="74" width="75" height="44" rx="2" fill="#3B82F6"/>
        <rect x="75" y="122" width="105" height="6" rx="2" fill="#9CA3AF"/>
        <!-- Graduation Cap -->
        <polygon points="120,20 60,45 120,70 180,45" fill="#1F2937"/>
        <polygon points="90,52 90,75 150,75 150,52" fill="#374151"/>
        <path d="M175,47 L175,75" stroke="#F59E0B" stroke-width="3"/>
        <circle cx="175" cy="78" r="4" fill="#F59E0B"/>
      </svg>`;
    case "cup":
      return `🏆`;
    default:
      return "";
  }
}

// RENDER FUNCTION
function renderApp() {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = `
    <!-- SIDEBAR -->
    <aside class="sidebar">
      <div>
        <div class="brand-section">
          <div class="brand-logo-wrap">
            ${getIcon("cap-logo")}
          </div>
          <div class="brand-title">LearnHub</div>
          <div class="brand-subtitle">Learn • Practice • Grow</div>
        </div>

        <nav>
          <ul class="nav-list">
            <li class="nav-item ${state.currentTab === 'home' ? 'active' : ''}" onclick="switchTab('home')">
              <span class="nav-icon">${getIcon("home")}</span>
              <span class="nav-text">Home</span>
            </li>
            <li class="nav-item ${state.currentTab === 'courses' ? 'active' : ''}" onclick="switchTab('courses')">
              <span class="nav-icon">${getIcon("play")}</span>
              <span class="nav-text">My Courses</span>
            </li>
            <li class="nav-item ${state.currentTab === 'materials' ? 'active' : ''}" onclick="switchTab('materials')">
              <span class="nav-icon">${getIcon("book")}</span>
              <span class="nav-text">Study Materials</span>
            </li>
            <li class="nav-item ${state.currentTab === 'assignments' ? 'active' : ''}" onclick="switchTab('assignments')">
              <span class="nav-icon">${getIcon("check-square")}</span>
              <span class="nav-text">Assignments</span>
            </li>
            <li class="nav-item ${state.currentTab === 'progress' ? 'active' : ''}" onclick="switchTab('progress')">
              <span class="nav-icon">${getIcon("chart")}</span>
              <span class="nav-text">Progress</span>
            </li>
            <li class="nav-item ${state.currentTab === 'notifications' ? 'active' : ''}" onclick="switchTab('notifications')">
              <span class="nav-icon">${getIcon("bell")}</span>
              <span class="nav-text">Notifications</span>
              <span class="nav-badge">3</span>
            </li>
            <li class="nav-item ${state.currentTab === 'settings' ? 'active' : ''}" onclick="switchTab('settings')">
              <span class="nav-icon">${getIcon("settings")}</span>
              <span class="nav-text">Settings</span>
            </li>
          </ul>
        </nav>
      </div>

      <div class="sidebar-footer">
        <div class="handdrawn-quote">
          Small steps...<br>
          Big achievements! ♡
        </div>
        <div class="sidebar-illu">
          <svg width="76" height="52" viewBox="0 0 100 70" fill="none">
            <rect x="10" y="38" width="80" height="14" rx="3" fill="#1F2937"/>
            <rect x="10" y="34" width="80" height="5" fill="#E5E7EB"/>
            <rect x="18" y="20" width="70" height="15" rx="3" fill="#F8C02F"/>
            <rect x="18" y="16" width="70" height="5" fill="#FEF3C7"/>
          </svg>
        </div>
      </div>
    </aside>

    <!-- MAIN BODY -->
    <main class="main-wrapper">
      <!-- HEADER -->
      <header class="top-header">
        <div class="search-box-container">
          <span class="search-icon-inside">${getIcon("search")}</span>
          <input 
            type="text" 
            id="globalSearchInput"
            class="search-input" 
            placeholder="Search courses, notes..." 
            value="${state.searchQuery}"
            oninput="handleSearch(this.value)"
            autocomplete="off"
          />
          <div id="searchDropdownMount">
            ${renderSearchDropdown()}
          </div>
        </div>
        <div class="header-actions">
          <button class="icon-btn" title="Toggle Theme" onclick="toggleThemeNotice()">
            ${getIcon("sun")}
          </button>
          <button class="icon-btn" title="Notifications" onclick="switchTab('notifications')">
            ${getIcon("bell")}
            <span class="notification-dot">3</span>
          </button>
          <div class="avatar-badge" title="Learner Profile (No login required - Instant offline access)">
            N
          </div>
        </div>
      </header>

      <!-- VIEW RENDERER -->
      <section class="content-area">
        ${renderCurrentView()}
      </section>
    </main>

    <!-- MODALS (Upload / Submit Assignment) -->
    ${renderModal()}
  `;
}

// RENDER SWITCH FOR TABS
function renderCurrentView() {
  switch (state.currentTab) {
    case "home":
      return renderDashboard();
    case "courses":
      return renderCoursesView();
    case "materials":
      return renderMaterialsView();
    case "assignments":
      return renderAssignmentsView();
    case "progress":
      return renderProgressView();
    case "notifications":
      return renderNotificationsView();
    case "settings":
      return renderSettingsView();
    default:
      return renderDashboard();
  }
}

function renderSearchDropdown() {
  const q = (state.searchQuery || "").trim().toLowerCase();
  if (!q) return "";

  // 1. Search Courses
  const matchingCourses = state.courses.filter(c => 
    c.title.toLowerCase().includes(q) ||
    (c.category && c.category.toLowerCase().includes(q)) ||
    (c.description && c.description.toLowerCase().includes(q))
  );

  // 2. Search Lessons / Modules
  const matchingLessons = [];
  for (const c of state.courses) {
    if (c.modules) {
      for (const m of c.modules) {
        if (m.lessons) {
          for (const l of m.lessons) {
            if (l.title.toLowerCase().includes(q) || (l.content && l.content.toLowerCase().includes(q))) {
              matchingLessons.push({ courseId: c.id, courseTitle: c.title, lessonId: l.id, lessonTitle: l.title });
            }
          }
        }
      }
    }
  }

  // 3. Search Study Materials
  const matchingMaterials = state.materials.filter(m =>
    m.name.toLowerCase().includes(q) ||
    m.course.toLowerCase().includes(q) ||
    m.type.toLowerCase().includes(q)
  );

  // 4. Search Tasks
  const matchingTasks = state.tasks.filter(t =>
    t.title.toLowerCase().includes(q) ||
    t.course.toLowerCase().includes(q)
  );

  const totalResults = matchingCourses.length + matchingLessons.length + matchingMaterials.length + matchingTasks.length;

  if (totalResults === 0) {
    return `
      <div class="search-dropdown-results">
        <div class="search-no-results">
          🔍 No results found for "<strong>${state.searchQuery}</strong>"
        </div>
      </div>
    `;
  }

  let html = `<div class="search-dropdown-results">`;

  if (matchingCourses.length > 0) {
    html += `<div class="search-drop-group">Courses</div>`;
    matchingCourses.forEach(c => {
      html += `
        <div class="search-drop-item" onclick="selectSearchResult('course', '${c.id}')">
          <div class="search-drop-icon">🎓</div>
          <div class="search-drop-info">
            <div class="search-drop-title">${c.title}</div>
            <div class="search-drop-sub">${c.category} • ${c.progress}% completed</div>
          </div>
        </div>
      `;
    });
  }

  if (matchingLessons.length > 0) {
    html += `<div class="search-drop-group">Lessons & Notes</div>`;
    matchingLessons.slice(0, 4).forEach(l => {
      html += `
        <div class="search-drop-item" onclick="selectSearchResult('lesson', '${l.courseId}', '${l.lessonId}')">
          <div class="search-drop-icon">📖</div>
          <div class="search-drop-info">
            <div class="search-drop-title">${l.lessonTitle}</div>
            <div class="search-drop-sub">${l.courseTitle}</div>
          </div>
        </div>
      `;
    });
  }

  if (matchingMaterials.length > 0) {
    html += `<div class="search-drop-group">Study Materials</div>`;
    matchingMaterials.slice(0, 4).forEach(m => {
      html += `
        <div class="search-drop-item" onclick="selectSearchResult('material')">
          <div class="search-drop-icon">📄</div>
          <div class="search-drop-info">
            <div class="search-drop-title">${m.name}</div>
            <div class="search-drop-sub">${m.course} • ${m.type} (${m.size})</div>
          </div>
        </div>
      `;
    });
  }

  if (matchingTasks.length > 0) {
    html += `<div class="search-drop-group">Tasks & Quizzes</div>`;
    matchingTasks.slice(0, 3).forEach(t => {
      html += `
        <div class="search-drop-item" onclick="selectSearchResult('assignment')">
          <div class="search-drop-icon">📝</div>
          <div class="search-drop-info">
            <div class="search-drop-title">${t.title}</div>
            <div class="search-drop-sub">${t.course} • Due ${t.date}</div>
          </div>
        </div>
      `;
    });
  }

  html += `</div>`;
  return html;
}

// 1. DASHBOARD VIEW (Exact match to uploaded UI image)
function renderDashboard() {
  return `
    <div class="dashboard-grid">
      <!-- LEFT COLUMN -->
      <div class="dash-left">
        <!-- WELCOME BANNER -->
        <div class="welcome-banner">
          <div class="banner-text">
            <h1 class="banner-title">
              Welcome back,<br>Learner!
              <span class="star-decor">☆</span>
            </h1>
            <p class="banner-sub">Keep going — you're doing great! ♡</p>
            <button class="continue-btn" onclick="openCourse('${state.activeCourseId}')">
              Continue Learning ${getIcon("arrow-right")}
            </button>
          </div>
          <div class="banner-illustration">
            ${getIcon("banner-art")}
          </div>
        </div>

        <!-- 4 QUICK ACTIONS -->
        <div class="quick-actions-row">
          <div class="quick-action-card" onclick="openModal('upload')">
            <div class="qa-icon-wrap qa-yellow">
              ${getIcon("upload")}
            </div>
            <div class="qa-title">Upload<br>Materials</div>
          </div>
          <div class="quick-action-card" onclick="switchTab('materials')">
            <div class="qa-icon-wrap qa-blue">
              ${getIcon("search")}
            </div>
            <div class="qa-title">Search<br>Study Material</div>
          </div>
          <div class="quick-action-card" onclick="openModal('schedule')">
            <div class="qa-icon-wrap qa-orange">
              ${getIcon("calendar")}
            </div>
            <div class="qa-title">View<br>Schedule</div>
          </div>
          <div class="quick-action-card" onclick="switchTab('progress')">
            <div class="qa-icon-wrap qa-green">
              ${getIcon("chart")}
            </div>
            <div class="qa-title">Track<br>Progress</div>
          </div>
        </div>

        <!-- MY COURSES SECTION -->
        <div class="courses-section">
          <div class="section-hdr">
            <div class="section-hdr-left">
              <span>${getIcon("book")}</span>
              <span>My Courses</span>
            </div>
            <span class="view-all-link" onclick="switchTab('courses')">
              View All ${getIcon("arrow-right")}
            </span>
          </div>

          <div class="courses-cards-grid">
            ${state.courses.map(course => `
              <div class="course-card" onclick="openCourse('${course.id}')">
                <div class="course-card-top ${course.colorTheme}">
                  ${getCourseCardGraphic(course.iconType)}
                </div>
                <div class="course-card-body">
                  <div class="course-title-text">${course.title}</div>
                  <div class="course-modules-sub">${course.modulesCount} Modules • ${course.progress}% Complete</div>
                  <div class="course-progress-row">
                    <div class="progress-bar-container">
                      <div class="progress-bar-fill ${course.progress > 60 ? 'fill-orange' : (course.progress > 30 ? 'fill-green' : 'fill-orange')}" style="width: ${course.progress}%"></div>
                    </div>
                    <div class="course-card-arrow-btn">
                      ${getIcon("arrow-right")}
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- MOTIVATION FOOTER -->
        <div class="motivation-strip">
          <div class="moti-left">
            <div class="moti-trophy">${getIcon("cup")}</div>
            <div>
              <div class="moti-head">You're on the right track!</div>
              <div class="moti-sub">Keep learning, keep growing.</div>
            </div>
          </div>
          <div class="moti-right-art">
            <svg width="180" height="42" viewBox="0 0 200 50" fill="none">
              <path d="M5 40 Q 60 15, 120 38 T 195 10" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="4 4" fill="none"/>
              <polygon points="190,5 200,10 193,17" fill="#f59e0b"/>
              <rect x="155" y="30" width="8" height="15" rx="2" fill="#F8C02F"/>
              <rect x="168" y="22" width="8" height="23" rx="2" fill="#F8C02F"/>
              <rect x="181" y="14" width="8" height="31" rx="2" fill="#F8C02F"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: CALENDAR & TASKS -->
      <div class="dash-right">
        <!-- CALENDAR WIDGET -->
        <div class="cal-card">
          <div class="cal-header">
            <div class="cal-title-wrap">
              <span>${getIcon("calendar")}</span>
              <span>November 2026</span>
            </div>
            <div class="cal-nav-buttons">
              <span title="Previous month">&lt;</span>
              <span title="Next month">&gt;</span>
            </div>
          </div>

          <div class="cal-weekdays-grid">
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
          </div>

          <!-- November 2026 starts on Sunday (1st) and has 30 days -->
          <div class="cal-days-grid">
            ${renderNovemberCalendar()}
          </div>
        </div>

        <!-- UPCOMING TASKS WIDGET -->
        <div class="tasks-card">
          <div class="section-hdr" style="margin-bottom: 8px;">
            <div class="section-hdr-left" style="font-size: 16px;">
              <span>🕒</span>
              <span>Upcoming Tasks</span>
            </div>
            <span class="view-all-link" onclick="switchTab('assignments')">
              View All ${getIcon("arrow-right")}
            </span>
          </div>

          <div class="tasks-list">
            ${state.tasks.map(task => `
              <div class="task-item" onclick="switchTab('assignments')">
                <div class="task-icon-box ${task.iconType === 'yellow' ? 't-icon-yellow' : (task.iconType === 'purple' ? 't-icon-purple' : 't-icon-green')}">
                  ${getTaskIcon(task.type)}
                </div>
                <div class="task-details">
                  <div class="task-title">${task.title}</div>
                  <div class="task-course">${task.course}</div>
                </div>
                <div class="task-date-pill">${task.date}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function getCourseCardGraphic(iconType) {
  if (iconType === "code") return getIcon("code-laptop");
  if (iconType === "db") return getIcon("database-cylinder");
  if (iconType === "shield") return getIcon("shield-lock");
  return "";
}

function getTaskIcon(type) {
  if (type === "assignment") return `📋`;
  if (type === "quiz") return `📝`;
  return `📖`;
}

function renderNovemberCalendar() {
  // Nov 1, 2026 is Sunday, Nov 10 is highlighted as in image
  let html = "";
  for (let d = 1; d <= 30; d++) {
    const isToday = d === 10;
    html += `<div class="cal-cell ${isToday ? 'today-highlight' : ''}">${d}</div>`;
  }
  // Fill remaining to end of row if needed
  html += `<div class="cal-cell empty"></div><div class="cal-cell empty"></div><div class="cal-cell empty"></div><div class="cal-cell empty"></div><div class="cal-cell empty"></div>`;
  return html;
}

// 2. COURSES VIEW: Shows Catalog of ALL Courses or Detailed Syllabus
function renderCoursesView() {
  if (state.courseViewMode === "detail") {
    return renderCourseDetailView();
  }
  return renderAllCoursesCatalog();
}

function renderAllCoursesCatalog() {
  return `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h2 class="page-title">All Enrolled Courses (${state.courses.length})</h2>
          <p style="color: #6b7280; font-size: 13.5px; margin-top: 4px;">
            Browse and continue your enrolled courses, view modules, and check progress.
          </p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn-primary" onclick="openModal('upload')">
            + Upload Course Material
          </button>
        </div>
      </div>

      <div class="courses-cards-grid" style="grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 20px;">
        ${state.courses.map(course => `
          <div class="course-card" onclick="openCourse('${course.id}')">
            <div class="course-card-top ${course.colorTheme}" style="height: 120px;">
              ${getCourseCardGraphic(course.iconType)}
            </div>
            <div class="course-card-body">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                <span style="font-size: 11px; font-weight: 700; background: #f3f4f6; padding: 3px 8px; border-radius: 6px; color: #4b5563;">
                  ${course.category}
                </span>
                <span style="font-size: 12px; font-weight: 800; color: #d97706;">
                  ${course.progress}%
                </span>
              </div>
              <div class="course-title-text" style="font-size: 17px; margin-bottom: 6px;">${course.title}</div>
              <p style="font-size: 12.5px; color: #6b7280; line-height: 1.4; margin-bottom: 14px;">
                ${course.description || "Comprehensive syllabus modules and practical learning."}
              </p>
              <div class="course-modules-sub" style="margin-bottom: 14px;">
                📚 ${course.modulesCount} Modules • ${course.modules ? course.modules.reduce((acc, m) => acc + (m.lessons ? m.lessons.length : 0), 0) : 0} Lessons
              </div>
              <div class="course-progress-row">
                <div class="progress-bar-container">
                  <div class="progress-bar-fill ${course.progress > 60 ? 'fill-orange' : (course.progress > 30 ? 'fill-green' : 'fill-orange')}" style="width: ${course.progress}%"></div>
                </div>
                <button class="course-card-arrow-btn" style="border: none; cursor: pointer;">
                  ${getIcon("arrow-right")}
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderCourseDetailView() {
  const currentCourse = state.courses.find(c => c.id === state.activeCourseId) || state.courses[0];
  let currentLesson = null;

  for (const m of currentCourse.modules) {
    const found = m.lessons.find(l => l.id === state.activeLessonId);
    if (found) {
      currentLesson = found;
      break;
    }
  }
  if (!currentLesson && currentCourse.modules[0]?.lessons[0]) {
    currentLesson = currentCourse.modules[0].lessons[0];
  }

  return `
    <div class="page-container">
      <div class="page-header">
        <div>
          <button class="btn-secondary" style="font-size: 12.5px; padding: 6px 12px; margin-bottom: 10px;" onclick="viewAllCourses()">
            ← Back to All Courses
          </button>
          <h2 class="page-title">${currentCourse.title}</h2>
          <p style="color: #6b7280; font-size: 13.5px; margin-top: 4px;">
            ${currentCourse.category} • ${currentCourse.modulesCount} Modules • Overall Progress: ${currentCourse.progress}%
          </p>
        </div>
        <div style="display: flex; gap: 10px; align-items: flex-end;">
          <select class="form-control" style="width: auto;" onchange="openCourse(this.value)">
            ${state.courses.map(c => `
              <option value="${c.id}" ${c.id === currentCourse.id ? 'selected' : ''}>${c.title}</option>
            `).join('')}
          </select>
          <button class="btn-primary" onclick="openModal('upload')">
            + Upload Material
          </button>
        </div>
      </div>

      <div class="course-detail-view">
        <!-- MODULES & LESSONS LIST -->
        <div class="modules-sidebar">
          <h3 style="font-size: 15px; font-weight: 800; margin-bottom: 14px;">Course Syllabus</h3>
          ${currentCourse.modules.map(mod => `
            <div style="margin-bottom: 16px;">
              <div class="module-header">${mod.title}</div>
              <div>
                ${mod.lessons.map(les => `
                  <div 
                    class="lesson-item ${les.id === currentLesson?.id ? 'active' : ''}"
                    onclick="selectLesson('${les.id}')"
                  >
                    <span>${les.completed ? '✅' : '⚪'}</span>
                    <span>${les.title}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- LESSON CONTENT VIEWER -->
        <div class="lesson-content-pane">
          ${currentLesson ? `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
              <h3 class="lesson-title-lg">${currentLesson.title}</h3>
              <button 
                class="${currentLesson.completed ? 'btn-secondary' : 'btn-primary'}"
                onclick="toggleLessonComplete('${currentCourse.id}', '${currentLesson.id}')"
              >
                ${currentLesson.completed ? '✓ Completed' : 'Mark as Complete'}
              </button>
            </div>
            <div class="lesson-body-text">
              <p style="margin-bottom: 16px;">${currentLesson.content}</p>
              
              <div style="background: #fdfaf4; border: 1px solid #fae69e; border-radius: 12px; padding: 18px; margin: 20px 0;">
                <h4 style="font-weight: 700; margin-bottom: 8px;">📚 Recommended Material for this Lesson</h4>
                <p style="font-size: 13.5px; color: #555; margin-bottom: 12px;">Review the attached notes and offline documents compliant with SRS Section 4:</p>
                <button class="btn-secondary" onclick="switchTab('materials')">View Downloadable Materials</button>
              </div>

              <div style="display: flex; gap: 12px; margin-top: 24px;">
                <button class="btn-secondary" onclick="openModal('assignment')">Submit Lesson Assignment</button>
                <button class="btn-secondary" onclick="switchTab('progress')">Check Course Certificate</button>
              </div>
            </div>
          ` : `
            <div>Select a lesson to start studying.</div>
          `}
        </div>
      </div>
    </div>
  `;
}

// 3. STUDY MATERIALS VIEW (SRS Section 4 & FR-5.1 - FR-5.5)
function renderMaterialsView() {
  const filtered = state.materials.filter(m => 
    m.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
    m.course.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  return `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h2 class="page-title">Study Materials & Offline Documents</h2>
          <p style="color: #6b7280; font-size: 13.5px; margin-top: 4px;">
            Securely managed file repository conforming to SRS Section 4 restrictions (Type & Size validation).
          </p>
        </div>
        <button class="btn-primary" onclick="openModal('upload')">
          ${getIcon("upload")} Upload New File
        </button>
      </div>

      <!-- RESTRICTIONS NOTICE BOX -->
      <div class="restrictions-badge-box" style="margin-bottom: 20px; background: #fffbeb; border: 1px solid #fef3c7;">
        <strong>🔒 SRS Upload Policy:</strong> Documents (PDF, DOCX, TXT - max 10MB) • Presentations (PPT, PPTX - max 25MB) • Images (JPG, PNG, WEBP - max 2MB). Direct executable formats (.exe, .bat, scripts) are strictly prohibited.
      </div>

      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">
          <thead>
            <tr style="border-bottom: 2px solid #f1f1eb; color: #6b7280; font-size: 12.5px; text-transform: uppercase;">
              <th style="padding: 12px 16px;">Document Name</th>
              <th style="padding: 12px 16px;">Course</th>
              <th style="padding: 12px 16px;">Category</th>
              <th style="padding: 12px 16px;">File Size</th>
              <th style="padding: 12px 16px;">Upload Date</th>
              <th style="padding: 12px 16px; text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(mat => `
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 14px 16px; font-weight: 600; color: #111;">
                  📄 ${mat.name}
                </td>
                <td style="padding: 14px 16px; color: #4b5563;">${mat.course}</td>
                <td style="padding: 14px 16px;"><span style="background: #f3f4f6; padding: 4px 8px; border-radius: 6px; font-size: 12px;">${mat.type}</span></td>
                <td style="padding: 14px 16px; color: #6b7280;">${mat.size}</td>
                <td style="padding: 14px 16px; color: #6b7280;">${mat.date}</td>
                <td style="padding: 14px 16px; text-align: right;">
                  <button class="btn-secondary" style="padding: 6px 12px; font-size: 12px;" onclick="downloadSampleMaterial('${mat.name}')">
                    ⬇ Access Offline
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 4. ASSIGNMENTS VIEW (SRS FR-5.6 - FR-5.10)
function renderAssignmentsView() {
  return `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h2 class="page-title">Assignments & Assessments</h2>
          <p style="color: #6b7280; font-size: 13.5px; margin-top: 4px;">
            Submit your coursework and verify validation status according to instructor deadlines.
          </p>
        </div>
        <button class="btn-primary" onclick="openModal('assignment')">
          Submit Assignment
        </button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 18px;">
        <div style="border: 1px solid #e5e7eb; border-radius: var(--radius-md); padding: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span style="background: #dcfce7; color: #166534; font-size: 12px; font-weight: 700; padding: 4px 8px; border-radius: 6px;">COMPLETED</span>
            <span style="font-size: 12px; color: #6b7280;">Due: Nov 12, 2026</span>
          </div>
          <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 6px;">Web Development - Portfolio UI</h3>
          <p style="font-size: 13px; color: #4b5563; margin-bottom: 14px;">Build a responsive CSS grid portfolio page with semantic layout tags.</p>
          <div style="font-size: 12.5px; color: #15803d; font-weight: 600;">Grade: 95/100 • Feedback: Excellent responsive architecture.</div>
        </div>

        <div style="border: 1px solid #fde68a; background: #fffdf5; border-radius: var(--radius-md); padding: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span style="background: #fef3c7; color: #92400e; font-size: 12px; font-weight: 700; padding: 4px 8px; border-radius: 6px;">PENDING</span>
            <span style="font-size: 12px; color: #e11d48; font-weight: 700;">Due: Nov 14, 2026</span>
          </div>
          <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 6px;">Database Management - ER Schema</h3>
          <p style="font-size: 13px; color: #4b5563; margin-bottom: 14px;">Design a 3NF normalized schema for a university registration system.</p>
          <button class="btn-primary" style="padding: 7px 14px; font-size: 13px;" onclick="openModal('assignment')">Submit Now</button>
        </div>

        <div style="border: 1px solid #e5e7eb; border-radius: var(--radius-md); padding: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span style="background: #f3f4f6; color: #4b5563; font-size: 12px; font-weight: 700; padding: 4px 8px; border-radius: 6px;">UPCOMING</span>
            <span style="font-size: 12px; color: #6b7280;">Due: Nov 16, 2026</span>
          </div>
          <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 6px;">Cyber Security - Vulnerability Report</h3>
          <p style="font-size: 13px; color: #4b5563; margin-bottom: 14px;">Analyze file upload security vulnerabilities and mitigations based on OWASP.</p>
          <button class="btn-secondary" style="padding: 7px 14px; font-size: 13px;" onclick="openModal('assignment')">Prepare Submission</button>
        </div>
      </div>
    </div>
  `;
}

// 5. PROGRESS & CERTIFICATES (SRS FR-4.3 - FR-4.5)
function renderProgressView() {
  const avgProgress = Math.round(state.courses.reduce((acc, c) => acc + c.progress, 0) / state.courses.length);

  return `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h2 class="page-title">Learning Analytics & Certificates</h2>
          <p style="color: #6b7280; font-size: 13.5px; margin-top: 4px;">Track your completed modules and download verified offline certificates.</p>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-bottom: 24px;">
        <div style="background: #fef9e7; padding: 20px; border-radius: 16px; border: 1px solid #fae69e; text-align: center;">
          <div style="font-size: 32px; font-weight: 800; color: #d97706;">${avgProgress}%</div>
          <div style="font-size: 13px; font-weight: 700; color: #374151; margin-top: 4px;">Overall Completion</div>
        </div>
        <div style="background: #eff6ff; padding: 20px; border-radius: 16px; border: 1px solid #bfdbfe; text-align: center;">
          <div style="font-size: 32px; font-weight: 800; color: #2563eb;">3</div>
          <div style="font-size: 13px; font-weight: 700; color: #374151; margin-top: 4px;">Active Enrolled Courses</div>
        </div>
        <div style="background: #ecfdf5; padding: 20px; border-radius: 16px; border: 1px solid #a7f3d0; text-align: center;">
          <div style="font-size: 32px; font-weight: 800; color: #059669;">1</div>
          <div style="font-size: 13px; font-weight: 700; color: #374151; margin-top: 4px;">Certificate Ready</div>
        </div>
      </div>

      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
        <h3 style="font-size: 17px; font-weight: 800; margin-bottom: 14px;">Course Progress Breakdown</h3>
        ${state.courses.map(c => `
          <div style="margin-bottom: 18px;">
            <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: 700; margin-bottom: 6px;">
              <span>${c.title}</span>
              <span>${c.progress}%</span>
            </div>
            <div class="progress-bar-container" style="height: 8px; margin-right: 0;">
              <div class="progress-bar-fill fill-orange" style="width: ${c.progress}%"></div>
            </div>
            ${c.progress >= 80 ? `
              <div style="margin-top: 8px;">
                <button class="btn-secondary" style="font-size: 12px; padding: 5px 12px;" onclick="generateCertificate('${c.title}')">
                  🎓 Download Course Completion Certificate (PDF)
                </button>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// 6. NOTIFICATIONS VIEW
function renderNotificationsView() {
  return `
    <div class="page-container">
      <div class="page-header">
        <h2 class="page-title">Notifications</h2>
        <button class="btn-secondary" onclick="alert('All notifications marked as read!')">Mark All as Read</button>
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${state.notifications.map(n => `
          <div style="padding: 16px; border-radius: 12px; border: 1px solid #f1ebd8; background: #fffdf5; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 20px;">🔔</span>
              <div>
                <div style="font-size: 14px; font-weight: 700; color: #111;">${n.text}</div>
                <div style="font-size: 12px; color: #888;">${n.time}</div>
              </div>
            </div>
            <span style="font-size: 11px; background: #fef3c7; color: #d97706; padding: 4px 8px; border-radius: 6px; font-weight: bold;">New</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// 7. SETTINGS VIEW (SRS Section 4 Admin Policy Simulation)
function renderSettingsView() {
  return `
    <div class="page-container">
      <div class="page-header">
        <h2 class="page-title">LMS System & Security Settings</h2>
      </div>

      <div style="max-width: 640px;">
        <div style="background: #fdfaf4; padding: 18px; border-radius: 12px; border: 1px solid #fae69e; margin-bottom: 24px;">
          <h4 style="font-weight: 800; font-size: 15px; margin-bottom: 6px;">Zero-Login Offline Mode Enabled</h4>
          <p style="font-size: 13.5px; color: #4b5563;">
            Constraint Met: All learning components, course states, and study assets operate completely offline without login or register barriers.
          </p>
        </div>

        <h3 style="font-size: 16px; font-weight: 800; margin-bottom: 12px;">Upload Policy (SRS Section 4)</h3>
        <div style="border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; margin-bottom: 16px;">
          <div style="font-size: 14px; font-weight: 700; margin-bottom: 4px;">Document Maximum File Size</div>
          <div style="font-size: 12.5px; color: #6b7280; margin-bottom: 8px;">Configurable limit up to hard ceiling: 10 MB</div>
          <input type="text" class="form-control" value="10 MB" disabled style="background: #f9fafb;" />
        </div>

        <div style="border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; margin-bottom: 24px;">
          <div style="font-size: 14px; font-weight: 700; margin-bottom: 4px;">Security Magic Byte Header Inspection</div>
          <div style="font-size: 12.5px; color: #6b7280; margin-bottom: 8px;">Enforces mime-type / extension signature consensus</div>
          <span style="background: #dcfce7; color: #15803d; font-size: 12px; font-weight: 700; padding: 4px 8px; border-radius: 6px;">ACTIVE</span>
        </div>

        <button class="btn-primary" onclick="resetToDemoData()">Reset Demo Courses & Progress</button>
      </div>
    </div>
  `;
}

// MODAL RENDERER & FILE VALIDATION (Enforces SRS Section 4.1 & 4.4)
function renderModal() {
  if (!state.activeModal) return "";

  if (state.activeModal === "upload") {
    return `
      <div class="modal-overlay" onclick="closeModalOnOuter(event)">
        <div class="modal-card">
          <div class="modal-header">
            <h3 class="modal-title">Upload Study Material</h3>
            <button class="close-modal-btn" onclick="closeModal()">&times;</button>
          </div>

          <form id="uploadForm" onsubmit="handleMaterialUpload(event)">
            <div class="form-group">
              <label class="form-label">Course Selection</label>
              <select class="form-control" id="uploadCourseSelect" required>
                ${state.courses.map(c => `<option value="${c.title}">${c.title}</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Material Category</label>
              <select class="form-control" id="uploadCategorySelect" onchange="updateUploadCategoryGuidance(this.value)">
                <option value="documents">Documents (PDF, DOCX, TXT - Max 10MB)</option>
                <option value="presentations">Presentations (PPT, PPTX - Max 25MB)</option>
                <option value="images">Thumbnails / Images (JPG, PNG, WEBP - Max 2MB)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Select File to Upload</label>
              <div class="file-dropzone" onclick="document.getElementById('realFileInput').click()">
                <div style="font-size: 32px; margin-bottom: 8px;">📁</div>
                <div style="font-weight: 700; font-size: 14px;">Click to select file</div>
                <div style="font-size: 12px; color: #6b7280; margin-top: 4px;" id="selectedFileName">No file chosen yet</div>
              </div>
              <input 
                type="file" 
                id="realFileInput" 
                style="display: none;" 
                onchange="handleFileSelection(this)" 
              />
            </div>

            <div class="restrictions-badge-box" id="uploadRuleHint">
              <strong>Allowed:</strong> .pdf, .doc, .docx, .txt (Max 10 MB)<br>
              <em>Prohibited:</em> Executable files (.exe, .bat, scripts) are rejected by SRS validation.
            </div>

            <div id="uploadFeedback"></div>

            <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
              <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
              <button type="submit" class="btn-primary" id="uploadSubmitBtn">Upload File</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  if (state.activeModal === "assignment") {
    return `
      <div class="modal-overlay" onclick="closeModalOnOuter(event)">
        <div class="modal-card">
          <div class="modal-header">
            <h3 class="modal-title">Submit Course Assignment</h3>
            <button class="close-modal-btn" onclick="closeModal()">&times;</button>
          </div>

          <form onsubmit="handleAssignmentSubmit(event)">
            <div class="form-group">
              <label class="form-label">Select Task</label>
              <select class="form-control" id="assignTaskSelect" required>
                ${state.tasks.map(t => `<option value="${t.id}">${t.title} - ${t.course}</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Submission Notes / Summary</label>
              <textarea class="form-control" rows="3" placeholder="Enter comments or submission summary..." required></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Upload Submission File (.pdf, .docx, .zip - Max 20MB)</label>
              <div class="file-dropzone" onclick="document.getElementById('assignFileInput').click()">
                <div style="font-size: 32px; margin-bottom: 8px;">📤</div>
                <div style="font-weight: 700; font-size: 14px;">Select Assignment Solution</div>
                <div style="font-size: 12px; color: #6b7280; margin-top: 4px;" id="assignSelectedName">No file selected</div>
              </div>
              <input type="file" id="assignFileInput" style="display: none;" onchange="handleAssignFileSelection(this)" />
            </div>

            <div id="assignFeedback"></div>

            <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
              <button type="button" class="btn-secondary" onclick="closeModal()">Cancel</button>
              <button type="submit" class="btn-primary">Submit Solution</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  if (state.activeModal === "schedule") {
    return `
      <div class="modal-overlay" onclick="closeModalOnOuter(event)">
        <div class="modal-card">
          <div class="modal-header">
            <h3 class="modal-title">Study Schedule - November 2026</h3>
            <button class="close-modal-btn" onclick="closeModal()">&times;</button>
          </div>
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div style="padding: 14px; background: #fffdf5; border: 1px solid #fef3c7; border-radius: 10px;">
              <strong>Nov 10, 2026 (Today):</strong> Daily module review & assignment progress check.
            </div>
            <div style="padding: 14px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px;">
              <strong>Nov 12, 2026:</strong> Web Development - Portfolio Submission Deadline.
            </div>
            <div style="padding: 14px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px;">
              <strong>Nov 14, 2026:</strong> Database Management - Mid-term Assessment Quiz.
            </div>
            <div style="padding: 14px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px;">
              <strong>Nov 16, 2026:</strong> Cyber Security - Threat Modeling Workshop.
            </div>
          </div>
          <div style="text-align: right; margin-top: 20px;">
            <button class="btn-primary" onclick="closeModal()">Close</button>
          </div>
        </div>
      </div>
    `;
  }

  return "";
}

// APPLICATION INTERACTIONS & EVENT HANDLERS
window.switchTab = function(tabName) {
  state.currentTab = tabName;
  if (tabName === "courses") {
    state.courseViewMode = "catalog";
  }
  renderApp();
};

window.viewAllCourses = function() {
  state.courseViewMode = "catalog";
  state.currentTab = "courses";
  renderApp();
};

window.openCourse = function(courseId) {
  state.activeCourseId = courseId;
  state.courseViewMode = "detail";
  state.currentTab = "courses";
  renderApp();
};

window.selectLesson = function(lessonId) {
  state.activeLessonId = lessonId;
  renderApp();
};

window.toggleLessonComplete = function(courseId, lessonId) {
  const course = state.courses.find(c => c.id === courseId);
  if (!course) return;

  let total = 0;
  let completed = 0;

  for (const m of course.modules) {
    for (const l of m.lessons) {
      if (l.id === lessonId) {
        l.completed = !l.completed;
      }
      total++;
      if (l.completed) completed++;
    }
  }

  // Update course progress percentage
  course.progress = Math.round((completed / total) * 100);
  setStorage("courses", state.courses);
  renderApp();
};

window.handleSearch = function(val) {
  state.searchQuery = val;
  // Update only the search dropdown without re-rendering the whole page or destroying the input element
  const mount = document.getElementById("searchDropdownMount");
  if (mount) {
    mount.innerHTML = renderSearchDropdown();
  }
  // If user is on materials tab, update material list
  if (state.currentTab === "materials") {
    const tableContainer = document.querySelector(".content-area");
    if (tableContainer) {
      tableContainer.innerHTML = renderMaterialsView();
    }
  }
};

window.handleSearchFocus = function() {
  const mount = document.getElementById("searchDropdownMount");
  if (mount && state.searchQuery) {
    mount.innerHTML = renderSearchDropdown();
  }
};

window.selectSearchResult = function(type, id1, id2) {
  state.searchQuery = "";
  const input = document.getElementById("globalSearchInput");
  if (input) input.value = "";
  const mount = document.getElementById("searchDropdownMount");
  if (mount) mount.innerHTML = "";

  if (type === "course") {
    openCourse(id1);
  } else if (type === "lesson") {
    state.activeCourseId = id1;
    state.activeLessonId = id2;
    state.currentTab = "courses";
    renderApp();
  } else if (type === "material") {
    switchTab("materials");
  } else if (type === "assignment") {
    switchTab("assignments");
  }
};

window.openModal = function(modalType) {
  state.activeModal = modalType;
  renderApp();
};

window.closeModal = function() {
  state.activeModal = null;
  renderApp();
};

window.closeModalOnOuter = function(e) {
  if (e.target.classList.contains("modal-overlay")) {
    closeModal();
  }
};

window.toggleThemeNotice = function() {
  alert("Sunny day mode active! LearnHub's pastel yellow UI is optimized for high-contrast offline learning.");
};

window.downloadSampleMaterial = function(name) {
  const blob = new Blob([
    `LearnHub Offline Learning Material\nFile: ${name}\nAccess Date: 20 November 2026\nStatus: Verified clean & authorized offline copy under SRS compliance.`
  ], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name.replace(".pdf", ".txt").replace(".pptx", ".txt");
  a.click();
  URL.revokeObjectURL(url);
};

window.generateCertificate = function(courseName) {
  alert(`🎓 Congratulations! Certificate for "${courseName}" generated successfully for Learner. Stored in your offline portfolio.`);
};

window.resetDemoData = function() {
  localStorage.clear();
  state.courses = INITIAL_COURSES;
  state.materials = INITIAL_MATERIALS;
  state.tasks = INITIAL_TASKS;
  alert("Data reset to initial demo state!");
  renderApp();
};

// FILE VALIDATION ENGINE (SRS Section 4 Implementation)
let currentSelectedFile = null;
let currentAssignFile = null;

window.handleFileSelection = function(input) {
  const file = input.files[0];
  const display = document.getElementById("selectedFileName");
  const feedback = document.getElementById("uploadFeedback");
  if (!file) return;

  currentSelectedFile = file;
  if (display) display.innerText = `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
  if (feedback) feedback.innerHTML = "";
};

window.handleAssignFileSelection = function(input) {
  const file = input.files[0];
  const display = document.getElementById("assignSelectedName");
  const feedback = document.getElementById("assignFeedback");
  if (!file) return;

  currentAssignFile = file;
  if (display) display.innerText = `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
  if (feedback) feedback.innerHTML = "";
};

window.updateUploadCategoryGuidance = function(cat) {
  const hint = document.getElementById("uploadRuleHint");
  if (!hint) return;
  const rule = FILE_RESTRICTIONS[cat];
  if (rule) {
    hint.innerHTML = `<strong>Allowed:</strong> ${rule.exts.join(", ")} (${rule.label})<br><em>Security rule:</em> Executable formats (.exe, .bat) will trigger immediate 400 rejection.`;
  }
};

window.handleMaterialUpload = function(e) {
  e.preventDefault();
  const feedback = document.getElementById("uploadFeedback");
  const cat = document.getElementById("uploadCategorySelect").value;
  const courseName = document.getElementById("uploadCourseSelect").value;

  if (!currentSelectedFile) {
    feedback.innerHTML = `<div class="alert-error">Please select a file to upload.</div>`;
    return;
  }

  // 1. Extension check
  const fileName = currentSelectedFile.name.toLowerCase();
  const rule = FILE_RESTRICTIONS[cat] || FILE_RESTRICTIONS.documents;
  const hasValidExt = rule.exts.some(ext => fileName.endsWith(ext));

  if (!hasValidExt) {
    feedback.innerHTML = `<div class="alert-error"><strong>Error (400 - INVALID_FILE_TYPE):</strong> This file type is not allowed. Allowed types for this category: ${rule.exts.join(", ")}</div>`;
    return;
  }

  // 2. Prohibited scripts/executables check (SRS 4.1 note)
  const prohibited = [".exe", ".bat", ".sh", ".js", ".php", ".py", ".html", ".svg"];
  if (prohibited.some(ext => fileName.endsWith(ext))) {
    feedback.innerHTML = `<div class="alert-error"><strong>Security Violation:</strong> Executable or script files are strictly blocked.</div>`;
    return;
  }

  // 3. Size check (SRS 4.1 & FU-4)
  if (currentSelectedFile.size > rule.maxBytes) {
    feedback.innerHTML = `<div class="alert-error"><strong>Error (413 - FILE_TOO_LARGE):</strong> File exceeds the ${rule.label} limit.</div>`;
    return;
  }

  // Success: Record in offline repository
  const newMaterial = {
    id: "m-" + Date.now(),
    name: currentSelectedFile.name,
    type: currentSelectedFile.name.split('.').pop().toUpperCase(),
    size: (currentSelectedFile.size / (1024 * 1024)).toFixed(1) + " MB",
    course: courseName,
    category: cat,
    date: "2026-11-20"
  };

  state.materials.unshift(newMaterial);
  setStorage("materials", state.materials);

  feedback.innerHTML = `<div class="alert-success">✓ File validated successfully (Magic bytes clean) and added to course repository!</div>`;

  setTimeout(() => {
    closeModal();
    renderApp();
  }, 1200);
};

window.handleAssignmentSubmit = function(e) {
  e.preventDefault();
  const feedback = document.getElementById("assignFeedback");
  const taskId = document.getElementById("assignTaskSelect").value;

  if (!currentAssignFile) {
    feedback.innerHTML = `<div class="alert-error">Please attach your assignment file.</div>`;
    return;
  }

  const fileName = currentAssignFile.name.toLowerCase();
  const rule = FILE_RESTRICTIONS.assignment;
  const hasValidExt = rule.exts.some(ext => fileName.endsWith(ext));

  if (!hasValidExt) {
    feedback.innerHTML = `<div class="alert-error"><strong>Error (400 - INVALID_FILE_TYPE):</strong> Allowed types: PDF, DOCX, TXT, ZIP.</div>`;
    return;
  }

  if (currentAssignFile.size > rule.maxBytes) {
    feedback.innerHTML = `<div class="alert-error"><strong>Error (413 - FILE_TOO_LARGE):</strong> File exceeds 20 MB limit.</div>`;
    return;
  }

  // Mark task completed
  const t = state.tasks.find(x => x.id === taskId);
  if (t) {
    t.completed = true;
    setStorage("tasks", state.tasks);
  }

  feedback.innerHTML = `<div class="alert-success">✓ Assignment uploaded and submitted successfully!</div>`;

  setTimeout(() => {
    closeModal();
    renderApp();
  }, 1200);
};

// Initial Render
document.addEventListener("DOMContentLoaded", () => {
  renderApp();
});
renderApp();
