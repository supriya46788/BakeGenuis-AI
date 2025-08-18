// Authentication System for BakeGenius AI
class AuthSystem {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = this.getCurrentUser();
    }

    // Load users from localStorage
    loadUsers() {
        const users = localStorage.getItem('bakegenius_users');
        return users ? JSON.parse(users) : [];
    }

    // Save users to localStorage
    saveUsers() {
        localStorage.setItem('bakegenius_users', JSON.stringify(this.users));
    }

    // Get current logged-in user
    getCurrentUser() {
        const user = localStorage.getItem('bakegenius_current_user');
        return user ? JSON.parse(user) : null;
    }

    // Set current user
    setCurrentUser(user) {
        localStorage.setItem('bakegenius_current_user', JSON.stringify(user));
        this.currentUser = user;
    }

    // Clear current user (logout)
    clearCurrentUser() {
        localStorage.removeItem('bakegenius_current_user');
        this.currentUser = null;
    }

    // Check if email already exists
    emailExists(email) {
        return this.users.some(user => user.email.toLowerCase() === email.toLowerCase());
    }

    // Register new user
    signup(name, email, password) {
        if (this.emailExists(email)) {
            throw new Error('An account with this email already exists');
        }

        const newUser = {
            id: Date.now().toString(),
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: password, // In production, this should be hashed
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.saveUsers();
        
        // Auto-login after signup
        this.setCurrentUser({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        });

        return newUser;
    }

    // Login user
    login(email, password) {
        const user = this.users.find(u => 
            u.email.toLowerCase() === email.toLowerCase().trim() && 
            u.password === password
        );

        if (!user) {
            throw new Error('Invalid email or password');
        }

        this.setCurrentUser({
            id: user.id,
            name: user.name,
            email: user.email
        });

        return user;
    }

    // Logout user
    logout() {
        this.clearCurrentUser();
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
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

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Attempt login
        auth.login(email, password);

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

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Attempt signup
        auth.signup(name, email, password);

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

    const navLinks = document.querySelector('.nav-links');
    const ctaBtn = document.querySelector('.cta-btn');
    
    if (navLinks && ctaBtn) {
        // Hide login/signup links when logged in
        const loginLink = navLinks.querySelector('a[href*="login.html"]');
        const signupLink = navLinks.querySelector('a[href*="signup.html"]');
        if (loginLink) loginLink.parentElement.style.display = 'none';
        if (signupLink) signupLink.parentElement.style.display = 'none';
        
        // Replace CTA button with user info
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