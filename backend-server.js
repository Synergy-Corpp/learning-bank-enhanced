// GOD MODE - LEARNING BANK BACKEND SERVER
// IN GOD WE TRUST - USA FEDERAL BANKING SYSTEM
// Production-ready backend for separate domain deployment

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001; // Different port for backend
const JWT_SECRET = process.env.JWT_SECRET || 'usa-federal-banking-secret-change-in-production';

// CORS Configuration for separate frontend domain
const allowedOrigins = [
    'http://localhost:3000',
    'https://learning-bank-frontend.vercel.app',
    'https://learning-bank-usa.netlify.app',
    'https://learning-bank-frontend.herokuapp.com',
    process.env.FRONTEND_URL
].filter(Boolean);

// Enhanced CORS middleware
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers
app.use((req, res, next) => {
    res.header('X-Powered-By', 'Learning Bank USA - Federal Reserve');
    res.header('X-Frame-Options', 'DENY');
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        message: '🇺🇸 Learning Bank USA Backend - IN GOD WE TRUST',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0'
    });
});

// API routes prefix
app.use('/api', require('./api-routes'));

// Initialize SQLite Database with persistence for production
const dbPath = process.env.NODE_ENV === 'production' 
    ? path.join(__dirname, 'data', 'learning-bank.db')
    : ':memory:';

// Create data directory if it doesn't exist
if (process.env.NODE_ENV === 'production') {
    const fs = require('fs');
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error opening database:', err);
    } else {
        console.log('📊 Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    // Users table - GOD MODE: USA Banking Compliance with Approval System
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            balance REAL DEFAULT 0.00,
            status TEXT DEFAULT 'pending_approval',
            userID TEXT UNIQUE,
            serialNumber TEXT UNIQUE,
            approvedAt DATETIME,
            approvedBy TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Transactions table
    db.run(`
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            type TEXT NOT NULL,
            amount REAL NOT NULL,
            fromCurrency TEXT DEFAULT 'USD',
            toCurrency TEXT DEFAULT 'USD',
            description TEXT,
            recipientEmail TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users (id)
        )
    `);

    // Loan applications table
    db.run(`
        CREATE TABLE IF NOT EXISTS loan_applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            applicationId TEXT UNIQUE NOT NULL,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            ssn TEXT NOT NULL,
            birthDate TEXT NOT NULL,
            address TEXT NOT NULL,
            loanAmount REAL NOT NULL,
            annualIncome REAL NOT NULL,
            monthlyIncome REAL NOT NULL,
            loanPurpose TEXT NOT NULL,
            employer TEXT NOT NULL,
            occupation TEXT NOT NULL,
            workExperience INTEGER NOT NULL,
            monthlyRent REAL NOT NULL,
            hasCreditCard TEXT NOT NULL,
            bankName TEXT NOT NULL,
            accountNumber TEXT NOT NULL,
            routingNumber TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            reviewedAt DATETIME,
            reviewedBy TEXT,
            notes TEXT
        )
    `);

    console.log('✅ Database tables initialized successfully');
    
    // Create demo admin user for testing
    createDemoAdmin();
}

// Demo admin creation
function createDemoAdmin() {
    const adminEmail = 'admin@learningbank.usa';
    const adminPassword = 'admin123';
    
    db.get('SELECT * FROM users WHERE email = ?', [adminEmail], async (err, user) => {
        if (err) {
            console.error('Error checking admin user:', err);
            return;
        }
        
        if (!user) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            const adminUserID = 'USA000000001';
            const adminSerial = 'LBADMIN001';
            
            db.run(
                `INSERT INTO users (firstName, lastName, email, password, balance, status, userID, serialNumber, approvedAt, approvedBy) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)`,
                ['Federal', 'Administrator', adminEmail, hashedPassword, 100000.00, 'approved', adminUserID, adminSerial, 'System'],
                function(err) {
                    if (err) {
                        console.error('Error creating admin user:', err);
                    } else {
                        console.log('👨‍💼 Demo admin created - Email: admin@learningbank.usa, Password: admin123');
                    }
                }
            );
        }
    });
}

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

// Export database and middleware for use in routes
module.exports = { app, db, authenticateToken, generateUserID, generateSerialNumber };

// GOD MODE - UTILITY FUNCTIONS FOR USA BANKING COMPLIANCE
function generateUserID() {
    const prefix = 'USA';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 999).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
}

function generateSerialNumber() {
    const serial = 'LB' + Date.now().toString(36).toUpperCase() + 
                 Math.random().toString(36).substr(2, 4).toUpperCase();
    return serial;
}

// Start server only if this file is run directly
if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🏦 Learning Bank USA Backend Server running on port ${PORT}`);
        console.log('🇺🇸 IN GOD WE TRUST - Federal Banking System');
        console.log('📊 Database:', process.env.NODE_ENV === 'production' ? 'SQLite (persistent)' : 'SQLite (in-memory)');
        console.log('🔐 JWT Secret: Configured for production');
        console.log('🌐 CORS: Configured for cross-origin requests');
        console.log('🚀 Ready to accept API requests!');
        console.log('💡 Health check available at: /health');
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n🔄 Shutting down gracefully...');
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err);
            } else {
                console.log('💾 Database closed');
            }
            process.exit(0);
        });
    });
}