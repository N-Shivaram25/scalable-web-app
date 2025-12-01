#!/bin/bash
# Quick deployment helper script for Vercel

echo "🚀 Scalable React App - Vercel Deployment Helper"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Git found${NC}"
echo -e "${GREEN}✓ Node.js found$(node --version)${NC}"
echo ""

# Menu
echo "Choose an action:"
echo "1. Install dependencies"
echo "2. Test build locally"
echo "3. Check environment variables"
echo "4. Push to GitHub"
echo "5. View Vercel logs"
echo "6. All checks before deployment"
echo ""
read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo "Installing dependencies..."
        cd frontend && npm install && cd ..
        cd backend && npm install && cd ..
        echo -e "${GREEN}✓ Dependencies installed${NC}"
        ;;
    2)
        echo "Building frontend..."
        cd frontend && npm run build && cd ..
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ Frontend build successful${NC}"
        else
            echo -e "${RED}✗ Frontend build failed${NC}"
            exit 1
        fi
        ;;
    3)
        echo "Checking environment variables..."
        if [ -f "backend/.env" ]; then
            echo -e "${GREEN}✓ backend/.env exists${NC}"
            echo "Variables:"
            grep -v '^#' backend/.env | grep -v '^$'
        else
            echo -e "${YELLOW}⚠ backend/.env not found${NC}"
        fi
        ;;
    4)
        echo "Pushing to GitHub..."
        read -p "Enter commit message: " message
        git add .
        git commit -m "$message"
        git push origin main
        echo -e "${GREEN}✓ Pushed to GitHub${NC}"
        ;;
    5)
        echo "To view Vercel logs, visit: https://vercel.com/dashboard"
        ;;
    6)
        echo "Running deployment checks..."
        echo ""
        
        # Check frontend build
        echo "Building frontend..."
        cd frontend && npm run build > /dev/null 2>&1 && cd ..
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ Frontend builds successfully${NC}"
        else
            echo -e "${RED}✗ Frontend build failed${NC}"
            exit 1
        fi
        
        # Check if vercel.json exists
        if [ -f "vercel.json" ]; then
            echo -e "${GREEN}✓ vercel.json found${NC}"
        else
            echo -e "${RED}✗ vercel.json not found${NC}"
            exit 1
        fi
        
        # Check environment variables
        if [ -f "backend/.env" ]; then
            echo -e "${GREEN}✓ Environment variables configured${NC}"
        else
            echo -e "${YELLOW}⚠ Make sure to add environment variables in Vercel dashboard${NC}"
        fi
        
        echo ""
        echo -e "${GREEN}✓ All checks passed! Ready for deployment${NC}"
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo "Done! 🎉"
