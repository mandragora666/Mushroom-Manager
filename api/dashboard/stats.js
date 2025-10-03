// API route for dashboard stats
module.exports = (req, res) => {
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

  // Return mock dashboard statistics
  res.status(200).json({
    activeProtocols: 2,
    mushroomSpecies: 5,
    inventoryItems: 12,
    cultures: 8,
    averageSuccessRate: 79,
    temperature: 22,
    humidity: 85,
    co2: 650,
    ventilation: 6
  });
};