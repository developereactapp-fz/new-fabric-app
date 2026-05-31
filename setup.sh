#!/bin/bash

# 🚀 QUICK START SCRIPT - The Lev Labs Fabric App
# This script helps you quickly configure and start the app

set -e

echo "================================================"
echo "  🎯 The Lev Labs - Quick Start Setup"
echo "================================================"
echo ""

# Step 1: Check Node.js
echo "✓ Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "✗ Node.js is not installed. Please install Node.js 16+"
    exit 1
fi
echo "✓ Node.js $(node --version) found"
echo ""

# Step 2: Install dependencies
echo "✓ Installing dependencies..."
if [ ! -d "node_modules" ]; then
    npm install --silent
    echo "✓ Dependencies installed"
else
    echo "✓ Dependencies already installed"
fi
echo ""

# Step 3: Create .env.local
echo "✓ Checking environment configuration..."
if [ ! -f ".env.local" ]; then
    echo ""
    echo "Please enter your backend API URL:"
    echo "(Example: https://api.example.com)"
    read -p "API URL (Press Enter for default): " api_url
    
    if [ -z "$api_url" ]; then
        api_url="https://apperal-clothing-app-production.up.railway.app"
        echo "Using default API: $api_url"
    fi
    
    # Create .env.local
    cat > .env.local << EOF
# Backend API Configuration
VITE_API_URL=$api_url
VITE_API_TIMEOUT=30000

# App Configuration
VITE_APP_NAME=The Lev Labs
VITE_ENABLE_DEBUG=false
EOF
    
    echo "✓ Configuration file created (.env.local)"
else
    echo "✓ Configuration file exists (.env.local)"
    echo ""
    echo "Current API URL:"
    grep "VITE_API_URL" .env.local || echo "Not configured"
fi
echo ""

# Step 4: Ready to start
echo "================================================"
echo "✅ Setup Complete!"
echo "================================================"
echo ""
echo "To start the development server, run:"
echo ""
echo "  npm run dev"
echo ""
echo "Then open your browser to:"
echo "  http://localhost:5173"
echo ""
echo "================================================"
echo "📚 For more information, see:"
echo "  - SETUP_GUIDE.md"
echo "  - README_UPDATED.md"
echo "  - IMPLEMENTATION_REPORT.md"
echo "================================================"
echo ""
