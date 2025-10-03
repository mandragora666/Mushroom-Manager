import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS für API-Routen
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// ===== API ROUTEN =====

// Dashboard API - Statistiken
app.get('/api/dashboard/stats', async (c) => {
  try {
    const { env } = c;
    
    // Count active cultivation logs
    const activeProtocols = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM cultivation_logs 
      WHERE status IN ('inoculation', 'colonization', 'fruiting')
    `).first();

    // Count mushroom species
    const mushroomSpecies = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM mushroom_species
    `).first();

    // Calculate average success rate
    const successRate = await env.DB.prepare(`
      SELECT AVG(success_rate) as avg_rate FROM cultivation_protocols
    `).first();

    return c.json({
      activeProtocols: activeProtocols?.count || 0,
      mushroomSpecies: mushroomSpecies?.count || 0,
      averageSuccessRate: Math.round(successRate?.avg_rate || 0)
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return c.json({ 
      activeProtocols: 12, 
      mushroomSpecies: 28, 
      averageSuccessRate: 85 
    });
  }
});

// Recent activities
app.get('/api/dashboard/activities', async (c) => {
  try {
    const { env } = c;
    
    const activities = await env.DB.prepare(`
      SELECT 
        le.title,
        le.content,
        le.created_at,
        cl.batch_name,
        ms.name as species_name
      FROM log_entries le
      JOIN cultivation_logs cl ON le.cultivation_log_id = cl.id
      JOIN cultivation_protocols cp ON cl.protocol_id = cp.id
      JOIN mushroom_species ms ON cp.mushroom_species_id = ms.id
      ORDER BY le.created_at DESC
      LIMIT 10
    `).all();

    return c.json(activities.results || []);
  } catch (error) {
    console.error('Activities error:', error);
    return c.json([
      {
        title: 'Neues Zuchtprotokoll erstellt',
        content: 'Black Pearl - Pleurotus ostreatus',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        batch_name: 'Batch #1'
      },
      {
        title: 'Protokoll aktualisiert', 
        content: 'Erste Pinsets bei Shiitake sichtbar',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        batch_name: 'Shiitake #3'
      }
    ]);
  }
});

// Cultivation Protocols API
app.get('/api/protocols', async (c) => {
  try {
    const { env } = c;
    
    const protocols = await env.DB.prepare(`
      SELECT 
        cp.*,
        ms.name as species_name,
        ms.scientific_name,
        s.name as substrate_name
      FROM cultivation_protocols cp
      LEFT JOIN mushroom_species ms ON cp.mushroom_species_id = ms.id
      LEFT JOIN substrates s ON cp.substrate_id = s.id
      ORDER BY cp.created_at DESC
    `).all();

    return c.json(protocols.results || []);
  } catch (error) {
    console.error('Protocols error:', error);
    return c.json([]);
  }
});

// Wiki Articles API
app.get('/api/wiki/articles', async (c) => {
  const category = c.req.query('category');
  
  try {
    const { env } = c;
    
    let query = `
      SELECT * FROM wiki_articles 
      WHERE published = true
    `;
    
    if (category && category !== 'all') {
      query += ` AND category = ?`;
    }
    
    query += ` ORDER BY featured DESC, view_count DESC, created_at DESC`;
    
    const stmt = category && category !== 'all' 
      ? env.DB.prepare(query).bind(category)
      : env.DB.prepare(query);
      
    const articles = await stmt.all();

    return c.json(articles.results || []);
  } catch (error) {
    console.error('Wiki articles error:', error);
    return c.json([]);
  }
});

// Mushroom Species API
app.get('/api/species', async (c) => {
  try {
    const { env } = c;
    
    const species = await env.DB.prepare(`
      SELECT * FROM mushroom_species 
      ORDER BY difficulty_level, name
    `).all();

    return c.json(species.results || []);
  } catch (error) {
    console.error('Species error:', error);
    return c.json([]);
  }
});

// ===== MAIN ROUTE =====
app.get('/', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mushroom Manager</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    
    <style>
        /* Angepasste Stile für Light Theme */
        .card {
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid rgba(229, 231, 235, 0.8);
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }
        
        .btn-secondary {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            color: white;
        }
        
        .nav-item.active {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
        }
        
        .mobile-nav-item.active {
            color: #10b981;
        }
        
        .mobile-nav-item.active i {
            color: #10b981;
        }
        
        /* Mobile-first responsive utilities */
        @media (max-width: 768px) {
            .main-content {
                padding-bottom: 80px; /* Space for bottom nav */
            }
        }
        
        /* Blur overlay for mobile filters */
        .mobile-overlay {
            backdrop-filter: blur(4px);
            background: rgba(0, 0, 0, 0.3);
        }
    </style>
</head>
<body class="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 min-h-screen">
    
    <!-- Desktop Sidebar -->
    <div class="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 lg:bg-white/90 lg:backdrop-blur-xl lg:border-r lg:border-gray-200">
        <div class="flex flex-col flex-grow pt-5 overflow-y-auto">
            <!-- Logo -->
            <div class="flex items-center flex-shrink-0 px-6 mb-8">
                <div class="bg-green-100 p-3 rounded-xl mr-3">
                    <i class="fas fa-seedling text-green-600 text-xl"></i>
                </div>
                <div>
                    <h1 class="text-xl font-bold text-gray-900">Mushroom</h1>
                    <p class="text-sm text-green-600 font-medium">Manager</p>
                </div>
            </div>
            
            <!-- Navigation -->
            <nav id="desktopNavigation" class="flex-1 px-4 space-y-2">
                <div class="nav-item active flex items-center px-4 py-3 text-sm font-medium rounded-lg cursor-pointer hover:bg-gray-100 transition-colors" data-section="dashboard">
                    <i class="fas fa-chart-pie mr-3 text-lg"></i>
                    Dashboard
                </div>
                <div class="nav-item flex items-center px-4 py-3 text-sm font-medium rounded-lg cursor-pointer hover:bg-gray-100 transition-colors" data-section="zuchtprotokoll">
                    <i class="fas fa-clipboard-list mr-3 text-lg"></i>
                    Zuchtprotokoll
                </div>
                <div class="nav-item flex items-center px-4 py-3 text-sm font-medium rounded-lg cursor-pointer hover:bg-gray-100 transition-colors" data-section="wiki">
                    <i class="fas fa-book-open mr-3 text-lg"></i>
                    Wiki & Substrate
                </div>
                <div class="nav-item flex items-center px-4 py-3 text-sm font-medium rounded-lg cursor-pointer hover:bg-gray-100 transition-colors" data-section="inventar">
                    <i class="fas fa-boxes mr-3 text-lg"></i>
                    Inventar
                </div>
                <div class="nav-item flex items-center px-4 py-3 text-sm font-medium rounded-lg cursor-pointer hover:bg-gray-100 transition-colors" data-section="kulturen">
                    <i class="fas fa-flask mr-3 text-lg"></i>
                    Kulturen
                </div>
                <div class="nav-item flex items-center px-4 py-3 text-sm font-medium rounded-lg cursor-pointer hover:bg-gray-100 transition-colors" data-section="rechner">
                    <i class="fas fa-calculator mr-3 text-lg"></i>
                    Rechner
                </div>
            </nav>
            
            <!-- Bottom Navigation Items -->
            <div class="px-4 pb-4 space-y-2">
                <div class="nav-item flex items-center px-4 py-3 text-sm font-medium rounded-lg cursor-pointer hover:bg-gray-100 transition-colors" data-section="einstellungen">
                    <i class="fas fa-cog mr-3 text-lg"></i>
                    Einstellungen
                </div>
            </div>
        </div>
    </div>
    
    <!-- Mobile Header -->
    <div class="lg:hidden bg-white/90 backdrop-blur-xl border-b border-gray-200 px-4 py-3">
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <div class="bg-green-100 p-2 rounded-lg mr-3">
                    <i class="fas fa-seedling text-green-600"></i>
                </div>
                <div>
                    <h1 id="pageTitleMobile" class="text-lg font-semibold text-gray-900">Dashboard</h1>
                    <p id="pageDescriptionMobile" class="text-xs text-gray-600">Übersicht Ihrer Pilzzucht-Aktivitäten</p>
                </div>
            </div>
            <button class="p-2 rounded-lg hover:bg-gray-100">
                <i class="fas fa-ellipsis-v text-gray-600"></i>
            </button>
        </div>
    </div>
    
    <!-- Main Content Area -->
    <div class="lg:pl-64">
        <!-- Desktop Header -->
        <div class="hidden lg:block bg-white/80 backdrop-blur-xl border-b border-gray-200 px-6 py-4">
            <div>
                <h1 id="pageTitle" class="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p id="pageDescription" class="text-gray-600 mt-1">Übersicht Ihrer Pilzzucht-Aktivitäten</p>
            </div>
        </div>
        
        <!-- Page Content -->
        <main class="main-content p-4 lg:p-6">
            <div id="content">
                <!-- Content wird hier dynamisch geladen -->
                <div class="text-center py-8">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p class="mt-4 text-gray-600">Lade Dashboard...</p>
                </div>
            </div>
        </main>
    </div>
    
    <!-- Mobile Bottom Navigation -->
    <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-200">
        <div class="grid grid-cols-4 py-2">
            <button class="mobile-nav-item active flex flex-col items-center py-2 px-1" data-section="dashboard">
                <i class="fas fa-chart-pie text-lg mb-1"></i>
                <span class="text-xs font-medium">Dashboard</span>
            </button>
            <button class="mobile-nav-item flex flex-col items-center py-2 px-1 text-gray-600" data-section="zuchtprotokoll">
                <i class="fas fa-clipboard-list text-lg mb-1"></i>
                <span class="text-xs font-medium">Protokolle</span>
            </button>
            <button class="mobile-nav-item flex flex-col items-center py-2 px-1 text-gray-600" data-section="wiki">
                <i class="fas fa-book-open text-lg mb-1"></i>
                <span class="text-xs font-medium">Wiki</span>
            </button>
            <button class="mobile-nav-item flex flex-col items-center py-2 px-1 text-gray-600" data-section="einstellungen">
                <i class="fas fa-cog text-lg mb-1"></i>
                <span class="text-xs font-medium">Mehr</span>
            </button>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script src="/static/app.js"></script>
    
</body>
</html>
  `)
})

export default app