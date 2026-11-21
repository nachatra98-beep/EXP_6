from django.urls import path
from .views import (
    DashboardOverviewAPI, CourseListAPI, CourseDetailAPI,
    LessonToggleCompleteAPI, StudyMaterialAPI, TaskListAPI,
    AssignmentSubmissionAPI
)

urlpatterns = [
    path('dashboard/', DashboardOverviewAPI.as_view(), name='dashboard-overview'),
    path('courses/', CourseListAPI.as_view(), name='course-list'),
    path('courses/<str:course_id>/', CourseDetailAPI.as_view(), name='course-detail'),
    path('lessons/<int:lesson_id>/toggle/', LessonToggleCompleteAPI.as_view(), name='lesson-toggle'),
    path('materials/', StudyMaterialAPI.as_view(), name='study-materials'),
    path('tasks/', TaskListAPI.as_view(), name='task-list'),
    path('assignments/submit/', AssignmentSubmissionAPI.as_view(), name='assignment-submit'),
]
