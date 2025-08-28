const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8080;

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webmanifest': 'application/manifest+json'
};

const server = http.createServer((req, res) => {
    // Parse URL and get file path
    let filePath = '.' + req.url;
    
    // Default to index.html if requesting root
    if (filePath === './') {
        filePath = './index.html';
    }
    
    // Get file extension for MIME type
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeType = mimeTypes[extname] || 'application/octet-stream';
    
    // Read and serve the file
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // File not found
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File Not Found</h1><p>The requested file was not found.</p>');
            } else {
                // Server error
                res.writeHead(500);
                res.end('Sorry, there was an error: ' + error.code + '..\n');
            }
        } else {
            // Success - add cache headers for static assets
            const headers = { 'Content-Type': mimeType };
            if (extname === '.css' || extname === '.js' || extname === '.png' || extname === '.jpg' || extname === '.ico') {
                headers['Cache-Control'] = 'public, max-age=86400'; // 1 day cache
            }
            res.writeHead(200, headers);
            res.end(content, 'utf-8');
        }
    });
});

server.listen(port, () => {
    console.log(`🍰 BakeGenius.AI Server running at http://localhost:${port}/`);
    console.log('Available pages:');
    console.log(`  • Home: http://localhost:${port}/`);
    console.log(`  • Customize: http://localhost:${port}/html/customize.html`);
    console.log(`  • Scale Recipe: http://localhost:${port}/scale.html`);
    console.log(`  • About Us: http://localhost:${port}/html/about.html`);
    console.log(`  • Convert Recipe: http://localhost:${port}/html/convert.html`);
    console.log('\nPress Ctrl+C to stop the server');
    
    // Try to open browser automatically (Windows)
    const { exec } = require('child_process');
    exec(`start http://localhost:${port}`, (error) => {
        if (error) {
            console.log('\nManually open your browser and go to http://localhost:8080');
        }
    });
});
