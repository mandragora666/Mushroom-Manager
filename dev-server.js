// Simple development server that simulates Vercel's behavior
const http = require('http');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const PORT = process.env.PORT || 3000;

// Load API functions from files
const loadApiFunction = (filePath) => {
  try {
    delete require.cache[require.resolve(filePath)];
    return require(filePath);
  } catch (error) {
    console.error(`Error loading API function ${filePath}:`, error.message);
    return null;
  }
};

// Mock fallback responses
const mockApiRoutes = {
  '/api/dashboard/stats': {
    activeProtocols: 2,
    mushroomSpecies: 5,
    inventoryItems: 12,
    cultures: 8,
    averageSuccessRate: 79,
    temperature: 22,
    humidity: 85,
    co2: 650,
    ventilation: 6,
    dataSource: 'dev-mock'
  },
  '/api/dashboard/activities': [
    {
      id: 1,
      type: 'harvest',
      description: 'Shiitake-Ernte abgeschlossen',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      icon: 'fas fa-hand-paper',
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'inoculation', 
      description: 'Neue Oyster-Kultur angelegt',
      time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      icon: 'fas fa-syringe',
      color: 'text-blue-600'
    }
  ]
};

const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = req.url;
  
  // Handle API routes
  if (url.startsWith('/api/')) {
    const urlWithoutQuery = url.split('?')[0];
    
    // Map API routes to their respective files
    const apiMap = {
      '/api/dashboard/stats': './api/dashboard/stats.js',
      '/api/dashboard/activities': './api/dashboard/activities.js',
      '/api/protocols': './api/protocols/index.js',
      '/api/wiki': './api/wiki/index.js',
      '/api/wiki/categories': './api/wiki/categories.js'
    };
    
    // Handle dynamic routes (like /api/protocols/[id] or /api/wiki/[slug])
    let apiFunction = null;
    let matchedRoute = null;
    
    // Try exact match first
    if (apiMap[urlWithoutQuery]) {
      matchedRoute = urlWithoutQuery;
      apiFunction = loadApiFunction(apiMap[urlWithoutQuery]);
    } else {
      // Try pattern matching for dynamic routes
      if (urlWithoutQuery.startsWith('/api/protocols/') && urlWithoutQuery !== '/api/protocols') {
        matchedRoute = '/api/protocols/[id]';
        apiFunction = loadApiFunction('./api/protocols/[id].js');
      } else if (urlWithoutQuery.startsWith('/api/wiki/') && urlWithoutQuery !== '/api/wiki' && urlWithoutQuery !== '/api/wiki/categories') {
        matchedRoute = '/api/wiki/[slug]';
        apiFunction = loadApiFunction('./api/wiki/[slug].js');
      }
    }
    
    if (apiFunction) {
      try {
        // Create mock request/response objects compatible with Vercel API
        const mockReq = {
          method: req.method,
          url: url,
          query: Object.fromEntries(new URLSearchParams(url.split('?')[1] || '')),
          body: null,
          headers: req.headers
        };
        
        // Create Vercel-compatible response object
        const mockRes = {
          status: (code) => {
            res.statusCode = code;
            return mockRes;
          },
          json: (data) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          },
          end: (data) => {
            res.end(data);
          },
          setHeader: (key, value) => {
            res.setHeader(key, value);
          }
        };
        
        // Handle request body for POST/PUT requests
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', async () => {
            try {
              mockReq.body = JSON.parse(body || '{}');
              await apiFunction(mockReq, mockRes);
            } catch (parseError) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Invalid JSON in request body' }));
            }
          });
          return;
        } else {
          // Handle GET, DELETE requests
          try {
            await apiFunction(mockReq, mockRes);
          } catch (error) {
            console.error('API execution error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error', details: error.message }));
          }
          return;
        }
      } catch (error) {
        console.error(`API error in ${matchedRoute}:`, error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error', details: error.message }));
        return;
      }
    }
    
    // Fallback to mock data if API function not found
    if (mockApiRoutes[urlWithoutQuery]) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(mockApiRoutes[urlWithoutQuery]));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'API endpoint not found' }));
    }
    return;
  }

  // Handle static files
  let filePath;
  if (url === '/' || url === '/index.html') {
    filePath = path.join(__dirname, 'public', 'index.html');
  } else {
    // Remove leading slash and serve from public directory
    filePath = path.join(__dirname, 'public', url.slice(1));
  }

  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // If file doesn't exist, serve index.html (SPA fallback)
      filePath = path.join(__dirname, 'public', 'index.html');
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('404 Not Found');
        return;
      }

      // Set content type based on file extension
      const ext = path.extname(filePath);
      let contentType = 'text/html';
      switch (ext) {
        case '.js':
          contentType = 'application/javascript';
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
        case '.jpeg':
          contentType = 'image/jpeg';
          break;
      }

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Development server running on http://0.0.0.0:${PORT}`);
  console.log(`Also available at http://localhost:${PORT}`);
  console.log('API endpoints available:');
  Object.keys(mockApiRoutes).forEach(route => {
    console.log(`  http://localhost:${PORT}${route}`);
  });
  console.log('New API endpoints:');
  console.log(`  http://localhost:${PORT}/api/protocols`);
  console.log(`  http://localhost:${PORT}/api/wiki`);
  console.log(`  http://localhost:${PORT}/api/wiki/categories`);
  console.log('Server is listening on all network interfaces (0.0.0.0)');
});