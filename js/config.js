// Configuration file for BakeGenius AI
// This file contains all the configuration settings for the application

export const CONFIG = {
  // Firebase Configuration
  FIREBASE: {
    // These will be replaced with actual values from Firebase console
    apiKey: "YOUR_API_KEY",
    authDomain: "your-app.firebaseapp.com", 
    projectId: "your-project-id",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id",
    //measurementId: ""
  },

  // Gemini API Configuration
  GEMINI: {
    apiKey: "YOUR_GEMINI_API_KEY", // Replace with your actual Gemini API key
    model: "gemini-pro",
    maxTokens: 1000
  },

  // Application Settings
  APP: {
    name: "BakeGenius.ai",
    version: "1.0.0",
    defaultTheme: "light",
    defaultUnits: "metric"
  },

  // Firestore Collections
  COLLECTIONS: {
    USERS: "users",
    RECIPES: "recipes", 
    CONVERSION_HISTORY: "conversionHistory",
    INGREDIENT_DENSITIES: "ingredientDensities"
  },

  // Default ingredient densities (fallback if Firestore is unavailable)
  INGREDIENT_DENSITIES: {
    "flour": 120, // grams per cup
    "sugar": 200,
    "brown sugar": 220,
    "butter": 227,
    "milk": 244,
    "water": 237,
    "oil": 218,
    "honey": 340,
    "molasses": 337,
    "cornstarch": 128,
    "baking powder": 192,
    "baking soda": 192,
    "salt": 292,
    "cocoa powder": 85,
    "chocolate chips": 170,
    "nuts": 120,
    "oats": 80,
    "rice": 185,
    "pasta": 100
  },

  // UI Configuration
  UI: {
    animationDuration: 300,
    toastDuration: 3000,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    supportedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  }
};

// Helper function to get configuration value
export function getConfig(path) {
  return path.split('.').reduce((obj, key) => obj?.[key], CONFIG);
}

// Helper function to update configuration
export function updateConfig(path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((obj, key) => obj[key] = obj[key] || {}, CONFIG);
  target[lastKey] = value;
}
