# LearnHub - ReactJS & Django LMS (SRS Document v1.0)

A complete full-stack **Learning Management System (LMS)** engineered using **ReactJS** for the frontend and **Django + Django REST Framework** for the backend, designed strictly according to the **SRS Document (Draft v1.0, 20 Nov 2026)** and the reference UI dashboard.

---

## 🎯 Constraints & Implementation Overview

1. **Dashboard UI Match**:
   - **Sidebar**: Complete LearnHub branding (*"Learn • Practice • Grow"*), navigation tabs (*Home, My Courses, Study Materials, Assignments, Progress, Notifications, Settings*), notification badge counter, and the bottom handwritten quote (*"Small steps... Big achievements! ♡"* with the book illustration).
   - **Header**: Rounded search input bar (*"Search courses, notes..."*), sun theme icon, notification bell with red badge, and learner avatar `"N"`.
   - **Welcome Card**: High-fidelity pastel yellow card (*"Welcome back, Learner! ☆ Keep going — you're doing great! ♡"*), 3D graduation cap and laptop artwork, and `"Continue Learning >"` action button.
   - **Quick Action Cards**: *Upload Materials*, *Search Study Material*, *View Schedule*, and *Track Progress*.
   - **My Courses**: Pre-populated course cards (*Web Development - 85%*, *Database Management - 40%*, *Cyber Security - 20%*) with their respective icons, module counts, and progress bars.
   - **Calendar**: Interactive **November 2026** calendar matching the Sunday-start layout with the 10th highlighted.
   - **Upcoming Tasks**: *Submit Assignment (Web Dev)*, *Take Quiz (Database Management)*, and *Review Notes (Cyber Security)*.
   - **Motivation Strip**: Trophy icon, curve progress diagram, and motivational header.

2. **No Login or Register Page**:
   - As mandated by Constraint 2, the application skips authentication and registration walls entirely. Users have instant, frictionless access to the learner dashboard.

3. **Tech Stack (ReactJS & Django + Django REST Framework)**:
   - **Backend**: Python 3, Django 6.1, and Django REST Framework (`lms_core` app).
   - **Frontend**: ReactJS component architecture (`frontend/app.jsx` and `frontend/index.html`).
   - **REST API Endpoints**:
     - `GET /api/v1/dashboard/`: Aggregated dashboard payload.
     - `GET /api/v1/courses/`: Complete course listings and syllabus hierarchy.
     - `POST /api/v1/lessons/<id>/toggle/`: Marks lessons completed and computes dynamic course progress.
     - `POST /api/v1/materials/`: Uploads study materials with strict SRS Section 4 validation.
     - `POST /api/v1/assignments/submit/`: Submits assignment files and notes.
   - **SRS Section 4 Validation Engine**: Enforces file extensions, checks MIME types, prevents prohibited executables (`.exe`, `.bat`, `.py`, `.js`), and rejects files exceeding size thresholds (10MB for documents, 25MB for presentations, 20MB for assignments).

---

## 📁 Project Structure

```
EX_6/
├── backend/
│   ├── manage.py                    # Django CLI
│   ├── seed_db.py                   # Initial database seeder for courses & tasks
│   ├── db.sqlite3                   # Populated SQLite database
│   ├── learnhub_server/             # Django project configuration
│   │   ├── settings.py              # CORS, REST Framework, & File limits
│   │   ├── urls.py                  # Root URL router
│   │   └── wsgi.py
│   └── lms_core/                    # LMS core Django application
│       ├── models.py                # Course, Module, Lesson, Material, Task models
│       ├── serializers.py           # DRF Serializers
│       ├── views.py                 # REST API Views & SRS File Validators
│       └── urls.py                  # API v1 routes
├── frontend/
│   ├── index.html                   # React application root
│   └── app.jsx                      # ReactJS Single Page Application
├── start_django.bat                 # One-click launcher for Django server
├── index.html                       # Standalone offline version (instant browser view)
├── app.js                           # Vanilla JS fallback engine
├── style.css                        # UI stylesheet matching reference design
└── README.md
```

---

## 🚀 How to Run

### Option 1: Full-Stack React + Django Server
1. **Start the Django Backend**:
   - Double click `start_django.bat` or run:
     ```bash
     cd backend
     python manage.py runserver 127.0.0.1:8000
     ```
2. **Launch the React Frontend**:
   - Open [frontend/index.html](file:///c:/Users/user/Desktop/EX_6/frontend/index.html) in your web browser.
   - The top header will display `● Django REST API Connected`. All actions (toggling lesson completion, uploading materials, and submitting assignments) will persist directly through Django and its SQLite database.

### Option 2: Instant Standalone Offline Mode
- Open [index.html](file:///c:/Users/user/Desktop/EX_6/index.html) directly in any browser. It contains all components and pre-loaded courses running purely in-browser with zero dependencies.
