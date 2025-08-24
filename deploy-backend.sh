#!/bin/bash

# GOD MODE - LEARNING BANK BACKEND DEPLOYMENT SCRIPT
# IN GOD WE TRUST - Deploy Backend to Separate Domain

echo "🇺🇸 Learning Bank USA - Backend Deployment"
echo "IN GOD WE TRUST - Federal Banking System"
echo "=========================================="

# Create backend deployment directory
mkdir -p backend-deploy
cd backend-deploy

# Copy backend files
echo "📂 Copying backend files..."
cp ../backend-server.js ./server.js
cp ../api-routes.js ./api-routes.js
cp ../backend-package.json ./package.json
cp ../backend.env ./.env

# Create data directory for production database
mkdir -p data
mkdir -p logs

# Create Procfile for Heroku
echo "web: node server.js" > Procfile

# Create additional deployment files
cat > .gitignore << EOF
node_modules/
.env
*.log
data/*.db
logs/
.DS_Store
EOF

cat > README.md << EOF
# Learning Bank USA - Backend API
## IN GOD WE TRUST - Federal Banking System

This is the backend API for Learning Bank USA, a GOD mode banking system with federal compliance.

### Features
- 🇺🇸 USA Banking Compliance
- 🏦 Account Approval System
- 🔐 JWT Authentication
- 💰 Money Transfers
- 📊 Transaction History
- 👨‍💼 Admin Panel API

### Deployment
This backend is designed to run on a separate domain from the frontend.

### Environment Variables
- NODE_ENV=production
- JWT_SECRET=your-jwt-secret
- FRONTEND_URL=your-frontend-domain

### API Endpoints
- POST /api/register - User registration
- POST /api/login - User login  
- POST /api/check-status - Check approval status
- GET /api/profile - User profile
- POST /api/transfer - Money transfer
- GET /api/transactions - Transaction history
- POST /api/admin/approve-user - Approve users (admin)

### Health Check
GET /health - Returns server status
EOF

# Install dependencies
echo "📦 Installing backend dependencies..."
npm install

echo "✅ Backend deployment files prepared!"
echo ""
echo "📋 Next Steps:"
echo "1. Deploy to Heroku: heroku create learning-bank-backend"
echo "2. Set environment variables: heroku config:set JWT_SECRET=your-secret"
echo "3. Deploy: git add . && git commit -m 'Deploy backend' && git push heroku main"
echo ""
echo "🌐 Alternative deployment options:"
echo "- Railway: railway deploy"
echo "- Vercel: vercel --prod"
echo "- DigitalOcean App Platform"
echo ""
echo "🇺🇸 IN GOD WE TRUST - Federal Banking System Ready for Deployment!"