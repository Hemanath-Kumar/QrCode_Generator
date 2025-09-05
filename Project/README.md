# QR & Barcode Generator

A full-stack web application for generating QR codes and barcodes with multiple format support, built with React frontend and Django REST Framework backend.

## Features

### Frontend (React + TypeScript)
- **Multiple Code Types**: Support for QR Model 2, Micro QR, QR Model 1, Data Matrix, PDF417, Aztec, MaxiCode, DotCode, Code128, EAN13, UPC, Code39
- **Interactive UI**: Beautiful, responsive design with type selection and real-time validation
- **Generation History**: View all generated codes with detailed information
- **CSV Export**: Download generation logs as CSV files
- **Real-time Updates**: Async operations without page refreshes

### Backend (Django REST Framework)
- **Multiple Format Support**: Generate various QR codes and barcodes
- **MySQL Database**: Store generation logs with full details
- **RESTful API**: Clean API endpoints for all operations
- **Image Storage**: Automatic image generation and storage
- **CSV Export**: Generate CSV files from database records

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Axios for API calls
- React Query for state management
- QRCode.js and JSBarcode for code generation

### Backend
- Django 4.2 with Django REST Framework
- MySQL database
- Pillow for image processing
- Python barcode libraries (qrcode, python-barcode, segno)

## Installation

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- MySQL Server

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment**:
   - Windows: `venv\Scripts\activate`
   - Unix/Mac: `source venv/bin/activate`

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables**:
   - Copy `.env.example` to `.env`
   - Update database credentials and other settings

6. **Create MySQL database**:
   ```sql
   CREATE DATABASE qr_generator_db;
   ```

7. **Run migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

8. **Create superuser (optional)**:
   ```bash
   python manage.py createsuperuser
   ```

9. **Start development server**:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

## API Endpoints

### Generate Code
- **POST** `/api/generate/`
- **Body**: `{ "data": "text", "label": "optional", "code_type": "QR_Model_2" }`

### Get Logs
- **GET** `/api/logs/`

### Clear Logs
- **DELETE** `/api/logs/clear/`

### Download CSV
- **GET** `/api/logs/csv/`

## Code Types Supported

| Type | Description | Max Length | Use Cases |
|------|-------------|------------|-----------|
| QR Model 2 | Standard QR codes | 4,296 chars | General purpose, URLs, text |
| Micro QR | Compact QR codes | 35 chars | Small labels, limited space |
| QR Model 1 | Legacy QR codes | 1,167 chars | Legacy systems |
| Data Matrix | Dense 2D codes | 2,335 chars | Industrial parts, PCBs |
| PDF417 | Stacked linear | 1,850 chars | ID cards, documents |
| Aztec | Transport codes | 3,067 chars | Tickets, boarding passes |
| MaxiCode | Logistics codes | 93 chars | Shipping labels |
| DotCode | High-speed printing | 113 chars | Product marking |
| Code128 | Linear barcode | 48 chars | Retail, inventory |
| EAN13 | European retail | 12 digits | Product barcodes |
| UPC | US retail | 11 digits | Product barcodes |
| Code39 | Simple linear | 43 chars | Logistics, inventory |

## Database Schema

### GenerationLog Model
- `filename`: Generated filename
- `data`: Encoded data
- `label`: Optional label
- `code_type`: Type of code generated
- `date`: Generation date
- `time`: Generation time
- `location`: File path
- `created_at`: Timestamp
- `qr_code_image`: Image field

## Development

### Running Tests
```bash
# Backend tests
python manage.py test

# Frontend tests
npm test
```

### Building for Production
```bash
# Frontend build
npm run build

# Backend collectstatic
python manage.py collectstatic
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.