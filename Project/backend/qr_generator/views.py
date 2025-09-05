import os
import csv
import io
from datetime import datetime
from django.http import HttpResponse, JsonResponse
from django.conf import settings
from django.core.files.base import ContentFile
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from PIL import Image, ImageDraw, ImageFont,ImageOps
import qrcode
import barcode
from barcode.writer import ImageWriter
import treepoem
import segno
from .models import GenerationLog
from .serializers import GenerationLogSerializer, GenerateRequestSerializer

def get_unique_filename(base_name, extension=".png"):
    """Generate unique filename with counter"""
    counter_file = os.path.join(settings.MEDIA_ROOT, "qr_counter.txt")
    
    if os.path.exists(counter_file):
        with open(counter_file, 'r') as f:
            count = int(f.read().strip()) + 1
    else:
        count = 1
    
    # Save new count for next run
    os.makedirs(os.path.dirname(counter_file), exist_ok=True)
    with open(counter_file, 'w') as f:
        f.write(str(count))
    
    return f"{base_name}_{count}{extension}"

def generate_qr_code_image(data, code_type, label=""):
    """
    Generate QR code or barcode image with clean label placement, no cropping.
    Returns: PIL.Image.Image
    """
    img = None

    try:
        # Generate QR/Barcode Image
        if code_type == "QR_Model_2":
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_M,
                box_size=10,
                border=4,
            )
            qr.add_data(data)
            qr.make(fit=True)
            img = qr.make_image(fill_color="black", back_color="white").convert("RGB")

        elif code_type == "Micro_QR":
            qr = segno.make(data, micro=True)
            buf = io.BytesIO()
            qr.save(buf, kind='png', scale=10, border=4)
            buf.seek(0)
            img = Image.open(buf).convert("RGB")

        elif code_type == "QR_Model_1":
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            qr.add_data(data)
            qr.make(fit=True)
            img = qr.make_image(fill_color="black", back_color="white").convert("RGB")

        elif code_type == "Aztec":
            img = treepoem.generate_barcode(barcode_type="azteccode", data=data).convert("RGB")

        elif code_type in ["Data_Matrix", "PDF417", "MaxiCode", "DotCode", "Code128", "EAN13", "UPC", "Code39"]:
            barcode_map = {
                "Data_Matrix": "datamatrix",
                "PDF417": "pdf417",
                "MaxiCode": "maxicode",
                "DotCode": "dotcode",
                "Code128": "code128",
                "EAN13": "ean13",
                "UPC": "upca",
                "Code39": "code39",
            }
            # Validation
            if code_type == "EAN13" and (not data.isdigit() or len(data) != 12):
                raise ValueError("EAN13 requires exactly 12 numeric digits")
            if code_type == "UPC" and (not data.isdigit() or len(data) != 11):
                raise ValueError("UPC requires exactly 11 numeric digits")

            img = treepoem.generate_barcode(barcode_type=barcode_map[code_type], data=data,options={"includetext": False},).convert("RGB")
            # Force upscaling if image is too small for scanners
            min_size = 300
            if img.width < min_size or img.height < min_size:
                scale_factor = max(min_size // img.width, min_size // img.height)
                img = img.resize(
                    (img.width * scale_factor, img.height * scale_factor),
                    Image.NEAREST  # preserves sharpness for barcode scanning
                )
        else:
            raise ValueError(f"Unsupported code type: {code_type}")

        # Add Label Safely
        if label:
            font = ImageFont.load_default()
            draw = ImageDraw.Draw(img)
            bbox = draw.textbbox((0, 0), label, font=font)
            text_w = bbox[2] - bbox[0]
            text_h = bbox[3] - bbox[1]
            padding = 20  # extra padding for label
            bottom_padding = text_h + padding

            # Expand canvas without cropping using ImageOps
            img = ImageOps.expand(img, border=(0, 0, 0, bottom_padding), fill="white")

            # Recreate drawing context
            draw = ImageDraw.Draw(img)
            text_position = ((img.width - text_w) // 2, img.height - bottom_padding + (padding // 2))
            draw.text(text_position, label, fill="black", font=font)

        return img

    except Exception as e:
        raise Exception(f"Error generating {code_type}: {str(e)}")
    
@api_view(['POST'])
def generate_code(request):
    """Generate QR code or barcode"""
    serializer = GenerateRequestSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data['data']
    label = serializer.validated_data.get('label', '')
    code_type = serializer.validated_data['code_type']
    
    try:
        # Generate the image
        img = generate_qr_code_image(data, code_type, label)
        
        # Create filename
        today = datetime.now()
        day_month = today.strftime("%d%m")
        base_name = f"qrcode_{code_type}_{day_month}"
        filename = get_unique_filename(base_name)
        
        # Save image to BytesIO
        img_io = io.BytesIO()
        img.save(img_io, format='PNG', dpi=(300, 300))
        img_io.seek(0)
        
        # Create log entry
        now = datetime.now()
        date_str = now.strftime("%d/%m/%Y")
        time_str = now.strftime("%I:%M %p").lower()
        
        log = GenerationLog.objects.create(
            filename=filename,
            data=data,
            label=label,
            code_type=code_type,
            date=date_str,
            time=time_str,
            location=os.path.join(settings.MEDIA_ROOT, 'qr_codes', filename)
        )
        
        # Save image file
        log.qr_code_image.save(filename, ContentFile(img_io.getvalue()))
        
        # Return response
        log_serializer = GenerationLogSerializer(log, context={'request': request})
        
        return Response({
            'success': True,
            'message': f'Successfully generated {code_type}',
            'log': log_serializer.data,
            'qr_code_url': log_serializer.data['qr_code_url']
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_logs(request):
    """Get all generation logs"""
    logs = GenerationLog.objects.all()
    serializer = GenerationLogSerializer(logs, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['DELETE'])
def clear_logs(request):
    """Clear all generation logs"""
    GenerationLog.objects.all().delete()
    return Response({'message': 'All logs cleared successfully'})

@api_view(['GET'])
def download_csv(request):
    """Download CSV file with all logs"""
    logs = GenerationLog.objects.all()
    
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="qr_generation_log.csv"'
    
    writer = csv.writer(response)
    writer.writerow(['filename', 'data', 'label', 'code_type', 'date', 'time', 'location'])
    
    for log in logs:
        writer.writerow([
            log.filename,
            log.data,
            log.label,
            log.code_type,
            log.date,
            log.time,
            log.location
        ])
    
    return response