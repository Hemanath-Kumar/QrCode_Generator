from django.urls import path
from . import views

urlpatterns = [
    path('generate/', views.generate_code, name='generate_code'),
    path('logs/', views.get_logs, name='get_logs'),
    path('logs/clear/', views.clear_logs, name='clear_logs'),
    path('logs/csv/', views.download_csv, name='download_csv'),
]