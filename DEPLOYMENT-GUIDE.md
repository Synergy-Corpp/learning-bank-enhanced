# 🇺🇸 Learning Bank USA - Deployment Guide
## IN GOD WE TRUST - Federal Banking System

This guide explains how to deploy the Learning Bank USA system with **backend and frontend on separate domains** for production use.

## 🏗️ Architecture Overview

```
Frontend Domain              Backend Domain
(Static Hosting)            (Node.js Server)
├─ index.html               ├─ server.js
├─ dashboard.html           ├─ api-routes.js  
├─ admin.html               ├─ SQLite Database
├─ loans.html               └─ JWT Auth
├─ All CSS/JS files
└─ Beautiful Loading Codex
```

## 🚀 Quick Deployment

### Step 1: Deploy Backend
```bash
./deploy-backend.sh
cd backend-deploy
```

**Recommended Backend Platforms:**
- **Heroku**: `heroku create learning-bank-backend`
- **Railway**: `railway deploy`
- **DigitalOcean Apps**: Upload and deploy
- **Vercel**: `vercel --prod` (for API routes)

### Step 2: Deploy Frontend  
```bash
./deploy-frontend.sh
cd frontend-deploy
```

**Recommended Frontend Platforms:**
- **Netlify**: Drag & drop to netlify.com/drop
- **Vercel**: Upload to vercel.com
- **GitHub Pages**: Push to repository and enable Pages
- **Surge.sh**: `surge` command

## 📋 Detailed Deployment Instructions

### 🔧 Backend Deployment (Heroku Example)

1. **Prepare Backend**
   ```bash
   ./deploy-backend.sh
   cd backend-deploy
   git init
   git add .
   git commit -m "Initial backend deployment"
   ```

2. **Deploy to Heroku**
   ```bash
   heroku create learning-bank-backend-usa
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-super-secret-jwt-key
   heroku config:set FRONTEND_URL=https://your-frontend-domain.com
   git push heroku main
   ```

3. **Verify Deployment**
   ```bash
   heroku open /health
   ```

### 🎨 Frontend Deployment (Netlify Example)

1. **Prepare Frontend**
   ```bash
   ./deploy-frontend.sh
   cd frontend-deploy
   ```

2. **Update Configuration**
   Edit `frontend-config.js`:
   ```javascript
   API_ENDPOINTS: {
       production: 'https://learning-bank-backend-usa.herokuapp.com/api'
   }
   ```

3. **Deploy to Netlify**
   - Go to [netlify.com/drop](https://netlify.com/drop)
   - Drag and drop the `frontend-deploy` folder
   - Set environment variable: `REACT_APP_API_URL=https://your-backend-domain.herokuapp.com/api`

## 🔐 Environment Variables

### Backend Environment Variables
```env
NODE_ENV=production
PORT=3001
JWT_SECRET=your-jwt-secret-change-this
FRONTEND_URL=https://your-frontend-domain.com
DATABASE_PATH=./data/learning-bank.db
```

### Frontend Environment Variables
```env
REACT_APP_API_URL=https://your-backend-domain.herokuapp.com/api
```

## 🌐 Domain Configuration

### Example Domains
- **Backend**: `https://learning-bank-api.herokuapp.com`
- **Frontend**: `https://learning-bank-usa.netlify.app`

### CORS Configuration
The backend is pre-configured to accept requests from:
- localhost (development)
- Your production frontend domain
- Common hosting platforms

## 🧪 Testing Deployment

### 1. Health Check
Visit: `https://your-backend-domain.com/health`

Should return:
```json
{
  "status": "healthy",
  "message": "🇺🇸 Learning Bank USA Backend - IN GOD WE TRUST",
  "timestamp": "2025-08-24T...",
  "uptime": 123.45
}
```

### 2. Frontend Test
1. Visit your frontend domain
2. Try signing up for an account
3. Check that you receive User ID and Serial Number
4. Try the "Check Status" feature
5. Admin login: `admin@learningbank.usa` / `admin123`

### 3. API Test
```bash
curl -X POST https://your-backend-domain.com/api/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","password":"password123"}'
```

## 🛠️ Troubleshooting

### Common Issues

1. **CORS Errors**
   - Update `FRONTEND_URL` in backend environment variables
   - Check that frontend domain is in allowed origins

2. **API Connection Failed**
   - Verify backend deployment is running
   - Check frontend configuration in `frontend-config.js`
   - Ensure API endpoints are correct

3. **Database Issues**
   - Backend creates SQLite database automatically
   - For Heroku, consider using PostgreSQL add-on for persistence

4. **Authentication Issues**
   - Verify JWT_SECRET is set consistently
   - Check token expiration (24h default)

## 📊 Features Verification Checklist

After deployment, verify these GOD mode features:

- [ ] 🇺🇸 USA Federal theme loads correctly
- [ ] 💫 Beautiful loading codex animations work
- [ ] 🏦 Account signup creates User ID and Serial Number
- [ ] 🚫 Users cannot login until approved
- [ ] 🔍 Status checking works with ID/Serial
- [ ] 👨‍💼 Admin panel loads and shows pending users
- [ ] ✅ Admin can approve users
- [ ] 💰 Approved users can login and see dashboard
- [ ] 📱 Mobile responsive design works
- [ ] 🔐 Security headers are present

## 🔄 Updates and Maintenance

### Backend Updates
```bash
# In backend-deploy directory
git add .
git commit -m "Update backend"
git push heroku main
```

### Frontend Updates
- Make changes in `frontend-deploy` folder
- Re-upload to your static hosting platform

## 🎯 Production Recommendations

1. **Security**
   - Change default admin password
   - Use strong JWT secret
   - Enable HTTPS on both domains
   - Set up proper environment variables

2. **Database**
   - For production, consider PostgreSQL instead of SQLite
   - Set up database backups
   - Monitor database size

3. **Monitoring**
   - Set up uptime monitoring
   - Monitor API response times
   - Check error logs regularly

4. **Performance**
   - Enable gzip compression
   - Use CDN for static assets
   - Optimize images and assets

## 🆘 Support

If you encounter issues:

1. Check deployment logs
2. Verify environment variables
3. Test API endpoints manually
4. Check browser console for errors

---

## 🇺🇸 Final Notes

**IN GOD WE TRUST** - This Learning Bank USA system is designed for educational purposes to demonstrate full-stack banking application development with:

- Federal banking compliance themes
- Account approval workflows  
- Beautiful loading animations
- Ultra-realistic design elements
- Separate domain architecture
- GOD mode analytical frameworks

The system demonstrates modern web development practices including:
- RESTful API design
- JWT authentication
- SQLite database management
- Cross-origin resource sharing (CORS)
- Responsive web design
- Modern JavaScript (ES6+)
- Security best practices

🏦 **Learning Bank USA - Federal Banking System**  
🇺🇸 **IN GOD WE TRUST**  
💫 **GOD Mode Enabled**