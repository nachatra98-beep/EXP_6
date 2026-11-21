from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.views.static import serve
from django.http import HttpResponse
from pathlib import Path
import os

BASE_DIR = settings.BASE_DIR

def render_home(request):
    index_file = BASE_DIR.parent / 'index.html'
    with open(index_file, 'r', encoding='utf-8') as f:
        content = f.read()
    return HttpResponse(content, content_type='text/html')

def serve_static_root(request, filename):
    file_path = BASE_DIR.parent / filename
    if not file_path.exists():
        # Check in frontend folder
        file_path = BASE_DIR.parent / 'frontend' / filename
    if file_path.exists():
        content_type = 'text/css' if filename.endswith('.css') else ('application/javascript' if filename.endswith('.js') or filename.endswith('.jsx') else 'text/plain')
        with open(file_path, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read(), content_type=content_type)
    return HttpResponse('Not found', status=404)

urlpatterns = [
    # 1. Root route serves the complete interactive LMS application
    path('', render_home, name='home-app'),
    
    # 2. Django Admin & REST Framework API
    path('admin/', admin.site.urls),
    path('api/v1/', include('lms_core.urls')),
    
    # 3. Direct assets
    re_path(r'^(?P<filename>(style\.css|app\.js|app\.jsx))$', serve_static_root),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.BASE_DIR.parent)
