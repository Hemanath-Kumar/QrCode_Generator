from rest_framework import serializers
from .models import GenerationLog

class GenerationLogSerializer(serializers.ModelSerializer):
    qr_code_url = serializers.SerializerMethodField()

    class Meta:
        model = GenerationLog
        fields = ['id', 'filename', 'data', 'label', 'code_type', 'date', 'time', 'location', 'created_at', 'qr_code_url']

    def get_qr_code_url(self, obj):
        if obj.qr_code_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.qr_code_image.url)
        return None

class GenerateRequestSerializer(serializers.Serializer):
    data = serializers.CharField(max_length=4296)
    label = serializers.CharField(max_length=255, required=False, allow_blank=True)
    code_type = serializers.CharField(max_length=50)