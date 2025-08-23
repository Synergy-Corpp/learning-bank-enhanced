# 🏦 Learning Bank - Educational Banking System

A complete educational banking application built for learning frontend and backend interactions. This system includes full banking functionality and a comprehensive loan application system.

## ✨ Features

### 🏦 Banking System
- **User Registration & Authentication** - Secure signup/login with JWT tokens
- **Account Dashboard** - Real-time balance tracking and account management
- **Money Transfers** - Send money between users with instant processing
- **Transaction History** - Complete transaction logs with search and filtering
- **Currency Converter** - Live exchange rates with multi-currency support
- **Responsive Design** - Mobile-optimized interface

### 💰 Loan Application System
- **Multi-Step Application** - 4-step loan application wizard
- **Document Upload** - Secure file upload for loan verification
- **Loan Types** - Personal, business, auto, and home loans
- **Application Tracking** - Real-time status updates
- **Admin Review System** - Complete loan management for administrators

### 👥 Admin Panel (Enhanced with Analytical Frameworks)
- **User Management** - View, edit, and manage user accounts
- **Transaction Monitoring** - Real-time transaction oversight with volume analytics
- **Loan Administration** - Review and process loan applications with risk assessment
- **System Analytics** - Dashboard with key metrics, charts, and real-time statistics
- **Risk Analysis** - CORE LOCK powered loan risk assessment and processing time tracking
- **Settings Management** - Configure exchange rates and system settings

### 🤖 Analytical Framework Enhancements
- **FRI** (Fractal Recursive Intelligence) - Advanced banking calculations and processing logic
- **BRIE** (Behavioral Realistic Interaction Enhancement) - Realistic user behaviors and demo data
- **SPECTRE** (Spectral Color Enhancement) - Enhanced UI data visualization
- **MELANUTH** (Motion Enhancement and Life Acceleration) - Optimized transaction processing
- **CORE LOCK** - Enterprise-level security and authentication protocols

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Synergy-Corpp/learning-bank.git
   cd learning-bank
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Access the application**
   - Main App: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin.html

## 🔧 Demo Credentials

### User Account
- **Email:** demo@learningbank.com
- **Password:** demo123

### Admin Panel
- **Username:** admin
- **Password:** admin123

## 📁 Project Structure

```
learning-bank/
├── index.html          # Main landing page
├── dashboard.html      # User dashboard
├── loans.html          # Loan application system
├── admin.html          # Admin control panel
├── styles.css          # Main stylesheet
├── dashboard.css       # Dashboard styles
├── loans.css           # Loan system styles
├── admin.css           # Admin panel styles
├── script.js           # Main frontend logic
├── dashboard.js        # Dashboard functionality
├── loans.js            # Loan system logic
├── admin.js            # Admin panel logic
├── server.js           # Backend API server
├── package.json        # Dependencies and scripts
└── README.md           # Project documentation
```

## 🛠 Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with flexbox/grid
- **Vanilla JavaScript** - No frameworks for educational clarity
- **Responsive Design** - Mobile-first approach

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite** - Database (in-memory for demo)
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling

## 🎯 Learning Objectives

This project demonstrates:

1. **Frontend-Backend Communication**
   - RESTful API design
   - Fetch API usage
   - Async/await patterns
   - Error handling

2. **Authentication & Security**
   - JWT token management
   - Password hashing
   - Session handling
   - Input validation

3. **Database Operations**
   - CRUD operations
   - SQL queries
   - Data relationships
   - Transaction management

4. **File Handling**
   - File uploads
   - File validation
   - Storage management

5. **UI/UX Design**
   - Responsive layouts
   - Form validation
   - Modal systems
   - Loading states

## 🔐 Security Features

- **Password Hashing** - bcrypt with salt rounds
- **JWT Authentication** - Secure token-based auth
- **Input Validation** - Server-side validation
- **CORS Protection** - Cross-origin request security
- **File Upload Security** - Type and size validation

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    balance REAL DEFAULT 1000,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    description TEXT,
    recipient_email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
```

### Loan Applications Table
```sql
CREATE TABLE loan_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    personal_info TEXT,
    financial_info TEXT,
    loan_details TEXT,
    documents TEXT,
    status TEXT DEFAULT 'pending',
    notes TEXT,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
```

## 🌐 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### User Management
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Transactions
- `GET /api/transactions` - Get transaction history
- `POST /api/transfer` - Send money transfer

### Loans
- `POST /api/loan-application` - Submit loan application
- `GET /api/loan-applications` - Get user's loan applications

### Admin (Enhanced)
- `GET /api/admin/dashboard` - Get comprehensive dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/transactions` - Get all transactions
- `GET /api/loan-applications` - Get enhanced loan applications with risk analysis
- `PUT /api/admin/loan/:id` - Update loan status
- `GET /api/loan-application/:id` - Get specific loan application details

## 🎨 Styling

The application uses a modern, professional design with:
- **Color Scheme** - Blue gradient theme
- **Typography** - Clean, readable fonts
- **Layout** - CSS Grid and Flexbox
- **Animations** - Smooth transitions
- **Responsive** - Mobile-optimized

## 🧪 Testing

Test the application by:
1. Creating user accounts
2. Performing money transfers
3. Applying for loans
4. Using the admin panel
5. Testing responsive design

## 📝 Development Notes

- Uses in-memory SQLite database (resets on restart)
- No external dependencies for CSS/JS frameworks
- Educational focus on understanding concepts
- Comprehensive error handling
- Detailed code comments

## 🤝 Contributing

This is an educational project. Feel free to:
- Fork the repository
- Add new features
- Improve the UI/UX
- Enhance security
- Add tests

## 📄 License

This project is open source and available under the MIT License.

## 🔗 Demo

Try the live demo: [Learning Bank Demo](https://your-vercel-url.vercel.app)

---

**Built for educational purposes to understand modern web development concepts and banking system fundamentals.**