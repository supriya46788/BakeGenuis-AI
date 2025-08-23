import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";


// ✅ Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyAOt1rdaHSqqyMgoHwoTwiot000ftgfASw",
    authDomain: "bake-genius.firebaseapp.com",
    projectId: "bake-genius",
    storageBucket: "bake-genius.firebasestorage.app",
    messagingSenderId: "789871840185",
    appId: "1:789871840185:web:52cd3ff9e02ba9f1d78468",
    measurementId: "G-Z9XMGQ6H25"
  };


// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const authFirebase = getAuth(app);

authFirebase.languageCode = "en";
const provider = new GoogleAuthProvider();

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