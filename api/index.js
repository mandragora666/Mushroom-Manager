// Vercel Serverless Function for Mushroom Manager Enhanced
// Consolidated API handler for all endpoints to avoid function limit

const fs = require('fs');
const path = require('path');
const url = require('url');

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.env.local' });
}

// In-memory data store for demo (replace with Supabase in production)
let protocols = [
  {
    id: '1',
    title: 'Austernpilz Zucht #1',
    species: 'Pleurotus ostreatus',
    batch_name: 'AP-2024-001',
    start_date: '2024-10-01',
    substrate_type: 'Weizenstroh',
    substrate_weight: 2.5,
    inoculation_method: 'Flüssigkultur',
    temperature_target: 20,
    humidity_target: 90,
    co2_target: 1000,
    growth_stage: 'fruiting',
    status: 'active',
    notes: 'Entwicklung verläuft planmäßig. Erste Primordien sichtbar.',
    photos: [],
    created_at: '2024-10-01T10:00:00Z',
    updated_at: '2024-10-03T09:15:00Z'
  },
  {
    id: '2',
    title: 'Shiitake Experiment',
    species: 'Lentinula edodes',
    batch_name: 'SH-2024-002',
    start_date: '2024-09-20',
    substrate_type: 'Buchenholzspäne',
    substrate_weight: 3.0,
    inoculation_method: 'Kornbrut',
    temperature_target: 16,
    humidity_target: 85,
    co2_target: 800,
    growth_stage: 'harvest',
    status: 'completed',
    notes: 'Erfolgreiche erste Ernte: 280g. Zweite Flush eingeleitet.',
    photos: [],
    created_at: '2024-09-20T14:30:00Z',
    updated_at: '2024-10-02T11:45:00Z'
  },
  {
    id: '3',
    title: 'King Oyster Test',
    species: 'Pleurotus eryngii',
    batch_name: 'KO-2024-003',
    start_date: '2024-10-02',
    substrate_type: 'Sägespäne Mix',
    substrate_weight: 4.0,
    inoculation_method: 'Agar-Transfer',
    temperature_target: 18,
    humidity_target: 95,
    co2_target: 1200,
    growth_stage: 'colonization',
    status: 'active',
    notes: 'Myzel breitet sich gut aus. Kein Kontaminationszeichen.',
    photos: [],
    created_at: '2024-10-02T16:20:00Z',
    updated_at: '2024-10-03T08:30:00Z'
  }
];

let mushroomSpecies = [
  {
    id: '1',
    name: 'Austernpilz',
    scientific_name: 'Pleurotus ostreatus',
    difficulty_level: 'easy',
    optimal_temperature_min: 15,
    optimal_temperature_max: 25,
    optimal_humidity_min: 85,
    optimal_humidity_max: 95,
    growth_time_days: 14,
    description: 'Ideal für Anfänger, robust und ertragreich'
  },
  {
    id: '2',
    name: 'Shiitake',
    scientific_name: 'Lentinula edodes',
    difficulty_level: 'medium',
    optimal_temperature_min: 12,
    optimal_temperature_max: 18,
    optimal_humidity_min: 80,
    optimal_humidity_max: 90,
    growth_time_days: 21,
    description: 'Beliebter Speisepilz mit medizinischen Eigenschaften'
  }
];

let wikiArticles = [
  {
    id: '1',
    title: 'Grundlagen der Sterilisation',
    slug: 'grundlagen-sterilisation',
    category: 'Techniken',
    summary: 'Wichtige Sterilisationsmethoden für die Pilzzucht',
    content: '# Sterilisation in der Pilzzucht\\n\\nSterilisation ist der Schlüssel zum Erfolg...',
    tags: ['sterilisation', 'hygiene', 'grundlagen'],
    author: 'Mushroom Manager',
    status: 'published',
    view_count: 127,
    created_at: '2024-10-01T09:00:00Z'
  }
];

// Helper functions
function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 5);
}

function getDashboardStats() {
  const activeProtocols = protocols.filter(p => p.status === 'active').length;
  const completedProtocols = protocols.filter(p => p.status === 'completed').length;
  const failedProtocols = protocols.filter(p => p.status === 'failed').length;
  
  return {
    activeProtocols,
    mushroomSpecies: mushroomSpecies.length,
    inventoryItems: 15,
    cultures: 8,
    averageSuccessRate: completedProtocols > 0 ? Math.round((completedProtocols / protocols.length) * 100) : 85,
    temperature: 21 + Math.random() * 2,
    humidity: 85 + Math.random() * 10,
    totalProtocols: protocols.length,
    completedProtocols,
    failedProtocols
  };
}

// Get static file content
function getStaticFile(filePath) {
  try {
    const fullPath = path.join(process.cwd(), 'public', filePath);
    if (fs.existsSync(fullPath)) {
      return fs.readFileSync(fullPath);
    }
    return null;
  } catch (error) {
    console.error('Error reading static file:', error);
    return null;
  }
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };
  return types[ext] || 'text/plain';
}

// Main Vercel handler
module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  console.log(`[${new Date().toISOString()}] ${req.method} ${pathname}`);

  try {
    // Handle API routes
    if (pathname.startsWith('/api/')) {
      
      // Protocols API
      if (pathname === '/api/protocols') {
        if (req.method === 'GET') {
          res.status(200).json(protocols);
          return;
        } else if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk.toString());
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const newProtocol = {
                id: generateId(),
                ...data,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                status: 'active'
              };
              protocols.push(newProtocol);
              res.status(201).json(newProtocol);
            } catch (error) {
              res.status(400).json({ error: 'Invalid JSON' });
            }
          });
          return;
        }
      }
      
      // Dashboard API
      if (pathname === '/api/dashboard/stats') {
        res.status(200).json(getDashboardStats());
        return;
      }
      
      // Mushroom Species API
      if (pathname === '/api/mushroom-species') {
        res.status(200).json(mushroomSpecies);
        return;
      }
      
      // Wiki API
      if (pathname === '/api/wiki') {
        res.status(200).json(wikiArticles);
        return;
      }
      
      if (pathname === '/api/wiki/categories') {
        res.status(200).json([
          { name: 'Pilzarten', description: 'Verschiedene Pilzarten', count: mushroomSpecies.length },
          { name: 'Techniken', description: 'Zucht-Techniken', count: wikiArticles.length }
        ]);
        return;
      }

      // Default API error
      res.status(404).json({ error: 'API endpoint not found', path: pathname });
      return;
    }

    // Handle static files
    if (pathname.startsWith('/static/') || pathname.includes('.')) {
      let filePath = pathname.startsWith('/static/') 
        ? pathname.substring('/static/'.length)
        : pathname.substring(1);
      
      if (pathname.startsWith('/static/')) {
        filePath = 'static/' + filePath;
      }

      const fileContent = getStaticFile(filePath);
      if (fileContent) {
        const contentType = getContentType(filePath);
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        res.status(200).send(fileContent);
        return;
      }
    }

    // Serve main HTML for all other routes
    const indexPath = path.join(process.cwd(), 'public', 'index.html');
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(content);
    } else {
      res.status(404).send('Application not found');
    }

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
};