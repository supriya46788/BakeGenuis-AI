# 🔐 Google Sign-In Setup Guide

This guide will help you set up Google Sign-In for local development and testing.

## Prerequisites

- A Google account
- Access to [Google Cloud Console](https://console.cloud.google.com/)

## Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter a project name (e.g., "BakeGenius-AI-Dev")
4. Click "Create"

### 2. Enable Google+ API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google+ API" or "Google Identity Services"
3. Click on it and click "Enable"

### 3. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: "BakeGenius AI Dev"
   - User support email: Your email
   - Developer contact information: Your email
4. Click "Save and Continue" through the remaining steps
5. Back to "Create OAuth client ID":
   - Application type: Web application
   - Name: "BakeGenius AI Web Client"
   - Authorized JavaScript origins: Add your local development URLs:
     - `http://localhost:5500`
     - `http://localhost:5501`
     - `http://127.0.0.1:5500`
     - `http://127.0.0.1:5501`
6. Click "Create"
7. Copy the **Client ID** (looks like: `1234567890-abc123def456.apps.googleusercontent.com`)

### 4. Configure Your Local Environment

1. Copy the template file:
   ```bash
   cp js/google_config.example.js js/google_config.js
   ```

2. Edit `js/google_config.js` and add your client ID:
   ```javascript
   window.GOOGLE_CLIENT_ID = "YOUR_ACTUAL_CLIENT_ID_HERE";
   ```

3. **Important**: Add `js/google_config.js` to `.gitignore` to keep your client ID private:
   ```bash
   echo "js/google_config.js" >> .gitignore
   ```

### 5. Start Local Development Server

```bash
cd /home/rht/Projects/BakeGenuis-AI
python3 -m http.server 5501
```

### 6. Test Google Sign-In

1. Open `http://localhost:5501/html/login.html`
2. You should see a Google Sign-In button below the login form
3. Click it and sign in with your Google account

## Troubleshooting

### Button Not Visible
- Check browser console for errors
- Verify `GOOGLE_CLIENT_ID` is set correctly
- Ensure you're serving over HTTP (not file://)

### "Origin Mismatch" Error
- Add your exact localhost URL to Authorized JavaScript origins in Google Cloud Console
- Include the port number (e.g., `http://localhost:5501`)

### "Invalid Client" Error
- Double-check your client ID is correct
- Ensure the Google+ API is enabled in your project

### Ad-blocker Issues
- Some ad-blockers block Google scripts
- Temporarily disable ad-blockers for localhost testing

## Security Notes

- **Never commit your client ID** to version control
- The client ID is public and safe to use in frontend code
- Keep your OAuth consent screen configured appropriately
- Monitor your Google Cloud Console for unusual activity

## Production Deployment

When deploying to production:
1. Add your production domain to Authorized JavaScript origins
2. Update the OAuth consent screen with production details
3. Consider using environment variables for different environments

## Need Help?

- Check the [Google Identity Services documentation](https://developers.google.com/identity/gsi/web)
- Review the [OAuth 2.0 setup guide](https://developers.google.com/identity/protocols/oauth2)
- Open an issue in this repository for project-specific questions

---

**Happy coding! 🍰✨**
