#!/usr/bin/env python3
"""
Setup script for QR Generator Backend
"""
import os
import subprocess
import sys

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"\n{description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        print(f"Error output: {e.stderr}")
        return None

def setup_backend():
    """Set up the Django backend"""
    print("🚀 Setting up QR Generator Backend...")
    
    # Create virtual environment
    run_command("python -m venv venv", "Creating virtual environment")
    
    # Activate virtual environment and install requirements
    if os.name == 'nt':  # Windows
        activate_cmd = "venv\\Scripts\\activate"
    else:  # Unix/Linux/Mac
        activate_cmd = "source venv/bin/activate"
    
    run_command(f"{activate_cmd} && pip install -r requirements.txt", "Installing Python dependencies")
    
    # Run migrations
    run_command(f"{activate_cmd} && python manage.py makemigrations", "Creating migrations")
    run_command(f"{activate_cmd} && python manage.py migrate", "Running migrations")
    
    # Create superuser (optional)
    print("\n📝 You can create a superuser for admin access:")
    print(f"Run: {activate_cmd} && python manage.py createsuperuser")
    
    print("\n✅ Backend setup complete!")
    print("🔥 To start the development server:")
    print(f"   {activate_cmd} && python manage.py runserver")

if __name__ == "__main__":
    setup_backend()