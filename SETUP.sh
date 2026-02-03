#!/bin/bash
# SSB COMPASS - Quick Start Setup Script
# Run this script to set up the project quickly

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║  🎖️  SSB COMPASS - QUICK START SETUP  🎖️  ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v14+ first."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node -v)"
echo "✅ npm found: $(npm -v)"
echo ""

# Create backend directory
echo "📁 Setting up backend directory..."
mkdir -p backend
cd backend

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "⚙️  Creating .env configuration file..."
    cat > .env << EOF
PORT=5000
NODE_ENV=development
JWT_SECRET=ssb-compass-secret-key-min-32-characters-long
JWT_EXPIRE=7d
UPI_ID=8290002626@axl
ADMIN_ID=ADMIN123
ADMIN_PASSWORD=SSBNEW2026
EOF
    echo "✅ .env file created"
fi

cd ..

# Create uploads directory
echo "📁 Creating upload directories..."
mkdir -p uploads/candidates

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║         ✅ SETUP COMPLETE!                 ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "🚀 NEXT STEPS:"
echo ""
echo "1. START FRONTEND:"
echo "   - Open 'index.html' in your web browser"
echo "   - Or use: python -m http.server 8000"
echo ""
echo "2. START BACKEND:"
echo "   - cd backend"
echo "   - npm start"
echo "   - Server will run on http://localhost:5000"
echo ""
echo "3. ACCESS THE PLATFORM:"
echo "   - Frontend: http://localhost:8000 (or directly from browser)"
echo "   - API: http://localhost:5000/api"
echo "   - Health: http://localhost:5000/api/health"
echo ""
echo "4. ADMIN LOGIN:"
echo "   - Click 'Admin' button on the platform"
echo "   - ID: ADMIN123"
echo "   - Password: SSBNEW2026"
echo ""
echo "5. UPI PAYMENTS:"
echo "   - UPI ID: 8290002626@axl"
echo "   - Edit in Admin Settings if needed"
echo ""
echo "📚 Documentation: See SSB_COMPASS_DOCS.md"
echo "🎯 Test courses, candidates, and payments in admin dashboard"
echo ""
