// API route for recent activities
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

  // Return mock recent activities
  res.status(200).json([
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
    },
    {
      title: 'Ernteprotokoll',
      content: 'Erste Ernte von King Oyster erfolgreich',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      batch_name: 'King Oyster #2'
    }
  ]);
};