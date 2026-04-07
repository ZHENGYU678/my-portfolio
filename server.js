const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8004;

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm',
    '.pdf': 'application/pdf'
};

http.createServer((req, res) => {
    // Log requests
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

    // Decode URI to handle Chinese characters in paths
    let filePath = '.' + decodeURIComponent(req.url);
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                console.log(`${new Date().toISOString()} - 404 Not Found: ${filePath}`);
                res.writeHead(404);
                res.end('404 Not Found');
            } else {
                console.log(`${new Date().toISOString()} - 500 Error: ${error.code} for ${filePath}`);
                res.writeHead(500);
                res.end('500 Internal Server Error: ' + error.code);
            }
        } else {
            console.log(`${new Date().toISOString()} - 200 OK: ${filePath}`);
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
}).listen(PORT);

console.log(`Server running at http://localhost:${PORT}/`);
