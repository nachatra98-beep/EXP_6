from rest_framework import serializers
from .models import Course, Module, Lesson, StudyMaterial, Task, AssignmentSubmission

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'order', 'content', 'is_completed']

class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = ['id', 'title', 'order', 'lessons']

class CourseSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = [
            'id', 'course_id', 'title', 'category', 'modules_count',
            'progress', 'icon_type', 'color_theme', 'description', 'modules'
        ]

class StudyMaterialSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = StudyMaterial
        fields = [
            'id', 'course', 'course_title', 'name', 'file_type',
            'file_size_formatted', 'category', 'file', 'file_url', 'uploaded_at'
        ]

    def get_file_url(self, obj):
        if obj.file:
            return obj.file.url
        return None

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class AssignmentSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignmentSubmission
        fields = '__all__'
