from django.contrib import admin
from .models import GenerationLog

@admin.register(GenerationLog)
class GenerationLogAdmin(admin.ModelAdmin):
    list_display = ['filename', 'code_type', 'data', 'label', 'date', 'time', 'created_at']
    list_filter = ['code_type', 'date', 'created_at']
    search_fields = ['filename', 'data', 'label']
    readonly_fields = ['created_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).order_by('-created_at')