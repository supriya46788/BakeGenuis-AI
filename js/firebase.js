// js/firebase.js
// Use full CDN ESM URLs so the browser can resolve modules without a bundler

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
// If you will use Auth, Firestore, etc. add them here similarly:
// import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",  
    authDomain: "YOUR_AUTH_DOMAIN",  
    projectId: "YOUR_PROJECT_ID",  
    storageBucket: "YOUR_STORAGE_BUCKET",  
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",  
    appId: "YOUR_APP_ID",  
    measurementId: "YOUR_MEASUREMENT_ID"  
  };

const app = initializeApp(firebaseConfig);

// analytics may throw an error if not enabled in project — wrap or check as needed
try {
  const analytics = getAnalytics(app);
  console.log("Firebase analytics initialized");
} catch (err) {
  console.warn("Firebase analytics not initialized:", err.message);
}

console.log("Firebase initialized", { projectId: firebaseConfig.projectId });

// Export items for use elsewhere
export { app /* , analytics */ };