#!/bin/bash

# Insight Application Setup Script

set -e

echo "🚀 Setting up Insight Application..."

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📋 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your actual values before running the application"
else
    echo "✅ .env file already exists"
fi

# Set up backend
echo "🐍 Setting up Python backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

cd ..

# Set up frontend
echo "⚛️  Setting up React frontend..."
cd frontend

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

# Create frontend .env if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "Creating frontend .env.local from template..."
    cp .env.local.example .env.local
fi

cd ..

echo "✅ Setup complete!"
echo ""
echo "🚀 To start the application:"
echo "   1. Edit .env with your Gumloop API credentials"
echo "   2. Run: docker-compose up -d"
echo "   3. Or run manually:"
echo "      - Backend: cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
echo "      - Frontend: cd frontend && npm run dev"
echo ""
echo "🌐 Application will be available at:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:8000"
echo "   - API Docs: http://localhost:8000/docs"