#!/bin/bash

# Course Registration System - Setup Script for Ubuntu Server
# This script installs all dependencies and sets up the application

echo "🚀 Starting Course Registration System Setup..."
echo "================================================"

# Update system
echo ""
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js
echo ""
echo "📦 Installing Node.js 18.x..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ NPM version: $(npm --version)"

# Install MongoDB
echo ""
echo "📦 Installing MongoDB..."
if ! command -v mongod &> /dev/null; then
    # Import MongoDB GPG key
    wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
    
    # Add MongoDB repository
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -sc)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    
    # Install MongoDB
    sudo apt update
    sudo apt install -y mongodb-org
    
    # Start and enable MongoDB
    sudo systemctl start mongod
    sudo systemctl enable mongod
fi

echo "✓ MongoDB installed and running"
sudo systemctl status mongod --no-pager | head -n 5

# Install dependencies
echo ""
echo "📦 Installing application dependencies..."

# Backend dependencies
echo "Installing backend dependencies..."
cd server
npm install
cd ..

# Frontend dependencies
echo "Installing frontend dependencies..."
cd client
npm install
cd ..

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "================================================"
echo "📝 Next Steps:"
echo "================================================"
echo ""
echo "1. Configure environment variables:"
echo "   cd server"
echo "   nano .env"
echo ""
echo "2. Start the application:"
echo "   ./start.sh"
echo ""
echo "3. Access the website:"
echo "   http://$(hostname -I | awk '{print $1}'):5000"
echo ""
echo "================================================"
