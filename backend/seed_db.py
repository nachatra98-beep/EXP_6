import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'learnhub_server.settings')
django.setup()

from lms_core.models import Course, Module, Lesson, StudyMaterial, Task

def seed():
    print("Clearing existing records...")
    Course.objects.all().delete()
    Task.objects.all().delete()
    StudyMaterial.objects.all().delete()

    print("Creating Courses...")
    # 1. Web Development
    c1 = Course.objects.create(
        course_id="web-dev",
        title="Web Development",
        category="Development",
        modules_count=6,
        progress=85,
        icon_type="code",
        color_theme="web-dev",
        description="Master Modern Frontend and Backend Web Development with React, Django, and REST APIs."
    )

    m1_1 = Module.objects.create(course=c1, title="Module 1: Semantic HTML5 & Modern Layouts", order=1)
    Lesson.objects.create(module=m1_1, title="1.1 Introduction to Web Architecture & HTML5", order=1, content="Understand the client-server request cycle, HTTP protocol, DOM tree construction, and semantic HTML5 structuring.", is_completed=True)
    Lesson.objects.create(module=m1_1, title="1.2 CSS Flexbox and Grid Masterclass", order=2, content="1D vs 2D layout mechanisms, CSS Grid template areas, responsive auto-fill and auto-fit rules.", is_completed=True)

    m1_2 = Module.objects.create(course=c1, title="Module 2: ReactJS Component Architecture", order=2)
    Lesson.objects.create(module=m1_2, title="2.1 Modern React Hooks & State", order=1, content="Deep dive into useState, useEffect, useMemo, and reactive state management in SPAs.", is_completed=True)
    Lesson.objects.create(module=m1_2, title="2.2 REST API Integration with Django Backend", order=2, content="Connecting React with Django REST Framework using fetch/axios, handling CORS, and processing JSON payloads.", is_completed=False)

    # 2. Database Management
    c2 = Course.objects.create(
        course_id="db-mgmt",
        title="Database Management",
        category="Data Science",
        modules_count=8,
        progress=40,
        icon_type="db",
        color_theme="db-mgmt",
        description="Relational database modeling, SQL querying, indexing, transactions, and normalization."
    )

    m2_1 = Module.objects.create(course=c2, title="Module 1: Relational Concepts & ER Modeling", order=1)
    Lesson.objects.create(module=m2_1, title="1.1 Entities, Attributes & Foreign Key Constraints", order=1, content="Entity-relationship diagrams, primary keys, referential integrity, and cascading behaviors.", is_completed=True)
    Lesson.objects.create(module=m2_1, title="1.2 Normalization: 1NF through BCNF", order=2, content="Eliminating insertion, deletion, and update anomalies through schema decomposition.", is_completed=False)

    # 3. Cyber Security
    c3 = Course.objects.create(
        course_id="cyber-sec",
        title="Cyber Security",
        category="Security",
        modules_count=5,
        progress=20,
        icon_type="shield",
        color_theme="cyber-sec",
        description="Core cybersecurity principles, threat models, cryptography, and OWASP Top 10 defenses."
    )

    m3_1 = Module.objects.create(course=c3, title="Module 1: Fundamental Security & OWASP Top 10", order=1)
    Lesson.objects.create(module=m3_1, title="1.1 CIA Triad & Threat Modeling", order=1, content="Confidentiality, Integrity, and Availability principles, threat vectors, and risk mitigation.", is_completed=True)
    Lesson.objects.create(module=m3_1, title="1.2 Secure File Upload Restrictions & MIME Validation", order=2, content="Enforcing magic byte validation, whitelisting extensions, preventing remote code execution (RCE).", is_completed=False)

    print("Creating Study Materials...")
    StudyMaterial.objects.create(course=c1, name="Web_Dev_Cheatsheet.pdf", file_type="PDF", file_size_formatted="2.4 MB", category="Documents")
    StudyMaterial.objects.create(course=c2, name="Database_Normalization_Guide.pdf", file_type="PDF", file_size_formatted="3.8 MB", category="Documents")
    StudyMaterial.objects.create(course=c3, name="OWASP_Top_10_Summary.pptx", file_type="PPTX", file_size_formatted="8.1 MB", category="Presentations")

    print("Creating Upcoming Tasks...")
    Task.objects.create(title="Submit Assignment", course_name="Web Development", due_date_str="Nov 12", task_type="assignment", icon_type="yellow", is_completed=True)
    Task.objects.create(title="Take Quiz", course_name="Database Management", due_date_str="Nov 14", task_type="quiz", icon_type="purple", is_completed=False)
    Task.objects.create(title="Review Notes", course_name="Cyber Security", due_date_str="Nov 16", task_type="review", icon_type="green", is_completed=False)

    print("Database seeding completed successfully!")

if __name__ == '__main__':
    seed()
