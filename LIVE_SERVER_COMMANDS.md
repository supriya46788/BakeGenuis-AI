# 🌐 Live Server Commands & Usage Guide

## VS Code Live Server Commands:

### Method 1: Right-Click Method
1. **Open your project folder** in VS Code
2. **Right-click** on `privacypolicy.html` or `helpcenter.html`
3. **Select**: "Open with Live Server"
4. **Browser will automatically open** at `http://127.0.0.1:5500/privacypolicy.html`

### Method 2: Command Palette
1. **Press `Ctrl+Shift+P`** (Windows) or `Cmd+Shift+P` (Mac)
2. **Type**: `Live Server: Open with Live Server`
3. **Press Enter**

### Method 3: Status Bar
1. **Open any HTML file**
2. **Look at bottom-right** of VS Code
3. **Click "Go Live"** button in status bar

### Method 4: Keyboard Shortcut
1. **Open HTML file**
2. **Press `Alt+L Alt+O`** (default shortcut)

## 🔧 Live Server Controls:

### Start Server:
- **Right-click HTML file** → "Open with Live Server"
- **Command Palette** → "Live Server: Open with Live Server"
- **Click "Go Live"** in status bar

### Stop Server:
- **Click "Port: 5500"** in status bar (changes to "Go Live" when stopped)
- **Command Palette** → "Live Server: Stop Live Server"
- **Press `Alt+L Alt+C`**

## 📱 Testing Mobile View Steps:

### After Starting Live Server:
1. **Live Server opens** → `http://127.0.0.1:5500/privacypolicy.html`
2. **Press F12** to open DevTools
3. **Click device toggle** 📱
4. **Select mobile device** or set custom width

### Quick Test Commands in Browser:
```javascript
// Open DevTools Console and run:
// Simulate iPhone 12 Pro
document.body.style.width = '390px';

// Simulate Samsung Galaxy
document.body.style.width = '360px';

// Simulate tablet
document.body.style.width = '768px';
```

## 🎯 Direct URLs to Test:

Once Live Server is running, test these URLs:
- **Privacy Policy**: `http://127.0.0.1:5500/privacypolicy.html`
- **Help Center**: `http://127.0.0.1:5500/helpcenter.html`
- **Home Page**: `http://127.0.0.1:5500/index.html`

## ⚙️ Live Server Settings (Optional):

### Custom Port (if 5500 is busy):
1. **File** → **Preferences** → **Settings**
2. **Search**: `liveServer.settings.port`
3. **Change** to different port (e.g., 3000)

### Auto-refresh Settings:
1. **Settings** → **Search**: `liveServer.settings.donotShowInfoMsg`
2. **Check** to disable popup messages

## 🚨 Alternative if Live Server Doesn't Work:

### Python HTTP Server:
1. **Open Terminal** in VS Code (`Ctrl+``)
2. **Navigate to project**:
   ```bash
   cd "d:\BakeGenuis-AI"
   ```
3. **Start server**:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
4. **Open**: `http://localhost:8000/privacypolicy.html`

### Node.js http-server:
1. **Install globally**:
   ```bash
   npm install -g http-server
   ```
2. **Navigate to project**:
   ```bash
   cd "d:\BakeGenuis-AI"
   ```
3. **Start server**:
   ```bash
   http-server
   ```
4. **Open**: `http://localhost:8080/privacypolicy.html`

## 📋 Quick Checklist:

- [ ] Install Live Server extension
- [ ] Open HTML file in VS Code
- [ ] Right-click → "Open with Live Server"
- [ ] Browser opens automatically
- [ ] Press F12 for DevTools
- [ ] Click device toggle 📱
- [ ] Test different screen sizes
- [ ] Check footer responsiveness

## 🔥 Pro Tips:

1. **Auto-reload**: Live Server automatically refreshes when you save files
2. **Multiple files**: You can test different HTML files by changing the URL
3. **Network access**: Use `http://[your-ip]:5500` to test on mobile devices on same network
4. **Hot reload**: Changes to CSS/HTML automatically refresh the browser