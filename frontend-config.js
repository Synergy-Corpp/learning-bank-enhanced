// GOD MODE - LEARNING BANK FRONTEND CONFIGURATION
// IN GOD WE TRUST - USA Banking Frontend Config for Separate Domain

// Production API endpoints configuration
const FRONTEND_CONFIG = {
    // Backend API URLs based on environment
    API_ENDPOINTS: {
        development: 'http://localhost:3001/api',
        production: process.env.REACT_APP_API_URL || 'https://learning-bank-backend.herokuapp.com/api',
        staging: 'https://learning-bank-backend-staging.herokuapp.com/api'
    },
    
    // Get current environment
    getCurrentEnvironment() {
        if (typeof window !== 'undefined') {
            const hostname = window.location.hostname;
            if (hostname === 'localhost' || hostname === '127.0.0.1') {
                return 'development';
            } else if (hostname.includes('staging')) {
                return 'staging';
            } else {
                return 'production';
            }
        }
        return 'development';
    },
    
    // Get API base URL
    getApiUrl() {
        const env = this.getCurrentEnvironment();
        return this.API_ENDPOINTS[env];
    },
    
    // USA Banking configuration
    BANKING_CONFIG: {
        defaultCurrency: 'USD',
        federalMotto: 'IN GOD WE TRUST',
        bankName: 'Learning Bank USA',
        federalReserveCompliant: true,
        fdcInsured: true
    },
    
    // Beautiful loading codex configuration
    LOADING_CONFIG: {
        enableBeautifulCodex: true,
        loadingMessages: [
            "🇺🇸 IN GOD WE TRUST - Initializing Banking System...",
            "🔐 CORE LOCK Security Protocols Activated...",
            "🏦 Federal Banking Compliance Check...",
            "⚡ Neural Network Synchronization...",
            "🇺🇸 USA Banking Regulations Verified...",
            "✅ System Ready - Welcome to Learning Bank"
        ]
    }
};

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FRONTEND_CONFIG;
} else if (typeof window !== 'undefined') {
    window.FRONTEND_CONFIG = FRONTEND_CONFIG;
}