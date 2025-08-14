// Regular email/password login
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // For demo purposes - you can implement actual email/password auth later
  alert("Email/password login not implemented yet. Please use Google Sign-In.");
});

import {
  auth,
  provider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "../firebase-config";

// Google Sign-In button click handler
document
  .getElementById("googleSignInBtn")
  .addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User signed in:", user.email);

      // Store user info in localStorage
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
