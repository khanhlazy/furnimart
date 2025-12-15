#!/bin/bash

set -e

echo "╔═══════════════════════════════════════╗"
echo "║   🚀 FurniMart Installation Script   ║"
echo "╚═══════════════════════════════════════╝"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backend Setup
echo -e "${YELLOW}[1/4]${NC} Setting up Backend..."
cd backend

if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

echo "Installing dependencies..."
npm install

echo -e "${GREEN}✓ Backend setup completed${NC}"

# Frontend Setup
echo -e "${YELLOW}[2/4]${NC} Setting up Frontend..."
cd ../frontend

if [ ! -f .env.local ]; then
    echo "Creating .env.local from .env.example..."
    cp .env.example .env.local
fi

echo "Installing dependencies..."
npm install

echo -e "${GREEN}✓ Frontend setup completed${NC}"

# MongoDB Check
echo -e "${YELLOW}[3/4]${NC} Checking MongoDB..."
if command -v mongod &> /dev/null; then
    echo -e "${GREEN}✓ MongoDB is installed${NC}"
else
    echo -e "${YELLOW}⚠ MongoDB not found. Install from: https://www.mongodb.com/try/download/community${NC}"
fi

# Final Summary
echo -e "${YELLOW}[4/4]${NC} Installation Summary"
echo ""
echo -e "${GREEN}✓ All dependencies installed${NC}"
echo ""
echo "🚀 Quick Start:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend && npm run dev"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend && npm run dev"
echo ""
echo "Terminal 3 - Seed Data (after backend is running):"
echo "  cd backend && npm run seed"
echo ""
echo "📍 URLs:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:3001"
echo "  API Docs: http://localhost:3001/api/docs"
echo ""
