// Regular email/password signup
document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // For demo purposes - you can implement actual email/password auth later
  alert(
    "Email/password signup not implemented yet. Please use Google Sign-Up below."
  );
});

import {
  auth,
  provider,
  signInWithPopup,
  onAuthStateChanged,
} from "../firebase-config";

// Google Sign-Up button click handler (same as sign-in)
document
  .getElementById("googleSignUpBtn")
  .addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User signed up:", user.email);

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

      alert(`Welcome to BakeGenius ${user.displayName || user.email}!`);
      window.location.href = "index.html";
    } catch (error) {
      console.error("Sign-up error:", error);
      if (error.code === "auth/unauthorized-domain") {
        alert(
          "Domain authorization error. Please check Firebase console settings or try from localhost."
        );
      } else {
        alert("Sign-up failed: " + error.message);
      }
    }
  });
// Track authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Already logged in as:", user.email);
    window.location.href = "index.html";
  }
});
