import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Course, Module, Lesson, StudyMaterial, Task, AssignmentSubmission
from .serializers import (
    CourseSerializer, LessonSerializer, StudyMaterialSerializer,
    TaskSerializer, AssignmentSubmissionSerializer
)

# SRS Section 4 Upload Restrictions configuration
ALLOWED_EXTENSIONS = {
    'documents': ['.pdf', '.doc', '.docx', '.txt'],
    'presentations': ['.ppt', '.pptx'],
    'spreadsheets': ['.xls', '.xlsx', '.csv'],
    'images': ['.jpg', '.jpeg', '.png', '.webp'],
    'assignment': ['.pdf', '.doc', '.docx', '.txt', '.zip'],
}

MAX_SIZES = {
    'documents': 10 * 1024 * 1024,      # 10 MB
    'presentations': 25 * 1024 * 1024,  # 25 MB
    'spreadsheets': 10 * 1024 * 1024,   # 10 MB
    'images': 2 * 1024 * 1024,          # 2 MB
    'assignment': 20 * 1024 * 1024,     # 20 MB
}

PROHIBITED_EXTENSIONS = [
    '.exe', '.bat', '.sh', '.js', '.php', '.py', '.html', '.svg', '.vbs', '.msi'
]

def validate_srs_file(file_obj, category='documents'):
    filename = file_obj.name.lower()
    ext = os.path.splitext(filename)[1]

    # Prohibited executable check
    if ext in PROHIBITED_EXTENSIONS or any(filename.endswith(p) for p in PROHIBITED_EXTENSIONS):
        return False, "INVALID_FILE_TYPE", "Executable and script files (.exe, .bat, scripts) are strictly prohibited."

    allowed = ALLOWED_EXTENSIONS.get(category, ALLOWED_EXTENSIONS['documents'])
    if ext not in allowed:
        return False, "INVALID_FILE_TYPE", f"This file type is not allowed. Allowed types: {', '.join(allowed)}."

    max_size = MAX_SIZES.get(category, 10 * 1024 * 1024)
    if file_obj.size > max_size:
        return False, "FILE_TOO_LARGE", f"File exceeds the {max_size // (1024 * 1024)} MB limit."

    return True, None, None


class DashboardOverviewAPI(APIView):
    """Returns aggregated data for the dashboard UI matching the reference image"""
    def get(self, request):
        courses = Course.objects.all()
        tasks = Task.objects.all()
        materials = StudyMaterial.objects.all()[:10]

        return Response({
            "learner": {
                "name": "Learner",
                "initial": "N",
                "notification_count": 3
            },
            "courses": CourseSerializer(courses, many=True).data,
            "upcoming_tasks": TaskSerializer(tasks, many=True).data,
            "recent_materials": StudyMaterialSerializer(materials, many=True).data
        })


class CourseListAPI(APIView):
    def get(self, request):
        courses = Course.objects.all()
        return Response(CourseSerializer(courses, many=True).data)


class CourseDetailAPI(APIView):
    def get(self, request, course_id):
        try:
            course = Course.objects.get(course_id=course_id)
            return Response(CourseSerializer(course).data)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)


class LessonToggleCompleteAPI(APIView):
    def post(self, request, lesson_id):
        try:
            lesson = Lesson.objects.get(id=lesson_id)
            lesson.is_completed = not lesson.is_completed
            lesson.save()

            # Recalculate course progress
            course = lesson.module.course
            total_lessons = Lesson.objects.filter(module__course=course).count()
            completed_lessons = Lesson.objects.filter(module__course=course, is_completed=True).count()
            if total_lessons > 0:
                course.progress = int((completed_lessons / total_lessons) * 100)
                course.save()

            return Response({
                "lesson_id": lesson.id,
                "is_completed": lesson.is_completed,
                "course_progress": course.progress
            })
        except Lesson.DoesNotExist:
            return Response({"error": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)


class StudyMaterialAPI(APIView):
    def get(self, request):
        materials = StudyMaterial.objects.all().order_by('-id')
        return Response(StudyMaterialSerializer(materials, many=True).data)

    def post(self, request):
        file_obj = request.FILES.get('file')
        course_title = request.data.get('course_title')
        category = request.data.get('category', 'documents')

        if not file_obj:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

        is_valid, err_code, err_msg = validate_srs_file(file_obj, category)
        if not is_valid:
            status_code = status.HTTP_413_REQUEST_ENTITY_TOO_LARGE if err_code == "FILE_TOO_LARGE" else status.HTTP_400_BAD_REQUEST
            return Response({"error_code": err_code, "message": err_msg}, status=status_code)

        try:
            course = Course.objects.get(title__iexact=course_title)
        except Course.DoesNotExist:
            course = Course.objects.first()

        size_mb = f"{file_obj.size / (1024 * 1024):.1f} MB"
        file_ext = os.path.splitext(file_obj.name)[1].replace('.', '').upper()

        material = StudyMaterial.objects.create(
            course=course,
            name=file_obj.name,
            file_type=file_ext,
            file_size_formatted=size_mb,
            category=category.capitalize(),
            file=file_obj
        )

        return Response(StudyMaterialSerializer(material).data, status=status.HTTP_201_CREATED)


class TaskListAPI(APIView):
    def get(self, request):
        tasks = Task.objects.all()
        return Response(TaskSerializer(tasks, many=True).data)


class AssignmentSubmissionAPI(APIView):
    def post(self, request):
        task_id = request.data.get('task_id')
        notes = request.data.get('notes', '')
        file_obj = request.FILES.get('file')

        if not file_obj:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        is_valid, err_code, err_msg = validate_srs_file(file_obj, 'assignment')
        if not is_valid:
            status_code = status.HTTP_413_REQUEST_ENTITY_TOO_LARGE if err_code == "FILE_TOO_LARGE" else status.HTTP_400_BAD_REQUEST
            return Response({"error_code": err_code, "message": err_msg}, status=status_code)

        try:
            task = Task.objects.get(id=task_id)
            task.is_completed = True
            task.save()
        except Task.DoesNotExist:
            task = Task.objects.first()

        submission = AssignmentSubmission.objects.create(
            task=task,
            notes=notes,
            file=file_obj,
            original_filename=file_obj.name
        )

        return Response({
            "message": "Assignment submitted successfully!",
            "submission_id": submission.id,
            "task_id": task.id,
            "is_completed": task.is_completed
        }, status=status.HTTP_201_CREATED)
