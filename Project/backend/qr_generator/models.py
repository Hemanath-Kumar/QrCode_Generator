from django.db import models
from django.utils import timezone

class GenerationLog(models.Model):
    filename = models.CharField(max_length=255)
    data = models.TextField()
    label = models.CharField(max_length=255, blank=True)
    code_type = models.CharField(max_length=50)
    date = models.CharField(max_length=20)
    time = models.CharField(max_length=20)
    location = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    qr_code_image = models.ImageField(upload_to='qr_codes/', null=True, blank=True)
    


    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.filename} - {self.code_type}"

    @property
    def qr_code_url(self):
        if self.qr_code_image:
            return self.qr_code_image.url
        return None