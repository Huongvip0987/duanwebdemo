#!/bin/bash

# Course Registration System - Development Start Script
# This script starts both backend and frontend in development mode

echo "🚀 Starting Course Registration System (Development Mode)..."
echo "================================================"

# Check if MongoDB is running
if ! sudo systemctl is-active --quiet mongod; then
    echo "⚠️  MongoDB is not running. Starting MongoDB..."
    sudo systemctl start mongod
    sleep 2
fi

echo "✓ MongoDB is running"

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap CTRL+C and cleanup
trap cleanup INT TERM

# Start backend
echo ""
echo "🌐 Starting backend server..."
cd server
node server.js &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo ""
echo "🎨 Starting frontend development server..."
cd client
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "================================================"
echo "✅ Development servers started!"
echo "================================================"
echo ""
echo "📝 Backend API: http://localhost:5000"
echo "📝 Frontend: http://localhost:3000"
echo ""
echo "📝 Default login credentials:"
echo "   Email: student@university.edu"
echo "   Password: student123"
echo ""
echo "Press CTRL+C to stop all servers"
echo "================================================"
echo ""

# Wait for processes
wait
