import {
  auth,
  provider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "../firebase-config.js";

// Regular email/password login
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

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

    alert(`Welcome ${user.displayName || user.email}!`);
    window.location.href = "index.html";
  } catch (error) {
    console.error("Login error:", error);
    alert(error.message);
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
    alert(error.message);
  }
});

// Google Sign-In button click handler
document
  .getElementById("googleSignInBtn")
  .addEventListener("click", async () => {
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
      window.location.href = "index.html";
    } catch (error) {
      console.error("Sign-in error:", error);
      if (error.code === "auth/unauthorized-domain") {
        alert(
          "Domain authorization error. Please check Firebase console settings or try from localhost."
        );
      } else {
        alert("Sign-in failed: " + error.message);
      }
    }
  });

// Track authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Already logged in as:", user.email);
    window.location.href = "index.html";
  } else {
    console.log("Not signed in");
  }
});
