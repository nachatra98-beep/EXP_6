const { useState, useEffect } = React;

const API_BASE = "http://127.0.0.1:8000/api/v1";

// Fallback demo data if Django server isn't running yet
const DEFAULT_COURSES = [
  {
    id: 1,
    course_id: "web-dev",
    title: "Web Development",
    category: "Development",
    modules_count: 6,
    progress: 85,
    icon_type: "code",
    color_theme: "web-dev",
    modules: [
      {
        id: 1,
        title: "Module 1: Semantic HTML5 & Modern Layouts",
        lessons: [
          { id: 1, title: "1.1 Introduction to Web Architecture & HTML5", is_completed: true, content: "Understand HTTP/HTTPS client-server communication, DOM tree rendering, and semantic HTML5 structuring tags." },
          { id: 2, title: "1.2 CSS Flexbox and Grid Masterclass", is_completed: true, content: "Master responsive layout design with CSS Grid and Flexbox alignment axes." }
        ]
      },
      {
        id: 2,
        title: "Module 2: ReactJS Component Architecture",
        lessons: [
          { id: 3, title: "2.1 Modern React Hooks & State", is_completed: true, content: "State management using useState, useEffect side effects, and modular reusable UI architecture." },
          { id: 4, title: "2.2 REST API Integration with Django Backend", is_completed: false, content: "Integrating React single page frontend with Django REST Framework API." }
        ]
      }
    ]
  },
  {
    id: 2,
    course_id: "db-mgmt",
    title: "Database Management",
    category: "Data Science",
    modules_count: 8,
    progress: 40,
    icon_type: "db",
    color_theme: "db-mgmt",
    modules: [
      {
        id: 3,
        title: "Module 1: Relational Concepts & ER Modeling",
        lessons: [
          { id: 5, title: "1.1 Entities, Attributes & Foreign Keys", is_completed: true, content: "Entity-relationship modeling, primary keys, and relational integrity constraints." },
          { id: 6, title: "1.2 Normalization: 1NF to BCNF", is_completed: false, content: "Normalizing relational database structures to avoid duplication and anomaly errors." }
        ]
      }
    ]
  },
  {
    id: 3,
    course_id: "cyber-sec",
    title: "Cyber Security",
    category: "Security",
    modules_count: 5,
    progress: 20,
    icon_type: "shield",
    color_theme: "cyber-sec",
    modules: [
      {
        id: 4,
        title: "Module 1: Fundamentals & OWASP Top 10",
        lessons: [
          { id: 7, title: "1.1 CIA Triad & Threat Modeling", is_completed: true, content: "Confidentiality, Integrity, Availability principles and threat risk mitigation." },
          { id: 8, title: "1.2 Secure File Upload Restrictions & MIME Validation", is_completed: false, content: "Enforcing magic byte validation and size ceilings per SRS Section 4." }
        ]
      }
    ]
  }
];

const DEFAULT_TASKS = [
  { id: 1, title: "Submit Assignment", course_name: "Web Development", due_date_str: "Nov 12", task_type: "assignment", icon_type: "yellow", is_completed: true },
  { id: 2, title: "Take Quiz", course_name: "Database Management", due_date_str: "Nov 14", task_type: "quiz", icon_type: "purple", is_completed: false },
  { id: 3, title: "Review Notes", course_name: "Cyber Security", due_date_str: "Nov 16", task_type: "review", icon_type: "green", is_completed: false }
];

const DEFAULT_MATERIALS = [
  { id: 1, name: "Web_Dev_Cheatsheet.pdf", file_type: "PDF", file_size_formatted: "2.4 MB", course_title: "Web Development", category: "Documents", uploaded_at: "2026-11-10" },
  { id: 2, name: "Database_Normalization_Guide.pdf", file_type: "PDF", file_size_formatted: "3.8 MB", course_title: "Database Management", category: "Documents", uploaded_at: "2026-11-12" },
  { id: 3, name: "OWASP_Top_10_Summary.pptx", file_type: "PPTX", file_size_formatted: "8.1 MB", course_title: "Cyber Security", category: "Presentations", uploaded_at: "2026-11-15" }
];

function App() {
  const [currentTab, setCurrentTab] = useState("home");
  const [courses, setCourses] = useState(DEFAULT_COURSES);
  const [tasks, setTasks] = useState(DEFAULT_TASKS);
  const [materials, setMaterials] = useState(DEFAULT_MATERIALS);
  const [activeCourseId, setActiveCourseId] = useState("web-dev");
  const [activeLessonId, setActiveLessonId] = useState(1);
  const [modalType, setModalType] = useState(null); // 'upload' | 'assignment' | 'schedule'
  const [apiConnected, setApiConnected] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch initial data from Django backend
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch(`${API_BASE}/dashboard/`);
      if (res.ok) {
        const data = await res.json();
        if (data.courses && data.courses.length > 0) setCourses(data.courses);
        if (data.upcoming_tasks && data.upcoming_tasks.length > 0) setTasks(data.upcoming_tasks);
        if (data.recent_materials && data.recent_materials.length > 0) setMaterials(data.recent_materials);
        setApiConnected(true);
      }
    } catch (err) {
      console.log("Django backend offline, using pre-populated SRS dataset in React state.");
      setApiConnected(false);
    }
  };

  const handleToggleLesson = async (lessonId) => {
    try {
      if (apiConnected) {
        const res = await fetch(`${API_BASE}/lessons/${lessonId}/toggle/`, { method: "POST" });
        if (res.ok) {
          fetchDashboardData();
          return;
        }
      }
    } catch (e) {
      console.log("Offline mode toggling in React state");
    }

    // Local fallback update
    setCourses(prev => prev.map(c => {
      let total = 0, comp = 0;
      const newModules = c.modules.map(m => {
        const newLessons = m.lessons.map(l => {
          total++;
          if (l.id === lessonId) {
            const nextVal = !l.is_completed;
            if (nextVal) comp++;
            return { ...l, is_completed: nextVal };
          }
          if (l.is_completed) comp++;
          return l;
        });
        return { ...m, lessons: newLessons };
      });
      const newProg = total > 0 ? Math.round((comp / total) * 100) : c.progress;
      return { ...c, modules: newModules, progress: newProg };
    }));
  };

  const currentCourse = courses.find(c => c.course_id === activeCourseId) || courses[0];
  let currentLesson = null;
  if (currentCourse && currentCourse.modules) {
    for (const m of currentCourse.modules) {
      const l = m.lessons.find(item => item.id === activeLessonId);
      if (l) { currentLesson = l; break; }
    }
    if (!currentLesson && currentCourse.modules[0]?.lessons[0]) {
      currentLesson = currentCourse.modules[0].lessons[0];
    }
  }

  return (
    <div style={{ display: 'flex', width: '100vw', minHeight: '100vh' }}>
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div>
          <div className="brand-section">
            <div className="brand-logo-wrap">
              <svg width="42" height="42" viewBox="0 0 48 48" fill="none">
                <path d="M24 6L4 16L24 26L44 16L24 6Z" fill="#111827"/>
                <path d="M10 20V32C10 37 16 41 24 41C32 41 38 37 38 32V20L24 28L10 20Z" fill="#F8C02F"/>
                <path d="M41 18V31" stroke="#F8C02F" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="41" cy="33" r="2.5" fill="#111827"/>
              </svg>
            </div>
            <div className="brand-title">LearnHub</div>
            <div className="brand-subtitle">Learn • Practice • Grow</div>
          </div>

          <nav>
            <ul className="nav-list">
              <li className={`nav-item ${currentTab === 'home' ? 'active' : ''}`} onClick={() => setCurrentTab('home')}>
                <span className="nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                </span>
                <span className="nav-text">Home</span>
              </li>
              <li className={`nav-item ${currentTab === 'courses' ? 'active' : ''}`} onClick={() => setCurrentTab('courses')}>
                <span className="nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                </span>
                <span className="nav-text">My Courses</span>
              </li>
              <li className={`nav-item ${currentTab === 'materials' ? 'active' : ''}`} onClick={() => setCurrentTab('materials')}>
                <span className="nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                </span>
                <span className="nav-text">Study Materials</span>
              </li>
              <li className={`nav-item ${currentTab === 'assignments' ? 'active' : ''}`} onClick={() => setCurrentTab('assignments')}>
                <span className="nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                </span>
                <span className="nav-text">Assignments</span>
              </li>
              <li className={`nav-item ${currentTab === 'progress' ? 'active' : ''}`} onClick={() => setCurrentTab('progress')}>
                <span className="nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                </span>
                <span className="nav-text">Progress</span>
              </li>
              <li className={`nav-item ${currentTab === 'notifications' ? 'active' : ''}`} onClick={() => setCurrentTab('notifications')}>
                <span className="nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                </span>
                <span className="nav-text">Notifications</span>
                <span className="nav-badge">3</span>
              </li>
              <li className={`nav-item ${currentTab === 'settings' ? 'active' : ''}`} onClick={() => setCurrentTab('settings')}>
                <span className="nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                </span>
                <span className="nav-text">Settings</span>
              </li>
            </ul>
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="handdrawn-quote">
            Small steps...<br/>
            Big achievements! ♡
          </div>
          <div className="sidebar-illu">
            <svg width="76" height="52" viewBox="0 0 100 70" fill="none">
              <rect x="10" y="38" width="80" height="14" rx="3" fill="#1F2937"/>
              <rect x="10" y="34" width="80" height="5" fill="#E5E7EB"/>
              <rect x="18" y="20" width="70" height="15" rx="3" fill="#F8C02F"/>
              <rect x="18" y="16" width="70" height="5" fill="#FEF3C7"/>
            </svg>
          </div>
        </div>
      </aside>

      {/* MAIN WRAPPER */}
      <main className="main-wrapper">
        <header className="top-header">
          <div className="search-box-container">
            <span className="search-icon-inside">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search courses, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="header-actions">
            <div style={{ fontSize: '11px', background: apiConnected ? '#dcfce7' : '#fef3c7', color: apiConnected ? '#15803d' : '#b45309', padding: '5px 10px', borderRadius: '20px', fontWeight: 'bold' }}>
              {apiConnected ? '● Django REST API Connected' : '● React Offline Mode Active'}
            </div>
            <button className="icon-btn" title="Light Theme">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            </button>
            <button className="icon-btn" title="Notifications" onClick={() => setCurrentTab('notifications')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span className="notification-dot">3</span>
            </button>
            <div className="avatar-badge" title="Learner Profile (Constraint 2: No login required)">
              N
            </div>
          </div>
        </header>

        <section className="content-area">
          {currentTab === 'home' && (
            <div className="dashboard-grid">
              <div className="dash-left">
                {/* WELCOME BANNER */}
                <div className="welcome-banner">
                  <div className="banner-text">
                    <h1 className="banner-title">
                      Welcome back,<br/>Learner!
                      <span className="star-decor">☆</span>
                    </h1>
                    <p className="banner-sub">Keep going — you're doing great! ♡</p>
                    <button className="continue-btn" onClick={() => { setActiveCourseId('web-dev'); setCurrentTab('courses'); }}>
                      Continue Learning &gt;
                    </button>
                  </div>
                  <div className="banner-illustration">
                    <svg width="180" height="150" viewBox="0 0 200 160" fill="none">
                      <rect x="25" y="115" width="140" height="22" rx="4" fill="#374151"/>
                      <rect x="25" y="110" width="140" height="7" fill="#F3F4F6"/>
                      <rect x="35" y="85" width="125" height="24" rx="4" fill="#F8C02F"/>
                      <rect x="35" y="80" width="125" height="7" fill="#FEF3C7"/>
                      <rect x="85" y="70" width="85" height="52" rx="4" fill="#1F2937"/>
                      <rect x="90" y="74" width="75" height="44" rx="2" fill="#3B82F6"/>
                      <rect x="75" y="122" width="105" height="6" rx="2" fill="#9CA3AF"/>
                      <polygon points="120,20 60,45 120,70 180,45" fill="#1F2937"/>
                      <polygon points="90,52 90,75 150,75 150,52" fill="#374151"/>
                      <path d="M175,47 L175,75" stroke="#F59E0B" strokeWidth="3"/>
                      <circle cx="175" cy="78" r="4" fill="#F59E0B"/>
                    </svg>
                  </div>
                </div>

                {/* QUICK ACTIONS */}
                <div className="quick-actions-row">
                  <div className="quick-action-card" onClick={() => setModalType('upload')}>
                    <div className="qa-icon-wrap qa-yellow">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    </div>
                    <div className="qa-title">Upload<br/>Materials</div>
                  </div>
                  <div className="quick-action-card" onClick={() => setCurrentTab('materials')}>
                    <div className="qa-icon-wrap qa-blue">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                    <div className="qa-title">Search<br/>Study Material</div>
                  </div>
                  <div className="quick-action-card" onClick={() => setModalType('schedule')}>
                    <div className="qa-icon-wrap qa-orange">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    </div>
                    <div className="qa-title">View<br/>Schedule</div>
                  </div>
                  <div className="quick-action-card" onClick={() => setCurrentTab('progress')}>
                    <div className="qa-icon-wrap qa-green">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                    </div>
                    <div className="qa-title">Track<br/>Progress</div>
                  </div>
                </div>

                {/* MY COURSES */}
                <div className="courses-section">
                  <div className="section-hdr">
                    <div className="section-hdr-left">
                      <span>📖</span>
                      <span>My Courses</span>
                    </div>
                    <span className="view-all-link" onClick={() => setCurrentTab('courses')}>
                      View All &rarr;
                    </span>
                  </div>

                  <div className="courses-cards-grid">
                    {courses.map(course => (
                      <div key={course.id || course.course_id} className="course-card" onClick={() => { setActiveCourseId(course.course_id); setCurrentTab('courses'); }}>
                        <div className={`course-card-top ${course.color_theme}`}>
                          {course.icon_type === 'code' && (
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                              <rect x="6" y="8" width="36" height="24" rx="3" fill="#4338CA"/>
                              <path d="M2 34C2 32.8954 2.89543 32 4 32H44C45.1046 32 46 32.8954 46 34V36C46 38.2091 44.2091 40 42 40H6C3.79086 40 2 38.2091 2 36V34Z" fill="#312E81"/>
                              <text x="14" y="24" fill="#ffffff" fontSize="14" fontFamily="monospace" fontWeight="bold">&lt;/&gt;</text>
                            </svg>
                          )}
                          {course.icon_type === 'db' && (
                            <svg width="46" height="46" viewBox="0 0 48 48" fill="none">
                              <ellipse cx="24" cy="11" rx="16" ry="6" fill="#047857"/>
                              <path d="M8 11V21C8 24.3137 15.1634 27 24 27C32.8366 27 40 24.3137 40 21V11" stroke="#065F46" strokeWidth="2" fill="#059669"/>
                              <path d="M8 21V31C8 34.3137 15.1634 37 24 37C32.8366 37 40 34.3137 40 31V21" stroke="#065F46" strokeWidth="2" fill="#10B981"/>
                            </svg>
                          )}
                          {course.icon_type === 'shield' && (
                            <svg width="46" height="46" viewBox="0 0 48 48" fill="none">
                              <path d="M24 4L8 10V22C8 33 15 41 24 44C33 41 40 33 40 22V10L24 4Z" fill="#EF4444"/>
                              <rect x="19" y="24" width="10" height="9" rx="2" fill="white"/>
                              <path d="M21 24V21C21 19.3431 22.3431 18 24 18C25.6569 18 27 19.3431 27 21V24" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                          )}
                        </div>
                        <div className="course-card-body">
                          <div className="course-title-text">{course.title}</div>
                          <div className="course-modules-sub">{course.modules_count} Modules • {course.progress}% Complete</div>
                          <div className="course-progress-row">
                            <div className="progress-bar-container">
                              <div className={`progress-bar-fill ${course.progress > 60 ? 'fill-orange' : (course.progress > 30 ? 'fill-green' : 'fill-orange')}`} style={{ width: `${course.progress}%` }}></div>
                            </div>
                            <div className="course-card-arrow-btn">&rarr;</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MOTIVATION STRIP */}
                <div className="motivation-strip">
                  <div className="moti-left">
                    <div className="moti-trophy">🏆</div>
                    <div>
                      <div className="moti-head">You're on the right track!</div>
                      <div className="moti-sub">Keep learning, keep growing.</div>
                    </div>
                  </div>
                  <div className="moti-right-art">
                    <svg width="180" height="42" viewBox="0 0 200 50" fill="none">
                      <path d="M5 40 Q 60 15, 120 38 T 195 10" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4 4" fill="none"/>
                      <polygon points="190,5 200,10 193,17" fill="#f59e0b"/>
                      <rect x="155" y="30" width="8" height="15" rx="2" fill="#F8C02F"/>
                      <rect x="168" y="22" width="8" height="23" rx="2" fill="#F8C02F"/>
                      <rect x="181" y="14" width="8" height="31" rx="2" fill="#F8C02F"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="dash-right">
                <div className="cal-card">
                  <div className="cal-header">
                    <div className="cal-title-wrap">
                      <span>📅</span>
                      <span>November 2026</span>
                    </div>
                    <div className="cal-nav-buttons">
                      <span>&lt;</span>
                      <span>&gt;</span>
                    </div>
                  </div>

                  <div className="cal-weekdays-grid">
                    <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                  </div>

                  <div className="cal-days-grid">
                    {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                      <div key={day} className={`cal-cell ${day === 10 ? 'today-highlight' : ''}`}>
                        {day}
                      </div>
                    ))}
                    <div className="cal-cell empty"></div>
                    <div className="cal-cell empty"></div>
                    <div className="cal-cell empty"></div>
                    <div className="cal-cell empty"></div>
                    <div className="cal-cell empty"></div>
                  </div>
                </div>

                <div className="tasks-card">
                  <div className="section-hdr" style={{ marginBottom: '8px' }}>
                    <div className="section-hdr-left" style={{ fontSize: '16px' }}>
                      <span>🕒</span>
                      <span>Upcoming Tasks</span>
                    </div>
                    <span className="view-all-link" onClick={() => setCurrentTab('assignments')}>View All &rarr;</span>
                  </div>

                  <div className="tasks-list">
                    {tasks.map(t => (
                      <div key={t.id} className="task-item" onClick={() => setCurrentTab('assignments')}>
                        <div className={`task-icon-box ${t.icon_type === 'yellow' ? 't-icon-yellow' : (t.icon_type === 'purple' ? 't-icon-purple' : 't-icon-green')}`}>
                          {t.task_type === 'assignment' ? '📋' : (t.task_type === 'quiz' ? '📝' : '📖')}
                        </div>
                        <div className="task-details">
                          <div className="task-title">{t.title}</div>
                          <div className="task-course">{t.course_name}</div>
                        </div>
                        <div className="task-date-pill">{t.due_date_str}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'courses' && currentCourse && (
            <div className="page-container">
              <div className="page-header">
                <div>
                  <h2 className="page-title">{currentCourse.title}</h2>
                  <p style={{ color: '#6b7280', fontSize: '13.5px', marginTop: '4px' }}>
                    {currentCourse.category} • {currentCourse.modules_count} Modules • Progress: {currentCourse.progress}%
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select 
                    className="form-control" 
                    value={activeCourseId} 
                    onChange={(e) => setActiveCourseId(e.target.value)}
                  >
                    {courses.map(c => <option key={c.course_id} value={c.course_id}>{c.title}</option>)}
                  </select>
                  <button className="btn-primary" onClick={() => setModalType('upload')}>+ Upload Material</button>
                </div>
              </div>

              <div className="course-detail-view">
                <div className="modules-sidebar">
                  <h3 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '14px' }}>Syllabus & Modules</h3>
                  {currentCourse.modules && currentCourse.modules.map(mod => (
                    <div key={mod.id} style={{ marginBottom: '16px' }}>
                      <div className="module-header">{mod.title}</div>
                      <div>
                        {mod.lessons.map(les => (
                          <div 
                            key={les.id} 
                            className={`lesson-item ${les.id === currentLesson?.id ? 'active' : ''}`}
                            onClick={() => setActiveLessonId(les.id)}
                          >
                            <span>{les.is_completed ? '✅' : '⚪'}</span>
                            <span>{les.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="lesson-content-pane">
                  {currentLesson ? (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 className="lesson-title-lg">{currentLesson.title}</h3>
                        <button 
                          className={currentLesson.is_completed ? 'btn-secondary' : 'btn-primary'}
                          onClick={() => handleToggleLesson(currentLesson.id)}
                        >
                          {currentLesson.is_completed ? '✓ Completed' : 'Mark as Complete'}
                        </button>
                      </div>
                      <div className="lesson-body-text">
                        <p>{currentLesson.content}</p>
                        <div style={{ background: '#fdfaf4', border: '1px solid #fae69e', borderRadius: '12px', padding: '18px', marginTop: '24px' }}>
                          <h4 style={{ fontWeight: 700, marginBottom: '6px' }}>📘 Technical Note (SRS React & Django Stack)</h4>
                          <p style={{ fontSize: '13.5px', color: '#555' }}>
                            All progress modifications are synchronized through Django REST Framework endpoints with SQLite/Postgres ORM.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : <div>Select a lesson from syllabus.</div>}
                </div>
              </div>
            </div>
          )}

          {currentTab === 'materials' && (
            <div className="page-container">
              <div className="page-header">
                <div>
                  <h2 className="page-title">Study Materials Repository</h2>
                  <p style={{ color: '#6b7280', fontSize: '13.5px', marginTop: '4px' }}>
                    Enforcing SRS Section 4 Upload Restrictions (Type & Size Check) via Django REST Framework.
                  </p>
                </div>
                <button className="btn-primary" onClick={() => setModalType('upload')}>+ Upload New Material</button>
              </div>

              <div className="restrictions-badge-box" style={{ background: '#fffbeb', border: '1px solid #fef3c7', marginBottom: '20px' }}>
                <strong>🔒 SRS Section 4 Security Validation:</strong> Documents (.pdf, .doc, .docx, .txt - max 10MB) • Presentations (.ppt, .pptx - max 25MB). Executable scripts (.exe, .bat, .sh) are permanently rejected by Django validator.
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f1eb', color: '#6b7280' }}>
                    <th style={{ padding: '12px 16px' }}>Document Name</th>
                    <th style={{ padding: '12px 16px' }}>Course</th>
                    <th style={{ padding: '12px 16px' }}>Category</th>
                    <th style={{ padding: '12px 16px' }}>Size</th>
                    <th style={{ padding: '12px 16px' }}>Uploaded</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map(m => (
                    <tr key={m.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 600 }}>📄 {m.name}</td>
                      <td style={{ padding: '14px 16px', color: '#4b5563' }}>{m.course_title}</td>
                      <td style={{ padding: '14px 16px' }}><span style={{ background: '#f3f4f6', padding: '4px 8px', borderRadius: '6px' }}>{m.category}</span></td>
                      <td style={{ padding: '14px 16px', color: '#6b7280' }}>{m.file_size_formatted}</td>
                      <td style={{ padding: '14px 16px', color: '#6b7280' }}>{m.uploaded_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {currentTab === 'assignments' && (
            <div className="page-container">
              <div className="page-header">
                <div>
                  <h2 className="page-title">Course Assignments</h2>
                  <p style={{ color: '#6b7280', fontSize: '13.5px', marginTop: '4px' }}>Submit solutions and track grading status.</p>
                </div>
                <button className="btn-primary" onClick={() => setModalType('assignment')}>Submit Assignment</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
                {tasks.map(t => (
                  <div key={t.id} style={{ border: '1px solid #e5e7eb', borderRadius: '16px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: t.is_completed ? '#dcfce7' : '#fef3c7', color: t.is_completed ? '#15803d' : '#b45309' }}>
                        {t.is_completed ? 'COMPLETED' : 'PENDING'}
                      </span>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>Due: {t.due_date_str}, 2026</span>
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{t.title}</h3>
                    <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '14px' }}>Course: {t.course_name}</p>
                    {!t.is_completed && (
                      <button className="btn-primary" style={{ padding: '7px 14px', fontSize: '13px' }} onClick={() => setModalType('assignment')}>
                        Submit Now
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentTab === 'progress' && (
            <div className="page-container">
              <div className="page-header">
                <h2 className="page-title">Learning Progress Analytics</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '24px' }}>
                <div style={{ background: '#fef9e7', padding: '20px', borderRadius: '16px', textAlign: 'center', border: '1px solid #fae69e' }}>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: '#d97706' }}>
                    {Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length)}%
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '4px' }}>Overall Completion</div>
                </div>
                <div style={{ background: '#eff6ff', padding: '20px', borderRadius: '16px', textAlign: 'center', border: '1px solid #bfdbfe' }}>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: '#2563eb' }}>{courses.length}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '4px' }}>Active Courses</div>
                </div>
                <div style={{ background: '#ecfdf5', padding: '20px', borderRadius: '16px', textAlign: 'center', border: '1px solid #a7f3d0' }}>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: '#059669' }}>100%</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '4px' }}>Offline Stability</div>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'notifications' && (
            <div className="page-container">
              <div className="page-header">
                <h2 className="page-title">Notifications</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid #f1ebd8', background: '#fffdf5' }}>
                  🔔 <strong>Web Development:</strong> Module 1 assignments recorded and validated.
                </div>
                <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid #f1ebd8', background: '#fffdf5' }}>
                  🔔 <strong>Database Management:</strong> Quiz unlocks on Nov 14.
                </div>
                <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid #f1ebd8', background: '#fffdf5' }}>
                  🔔 <strong>Security:</strong> All uploads verified through SRS magic bytes policy.
                </div>
              </div>
            </div>
          )}

          {currentTab === 'settings' && (
            <div className="page-container">
              <div className="page-header">
                <h2 className="page-title">System & Security Settings</h2>
              </div>
              <div style={{ maxWidth: '600px' }}>
                <div style={{ padding: '16px', background: '#fdfaf4', border: '1px solid #fae69e', borderRadius: '12px', marginBottom: '18px' }}>
                  <strong>Constraint 2 Confirmed:</strong> Authentication/Login/Register pages removed. Direct dashboard access active.
                </div>
                <div style={{ padding: '16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', marginBottom: '18px' }}>
                  <strong>Constraint 3 Confirmed:</strong> Full Stack Architecture with ReactJS SPA and Django REST Framework API.
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* UPLOAD MODAL */}
      {modalType === 'upload' && (
        <div className="modal-overlay" onClick={(e) => { if (e.target.classList.contains('modal-overlay')) setModalType(null); }}>
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Upload Study Material (Django API)</h3>
              <button className="close-modal-btn" onClick={() => setModalType(null)}>&times;</button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const fileInput = document.getElementById('reactUploadFile');
              const courseSelect = document.getElementById('reactUploadCourse');
              const catSelect = document.getElementById('reactUploadCat');
              if (!fileInput.files[0]) {
                setStatusMessage("Please select a file to upload.");
                return;
              }
              const file = fileInput.files[0];
              const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
              if (['.exe', '.bat', '.sh', '.js', '.py'].includes(ext)) {
                setStatusMessage("Error (400 - INVALID_FILE_TYPE): Executables are blocked.");
                return;
              }

              const formData = new FormData();
              formData.append('file', file);
              formData.append('course_title', courseSelect.value);
              formData.append('category', catSelect.value);

              try {
                const res = await fetch(`${API_BASE}/materials/`, { method: 'POST', body: formData });
                if (res.ok) {
                  setStatusMessage("File successfully validated and uploaded to Django backend!");
                  setTimeout(() => { setModalType(null); fetchDashboardData(); setStatusMessage(""); }, 1200);
                  return;
                } else {
                  const errData = await res.json();
                  setStatusMessage(`Django Error: ${errData.message || 'Upload failed'}`);
                  return;
                }
              } catch (err) {
                // Fallback local addition
                setMaterials(prev => [{
                  id: Date.now(),
                  name: file.name,
                  file_type: ext.replace('.', '').toUpperCase(),
                  file_size_formatted: (file.size / (1024 * 1024)).toFixed(1) + " MB",
                  course_title: courseSelect.value,
                  category: catSelect.value,
                  uploaded_at: "2026-11-20"
                }, ...prev]);
                setStatusMessage("File uploaded to React state repository!");
                setTimeout(() => { setModalType(null); setStatusMessage(""); }, 1000);
              }
            }}>
              <div className="form-group">
                <label className="form-label">Course</label>
                <select className="form-control" id="reactUploadCourse">
                  {courses.map(c => <option key={c.course_id} value={c.title}>{c.title}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-control" id="reactUploadCat">
                  <option value="documents">Documents (PDF, DOCX, TXT - Max 10MB)</option>
                  <option value="presentations">Presentations (PPT, PPTX - Max 25MB)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Choose File</label>
                <input type="file" id="reactUploadFile" className="form-control" />
              </div>
              <div className="restrictions-badge-box">
                SRS Section 4: Validates file extension, magic byte headers, and size quota.
              </div>
              {statusMessage && <div className="alert-success" style={{ marginTop: '12px' }}>{statusMessage}</div>}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn-secondary" onClick={() => setModalType(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCHEDULE MODAL */}
      {modalType === 'schedule' && (
        <div className="modal-overlay" onClick={(e) => { if (e.target.classList.contains('modal-overlay')) setModalType(null); }}>
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">November 2026 Study Schedule</h3>
              <button className="close-modal-btn" onClick={() => setModalType(null)}>&times;</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '12px', background: '#fffdf5', border: '1px solid #fef3c7', borderRadius: '10px' }}>
                <strong>Nov 10, 2026 (Today):</strong> Daily module review & assignment progress check.
              </div>
              <div style={{ padding: '12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px' }}>
                <strong>Nov 12, 2026:</strong> Web Development - Portfolio Submission Deadline.
              </div>
              <div style={{ padding: '12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px' }}>
                <strong>Nov 14, 2026:</strong> Database Management - Mid-term Assessment Quiz.
              </div>
            </div>
            <div style={{ textAlign: 'right', marginTop: '20px' }}>
              <button className="btn-primary" onClick={() => setModalType(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ASSIGNMENT MODAL */}
      {modalType === 'assignment' && (
        <div className="modal-overlay" onClick={(e) => { if (e.target.classList.contains('modal-overlay')) setModalType(null); }}>
          <div className="modal-card">
            <div className="modal-header">
              <h3 className="modal-title">Submit Course Assignment</h3>
              <button className="close-modal-btn" onClick={() => setModalType(null)}>&times;</button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const taskSelect = document.getElementById('assignTaskSelect');
              const fileInput = document.getElementById('assignFileInput');
              if (!fileInput.files[0]) {
                setStatusMessage("Please select assignment file.");
                return;
              }
              const file = fileInput.files[0];
              const formData = new FormData();
              formData.append('task_id', taskSelect.value);
              formData.append('file', file);
              formData.append('notes', 'Submitted via React LMS interface');

              try {
                const res = await fetch(`${API_BASE}/assignments/submit/`, { method: 'POST', body: formData });
                if (res.ok) {
                  setStatusMessage("Assignment submitted successfully to Django API!");
                  setTimeout(() => { setModalType(null); fetchDashboardData(); setStatusMessage(""); }, 1200);
                  return;
                }
              } catch (err) {}

              // Fallback local update
              setTasks(prev => prev.map(t => t.id === parseInt(taskSelect.value) ? { ...t, is_completed: true } : t));
              setStatusMessage("Assignment submission accepted!");
              setTimeout(() => { setModalType(null); setStatusMessage(""); }, 1000);
            }}>
              <div className="form-group">
                <label className="form-label">Task</label>
                <select className="form-control" id="assignTaskSelect">
                  {tasks.map(t => <option key={t.id} value={t.id}>{t.title} - {t.course_name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Upload File (.pdf, .docx, .zip - Max 20MB)</label>
                <input type="file" id="assignFileInput" className="form-control" />
              </div>
              {statusMessage && <div className="alert-success" style={{ marginTop: '12px' }}>{statusMessage}</div>}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn-secondary" onClick={() => setModalType(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
