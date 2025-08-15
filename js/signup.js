import {
  auth,
  provider,
  signInWithPopup,
  onAuthStateChanged
} from "../firebase-config.js";

// Import additional Firebase auth functions
import { 
  createUserWithEmailAndPassword,
  updateProfile 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Check if user came from login page with email
document.addEventListener('DOMContentLoaded', () => {
  const signupEmail = sessionStorage.getItem('signupEmail');
  if (signupEmail) {
    document.getElementById('email').value = signupEmail;
    sessionStorage.removeItem('signupEmail');
    
    // Show a helpful message
    const emailInput = document.getElementById('email');
    emailInput.style.borderColor = '#4CAF50';
    emailInput.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.15)';
    
    // Add a small notice
    const notice = document.createElement('div');
    notice.style.cssText = `
      background: #E8F5E8;
      color: #2E7D32;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 14px;
      margin-bottom: 10px;
      text-align: center;
    `;
    notice.textContent = 'Email pre-filled from login attempt. Please complete your signup.';
    emailInput.parentNode.insertBefore(notice, emailInput);
  }
});

// Password strength checker
const passwordInput = document.getElementById("password");
const strengthText = document.getElementById("password-strength");
let currentStrength = "Weak"; // Track current strength

passwordInput.addEventListener("input", () => {
  const value = passwordInput.value;
  let strength = "Weak";
  let color = "red";

  const hasLower = /[a-z]/.test(value);
  const hasUpper = /[A-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

  if (value.length >= 8 && hasLower && hasUpper && hasNumber && hasSpecial) {
    strength = "Strong";
    color = "green";
  } else if (value.length >= 6 && ((hasLower && hasUpper) || (hasNumber && hasSpecial))) {
    strength = "Medium";
    color = "orange";
  }

  currentStrength = strength; // Update current strength
  strengthText.textContent = `Password strength: ${strength}`;
  strengthText.style.color = color;
});

// Signup form submit
document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = passwordInput.value.trim();

  // Check password strength before allowing signup
  if (currentStrength !== "Strong") {
    alert("Password must be strong! Please include uppercase, lowercase, number, special character, and minimum 8 characters.");
    return; // Stop form submission
  }

  if (!username || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  // Show loading state
  const submitButton = document.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.textContent = "Creating account...";
  submitButton.disabled = true;

  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile with username
    await updateProfile(user, {
      displayName: username
    });

    // Save user info locally
    localStorage.setItem(
      "user",
      JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: username,
        photoURL: user.photoURL,
      })
    );

    // Show success message
    const successDiv = document.getElementById('signup-success');
    successDiv.style.display = 'block';
    successDiv.textContent = `Welcome ${username}! Account created successfully. Redirecting...`;
    
    // Redirect to index page after successful signup
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 2000);
  } catch (error) {
    console.error("Signup error:", error);
    if (error.code === "auth/email-already-in-use") {
      const shouldLogin = confirm("This email is already registered. Would you like to go to the login page instead?");
      if (shouldLogin) {
        // Store email for login page
        sessionStorage.setItem('loginEmail', email);
        window.location.href = "login.html";
      }
    } else if (error.code === "auth/weak-password") {
      alert("Password is too weak. Please choose a stronger password.");
    } else if (error.code === "auth/invalid-email") {
      alert("Please enter a valid email address.");
    } else {
      alert("Signup failed: " + error.message);
    }
  } finally {
    // Reset button state
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }
});

// Google Sign-Up button click handler
document.getElementById("googleSignUpBtn").addEventListener("click", async () => {
  // Show loading state
  const googleButton = document.getElementById("googleSignUpBtn");
  const originalHTML = googleButton.innerHTML;
  googleButton.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
      <div style="width: 16px; height: 16px; border: 2px solid #f3f3f3; border-top: 2px solid #4285F4; border-radius: 50%; animation: spin 1s linear infinite;"></div>
      Creating account...
    </div>
  `;
  googleButton.disabled = true;

  // Add spin animation if not already present
  if (!document.querySelector('#spin-animation')) {
    const style = document.createElement('style');
    style.id = 'spin-animation';
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    localStorage.setItem(
      "user",
      JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      })
    );

    alert(`Welcome ${user.displayName || user.email}!`);
    
    // Redirect to index page after successful Google signup
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 2000);
  } catch (error) {
    console.error("Google sign-up error:", error);
    if (error.code === "auth/popup-closed-by-user") {
      alert("Sign-up was cancelled. Please try again.");
    } else if (error.code === "auth/popup-blocked") {
      alert("Pop-up was blocked by your browser. Please allow pop-ups for this site and try again.");
    } else if (error.code === "auth/unauthorized-domain") {
      alert("This domain is not authorized for Google sign-in. Please contact support.");
    } else if (error.code === "auth/cancelled-popup-request") {
      // User cancelled, no need to show error
      console.log("User cancelled Google sign-up");
    } else {
      alert("Sign-up failed: " + error.message);
    }
  } finally {
    // Reset button state
    googleButton.innerHTML = originalHTML;
    googleButton.disabled = false;
  }
});

// Track authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Already logged in as:", user.email);
    // Don't auto-redirect on signup page to allow completion
  } else {
    console.log("Not signed in");
  }
});