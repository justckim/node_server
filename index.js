// Create server using purely Node modules

const http = require('http');
const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
  // Build file path (make file path dynamic)
  // If req.url = '/', then filePath = ./index.html
  // Else, req.url 
  let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);

  // Extension of file
  let extname = path.extname(filePath);

  // Set initial content type
  let contentType = 'text/html';

  // Check extension and set content type 
  switch(extname) {
    case '.js': 
      contentType: 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
  }

  // Read file - this will also work for additional files (CSS, JS) that your html files are linked to. Browser will make additional HTTP requests after html file is retrieved for CSS/JS  
  fs.readFile(filePath, (err, content) => {
    // Error is an object with property containing error code
    if(err) {
      if(err.code == 'ENOENT') {
        // Page not found
        fs.readFile(path.join(__dirname, 'public', '404.html'), (err, content) => {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content, 'utf8');
        })
      } else {
        // Some sever error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`); 
      }
    } else {
      // Success - pass in contentType variable to writeHead to make dynamic
      res.writeHead(200, { 'Content-type': contentType});
      res.end(content, 'utf8')
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));