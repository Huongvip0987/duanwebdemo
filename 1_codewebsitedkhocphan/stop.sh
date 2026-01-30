#!/bin/bash

# Stop all running Node.js processes
echo "🛑 Stopping Course Registration System..."

# Find and kill Node.js processes
pkill -f "node server.js"
pkill -f "react-scripts"

echo "✓ All processes stopped"
