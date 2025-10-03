// API route for dashboard stats
const supabase = require('../../lib/supabase');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Try to get real stats from Supabase
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      const stats = await supabase.getDashboardStats();
      
      res.status(200).json({
        activeProtocols: stats.activeProtocols,
        totalProtocols: stats.totalProtocols,
        recentEntries: stats.recentEntries,
        mushroomSpecies: 5, // Could be calculated from distinct species
        inventoryItems: 12, // Placeholder - implement later
        averageSuccessRate: 79,
        temperature: 22,
        humidity: 85,
        co2: 650,
        ventilation: 6,
        dataSource: 'supabase'
      });
    } else {
      // Fallback to mock data if Supabase not configured
      res.status(200).json({
        activeProtocols: 2,
        totalProtocols: 5,
        recentEntries: 8,
        mushroomSpecies: 5,
        inventoryItems: 12,
        cultures: 8,
        averageSuccessRate: 79,
        temperature: 22,
        humidity: 85,
        co2: 650,
        ventilation: 6,
        dataSource: 'mock'
      });
    }
  } catch (error) {
    console.error('Dashboard stats error:', error);
    // Return mock data on error
    res.status(200).json({
      activeProtocols: 2,
      totalProtocols: 5,
      recentEntries: 8,
      mushroomSpecies: 5,
      inventoryItems: 12,
      cultures: 8,
      averageSuccessRate: 79,
      temperature: 22,
      humidity: 85,
      co2: 650,
      ventilation: 6,
      dataSource: 'fallback',
      error: error.message
    });
  }
};