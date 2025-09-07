/**
 * BakeGenius.AI Configuration
 * Production-ready configuration file
 */

const CONFIG = {
    // Development settings
    development: {
        enableLogging: false,
        enableDebug: false,
        apiTimeout: 10000
    },
    
    // Production settings
    production: {
        enableLogging: false,
        enableDebug: false,
        apiTimeout: 5000
    },
    
    // Feature flags
    features: {
        floatingEmojis: true,
        smoothScrolling: true,
        darkMode: true,
        analytics: false
    },
    
    // API configuration (move sensitive data to server-side)
    api: {
        // Note: In production, API calls should be made through your backend
        // Never expose API keys in client-side code
        baseUrl: null,
        timeout: 5000
    },
    
    // UI configuration
    ui: {
        animationDuration: 300,
        scrollOffset: 50,
        mobileBreakpoint: 768
    },
    
    // Performance settings
    performance: {
        lazyLoadImages: true,
        preloadCriticalResources: true,
        enableServiceWorker: false
    }
};

// Environment detection
const isProduction = window.location.hostname !== 'localhost' && 
                    window.location.hostname !== '127.0.0.1';

// Export current environment config
window.BAKEGENIUS_CONFIG = isProduction ? CONFIG.production : CONFIG.development;
window.BAKEGENIUS_FEATURES = CONFIG.features;
window.BAKEGENIUS_UI = CONFIG.ui;
