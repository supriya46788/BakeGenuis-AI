import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";


// Firebase Config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Replace with your actual API key
  authDomain: "YOUR_AUTH_DOMAIN", // Replace with your actual auth domain
  projectId: "YOUR_PROJECT_ID", // Replace with your actual project ID
  storageBucket: "YOUR_STORAGE_BUCKET", // Replace with your actual storage bucket
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Replace with your actual messaging sender ID
  appId: "YOUR_APP_ID", // Replace with your actual app ID
  measurementId: "YOUR_MEASUREMENT_ID" // Replace with your actual measurement ID if needed
};


// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const authFirebase = getAuth(app);
const provider = new GoogleAuthProvider(); 

authFirebase.languageCode = "en"; 

// ✅ Google Login Button
const googleLogin = document.getElementById("google-login-btn");
if (googleLogin) {
  googleLogin.addEventListener("click", function () {
    signInWithPopup(authFirebase, provider)
      .then((result) => {
        const user = result.user;
        console.log("Google user signed in:", user);

        // ✅ Sync Firebase user → local auth.js system
        if (window.auth) {
          auth.setCurrentUser({
            id: user.uid,
            name: user.displayName || "Google User",
            email: user.email,
          });
        }

        // ✅ Redirect
        window.location.href = "http://localhost:5500/html/customize.html";
      })
      .catch((error) => {
        console.error("Google sign-in error:", error.code, error.message);

        // ✅ Friendly error handling
        switch (error.code) {
          case "auth/popup-closed-by-user":
            alert("Sign-in popup was closed before completing. Please try again.");
            break;
          case "auth/cancelled-popup-request":
            alert("Multiple sign-in attempts detected. Please wait and try again.");
            break;
          case "auth/popup-blocked":
            alert("Popup was blocked by the browser. Please allow popups and try again.");
            break;
          case "auth/network-request-failed":
            alert("Network error occurred. Check your connection and try again.");
            break;
          default:
            alert("Google sign-in failed. Please try again later.");
        }
      });
  });
}