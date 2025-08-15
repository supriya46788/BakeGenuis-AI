// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBuBfWtdpSaJoonPbDe3r_eSx1cnkS5tSo",
  authDomain: "bakegenuis-ai.firebaseapp.com",
  projectId: "bakegenuis-ai",
  storageBucket: "bakegenuis-ai.firebasestorage.app",
  messagingSenderId: "443206783224",
  appId: "1:443206783224:web:289a450763b91df4052b0d",
  measurementId: "G-B74HB5KZLM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Configure Google provider
provider.addScope('email');
provider.addScope('profile');

export { 
  auth, 
  provider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signInWithEmailAndPassword
};