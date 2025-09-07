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
    return this.users.some(
      (user) => user.email.toLowerCase() === email.toLowerCase().trim()
    );
  }

  // Register new user
  signup(name, email, password) {
    if (this.emailExists(email)) {
      toastManager.error('An account with this email already exists', 'Signup Error');
      // throw new Error('An account with this email already exists');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password, // NOTE: For production, hash the password
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    this.saveUsers();

    // Auto-login after signup
    this.setCurrentUser({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    });

    return true;
  }

  // Login user
  login(email, password) {
    const user = this.users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase().trim() &&
        u.password === password
    );
    if (!user) {
      toastManager.error('Invalid email or password', 'Login Error');
      // throw new Error('Invalid email or password');
      return;
    }
    this.setCurrentUser({
      id: user.id,
      name: user.name,
      email: user.email,
    });
    return true;
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

/* ---------- Toast System ---------- */
class ToastManager {
  constructor() {
    this.container = this.createContainer();
    this.toasts = [];
  }

  createContainer() {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  show(message, type = 'info', title = '', duration = 5000) {
    const toast = this.createToast(message, type, title);
    this.container.appendChild(toast);
    this.toasts.push(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);

    // Auto remove
    const removeTimer = setTimeout(() => {
      this.remove(toast);
    }, duration);

    // Store timer reference for manual removal
    toast._removeTimer = removeTimer;

    // Limit number of toasts
    if (this.toasts.length > 5) {
      this.remove(this.toasts[0]);
    }

    return toast;
  }

  createToast(message, type, title) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
      success: '🎉',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    const toastTitle = title || {
      success: 'Success!',
      error: 'Error!',
      warning: 'Warning!',
      info: 'Info'
    }[type];

    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div class="toast-content">
        <div class="toast-title">${toastTitle}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" onclick="toastManager.remove(this.parentElement)">×</button>
      <div class="toast-progress"></div>
    `;

    return toast;
  }

  remove(toast) {
    if (!toast || !toast.parentElement) return;

    // Clear timer if exists
    if (toast._removeTimer) {
      clearTimeout(toast._removeTimer);
    }

    toast.classList.remove('show');
    
    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
      this.toasts = this.toasts.filter(t => t !== toast);
    }, 400);
  }

  success(message, title = 'Success!', duration = 5000) {
    return this.show(message, 'success', title, duration);
  }

  error(message, title = 'Error!', duration = 6000) {
    return this.show(message, 'error', title, duration);
  }

  warning(message, title = 'Warning!', duration = 5000) {
    return this.show(message, 'warning', title, duration);
  }

  info(message, title = 'Info', duration = 4000) {
    return this.show(message, 'info', title, duration);
  }
}

// Global toast manager instance
const toastManager = new ToastManager();

/* ---------- UI Helpers ---------- */
function getErrorEl() {
  return document.getElementById('errorMessage');
}
function getSuccessEl() {
  return document.getElementById('successMessage');
}

function showError(message) {
  // Show toast for critical errors
  const criticalErrors = [
    'An account with this email already exists',
    'Invalid email or password',
    'Network error - please check your connection',
    'Passwords do not match',
    'Please enter a valid email address'
  ];
  
  if (criticalErrors.some(error => message.includes(error))) {
    toastManager.error(message, 'Authentication Error');
  }
  
  // Keep inline messages for all errors
  const el = getErrorEl();
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');

  // Hide success if visible
  const success = getSuccessEl();
  if (success) success.classList.remove('show');

  clearTimeout(el._hideTimer);
  el._hideTimer = setTimeout(() => {
    el.classList.remove('show');
  }, 5000);
}

function hideError() {
  const el = getErrorEl();
  if (el) el.classList.remove('show');
}

function showSuccess(message) {
  // Don't show success toasts here - only in specific success handlers
  const el = getSuccessEl();
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');

  hideError();

  clearTimeout(el._hideTimer);
  el._hideTimer = setTimeout(() => {
    el.classList.remove('show');
  }, 3000);

  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function setLoading(isLoading, buttonId = 'loginButton') {
  const button = document.getElementById(buttonId);
  if (!button) return;
  const spinner = button.querySelector('.loading-spinner');
  const buttonText = button.querySelector('.button-text');

  if (isLoading) {
    button.disabled = true;
    if (spinner) spinner.style.display = 'inline-block';
    if (buttonText) buttonText.style.opacity = '0.7';
  } else {
    button.disabled = false;
    if (spinner) spinner.style.display = 'none';
    if (buttonText) buttonText.style.opacity = '1';
  }
}

function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const icon = input.parentElement.querySelector('.password-toggle i');
  if (input.type === 'password') {
    input.type = 'text';
    if (icon) {
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    }
  } else {
    input.type = 'password';
    if (icon) {
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
  }
}

function checkPasswordStrength(password) {
  const strengthElement = document.getElementById('passwordStrength');
  if (!strengthElement) return;

  let strength = 0;
  let message = '';

  if (password.length >= 6) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

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

// Use the more permissive email validation (keep your version)
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/* ---------- Page Init ---------- */
function initLoginPage() {
  if (auth.isLoggedIn()) {
    window.location.href = '../index.html';
    return;
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  hideError();

  // Initialize Google Sign-In button if available
  initGoogleSignIn('login');
}

function initSignupPage() {
  if (auth.isLoggedIn()) {
    window.location.href = '../index.html';
    return;
  }

  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }

  const passwordInput = document.getElementById('password');
  if (passwordInput) {
    passwordInput.addEventListener('input', (e) =>
      checkPasswordStrength(e.target.value)
    );
  }

  hideError();

  // Initialize Google Sign-In button if available
  initGoogleSignIn('signup');
}

/* ---------- Submit Handlers ---------- */
async function handleLogin(event) {
  event.preventDefault();
  hideError();
  setLoading(true, 'loginButton');

  const formData = new FormData(event.target);
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    if (!email || !password) {
      toastManager.error('Please fill in all fields', 'Login Error');
      // throw new Error('Please fill in all fields');
      return;
    }
    if (!validateEmail(email)) {
      toastManager.error('Enter a valid email address', 'Login Error');
      // throw new Error('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      toastManager.error('Password must be at least 6 characters long', 'Login Error');
      // throw new Error('Password must be at least 6 characters long');
      return;
    }

    await new Promise((r) => setTimeout(r, 800));

    if(auth.login(email, password)){
      // Success toast ONLY for successful login
      toastManager.success(`Welcome back, ${auth.currentUser.name.split(' ')[0]}! 🎉`, 'Login Successful!');
      setTimeout(() => {
      window.location.href = '../index.html';
    }, 1200);
    }

    
  } catch (err) {
    toastManager.error(err.message || 'Something went wrong. Please try again.', 'Login Error');
    // showError(err.message || 'Something went wrong. Please try again.');
  } finally {
    setLoading(false, 'loginButton');
  }
}

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
    if (!name || !email || !password || !confirmPassword) {
      toastManager.error('Please fill in all fields', 'Signup Error');
      // throw new Error('Please fill in all fields');
      return;
    }
    if (name.trim().length < 2) {
      toastManager.error('Name must be at least 2 characters long', 'Signup Error');
      // throw new Error('Name must be at least 2 characters long');
      return;
    }
    if (!validateEmail(email)) {
      toastManager.error('Please enter a valid email address', 'Signup Error');
      // throw new Error('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      toastManager.error('Password must be at least 6 characters long', 'Signup Error');
      // throw new Error('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      toastManager.error('Passwords do not match', 'Signup Error');
      // throw new Error('Passwords do not match');
      return;
    }

    await new Promise((r) => setTimeout(r, 1000));

    if(auth.signup(name, email, password)){
      // Success toast ONLY for successful signup
      toastManager.success(`Welcome to BakeGenius, ${name.split(' ')[0]}! 🎂`, 'Account Created!');

    setTimeout(() => {
      window.location.href = '../index.html';
    }, 1400);
  }
  } catch (err) {
    // showError(err.message || 'Something went wrong. Please try again.');
    toastManager.error(err.message || 'Something went wrong. Please try again.', 'Signup Error');
  } finally {
    setLoading(false, 'signupButton');
  }
}

/* ---------- Navigation & Auth ---------- */
function updateNavigation() {
  if (!auth.isLoggedIn()) return;

  const navbarContainer = document.querySelector('.navbar-container');
  if (!navbarContainer) return;

  // Hide login/signup buttons
  const loginBtn = document.querySelector('.login-btn');
  const signupBtn = document.querySelector('.signup-btn');
  if (loginBtn) loginBtn.style.display = 'none';
  if (signupBtn) signupBtn.style.display = 'none';

  // Remove existing user-info if present
  const existingUserInfo = navbarContainer.querySelector('.user-info');
  if (existingUserInfo) existingUserInfo.remove();

  // Build user info div
  const userInfo = document.createElement('div');
  userInfo.className = 'user-info';
  const hasAvatar = auth.currentUser && auth.currentUser.avatarUrl;
  const avatarHtml = hasAvatar
    ? `<img src="${auth.currentUser.avatarUrl}" alt="avatar" class="user-avatar" style="width:32px;height:32px;border-radius:50%;object-fit:cover;" />`
    : `<div class="user-avatar">${auth.currentUser.name.charAt(0).toUpperCase()}</div>`;
  
      userInfo.innerHTML = `
      <div class="user-row">
        ${avatarHtml}
        <span>Hi, ${auth.currentUser.name.split(' ')[0]}!</span>
      </div>
      <button class="logout-btn" onclick="handleLogout()">Logout</button>
    `;


  // Insert user info in place of CTA button or at the end
  const ctaBtn = navbarContainer.querySelector('.cta-btn');
  const authButtons = navbarContainer.querySelector('.auth-buttons');
 if (authButtons) {
  authButtons.parentNode.replaceChild(userInfo, authButtons);
  } else {
  navbarContainer.appendChild(userInfo);
 }
}

function handleLogout() {
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: 'Are you sure you want to log out?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#FF4757',
      cancelButtonColor: '#70A1FF',
      confirmButtonText: 'Yes, log out',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'swal-popup',
        title: 'swal-title',
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        performLogout();
      }
    });
  } else {
    if (confirm('Are you sure you want to logout?')) {
      performLogout();
    }
  }
}

function performLogout() {
  auth.logout();
  
  // Disable Google auto-select so the next visit doesn't auto sign-in
  if (window.google && google.accounts && google.accounts.id) {
    try { google.accounts.id.disableAutoSelect(); } catch (e) {}
  }
  
  // Success toast ONLY for successful logout
  toastManager.success('You have been logged out successfully', 'Goodbye!', 2000);
  
  const currentPath = window.location.pathname;
  setTimeout(() => {
    if (currentPath.includes('/html/')) {
      window.location.href = 'login.html';
    } else {
      window.location.href = 'html/login.html';
    }
  }, 1800);
}

// Enhanced checkAuth function to handle more scenarios
function checkAuth() {
  const protectedPages = ['convert.html', 'customize.html', 'scale.html', 'recipe_hub.html'];
  const currentPage = window.location.pathname.split('/').pop();

  // Redirect to login if trying to access protected page without authentication
  if (protectedPages.includes(currentPage) && !auth.isLoggedIn()) {
    window.location.href = 'login.html';
    return false;
  }

  // Redirect away from login/signup pages if already authenticated
  const authPages = ['login.html', 'signup.html'];
  if (authPages.includes(currentPage) && auth.isLoggedIn()) {
    window.location.href = '../index.html';
    return false;
  }

  // Update navigation based on auth status
  if (auth.isLoggedIn()) {
    updateNavigation();
  } else {
    // Ensure auth elements are visible when logged out
    const authElements = document.querySelectorAll('a[href*="login.html"], a[href*="signup.html"], .login-btn, .signup-btn');
    authElements.forEach(element => {
      element.style.display = '';
    });

    // Ensure Scale Now button is always visible
    const scaleButtons = document.querySelectorAll('.cta-btn, .scale-nav-btn, a[href*="scale.html"]');
    scaleButtons.forEach(button => {
      button.style.display = '';
    });

    const userInfo = document.querySelector('.user-info');
    if (userInfo) {
      userInfo.remove();
    }
  }

  return true;
}

document.addEventListener('DOMContentLoaded', function() {
  checkAuth();
  window.addEventListener('storage', function(e) {
    if (e.key === 'bakegenius_current_user') {
      checkAuth();
    }
  });
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { auth, checkAuth, updateNavigation, handleLogout };
}

// --------------------
// Google Sign-In Setup
// --------------------

function base64UrlDecode(input) {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
  try {
    return decodeURIComponent(atob(padded).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  } catch (e) {
    return atob(padded);
  }
}

function parseJwt(idToken) {
  try {
    const payload = idToken.split('.')[1];
    const json = base64UrlDecode(payload);
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

function handleGoogleCredentialResponse(response) {
  const credential = response && response.credential;
  if (!credential) {
    toastManager.error('Google sign-in failed. Please try again.', 'Google Sign-In Error');
    return;
  }
  const payload = parseJwt(credential);
  if (!payload || !payload.email) {
    toastManager.error('Unable to parse Google user.', 'Google Sign-In Error');
    return;
  }

  const googleUser = {
    id: 'google:' + (payload.sub || payload.email),
    name: payload.name || payload.given_name || payload.email.split('@')[0],
    email: (payload.email || '').toLowerCase(),
    avatarUrl: payload.picture || '',
    provider: 'google',
    createdAt: new Date().toISOString()
  };

  const existingLocal = auth.users.find(u => u.email.toLowerCase() === googleUser.email);
  if (!existingLocal) {
    auth.users.push(googleUser);
    auth.saveUsers();
  } else {
    // Merge avatar and provider info for existing user
    existingLocal.provider = existingLocal.provider || 'local';
    if (googleUser.avatarUrl && !existingLocal.avatarUrl) {
      existingLocal.avatarUrl = googleUser.avatarUrl;
      auth.saveUsers();
    }
  }

  auth.setCurrentUser({ 
    id: googleUser.id, 
    name: googleUser.name, 
    email: googleUser.email, 
    avatarUrl: googleUser.avatarUrl 
  });

  // Success toast for Google Sign-In
  toastManager.success(`Welcome, ${googleUser.name.split(' ')[0]}! 🎉`, 'Google Sign-In Successful!');

  // Redirect to home
  setTimeout(() => {
    window.location.href = '../index.html';
  }, 1200);
}

function initGoogleSignIn(page) {
  const target = document.getElementById('google-login-btn');
  if (!target) return;

  const clientId = (window.GOOGLE_CLIENT_ID || '').trim();
  if (!clientId) {
    // Show guidance if client id is not configured
    target.style.display = 'block';
    target.innerHTML = '<div style="font-size:14px;color:#888;padding:8px 0;">Set GOOGLE_CLIENT_ID in <code>js/google_config.js</code> to enable Google Sign-In.</div>';
    console.warn('Google Sign-In: Missing window.GOOGLE_CLIENT_ID. Set it in js/google_config.js');
    return;
  }

  let attempts = 0;
  const maxAttempts = 40; // ~4s
  const timer = setInterval(function() {
    attempts++;
    if (window.google && google.accounts && google.accounts.id) {
      clearInterval(timer);
      try {
        google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: true
        });
        
        // Add click handler to existing button
        target.addEventListener('click', function() {
          google.accounts.id.prompt();
        });
        
      } catch (e) {
        console.error('Failed to initialize Google Sign-In', e);
        target.style.display = 'block';
        target.innerHTML = '<div style="font-size:14px;color:#888;padding:8px 0;">Failed to initialize Google Sign-In. Check console.</div>';
      }
    } else if (attempts >= maxAttempts) {
      clearInterval(timer);
      target.style.display = 'block';
      target.innerHTML = '<div style="font-size:14px;color:#888;padding:8px 0;">Could not load Google script. Check network/ad-blockers.</div>';
    }
  }, 100);
}