#!/bin/bash

echo "🧹 Cleaning up existing processes..."
pkill -f "uvicorn" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
pkill -f "node.*frontend" 2>/dev/null || true

echo "🚀 Starting Insight Application..."

# Start backend
echo "📡 Starting backend on port 8000..."
cd /Users/jeffaxelrod/content_miner/backend
source venv/bin/activate
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend to start
sleep 3

# Test backend
echo "🔍 Testing backend..."
curl -s http://127.0.0.1:8000/health && echo " ✅ Backend is healthy" || echo " ❌ Backend failed"

# Start frontend
echo "⚛️  Starting frontend on port 3000..."
cd /Users/jeffaxelrod/content_miner/frontend

# Try different port and host configurations
echo "Trying different network configurations..."

# Method 1: Default
npm run dev &
FRONTEND_PID1=$!
sleep 5

# Check if it worked
if curl -s http://localhost:3000 >/dev/null 2>&1; then
    echo "✅ Frontend running on http://localhost:3000"
    echo "🎉 Application is ready!"
    echo ""
    echo "🌐 Open your browser and go to: http://localhost:3000"
    echo "📡 API is available at: http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop both services"
    wait
else
    echo "❌ Method 1 failed, trying method 2..."
    kill $FRONTEND_PID1 2>/dev/null || true
    
    # Method 2: Specific host
    npm run dev -- --host 127.0.0.1 --port 3001 &
    FRONTEND_PID2=$!
    sleep 5
    
    if curl -s http://127.0.0.1:3001 >/dev/null 2>&1; then
        echo "✅ Frontend running on http://127.0.0.1:3001"
        echo "🌐 Open your browser and go to: http://127.0.0.1:3001"
    else
        echo "❌ Both methods failed. Please check:"
        echo "1. macOS Firewall settings"
        echo "2. Network permissions for Node.js"
        echo "3. Try running manually: cd frontend && npm run dev"
    fi
fi

echo ""
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID1 or $FRONTEND_PID2"
echo ""
echo "To stop: pkill -f uvicorn && pkill -f vite"

wait