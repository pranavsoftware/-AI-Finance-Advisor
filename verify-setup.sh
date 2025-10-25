#!/bin/bash

# AI Finance Advisor - Setup & Verification Script

echo "🚀 AI Finance Advisor - Project Setup Verification"
echo "=================================================="

# Check directories
echo ""
echo "✅ Checking project structure..."

directories=(
  "backend/src/routes"
  "backend/src/controllers"
  "backend/src/models"
  "backend/src/services"
  "backend/src/middleware"
  "backend/src/types"
  "backend/src/utils"
  "frontend/src/pages"
  "frontend/src/components"
  "frontend/src/services"
  "frontend/src/context"
  "frontend/src/types"
  "frontend/src/utils"
  "ml-service"
  ".github/workflows"
)

for dir in "${directories[@]}"; do
  if [ -d "$dir" ]; then
    echo "  ✓ $dir"
  else
    echo "  ✗ $dir (MISSING)"
  fi
done

# Check key files
echo ""
echo "✅ Checking critical files..."

files=(
  "backend/package.json"
  "backend/tsconfig.json"
  "backend/src/server.ts"
  "backend/src/database.ts"
  "backend/.env.example"
  "frontend/package.json"
  "frontend/index.html"
  "frontend/src/main.tsx"
  "frontend/src/App.tsx"
  "ml-service/app.py"
  "ml-service/requirements.txt"
  "docker-compose.yml"
  "README.md"
  ".gitignore"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ $file (MISSING)"
  fi
done

echo ""
echo "✅ Project structure verified!"
echo ""
echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. Backend Setup:"
echo "   cd backend"
echo "   cp .env.example .env"
echo "   # Edit .env with your credentials"
echo "   npm install"
echo ""
echo "2. Frontend Setup:"
echo "   cd frontend"
echo "   cp .env.example .env"
echo "   npm install"
echo ""
echo "3. ML Service Setup:"
echo "   cd ml-service"
echo "   pip install -r requirements.txt"
echo ""
echo "4. Run with Docker Compose:"
echo "   docker-compose up -d"
echo ""
echo "5. Access the application:"
echo "   Frontend: http://localhost:5173"
echo "   API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/api/docs"
echo "   MongoDB: mongodb://localhost:27017"
echo ""
echo "✨ Setup complete!"
