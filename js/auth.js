// Firebase Authentication Service
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase.js';

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Authentication Functions
export class AuthService {
  
  // Sign up with email and password
  static async signUp(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile with display name
      await updateProfile(user, { displayName });
      
      // Create user document in Firestore
      await this.createUserDocument(user.uid, {
        email: user.email,
        displayName: displayName,
        createdAt: new Date(),
        preferences: {
          theme: 'light',
          units: 'metric'
        }
      });
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Sign in with email and password
  static async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Sign in with Google
  static async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user document exists, create if not
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await this.createUserDocument(user.uid, {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date(),
          preferences: {
            theme: 'light',
            units: 'metric'
          }
        });
      }
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Sign out
  static async signOut() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get current user
  static getCurrentUser() {
    return auth.currentUser;
  }

  // Listen to auth state changes
  static onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }

  // Create user document in Firestore
  static async createUserDocument(uid, userData) {
    try {
      await setDoc(doc(db, 'users', uid), userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get user document from Firestore
  static async getUserDocument(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return { success: true, data: userDoc.data() };
      } else {
        return { success: false, error: 'User document not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}


