import uuid
import os
from django.db import models

def generate_file_path(instance, filename):
    ext = os.path.splitext(filename)[1].lower()
    return f"uploads/{uuid.uuid4()}{ext}"

class Course(models.Model):
    course_id = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    modules_count = models.IntegerField(default=1)
    progress = models.IntegerField(default=0)
    icon_type = models.CharField(max_length=50, default='code')
    color_theme = models.CharField(max_length=50, default='web-dev')
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Module(models.Model):
    course = models.ForeignKey(Course, related_name='modules', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    order = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.course.title} - {self.title}"

class Lesson(models.Model):
    module = models.ForeignKey(Module, related_name='lessons', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    order = models.IntegerField(default=1)
    content = models.TextField()
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title

class StudyMaterial(models.Model):
    course = models.ForeignKey(Course, related_name='materials', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=20)
    file_size_formatted = models.CharField(max_length=50)
    category = models.CharField(max_length=50, default='Documents')
    file = models.FileField(upload_to=generate_file_path, blank=True, null=True)
    uploaded_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.name

class Task(models.Model):
    TASK_TYPES = [
        ('assignment', 'Assignment'),
        ('quiz', 'Quiz'),
        ('review', 'Review'),
    ]
    title = models.CharField(max_length=200)
    course_name = models.CharField(max_length=200)
    due_date_str = models.CharField(max_length=50) # e.g. "Nov 12"
    task_type = models.CharField(max_length=20, choices=TASK_TYPES, default='assignment')
    icon_type = models.CharField(max_length=20, default='yellow')
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} ({self.course_name})"

class AssignmentSubmission(models.Model):
    task = models.ForeignKey(Task, related_name='submissions', on_delete=models.CASCADE)
    notes = models.TextField(blank=True)
    file = models.FileField(upload_to=generate_file_path, blank=True, null=True)
    original_filename = models.CharField(max_length=255, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
