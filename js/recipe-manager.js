// Recipe Manager - Handles recipe operations with Firebase
import { FirestoreService } from './firestore.js';
import { AuthService } from './auth.js';

export class RecipeManager {
  
  // Save a converted recipe
  static async saveRecipe(recipeData) {
    const user = AuthService.getCurrentUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const result = await FirestoreService.saveRecipe(user.uid, recipeData);
      if (result.success) {
        // Show success message
        this.showToast('Recipe saved successfully!', 'success');
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
      this.showToast('Failed to save recipe. Please try again.', 'error');
      return { success: false, error: error.message };
    }
  }

  // Load user's saved recipes
  static async loadUserRecipes() {
    const user = AuthService.getCurrentUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const result = await FirestoreService.getUserRecipes(user.uid);
      if (result.success) {
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error loading recipes:', error);
      this.showToast('Failed to load recipes. Please try again.', 'error');
      return { success: false, error: error.message };
    }
  }

  // Delete a recipe
  static async deleteRecipe(recipeId) {
    const user = AuthService.getCurrentUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const result = await FirestoreService.deleteRecipe(recipeId);
      if (result.success) {
        this.showToast('Recipe deleted successfully!', 'success');
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      this.showToast('Failed to delete recipe. Please try again.', 'error');
      return { success: false, error: error.message };
    }
  }

  // Save conversion to history
  static async saveToHistory(conversionData) {
    const user = AuthService.getCurrentUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const result = await FirestoreService.saveConversionHistory(user.uid, conversionData);
      return result;
    } catch (error) {
      console.error('Error saving to history:', error);
      return { success: false, error: error.message };
    }
  }

  // Load conversion history
  static async loadHistory() {
    const user = AuthService.getCurrentUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const result = await FirestoreService.getConversionHistory(user.uid);
      return result;
    } catch (error) {
      console.error('Error loading history:', error);
      return { success: false, error: error.message };
    }
  }

  // Save user preferences
  static async savePreferences(preferences) {
    const user = AuthService.getCurrentUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const result = await FirestoreService.saveUserPreferences(user.uid, preferences);
      if (result.success) {
        this.showToast('Preferences saved!', 'success');
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      this.showToast('Failed to save preferences. Please try again.', 'error');
      return { success: false, error: error.message };
    }
  }

  // Load user preferences
  static async loadPreferences() {
    const user = AuthService.getCurrentUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const result = await FirestoreService.getUserPreferences(user.uid);
      return result;
    } catch (error) {
      console.error('Error loading preferences:', error);
      return { success: false, error: error.message };
    }
  }

  // Helper function to show toast notifications
  static showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Style the toast
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      z-index: 10000;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  // Format recipe data for display
  static formatRecipeForDisplay(recipe) {
    return {
      id: recipe.id,
      title: recipe.originalRecipe?.title || 'Untitled Recipe',
      originalText: recipe.originalRecipe?.text || '',
      convertedText: recipe.convertedRecipe?.text || '',
      ingredients: recipe.ingredients || [],
      createdAt: recipe.createdAt?.toDate?.() || new Date(recipe.createdAt),
      tags: recipe.tags || [],
      notes: recipe.notes || ''
    };
  }

  // Format conversion history for display
  static formatHistoryForDisplay(history) {
    return history.map(item => ({
      id: item.id,
      originalText: item.originalText,
      convertedText: item.convertedText,
      ingredients: item.ingredients || [],
      timestamp: item.timestamp?.toDate?.() || new Date(item.timestamp)
    }));
  }
}



