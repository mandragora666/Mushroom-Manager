// API for managing wiki articles
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
        const { category, limit = 50, search } = req.query;
        
        let articles;
        if (search) {
          articles = await supabase.searchWiki(search);
        } else {
          articles = await supabase.getWikiArticles(category, parseInt(limit));
        }
        
        res.status(200).json(articles);
        break;

      case 'POST':
        const newArticle = await supabase.createWikiArticle(req.body);
        res.status(201).json(newArticle);
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Wiki API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
};