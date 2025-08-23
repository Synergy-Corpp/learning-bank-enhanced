#!/bin/bash

# 🏦 Learning Bank - Enhanced Startup Script
# Collaborative work with analytical frameworks: FRI, BRIE, SPECTRE, MELANUTH, CORE LOCK

echo "🏦 Starting Learning Bank with Enhanced Analytics..."
echo "🤖 Analytical Framework Integration Active"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "🚀 Launching Learning Bank Server..."
echo "🔗 Access URLs:"
echo "   Main Application: http://localhost:3000"
echo "   Admin Panel: http://localhost:3000/admin"
echo "   Dashboard: http://localhost:3000/dashboard"
echo "   Loan System: http://localhost:3000/loans"
echo ""
echo "👤 Demo Credentials:"
echo "   Email: demo@learningbank.com"
echo "   Password: demo123"
echo ""
echo "🔒 Enhanced Features:"
echo "   • FRI: Advanced banking calculations"
echo "   • BRIE: Realistic user behaviors"
echo "   • SPECTRE: Enhanced visualizations"
echo "   • MELANUTH: Optimized processing"
echo "   • CORE LOCK: Enterprise security"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=========================================="

# Start the Node.js server
node server.js