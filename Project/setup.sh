#!/bin/bash
echo "🚀 Setting up QR Generator System"
echo "================================="

# Frontend setup
echo "📦 Installing frontend dependencies..."
npm install

# Backend setup
echo "🐍 Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Database setup
echo "🗄️ Setting up database..."
python manage.py makemigrations
python manage.py migrate

# Create media directory
mkdir -p media/qr_codes

cd ..

echo "✅ Setup complete!"
echo ""
echo "To start the system:"
echo "1. Backend: cd backend && source venv/bin/activate && python manage.py runserver"
echo "2. Frontend: npm run dev"
echo "3. Test: python test_system.py"