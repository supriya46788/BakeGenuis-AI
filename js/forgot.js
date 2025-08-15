import { auth } from "../firebase-config.js";
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

document.getElementById("forgot-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();

  if (!email) {
    alert("Please enter your email address.");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent! Please check your inbox.");
    window.location.href = "login.html";
  } catch (error) {
    console.error("Error sending password reset email:", error);
    if (error.code === "auth/user-not-found") {
      alert("No account found with this email.");
    } else {
      alert("Error: " + error.message);
    }
  }
});