import {
  auth,
  provider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword
} from "../firebase-config.js";

// Import additional Firebase auth functions
import { 
  sendPasswordResetEmail 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Check if user came from signup page with email
document.addEventListener('DOMContentLoaded', () => {
  const loginEmail = sessionStorage.getItem('loginEmail');
  if (loginEmail) {
    document.getElementById('email').value = loginEmail;
    sessionStorage.removeItem('loginEmail');
    
    // Show a helpful message
    const emailInput = document.getElementById('email');
    emailInput.style.borderColor = '#4CAF50';
    emailInput.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.15)';
    
    // Focus on password field
    document.getElementById('password').focus();
  }
});

// Function to show signup alert
function showSignupAlert(email) {
  const shouldSignup = confirm(
    `No account found for ${email}.\n\nWould you like to create a new account with this email?`
  );
  
  if (shouldSignup) {
    // Store the email for signup
    sessionStorage.setItem('signupEmail', email);
    window.location.href = "signup.html";
  }
}

// Regular email/password login
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  // Show loading state
  const submitButton = document.getElementById("log");
  const originalText = submitButton.textContent;
  submitButton.textContent = "Signing in...";
  submitButton.disabled = true;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user info locally
    localStorage.setItem(
      "user",
      JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      })
    );

    alert(`Welcome back ${user.displayName || user.email}!`);
    window.location.href = "../index.html";
  } catch (error) {
    console.error("Login error:", error);
    
    // Handle specific error cases
    if (error.code === "auth/user-not-found") {
      showSignupAlert(email);
    } else if (error.code === "auth/wrong-password") {
      alert("Incorrect password. Please try again or use 'Forgot Password' if needed.");
    } else if (error.code === "auth/invalid-email") {
      alert("Please enter a valid email address.");
    } else if (error.code === "auth/too-many-requests") {
      alert("Too many failed attempts. Please try again later or reset your password.");
    } else if (error.code === "auth/invalid-credential") {
      alert("Invalid email or password. Please check your credentials and try again.");
    } else {
      alert("Login failed: " + error.message);
    }
  } finally {
    // Reset button state
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }
});

// Forgot password handler
document.querySelector(".forgot-link")?.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = prompt("Enter your email to reset password:");
  if (!email) return;

  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent! Please check your inbox.");
  } catch (error) {
    console.error("Password reset error:", error);
    if (error.code === "auth/user-not-found") {
      alert("No account found with this email address.");
    } else {
      alert("Error sending reset email: " + error.message);
    }
  }
});

// Google Sign-In button click handler
document.getElementById("googleSignInBtn").addEventListener("click", async () => {
  // Show loading state
  const googleButton = document.getElementById("googleSignInBtn");
  const originalHTML = googleButton.innerHTML;
  googleButton.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
      <div style="width: 16px; height: 16px; border: 2px solid #f3f3f3; border-top: 2px solid #4285F4; border-radius: 50%; animation: spin 1s linear infinite;"></div>
      Signing in...
    </div>
  `;
  googleButton.disabled = true;

  // Add spin animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

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
    window.location.href = "../index.html";
  } catch (error) {
    console.error("Google sign-in error:", error);
    
    if (error.code === "auth/popup-closed-by-user") {
      alert("Sign-in was cancelled. Please try again.");
    } else if (error.code === "auth/popup-blocked") {
      alert("Pop-up was blocked by your browser. Please allow pop-ups for this site and try again.");
    } else if (error.code === "auth/unauthorized-domain") {
      alert("This domain is not authorized for Google sign-in. Please contact support.");
    } else if (error.code === "auth/cancelled-popup-request") {
      // User cancelled, no need to show error
      console.log("User cancelled Google sign-in");
    } else {
      alert("Google sign-in failed: " + error.message);
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
    // Only redirect if not already on index page
    const currentPage = window.location.pathname;

    if (!currentPage.endsWith("index.html") && !currentPage.endsWith("signup.html")) {
      // Don't auto-redirect from login page to allow manual login
      // window.location.href = "../index.html";
    }
  } else {
    console.log("Not signed in");
  }
});