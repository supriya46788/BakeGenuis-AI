# Firebase Integration Setup Guide

This guide will help you set up Firebase connectivity for the BakeGenius AI project while keeping your credentials secure when contributing to the repository.

---

## ✅ Prerequisites

1. A Google account  
2. Access to the [Firebase Console](https://console.firebase.google.com/)  
3. Basic understanding of web development  

---

## ✅ Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)  
2. Click "Create a project" or "Add project"  
3. Enter project name: `bakegenius-ai` (or your preferred name)  
4. Enable Google Analytics (optional but recommended)  
5. Click "Create project"  

---

## ✅ Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar  
2. Click "Get started"  
3. Go to the "Sign-in method" tab  
4. Enable the following providers:  
   - **Email/Password**: Click "Email/Password" and enable it  
   - **Google**: Click "Google" and enable it, and add your project support email  

---

## ✅ Step 3: Set up Firestore Database

1. Go to "Firestore Database" in the left sidebar  
2. Click "Create database"  
3. Choose "Start in test mode" (for development purposes)  
4. Select a location closest to your users  
5. Click "Done"  

---

## ✅ Step 4: Get Firebase Configuration

1. Go to "Project settings" (gear icon in the top-left corner)  
2. Scroll to the "Your apps" section  
3. Click the Web icon (`</>`) to add a web app  
4. Enter app nickname: `BakeGenius AI`  
5. Optionally check "Also set up Firebase Hosting"  
6. Click "Register app"  
7. Copy the Firebase configuration object — you will use this in your local setup  

---



### ✅ Step 5: Update the Configuration File with Placeholders

For security reasons, **do not commit your actual API keys**. Use placeholders in the configuration file and instruct developers to replace them when setting up locally.

#### Update `js/config.js` as follows:

```javascript
FIREBASE: {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
}
