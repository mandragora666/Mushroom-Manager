// API for managing breeding protocols
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

  try {
    switch (req.method) {
      case 'GET':
        const { limit = 50, offset = 0 } = req.query;
        const protocols = await supabase.getProtocols(parseInt(limit), parseInt(offset));
        res.status(200).json(protocols);
        break;

      case 'POST':
        const newProtocol = await supabase.createProtocol(req.body);
        res.status(201).json(newProtocol);
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Protocols API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
};