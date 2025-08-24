// GOD MODE - API ROUTES FOR LEARNING BANK USA
// IN GOD WE TRUST - Federal Banking API Endpoints

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Import database and utilities (will be set by main server)
let db, authenticateToken, generateUserID, generateSerialNumber;

// Set dependencies (called by main server)
function setDependencies(dependencies) {
    db = dependencies.db;
    authenticateToken = dependencies.authenticateToken;
    generateUserID = dependencies.generateUserID;
    generateSerialNumber = dependencies.generateSerialNumber;
}

const JWT_SECRET = process.env.JWT_SECRET || 'usa-federal-banking-secret-change-in-production';

// User Registration - NO AUTO LOGIN, AWAITS APPROVAL
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Validation
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

// User Login - Enhanced with approval status check
router.post('/login', async (req, res) => {
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

// STATUS CHECK ENDPOINT - Users can check their approval status
router.post('/check-status', (req, res) => {
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
router.post('/admin/approve-user', authenticateToken, (req, res) => {
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

// Get user profile (protected)
router.get('/profile', authenticateToken, (req, res) => {
    db.get(
        'SELECT id, firstName, lastName, email, balance, status, userID, serialNumber, createdAt FROM users WHERE id = ?',
        [req.user.userId],
        (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            
            res.json({
                success: true,
                user: user
            });
        }
    );
});

// Get all users (admin only)
router.get('/admin/users', authenticateToken, (req, res) => {
    db.all(
        'SELECT id, firstName, lastName, email, balance, status, userID, serialNumber, createdAt, approvedAt, approvedBy FROM users ORDER BY createdAt DESC',
        [],
        (err, users) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            
            res.json({
                success: true,
                users: users
            });
        }
    );
});

// Money transfer endpoint
router.post('/transfer', authenticateToken, (req, res) => {
    try {
        const { recipientEmail, amount, description } = req.body;
        const senderUserId = req.user.userId;

        if (!recipientEmail || !amount || amount <= 0) {
            return res.status(400).json({ error: 'Valid recipient email and amount are required' });
        }

        // Start transaction
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');

            // Get sender balance
            db.get('SELECT * FROM users WHERE id = ?', [senderUserId], (err, sender) => {
                if (err || !sender) {
                    db.run('ROLLBACK');
                    return res.status(500).json({ error: 'Sender not found' });
                }

                if (sender.balance < amount) {
                    db.run('ROLLBACK');
                    return res.status(400).json({ error: 'Insufficient balance' });
                }

                // Get recipient
                db.get('SELECT * FROM users WHERE email = ?', [recipientEmail], (err, recipient) => {
                    if (err || !recipient) {
                        db.run('ROLLBACK');
                        return res.status(404).json({ error: 'Recipient not found' });
                    }

                    if (recipient.status !== 'approved') {
                        db.run('ROLLBACK');
                        return res.status(400).json({ error: 'Recipient account not approved' });
                    }

                    // Update balances
                    db.run(
                        'UPDATE users SET balance = balance - ? WHERE id = ?',
                        [amount, senderUserId],
                        (err) => {
                            if (err) {
                                db.run('ROLLBACK');
                                return res.status(500).json({ error: 'Failed to update sender balance' });
                            }

                            db.run(
                                'UPDATE users SET balance = balance + ? WHERE id = ?',
                                [amount, recipient.id],
                                (err) => {
                                    if (err) {
                                        db.run('ROLLBACK');
                                        return res.status(500).json({ error: 'Failed to update recipient balance' });
                                    }

                                    // Record transactions
                                    db.run(
                                        'INSERT INTO transactions (userId, type, amount, description, recipientEmail) VALUES (?, ?, ?, ?, ?)',
                                        [senderUserId, 'transfer_out', amount, description || 'Money transfer', recipientEmail]
                                    );

                                    db.run(
                                        'INSERT INTO transactions (userId, type, amount, description, recipientEmail) VALUES (?, ?, ?, ?, ?)',
                                        [recipient.id, 'transfer_in', amount, description || 'Money transfer', sender.email]
                                    );

                                    db.run('COMMIT');

                                    res.json({
                                        success: true,
                                        message: 'Transfer completed successfully',
                                        newBalance: sender.balance - amount
                                    });
                                }
                            );
                        }
                    );
                });
            });
        });
    } catch (error) {
        console.error('Transfer error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get transaction history
router.get('/transactions', authenticateToken, (req, res) => {
    db.all(
        'SELECT * FROM transactions WHERE userId = ? ORDER BY createdAt DESC LIMIT 50',
        [req.user.userId],
        (err, transactions) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            
            res.json({
                success: true,
                transactions: transactions
            });
        }
    );
});

module.exports = router;
module.exports.setDependencies = setDependencies;