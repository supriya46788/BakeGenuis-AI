// Secure Authentication System for BakeGenius AI
// Uses backend API with proper password hashing and JWT tokens

class AuthSystem {
    constructor() {
        this.cleanupOldStorage(); // Remove old insecure storage
        this.currentUser = this.getCurrentUser();
        this.token = this.getToken();
    }

    // Clean up old insecure localStorage items
    cleanupOldStorage() {
        // Remove plain text password storage
        localStorage.removeItem('bakegenius_users');
        localStorage.removeItem('bakegenius_current_user');
        
        // Note: We keep bakegenius_user_name and bakegenius_user_email for display purposes
        // but these don't contain sensitive information
    }

    // API Base URL
    getApiBaseUrl() {
        // Use relative URL for same-origin requests
        return window.location.origin.includes('localhost') 
            ? 'http://localhost:3000' 
            : '';
    }

    // Get stored JWT token
    getToken() {
        return localStorage.getItem('bakegenius_token');
    }

    // Store JWT token
    setToken(token) {
        localStorage.setItem('bakegenius_token', token);
        this.token = token;
    }

    // Remove JWT token (logout)
    removeToken() {
        localStorage.removeItem('bakegenius_token');
        this.token = null;
    }

    // Get current logged-in user from token
    getCurrentUser() {
        const token = this.getToken();
        if (!token) return null;

        try {
            // Decode JWT token to get user info (without verification for frontend use)
            const payload = JSON.parse(atob(token.split('.')[1]));
            return {
                id: payload.userId,
                // Additional user info can be stored in token or fetched from API
                name: localStorage.getItem('bakegenius_user_name') || 'User',
                email: localStorage.getItem('bakegenius_user_email') || ''
            };
        } catch (error) {
            console.error('Error decoding token:', error);
            this.removeToken();
            return null;
        }
    }

    // Set current user info (for display purposes)
    setCurrentUser(userData) {
        if (userData.name) {
            localStorage.setItem('bakegenius_user_name', userData.name);
        }
        if (userData.email) {
            localStorage.setItem('bakegenius_user_email', userData.email);
        }
        this.currentUser = this.getCurrentUser(); // Refresh user data
    }

    // Clear user data (logout)
    clearCurrentUser() {
        localStorage.removeItem('bakegenius_user_name');
        localStorage.removeItem('bakegenius_user_email');
        this.removeToken();
        this.currentUser = null;
    }

    // Make authenticated API request
    async makeAuthenticatedRequest(url, options = {}) {
        const token = this.getToken();
        if (!token) {
            throw new Error('No authentication token found');
        }

        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            ...options
        };

        try {
            const response = await fetch(url, defaultOptions);
            
            if (response.status === 401) {
                // Token expired or invalid
                this.clearCurrentUser();
                throw new Error('Session expired. Please login again.');
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            if (error.message.includes('Failed to fetch')) {
                throw new Error('Network error. Please check your connection.');
            }
            throw error;
        }
    }

    // Register new user via API
    async signup(name, email, password) {
        try {
            const response = await fetch(`${this.getApiBaseUrl()}/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            // Store token and user data
            this.setToken(data.token);
            this.setCurrentUser(data.user);

            return data.user;
        } catch (error) {
            throw new Error(error.message || 'Registration failed. Please try again.');
        }
    }

    // Login user via API
    async login(email, password) {
        try {
            const response = await fetch(`${this.getApiBaseUrl()}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Store token and user data
            this.setToken(data.token);
            this.setCurrentUser(data.user);

            return data.user;
        } catch (error) {
            throw new Error(error.message || 'Login failed. Please try again.');
        }
    }

    // Logout user
    logout() {
        this.clearCurrentUser();
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.token !== null && this.currentUser !== null;
    }

    // Get user profile from API
    async getProfile() {
        try {
            const data = await this.makeAuthenticatedRequest(`${this.getApiBaseUrl()}/api/user/profile`);
            this.setCurrentUser(data);
            return data;
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch user profile');
        }
    }

    // Verify token is still valid
    async verifyToken() {
        if (!this.token) return false;
        
        try {
            await this.getProfile();
            return true;
        } catch (error) {
            return false;
        }
    }
}

// Global auth instance
const auth = new AuthSystem();

// Utility functions
function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorElement.classList.remove('show');
        }, 5000);
    }
}

function hideError() {
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

function setLoading(isLoading, buttonId = 'loginButton') {
    const button = document.getElementById(buttonId);
    const spinner = button.querySelector('.loading-spinner');
    const buttonText = button.querySelector('.button-text');
    
    if (isLoading) {
        button.disabled = true;
        spinner.style.display = 'inline-block';
        buttonText.style.opacity = '0.7';
    } else {
        button.disabled = false;
        spinner.style.display = 'none';
        buttonText.style.opacity = '1';
    }
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector('.password-toggle i');
    
    if (input.type === 'password') {
        input.type = 'text';
        button.classList.remove('fa-eye');
        button.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        button.classList.remove('fa-eye-slash');
        button.classList.add('fa-eye');
    }
}

function checkPasswordStrength(password) {
    const strengthElement = document.getElementById('passwordStrength');
    if (!strengthElement) return;

    let strength = 0;
    let message = '';

    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;

    switch (strength) {
        case 0:
        case 1:
            message = '⚠️ Weak password';
            strengthElement.className = 'password-strength weak';
            break;
        case 2:
        case 3:
            message = '⚡ Medium strength';
            strengthElement.className = 'password-strength medium';
            break;
        case 4:
        case 5:
            message = '✅ Strong password';
            strengthElement.className = 'password-strength strong';
            break;
    }

    strengthElement.textContent = message;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Login page initialization
function initLoginPage() {
    // Redirect if already logged in
    if (auth.isLoggedIn()) {
        window.location.href = '../index.html';
        return;
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Clear any existing errors
    hideError();
}

// Signup page initialization
function initSignupPage() {
    // Redirect if already logged in
    if (auth.isLoggedIn()) {
        window.location.href = '../index.html';
        return;
    }

    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    // Password strength checker
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', (e) => {
            checkPasswordStrength(e.target.value);
        });
    }

    // Clear any existing errors
    hideError();
}

// Handle login form submission
async function handleLogin(event) {
    event.preventDefault();
    hideError();
    setLoading(true, 'loginButton');

    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        // Validate inputs
        if (!email || !password) {
            throw new Error('Please fill in all fields');
        }

        if (!validateEmail(email)) {
            throw new Error('Please enter a valid email address');
        }

        // Attempt login via API
        await auth.login(email, password);

        // Success - redirect to home
        window.location.href = '../index.html';

    } catch (error) {
        showError(error.message);
    } finally {
        setLoading(false, 'loginButton');
    }
}

// Handle signup form submission
async function handleSignup(event) {
    event.preventDefault();
    hideError();
    setLoading(true, 'signupButton');

    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    try {
        // Validate inputs
        if (!name || !email || !password || !confirmPassword) {
            throw new Error('Please fill in all fields');
        }

        if (name.trim().length < 2) {
            throw new Error('Name must be at least 2 characters long');
        }

        if (!validateEmail(email)) {
            throw new Error('Please enter a valid email address');
        }

        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }

        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        // Attempt signup via API
        await auth.signup(name, email, password);

        // Success - redirect to home
        window.location.href = '../index.html';

    } catch (error) {
        showError(error.message);
    } finally {
        setLoading(false, 'signupButton');
    }
}

// Update navigation for logged-in users
function updateNavigation() {
    if (!auth.isLoggedIn()) return;

    const authButtons = document.querySelector('.auth-buttons');
    const navbarContainer = document.querySelector('.navbar-container');
    
    if (authButtons && navbarContainer) {
        // Replace auth buttons with user info
        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';
        userInfo.innerHTML = `
            <div class="user-avatar">${auth.currentUser.name.charAt(0).toUpperCase()}</div>
            <span>Hi, ${auth.currentUser.name.split(' ')[0]}!</span>
            <button class="logout-btn" onclick="handleLogout()">Logout</button>
        `;
        
        authButtons.parentNode.replaceChild(userInfo, authButtons);
    }
    
    // Also handle the case where there's a single CTA button (like on some pages)
    const ctaBtn = document.querySelector('.cta-btn');
    if (ctaBtn && !document.querySelector('.user-info')) {
        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';
        userInfo.innerHTML = `
            <div class="user-avatar">${auth.currentUser.name.charAt(0).toUpperCase()}</div>
            <span>Hi, ${auth.currentUser.name.split(' ')[0]}!</span>
            <button class="logout-btn" onclick="handleLogout()">Logout</button>
        `;
        
        ctaBtn.parentNode.replaceChild(userInfo, ctaBtn);
    }
}

// Helper function to get correct path based on current location
function getCurrentPath() {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/html/')) {
        return './';
    } else {
        return 'html/';
    }
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        auth.logout();
        // Determine correct path based on current location
        const currentPath = window.location.pathname;
        if (currentPath.includes('/html/')) {
            window.location.href = 'login.html';
        } else {
            window.location.href = 'html/login.html';
        }
    }
}

// Check authentication on page load
function checkAuth() {
    // Pages that require authentication
    const protectedPages = ['convert.html', 'customize.html', 'scale.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !auth.isLoggedIn()) {
        // Redirect to login
        window.location.href = 'login.html';
        return false;
    }
    
    // Update navigation if logged in
    if (auth.isLoggedIn()) {
        updateNavigation();
    }
    
    return true;
}

// Initialize auth system on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { auth, checkAuth, updateNavigation, handleLogout };
}