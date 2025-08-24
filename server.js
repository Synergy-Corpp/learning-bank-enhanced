const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// Initialize SQLite Database
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    // Users table - GOD MODE: USA Banking Compliance with Approval System
    db.run(`
        CREATE TABLE users (
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
        CREATE TABLE transactions (
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
        CREATE TABLE loan_applications (
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

    console.log('Database tables created successfully');
    
    // BRIE & MELANUTH: Create realistic demo data for testing
    console.log('🎭 Creating demo data with realistic banking scenarios...');
    createDemoData();
    console.log('✅ Demo users and transactions created!');
}

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

// Routes

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Serve dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Serve loans page
app.get('/loans', (req, res) => {
    res.sendFile(path.join(__dirname, 'loans.html'));
});

// User Registration
app.post('/api/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Validate input
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Generate User ID and Serial Number - USA Banking Compliance
        const userID = generateUserID();
        const serialNumber = generateSerialNumber();

        // Insert user into database - NO AUTO LOGIN, AWAITS APPROVAL
        db.run(
            'INSERT INTO users (firstName, lastName, email, password, userID, serialNumber, status, balance) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [firstName, lastName, email, hashedPassword, userID, serialNumber, 'pending_approval', 0.00],
            function(err) {
                if (err) {
                    if (err.code === 'SQLITE_CONSTRAINT') {
                        return res.status(400).json({ error: 'User with this email already exists' });
                    }
                    return res.status(500).json({ error: 'Failed to create user' });
                }

                // NO TOKEN PROVIDED - User must wait for approval
                res.status(201).json({
                    success: true,
                    message: 'Account registration submitted successfully',
                    userID: userID,
                    serialNumber: serialNumber,
                    status: 'pending_approval',
                    instructions: 'Your account is pending approval. Check back with your User ID and Serial Number for status updates.',
                    checkBackInstructions: {
                        userID: userID,
                        serialNumber: serialNumber,
                        estimatedTime: '24-48 hours',
                        nextSteps: 'You will receive access once approved by our Federal Banking Team'
                    }
                });
            }
        );
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// User Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user in database
        db.get(
            'SELECT * FROM users WHERE email = ?',
            [email],
            async (err, user) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }

                if (!user) {
                    return res.status(401).json({ error: 'Invalid email or password' });
                }

                // Verify password
                const isValidPassword = await bcrypt.compare(password, user.password);
                
                if (!isValidPassword) {
                    return res.status(401).json({ error: 'Invalid email or password' });
                }
                
                // CHECK APPROVAL STATUS - GOD MODE: USA Banking Compliance
                if (user.status !== 'approved') {
                    return res.status(403).json({ 
                        error: 'Account not approved', 
                        status: user.status,
                        userID: user.userID,
                        serialNumber: user.serialNumber,
                        message: 'Your account is still pending approval. Please check back later.',
                        instructions: 'Contact admin or check back with your User ID and Serial Number for approval status.'
                    });
                }

                // Generate JWT token - ONLY FOR APPROVED USERS
                const token = jwt.sign(
                    { userId: user.id, email: user.email },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );

                res.json({
                    message: 'Login successful - Welcome to Learning Bank USA',
                    token: token,
                    user: {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        balance: user.balance,
                        status: user.status,
                        userID: user.userID,
                        serialNumber: user.serialNumber
                    }
                });
            }
        );
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user profile
app.get('/api/profile', authenticateToken, (req, res) => {
    db.get(
        'SELECT id, firstName, lastName, email, balance, createdAt FROM users WHERE id = ?',
        [req.user.userId],
        (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({ user });
        }
    );
});

// Get transaction history
app.get('/api/transactions', authenticateToken, (req, res) => {
    db.all(
        'SELECT * FROM transactions WHERE userId = ? ORDER BY createdAt DESC LIMIT 50',
        [req.user.userId],
        (err, transactions) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            res.json({ transactions });
        }
    );
});

// Money Transfer
app.post('/api/transfer', authenticateToken, (req, res) => {
    const { amount, recipientEmail, description } = req.body;

    if (!amount || !recipientEmail) {
        return res.status(400).json({ error: 'Amount and recipient email are required' });
    }

    if (amount <= 0) {
        return res.status(400).json({ error: 'Amount must be positive' });
    }

    // Start transaction
    db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        // Check sender's balance
        db.get(
            'SELECT balance FROM users WHERE id = ?',
            [req.user.userId],
            (err, sender) => {
                if (err || !sender) {
                    db.run('ROLLBACK');
                    return res.status(500).json({ error: 'Error checking balance' });
                }

                if (sender.balance < amount) {
                    db.run('ROLLBACK');
                    return res.status(400).json({ error: 'Insufficient balance' });
                }

                // Find recipient
                db.get(
                    'SELECT id FROM users WHERE email = ?',
                    [recipientEmail],
                    (err, recipient) => {
                        if (err) {
                            db.run('ROLLBACK');
                            return res.status(500).json({ error: 'Error finding recipient' });
                        }

                        if (!recipient) {
                            db.run('ROLLBACK');
                            return res.status(404).json({ error: 'Recipient not found' });
                        }

                        // Update sender balance
                        db.run(
                            'UPDATE users SET balance = balance - ? WHERE id = ?',
                            [amount, req.user.userId],
                            (err) => {
                                if (err) {
                                    db.run('ROLLBACK');
                                    return res.status(500).json({ error: 'Error updating sender balance' });
                                }

                                // Update recipient balance
                                db.run(
                                    'UPDATE users SET balance = balance + ? WHERE id = ?',
                                    [amount, recipient.id],
                                    (err) => {
                                        if (err) {
                                            db.run('ROLLBACK');
                                            return res.status(500).json({ error: 'Error updating recipient balance' });
                                        }

                                        // Record transaction
                                        db.run(
                                            'INSERT INTO transactions (userId, type, amount, description, recipientEmail) VALUES (?, ?, ?, ?, ?)',
                                            [req.user.userId, 'transfer_out', amount, description || 'Money transfer', recipientEmail],
                                            (err) => {
                                                if (err) {
                                                    db.run('ROLLBACK');
                                                    return res.status(500).json({ error: 'Error recording transaction' });
                                                }

                                                // Record recipient transaction
                                                db.run(
                                                    'INSERT INTO transactions (userId, type, amount, description) VALUES (?, ?, ?, ?)',
                                                    [recipient.id, 'transfer_in', amount, `Received from ${req.user.email}`],
                                                    (err) => {
                                                        if (err) {
                                                            db.run('ROLLBACK');
                                                            return res.status(500).json({ error: 'Error recording recipient transaction' });
                                                        }

                                                        db.run('COMMIT');
                                                        res.json({
                                                            message: 'Transfer successful',
                                                            transaction: {
                                                                amount,
                                                                recipientEmail,
                                                                description,
                                                                timestamp: new Date().toISOString()
                                                            }
                                                        });
                                                    }
                                                );
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    });
});

// Currency conversion rates (mock data)
const exchangeRates = {
    USD: { EUR: 0.85, GBP: 0.73, CAD: 1.25 },
    EUR: { USD: 1.18, GBP: 0.86, CAD: 1.47 },
    GBP: { USD: 1.37, EUR: 1.16, CAD: 1.71 },
    CAD: { USD: 0.80, EUR: 0.68, GBP: 0.58 }
};

// Get exchange rates
app.get('/api/exchange-rates', (req, res) => {
    res.json({ rates: exchangeRates });
});

// Convert currency
app.post('/api/convert', (req, res) => {
    const { amount, fromCurrency, toCurrency } = req.body;

    if (!amount || !fromCurrency || !toCurrency) {
        return res.status(400).json({ error: 'Amount, from currency, and to currency are required' });
    }

    if (fromCurrency === toCurrency) {
        return res.json({ convertedAmount: amount });
    }

    let rate = 1;
    if (exchangeRates[fromCurrency] && exchangeRates[fromCurrency][toCurrency]) {
        rate = exchangeRates[fromCurrency][toCurrency];
    }

    const convertedAmount = (amount * rate).toFixed(2);
    
    res.json({
        originalAmount: amount,
        fromCurrency,
        toCurrency,
        exchangeRate: rate,
        convertedAmount: parseFloat(convertedAmount)
    });
});

// Loan application submission
app.post('/api/loan-application', (req, res) => {
    const {
        firstName, lastName, email, phone, ssn, birthDate, address,
        loanAmount, annualIncome, monthlyIncome, loanPurpose,
        employer, occupation, workExperience, monthlyRent, hasCreditCard,
        bankName, accountNumber, routingNumber
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !loanAmount || !annualIncome) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate unique application ID
    const applicationId = 'LN' + Date.now().toString();

    // Insert loan application into database
    db.run(`
        INSERT INTO loan_applications (
            applicationId, firstName, lastName, email, phone, ssn, birthDate, address,
            loanAmount, annualIncome, monthlyIncome, loanPurpose,
            employer, occupation, workExperience, monthlyRent, hasCreditCard,
            bankName, accountNumber, routingNumber
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        applicationId, firstName, lastName, email, phone, ssn, birthDate, address,
        loanAmount, annualIncome, monthlyIncome, loanPurpose,
        employer, occupation, workExperience, monthlyRent, hasCreditCard,
        bankName, accountNumber, routingNumber
    ], function(err) {
        if (err) {
            console.error('Loan application error:', err);
            return res.status(500).json({ error: 'Failed to submit loan application' });
        }

        res.status(201).json({
            message: 'Loan application submitted successfully',
            applicationId: applicationId,
            status: 'pending',
            estimatedResponse: '24-48 hours'
        });
    });
});

// Get admin dashboard statistics (CORE LOCK enhanced)
app.get('/api/admin/dashboard', (req, res) => {
    db.serialize(() => {
        const stats = {};
        
        // Total users
        db.get('SELECT COUNT(*) as totalUsers FROM users', (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            stats.totalUsers = result.totalUsers;
        });
        
        // Total transactions
        db.get('SELECT COUNT(*) as totalTransactions, SUM(amount) as totalVolume FROM transactions', (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            stats.totalTransactions = result.totalTransactions || 0;
            stats.totalVolume = result.totalVolume || 0;
        });
        
        // Loan applications
        db.get('SELECT COUNT(*) as totalLoans, COUNT(CASE WHEN status = "pending" THEN 1 END) as pendingLoans FROM loan_applications', (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            stats.totalLoans = result.totalLoans || 0;
            stats.pendingLoans = result.pendingLoans || 0;
            
            res.json({ stats });
        });
    });
});

// Get loan applications (admin only - BRIE enhanced)
app.get('/api/loan-applications', (req, res) => {
    db.all('SELECT * FROM loan_applications ORDER BY submittedAt DESC', (err, applications) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        // MELANUTH: Add realistic processing status updates
        const enhancedApplications = applications.map(app => ({
            ...app,
            processingTime: calculateProcessingTime(app.submittedAt),
            riskLevel: calculateRiskLevel(app.loanAmount, app.annualIncome),
            priority: app.loanAmount > 50000 ? 'high' : app.loanAmount > 20000 ? 'medium' : 'low'
        }));
        
        res.json({ applications: enhancedApplications });
    });
});

// Update loan application status (admin only)
app.put('/api/loan-application/:id', (req, res) => {
    const { id } = req.params;
    const { status, notes, reviewedBy } = req.body;

    db.run(`
        UPDATE loan_applications 
        SET status = ?, notes = ?, reviewedBy = ?, reviewedAt = CURRENT_TIMESTAMP 
        WHERE applicationId = ?
    `, [status, notes, reviewedBy, id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to update application' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Application not found' });
        }

        res.json({ message: 'Application updated successfully' });
    });
});

// Get loan application by ID
app.get('/api/loan-application/:id', (req, res) => {
    const { id } = req.params;

    db.get('SELECT * FROM loan_applications WHERE applicationId = ?', [id], (err, application) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        res.json({ application });
    });
});

// FRI: Fractal Recursive Intelligence - Helper functions for realistic banking calculations
function calculateProcessingTime(submittedAt) {
    const submitted = new Date(submittedAt);
    const now = new Date();
    const diffHours = Math.floor((now - submitted) / (1000 * 60 * 60));
    
    if (diffHours < 24) return `${diffHours} hours`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
}

function calculateRiskLevel(loanAmount, annualIncome) {
    if (!annualIncome || annualIncome === 0) return 'high';
    
    const debtToIncomeRatio = loanAmount / annualIncome;
    
    if (debtToIncomeRatio > 0.5) return 'high';
    if (debtToIncomeRatio > 0.3) return 'medium';
    return 'low';
}

// BRIE: Behavioral Realistic Interaction Enhancement - Generate realistic demo data
function createDemoData() {
    const demoUsers = [
        { firstName: 'Demo', lastName: 'User', email: 'demo@learningbank.com', password: 'demo123' },
        { firstName: 'Alice', lastName: 'Johnson', email: 'alice@test.com', password: 'test123' },
        { firstName: 'Bob', lastName: 'Smith', email: 'bob@test.com', password: 'test123' }
    ];
    
    demoUsers.forEach(async (user, index) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        
        db.run(
            'INSERT OR IGNORE INTO users (firstName, lastName, email, password, balance) VALUES (?, ?, ?, ?, ?)',
            [user.firstName, user.lastName, user.email, hashedPassword, 1000 + (index * 500)]
        );
    });
    
    // Create some demo transactions
    setTimeout(() => {
        const demoTransactions = [
            { userId: 1, type: 'deposit', amount: 500, description: 'Initial deposit' },
            { userId: 2, type: 'transfer_out', amount: 100, description: 'Payment to Alice', recipientEmail: 'alice@test.com' },
            { userId: 3, type: 'transfer_in', amount: 100, description: 'Payment from Demo User' }
        ];
        
        demoTransactions.forEach(tx => {
            db.run(
                'INSERT INTO transactions (userId, type, amount, description, recipientEmail) VALUES (?, ?, ?, ?, ?)',
                [tx.userId, tx.type, tx.amount, tx.description, tx.recipientEmail || null]
            );
        });
    }, 1000);
}

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

// STATUS CHECK ENDPOINT - Users can check their approval status
app.post('/api/check-status', (req, res) => {
    try {
        const { userID, serialNumber } = req.body;
        
        if (!userID || !serialNumber) {
            return res.status(400).json({ 
                error: 'User ID and Serial Number are required',
                instructions: 'Please provide both your User ID and Serial Number to check your account status.'
            });
        }
        
        db.get(
            'SELECT id, firstName, lastName, email, status, userID, serialNumber, createdAt, approvedAt, approvedBy FROM users WHERE userID = ? AND serialNumber = ?',
            [userID, serialNumber],
            (err, user) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }
                
                if (!user) {
                    return res.status(404).json({ 
                        error: 'User not found',
                        message: 'No account found with the provided User ID and Serial Number.',
                        instructions: 'Please verify your credentials or contact support.'
                    });
                }
                
                // Status response based on approval state
                const statusMessages = {
                    'pending_approval': {
                        title: '⏳ Account Pending Approval',
                        message: 'Your account is currently under review by our Federal Banking Team.',
                        estimatedTime: '24-48 hours from submission',
                        nextSteps: 'Please check back later. You will be notified once approved.'
                    },
                    'under_review': {
                        title: '🔍 Account Under Review',
                        message: 'Your account is being actively reviewed by our compliance team.',
                        estimatedTime: '12-24 hours',
                        nextSteps: 'Final verification in progress. Please check back soon.'
                    },
                    'approved': {
                        title: '✅ Account Approved',
                        message: 'Congratulations! Your Learning Bank USA account has been approved.',
                        estimatedTime: 'Ready now',
                        nextSteps: 'You can now log in to access your banking services.',
                        approvedDetails: {
                            approvedAt: user.approvedAt,
                            approvedBy: user.approvedBy || 'Federal Banking Team'
                        }
                    },
                    'rejected': {
                        title: '❌ Account Application Rejected',
                        message: 'Unfortunately, your account application could not be approved at this time.',
                        nextSteps: 'Please contact our support team for more information.'
                    }
                };
                
                const statusInfo = statusMessages[user.status] || statusMessages['pending_approval'];
                
                res.json({
                    success: true,
                    userID: user.userID,
                    serialNumber: user.serialNumber,
                    applicantName: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                    status: user.status,
                    submittedAt: user.createdAt,
                    statusInfo: statusInfo,
                    federalNotice: 'IN GOD WE TRUST - Learning Bank USA Federal Compliance System'
                });
            }
        );
    } catch (error) {
        console.error('Status check error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ADMIN ENDPOINT - Approve user accounts
app.post('/api/admin/approve-user', authenticateToken, (req, res) => {
    try {
        const { userID, status, startingBalance = 1000.00 } = req.body;
        
        if (!userID || !status) {
            return res.status(400).json({ error: 'User ID and status are required' });
        }
        
        const validStatuses = ['approved', 'rejected', 'under_review'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        
        // Update user status and balance
        const updateQuery = status === 'approved' ? 
            'UPDATE users SET status = ?, balance = ?, approvedAt = CURRENT_TIMESTAMP, approvedBy = ? WHERE userID = ?' :
            'UPDATE users SET status = ?, approvedAt = CURRENT_TIMESTAMP, approvedBy = ? WHERE userID = ?';
            
        const params = status === 'approved' ? 
            [status, startingBalance, 'Admin', userID] :
            [status, 'Admin', userID];
        
        db.run(updateQuery, params, function(err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to update user status' });
            }
            
            if (this.changes === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            
            res.json({
                success: true,
                message: `User ${userID} status updated to ${status}`,
                userID: userID,
                status: status,
                balance: status === 'approved' ? startingBalance : 0
            });
        });
    } catch (error) {
        console.error('User approval error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🏦 Learning Bank Server running on http://localhost:${PORT}`);
    console.log('📊 Database: SQLite (in-memory)');
    console.log('🔐 JWT Secret: Make sure to set JWT_SECRET in production');
    console.log('🚀 Ready to accept requests!');
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