#!/bin/bash

# GOD MODE - LEARNING BANK FRONTEND DEPLOYMENT SCRIPT
# IN GOD WE TRUST - Deploy Frontend to Separate Domain

echo "🇺🇸 Learning Bank USA - Frontend Deployment"
echo "IN GOD WE TRUST - Federal Banking System"
echo "=========================================="

# Create frontend deployment directory
mkdir -p frontend-deploy
cd frontend-deploy

# Copy all frontend files
echo "📂 Copying frontend files..."
cp ../index.html ./
cp ../dashboard.html ./
cp ../admin.html ./
cp ../loans.html ./
cp ../styles.css ./
cp ../dashboard.css ./
cp ../admin.css ./
cp ../loans.css ./
cp ../beautiful-loading-codex.css ./
cp ../script.js ./
cp ../dashboard.js ./
cp ../admin.js ./
cp ../loans.js ./
cp ../beautiful-loading-codex.js ./
cp ../frontend-config.js ./
cp ../neural-bg.svg ./
cp ../quantum-loader.svg ./

# Update script.js to use configuration
echo "🔧 Updating frontend to use separate backend..."

# Create updated script with backend configuration
cat > script-updated.js << 'EOF'
// Load frontend configuration
if (typeof FRONTEND_CONFIG === 'undefined' && typeof window !== 'undefined') {
    // Load config if not already loaded
    const script = document.createElement('script');
    script.src = './frontend-config.js';
    document.head.appendChild(script);
}

// Wait for config to load and update API_BASE
document.addEventListener('DOMContentLoaded', () => {
    if (typeof FRONTEND_CONFIG !== 'undefined') {
        window.API_BASE = FRONTEND_CONFIG.getApiUrl();
        console.log('🇺🇸 Learning Bank USA - Connected to Backend:', window.API_BASE);
    }
});

EOF

# Append original script content (excluding original API_BASE definition)
grep -v "const API_BASE = 'http://localhost:3000/api';" ../script.js >> script-updated.js
mv script-updated.js script.js

# Create package.json for frontend deployment
cat > package.json << EOF
{
  "name": "learning-bank-frontend",
  "version": "1.0.0",
  "description": "Learning Bank USA Frontend - IN GOD WE TRUST",
  "main": "index.html",
  "scripts": {
    "start": "serve .",
    "build": "echo 'Static frontend - no build needed'",
    "deploy": "echo 'Deploy to static hosting'"
  },
  "keywords": ["banking", "frontend", "usa", "federal", "learning"],
  "author": "Learning Bank USA - Federal Reserve",
  "license": "MIT",
  "dependencies": {
    "serve": "^14.0.0"
  }
}
EOF

# Create deployment configuration files
cat > .gitignore << EOF
node_modules/
.DS_Store
*.log
EOF

cat > _redirects << EOF
# Netlify redirects for SPA
/*    /index.html   200
EOF

cat > netlify.toml << EOF
[build]
  publish = "."
  
[build.environment]
  REACT_APP_API_URL = "https://your-backend-domain.herokuapp.com/api"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
EOF

cat > vercel.json << EOF
{
  "version": 2,
  "builds": [
    {
      "src": "**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "https://your-backend-domain.herokuapp.com/api"
  }
}
EOF

cat > README.md << EOF
# Learning Bank USA - Frontend
## IN GOD WE TRUST - Federal Banking System

This is the frontend for Learning Bank USA, a GOD mode banking system with ultra-realistic design and federal compliance.

### Features
- 🇺🇸 USA Federal Banking Theme
- 💫 Beautiful Loading Codex System  
- 🏦 Account Approval Workflow
- 🔐 Secure Authentication
- 💰 Money Transfer Interface
- 📊 Transaction History
- 👨‍💼 Admin Panel
- 📱 Mobile Responsive Design

### Deployment Options

#### Netlify (Recommended)
1. Upload this folder to Netlify
2. Set environment variable: REACT_APP_API_URL=https://your-backend-domain.com/api
3. Deploy

#### Vercel
1. Upload this folder to Vercel
2. Set environment variable: REACT_APP_API_URL=https://your-backend-domain.com/api
3. Deploy

#### GitHub Pages
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Update frontend-config.js with your backend URL

### Configuration
Update \`frontend-config.js\` with your backend API URL:
\`\`\`javascript
API_ENDPOINTS: {
    production: 'https://your-backend-domain.herokuapp.com/api'
}
\`\`\`

### Pages
- \`index.html\` - Main banking interface
- \`dashboard.html\` - User dashboard
- \`admin.html\` - Admin panel
- \`loans.html\` - Loan application system

### GOD Mode Features
- Beautiful Loading Codex with USA theme
- Federal banking compliance
- Account approval system
- Ultra-realistic design elements
- "IN GOD WE TRUST" branding throughout

🇺🇸 IN GOD WE TRUST - Federal Banking System
EOF

echo "✅ Frontend deployment files prepared!"
echo ""
echo "📋 Next Steps - Choose your deployment platform:"
echo ""
echo "🟢 Netlify (Recommended):"
echo "1. Drag and drop this folder to netlify.com/drop"
echo "2. Set REACT_APP_API_URL environment variable"
echo "3. Deploy!"
echo ""
echo "🔵 Vercel:"
echo "1. Upload to vercel.com"
echo "2. Set REACT_APP_API_URL environment variable"
echo "3. Deploy!"
echo ""
echo "🟠 GitHub Pages:"
echo "1. Push to GitHub repository"
echo "2. Enable Pages in settings"
echo "3. Update frontend-config.js with backend URL"
echo ""
echo "⚠️  IMPORTANT: Update frontend-config.js with your actual backend URL!"
echo "🇺🇸 IN GOD WE TRUST - Federal Banking System Ready for Deployment!"