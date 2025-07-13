#!/bin/bash

echo "🧹 Cleaning up any existing processes..."
pkill -f "uvicorn"
pkill -f "vite"

echo "🚀 Starting Insight Application..."

# Start backend
echo "📡 Starting backend on port 8000..."
cd /Users/jeffaxelrod/content_miner/backend
source venv/bin/activate
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Test backend
echo "🔍 Testing backend..."
curl -s http://localhost:8000/health && echo "✅ Backend is healthy" || echo "❌ Backend failed"

# Start frontend
echo "⚛️  Starting frontend on port 3000..."
cd /Users/jeffaxelrod/content_miner/frontend
npm run dev &
FRONTEND_PID=$!

echo "🎉 Application started!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Access your application at: http://localhost:3000"
echo "API documentation at: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both services"

# Wait for user to stop
wait