// API for managing individual protocols
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

  // Extract ID from URL path
  const pathParts = req.url.split('/');
  const id = pathParts[pathParts.length - 1];

  if (!id || id === '[id].js') {
    res.status(400).json({ error: 'Protocol ID is required' });
    return;
  }

  try {
    switch (req.method) {
      case 'GET':
        const protocol = await supabase.getProtocol(id);
        if (!protocol) {
          res.status(404).json({ error: 'Protocol not found' });
          return;
        }
        res.status(200).json(protocol);
        break;

      case 'PUT':
      case 'PATCH':
        const updatedProtocol = await supabase.updateProtocol(id, req.body);
        res.status(200).json(updatedProtocol);
        break;

      case 'DELETE':
        await supabase.deleteProtocol(id);
        res.status(204).end();
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Protocol API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
};