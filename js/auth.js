// User Authentication System
class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('bakegenius_users') || '[]');
        this.currentUser = JSON.parse(localStorage.getItem('bakegenius_current_user') || 'null');
    }

    // Save users to localStorage
    saveUsers() {
        localStorage.setItem('bakegenius_users', JSON.stringify(this.users));
    }

    // Save current user session
    saveCurrentUser(user) {
        this.currentUser = user;
        localStorage.setItem('bakegenius_current_user', JSON.stringify(user));
    }

    // Clear current user session
    clearCurrentUser() {
        this.currentUser = null;
        localStorage.removeItem('bakegenius_current_user');
    }

    // Check if email already exists
    emailExists(email) {
        return this.users.some(user => user.email.toLowerCase() === email.toLowerCase());
    }

    // Register new user
    signup(name, email, password) {
        // Validate input
        if (!name.trim() || !email.trim() || !password.trim()) {
            throw new Error('All fields are required');
        }

        if (!this.isValidEmail(email)) {
            throw new Error('Please enter a valid email address');
        }

        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }

        // Check if email already exists
        if (this.emailExists(email)) {
            throw new Error('An account with this email already exists');
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: password, // In production, this should be hashed
            createdAt: new Date().toISOString()
        };

        // Add to users array
        this.users.push(newUser);
        this.saveUsers();

        // Auto-login the new user
        const userSession = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        };
        this.saveCurrentUser(userSession);

        return userSession;
    }

    // Login user
    login(email, password) {
        // Validate input
        if (!email.trim() || !password.trim()) {
            throw new Error('Email and password are required');
        }

        // Find user
        const user = this.users.find(u => 
            u.email.toLowerCase() === email.toLowerCase().trim()
        );

        if (!user) {
            throw new Error('No account found with this email address');
        }

        if (user.password !== password) {
            throw new Error('Incorrect password');
        }

        // Create user session
        const userSession = {
            id: user.id,
            name: user.name,
            email: user.email
        };
        this.saveCurrentUser(userSession);

        return userSession;
    }

    // Logout user
    logout() {
        this.clearCurrentUser();
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Check password strength
    checkPasswordStrength(password) {
        if (password.length < 6) return 'weak';
        if (password.length < 8) return 'medium';
        
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        const strengthCount = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
        
        if (strengthCount >= 3 && password.length >= 8) return 'strong';
        if (strengthCount >= 2) return 'medium';
        return 'weak';
    }
}

// Global auth instance
const auth = new AuthSystem();

// UI Helper Functions
function showError(message) {
    const errorEl = document.getElementById('errorMessage');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('show');
        setTimeout(() => errorEl.classList.remove('show'), 5000);
    }
}

function showSuccess(message) {
    const successEl = document.getElementById('successMessage');
    if (successEl) {
        successEl.textContent = message;
        successEl.classList.add('show');
        setTimeout(() => successEl.classList.remove('show'), 3000);
    }
}

function setLoading(isLoading, buttonId = 'signupButton') {
    const button = document.getElementById(buttonId);
    const spinner = document.getElementById('loadingSpinner');
    const buttonText = document.getElementById('buttonText');
    
    if (button && spinner && buttonText) {
        if (isLoading) {
            button.disabled = true;
            spinner.style.display = 'inline-block';
            buttonText.textContent = buttonId.includes('signup') ? 'Creating Account...' : 'Signing In...';
        } else {
            button.disabled = false;
            spinner.style.display = 'none';
            buttonText.textContent = buttonId.includes('signup') ? 'Create Account ✨' : 'Sign In 🚀';
        }
    }
}

// Signup Page Functions
function initSignupPage() {
    const form = document.getElementById('signupForm');
    const passwordInput = document.getElementById('password');
    const strengthIndicator = document.getElementById('passwordStrength');

    // Password strength checker
    if (passwordInput && strengthIndicator) {
        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            const strength = auth.checkPasswordStrength(password);
            
            strengthIndicator.className = `password-strength strength-${strength}`;
            
            switch (strength) {
                case 'weak':
                    strengthIndicator.textContent = '🔴 Weak - Use at least 6 characters';
                    break;
                case 'medium':
                    strengthIndicator.textContent = '🟡 Medium - Add numbers and symbols';
                    break;
                case 'strong':
                    strengthIndicator.textContent = '🟢 Strong - Great password!';
                    break;
            }
        });
    }

    // Form submission
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            setLoading(true, 'signupButton');

            try {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const user = auth.signup(name, email, password);
                showSuccess(`Welcome ${user.name}! Account created successfully.`);
                
                // Redirect to home page after success
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 2000);
                
            } catch (error) {
                showError(error.message);
            } finally {
                setLoading(false, 'signupButton');
            }
        });
    }
}

// Login Page Functions
function initLoginPage() {
    const form = document.getElementById('loginForm');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            setLoading(true, 'loginButton');

            try {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const user = auth.login(email, password);
                showSuccess(`Welcome back, ${user.name}!`);
                
                // Redirect to home page after success
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1500);
                
            } catch (error) {
                showError(error.message);
            } finally {
                setLoading(false, 'loginButton');
            }
        });
    }
}

// Navigation Authentication Functions
function updateNavigation() {
    const user = auth.getCurrentUser();
    const navLinks = document.getElementById('navLinks');
    
    if (!navLinks) return;

    // Remove existing auth links
    const existingAuthLinks = navLinks.querySelectorAll('.auth-nav-item');
    existingAuthLinks.forEach(link => link.remove());

    if (user) {
        // User is logged in - show user name and logout
        const userInfo = document.createElement('li');
        userInfo.className = 'auth-nav-item';
        userInfo.innerHTML = `
            <span style="color: var(--candy-red); font-weight: 600;">👋 ${user.name}</span>
        `;

        const logoutLink = document.createElement('li');
        logoutLink.className = 'auth-nav-item';
        logoutLink.innerHTML = `
            <a href="#" onclick="handleLogout()" style="color: var(--sky-blue); font-weight: 600;">Logout</a>
        `;

        navLinks.appendChild(userInfo);
        navLinks.appendChild(logoutLink);
    } else {
        // User is not logged in - show login/signup links
        const loginLink = document.createElement('li');
        loginLink.className = 'auth-nav-item';
        loginLink.innerHTML = `<a href="html/login.html">Login</a>`;

        const signupLink = document.createElement('li');
        signupLink.className = 'auth-nav-item';
        signupLink.innerHTML = `<a href="html/signup.html">Sign Up</a>`;

        navLinks.appendChild(loginLink);
        navLinks.appendChild(signupLink);
    }
}

// Logout Handler
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        auth.logout();
        showSuccess('Logged out successfully!');
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'html/login.html';
        }, 1000);
    }
}

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
    
    // Check if user is on a protected page without being logged in
    const protectedPages = ['convert.html', 'customize.html', 'scale.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !auth.isLoggedIn()) {
        alert('Please login to access this feature.');
        window.location.href = 'login.html';
    }
});

// Export for global use
window.auth = auth;
window.handleLogout = handleLogout;
window.updateNavigation = updateNavigation;