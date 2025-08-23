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
      throw new Error('An account with this email already exists');
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

    return newUser;
  }

  // Login user
  login(email, password) {
    const user = this.users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase().trim() &&
        u.password === password
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    this.setCurrentUser({
      id: user.id,
      name: user.name,
      email: user.email,
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

  // Update user information
  updateUser(userId, updatedData) {
    const userIndex = this.users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        this.users[userIndex] = { ...this.users[userIndex], ...updatedData };
        this.saveUsers();
        if (this.currentUser && this.currentUser.id === userId) {
            this.setCurrentUser(this.users[userIndex]);
        }
    }
  }
}

// Global auth instance
const auth = new AuthSystem();

/* ---------- UI Helpers ---------- */
function getErrorEl() {
  return document.getElementById('errorMessage');
}
function getSuccessEl() {
  return document.getElementById('successMessage');
}

function showError(message) {
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

function setLoading(isLoading, buttonId) {
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
      message = '⚠ Weak password';
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
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

/* ---------- Page Init ---------- */
function initLoginPage() {
  if (auth.isLoggedIn()) {
    window.location.href = '../index.html';
    return;
  }

  const form = document.getElementById('loginForm');
  if (form) form.addEventListener('submit', handleLogin);

  hideError();
}

function initSignupPage() {
  if (auth.isLoggedIn()) {
    window.location.href = '../index.html';
    return;
  }

  const form = document.getElementById('signupForm');
  if (form) form.addEventListener('submit', handleSignup);

  const passwordInput = document.getElementById('password');
  if (passwordInput) {
    passwordInput.addEventListener('input', (e) =>
      checkPasswordStrength(e.target.value)
    );
  }

  hideError();
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
    if (!email || !password) throw new Error('Please fill in all fields');
    if (!validateEmail(email))
      throw new Error('Please enter a valid email address');

    await new Promise((r) => setTimeout(r, 800));

    auth.login(email, password);

    showSuccess('✅ Login successful! Redirecting…');

    setTimeout(() => {
      window.location.href = '../index.html';
    }, 1200);
    return;
  } catch (err) {
    showError(err.message || 'Something went wrong. Please try again.');
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
      throw new Error('Please fill in all fields');
    }
    if (name.trim().length < 2)
      throw new Error('Name must be at least 2 characters long');
    if (!validateEmail(email))
      throw new Error('Please enter a valid email address');
    if (password.length < 6)
      throw new Error('Password must be at least 6 characters long');
    if (password !== confirmPassword)
      throw new Error('Passwords do not match');

    await new Promise((r) => setTimeout(r, 1000));

    auth.signup(name, email, password);

    showSuccess('✅ Signup successful! Redirecting…');

    setTimeout(() => {
      window.location.href = '../index.html';
    }, 1400);
    return;
  } catch (err) {
    showError(err.message || 'Something went wrong. Please try again.');
  } finally {
    setLoading(false, 'signupButton');
  }
}

/* ---------- Navigation & Auth ---------- */
function updateNavigation() {
  if (!auth.isLoggedIn()) return;

  const navLinks = document.querySelector('.nav-links');
  const ctaBtn = document.querySelector('.cta-btn');

  if (navLinks && ctaBtn) {
    const loginLink = navLinks.querySelector('a[href*="login.html"]');
    const signupLink = navLinks.querySelector('a[href*="signup.html"]');
    if (loginLink) loginLink.parentElement.style.display = 'none';
    if (signupLink) signupLink.parentElement.style.display = 'none';

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

// Final merged logout with SweetAlert and correct path handling
function handleLogout() {
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
      auth.logout();
      const currentPath = window.location.pathname;
      if (currentPath.includes('/html/')) {
        window.location.href = 'login.html';
      } else {
        window.location.href = 'html/login.html';
      }
    }
  });
}

function checkAuth() {
  const protectedPages = ['convert.html', 'customize.html', 'scale.html', 'profile.html'];
  const currentPage = window.location.pathname.split('/').pop();

  if (protectedPages.includes(currentPage) && !auth.isLoggedIn()) {
    window.location.href = 'login.html';
    return false;
  }

  if (auth.isLoggedIn()) {
    updateNavigation();
  }

  return true;
}

document.addEventListener('DOMContentLoaded', function () {
  checkAuth();
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { auth, checkAuth, updateNavigation, handleLogout };
}
