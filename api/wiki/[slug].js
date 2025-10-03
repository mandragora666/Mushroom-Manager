// API for managing individual wiki articles by slug
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

  // Extract slug from URL path
  const pathParts = req.url.split('/');
  const slug = pathParts[pathParts.length - 1];

  if (!slug || slug === '[slug].js') {
    res.status(400).json({ error: 'Article slug is required' });
    return;
  }

  try {
    switch (req.method) {
      case 'GET':
        const article = await supabase.getWikiArticle(slug);
        if (!article) {
          res.status(404).json({ error: 'Article not found' });
          return;
        }
        res.status(200).json(article);
        break;

      case 'PUT':
      case 'PATCH':
        // Find article by slug first to get ID
        const existingArticle = await supabase.getWikiArticle(slug);
        if (!existingArticle) {
          res.status(404).json({ error: 'Article not found' });
          return;
        }
        
        const updatedArticle = await supabase.updateWikiArticle(existingArticle.id, req.body);
        res.status(200).json(updatedArticle);
        break;

      case 'DELETE':
        // Find article by slug first to get ID
        const articleToDelete = await supabase.getWikiArticle(slug);
        if (!articleToDelete) {
          res.status(404).json({ error: 'Article not found' });
          return;
        }
        
        await supabase.deleteWikiArticle(articleToDelete.id);
        res.status(204).end();
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Wiki article API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
};