// Firestore Database Service
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase.js';

export class FirestoreService {
  
  // Save a converted recipe
  static async saveRecipe(userId, recipeData) {
    try {
      const recipeRef = await addDoc(collection(db, 'recipes'), {
        userId: userId,
        originalRecipe: recipeData.original,
        convertedRecipe: recipeData.converted,
        ingredients: recipeData.ingredients,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isPublic: false,
        tags: recipeData.tags || [],
        notes: recipeData.notes || ''
      });
      
      return { success: true, recipeId: recipeRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get user's saved recipes
  static async getUserRecipes(userId) {
    try {
      const q = query(
        collection(db, 'recipes'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const recipes = [];
      
      querySnapshot.forEach((doc) => {
        recipes.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return { success: true, recipes };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get a specific recipe
  static async getRecipe(recipeId) {
    try {
      const recipeDoc = await getDoc(doc(db, 'recipes', recipeId));
      
      if (recipeDoc.exists()) {
        return { success: true, recipe: { id: recipeDoc.id, ...recipeDoc.data() } };
      } else {
        return { success: false, error: 'Recipe not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update a recipe
  static async updateRecipe(recipeId, updateData) {
    try {
      await updateDoc(doc(db, 'recipes', recipeId), {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete a recipe
  static async deleteRecipe(recipeId) {
    try {
      await deleteDoc(doc(db, 'recipes', recipeId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Save user preferences
  static async saveUserPreferences(userId, preferences) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        preferences: preferences,
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get user preferences
  static async getUserPreferences(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return { success: true, preferences: userData.preferences || {} };
      } else {
        return { success: false, error: 'User not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Save conversion history
  static async saveConversionHistory(userId, conversionData) {
    try {
      await addDoc(collection(db, 'conversionHistory'), {
        userId: userId,
        originalText: conversionData.original,
        convertedText: conversionData.converted,
        ingredients: conversionData.ingredients,
        timestamp: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get conversion history
  static async getConversionHistory(userId, limitCount = 50) {
    try {
      const q = query(
        collection(db, 'conversionHistory'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const history = [];
      
      querySnapshot.forEach((doc) => {
        history.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return { success: true, history };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get public recipes (for community features)
  static async getPublicRecipes(limitCount = 20) {
    try {
      const q = query(
        collection(db, 'recipes'),
        where('isPublic', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const recipes = [];
      
      querySnapshot.forEach((doc) => {
        recipes.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return { success: true, recipes };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}



