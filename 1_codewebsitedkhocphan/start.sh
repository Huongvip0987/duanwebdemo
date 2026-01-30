#!/bin/bash

# Course Registration System - Start Script
# This script starts the application in production mode

echo "🚀 Starting Course Registration System..."
echo "================================================"

# Check if MongoDB is running
if ! sudo systemctl is-active --quiet mongod; then
    echo "⚠️  MongoDB is not running. Starting MongoDB..."
    sudo systemctl start mongod
    sleep 2
fi

echo "✓ MongoDB is running"

# Build frontend
echo ""
echo "📦 Building frontend..."
cd client
npm run build
cd ..

echo "✓ Frontend built successfully"

# Start backend server
echo ""
echo "🌐 Starting backend server..."
cd server

# Set production environment
export NODE_ENV=production

# Start server
echo ""
echo "================================================"
echo "✅ Server is starting..."
echo "================================================"
echo ""
echo "📝 Access the application at:"
echo "   http://$(hostname -I | awk '{print $1}'):5000"
echo ""
echo "📝 Default login credentials:"
echo "   Email: student@university.edu"
echo "   Password: student123"
echo ""
echo "================================================"
echo ""

node server.js
