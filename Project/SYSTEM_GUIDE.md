# QR & Barcode Generator System Guide

## Overview
This is a full-stack QR and Barcode generator application with React frontend and Django REST Framework backend.

## Frontend Features

### 1. QR Type Information Display
- **Visual Type Selection**: Grid layout showing all supported QR/barcode types
- **Detailed Information**: Each type shows:
  - Name and description
  - Supported data formats
  - Maximum character length
  - Use case examples
- **Real-time Validation**: Character count and format validation

### 2. Code Generation Interface
- **Data Input**: Multi-line text area for code data
- **Label Field**: Optional label that appears below the generated code
- **Type Selection**: Visual selection with detailed information
- **Live Preview**: Shows selected type information and validation

### 3. Generation History
- **Comprehensive Logging**: All generated codes are logged with:
  - Filename
  - Data content
  - Label
  - Code type
  - Date and time
  - File location
- **Visual History**: Table format with thumbnail images
- **CSV Export**: Download complete history as CSV
- **Persistent Data**: History persists across page refreshes

### 4. User Experience
- **Async Operations**: All operations without page refresh
- **Loading States**: Visual feedback during generation
- **Error Handling**: Clear error messages and validation
- **Responsive Design**: Works on all device sizes

## Backend Features

### 1. Database Storage
- **MySQL Database**: Stores all generation logs
- **Model Structure**:
  ```python
  class GenerationLog:
      filename = CharField(max_length=255)
      data = TextField()
      label = CharField(max_length=255, blank=True)
      code_type = CharField(max_length=50)
      date = CharField(max_length=20)
      time = CharField(max_length=20)
      location = TextField()
      created_at = DateTimeField(auto_now_add=True)
      qr_code_image = ImageField(upload_to='qr_codes/')
  ```

### 2. API Endpoints
- **POST /api/generate/**: Generate new QR/barcode
- **GET /api/logs/**: Get all generation logs
- **DELETE /api/logs/clear/**: Clear all logs
- **GET /api/logs/csv/**: Download CSV export

### 3. Code Generation
- **Multiple Libraries**: Uses segno, qrcode, python-barcode, treepoem
- **Image Processing**: PIL for image manipulation and label addition
- **File Management**: Automatic filename generation and storage
- **High Quality**: 300 DPI output for print quality

## Supported Code Types

| Type | Max Length | Data Support | Use Cases |
|------|------------|--------------|-----------|
| QR Model 2 | 4,296 chars | Numeric, Alphanumeric, Kanji, Byte | General purpose, URLs, text |
| Micro QR | 35 chars | Numeric, Alphanumeric, Byte | Small labels, limited space |
| QR Model 1 | 1,167 chars | Numeric, Alphanumeric, Byte | Legacy systems |
| Data Matrix | 2,335 chars | ASCII, Extended ASCII | Industrial parts, PCBs |
| PDF417 | 1,850 chars | ASCII, Binary | ID cards, documents |
| Aztec | 3,067 chars | Binary, ASCII | Tickets, boarding passes |
| MaxiCode | 93 chars | ASCII | Shipping labels |
| DotCode | 113 chars | ASCII, Binary | Product marking |
| Code128 | 48 chars | ASCII (all 128) | Retail, inventory |
| EAN13 | 12 digits | Numeric only | Product barcodes |
| UPC | 11 digits | Numeric only | US retail products |
| Code39 | 43 chars | Uppercase, digits, symbols | Logistics, inventory |

## Setup Instructions

### Prerequisites
- Node.js 16+
- Python 3.8+
- MySQL Server

### Backend Setup
1. Navigate to backend directory: `cd backend`
2. Create virtual environment: `python -m venv venv`
3. Activate: `source venv/bin/activate` (Linux/Mac) or `venv\Scripts\activate` (Windows)
4. Install dependencies: `pip install -r requirements.txt`
5. Set up database in MySQL: `CREATE DATABASE qr_generator_db;`
6. Run migrations: `python manage.py migrate`
7. Start server: `python manage.py runserver`

### Frontend Setup
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`

## Technical Implementation

### Frontend Architecture
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for responsive styling
- **Axios** for API communication
- **React Query** for state management
- **Lucide React** for icons

### Backend Architecture
- **Django 4.2** with Django REST Framework
- **MySQL** database for persistence
- **Pillow** for image processing
- **Multiple barcode libraries** for code generation
- **CORS** enabled for frontend communication

### Key Features Implementation

#### 1. Type Selection with Information
```typescript
// QRTypeSelector component shows detailed information
const QR_CODE_TYPES = [
  {
    id: 'QR_Model_2',
    name: 'QR Model 2',
    description: 'Standard QR codes with high capacity',
    supports: 'Numeric, Alphanumeric, Kanji, Byte (ASCII/UTF-8)',
    maxLength: 4296,
    example: 'https://example.com or any text up to 4296 characters'
  },
  // ... other types
];
```

#### 2. Async Generation
```typescript
// Generation without page refresh
const generateCode = async (request: GenerateRequest) => {
  setIsGenerating(true);
  try {
    const response = await qrCodeApi.generateCode(request);
    setLatestGeneration(response.log);
    await fetchLogs(); // Refresh history
  } catch (error) {
    setError(error.message);
  } finally {
    setIsGenerating(false);
  }
};
```

#### 3. History Persistence
```python
# Django model with automatic timestamp
class GenerationLog(models.Model):
    # ... fields
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
```

#### 4. CSV Export
```python
# Backend CSV generation
def download_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="qr_generation_log.csv"'
    
    writer = csv.writer(response)
    writer.writerow(['filename', 'data', 'label', 'code_type', 'date', 'time', 'location'])
    
    for log in GenerationLog.objects.all():
        writer.writerow([log.filename, log.data, log.label, log.code_type, log.date, log.time, log.location])
    
    return response
```

## Usage Flow

1. **Select Code Type**: Choose from visual grid with detailed information
2. **Enter Data**: Input text/data to encode with optional label
3. **Generate**: Click generate to create code asynchronously
4. **View Result**: See generated code with download option
5. **Check History**: View all previous generations in table format
6. **Export Data**: Download complete history as CSV

## Error Handling
- **Client-side Validation**: Character limits and format checking
- **Server-side Validation**: Data format and type compatibility
- **Error Messages**: Clear, user-friendly error descriptions
- **Graceful Degradation**: Fallback options for unsupported types

## Security Features
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Server-side validation for all inputs
- **File Security**: Secure file upload and storage
- **SQL Injection Protection**: Django ORM prevents SQL injection

This system provides a complete, production-ready QR and barcode generation solution with comprehensive logging, export capabilities, and a user-friendly interface.