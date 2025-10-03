// Supabase Client Configuration
// This will work both in browser and Node.js (Vercel Functions)

class SupabaseClient {
  constructor() {
    this.supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    this.supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    this.baseHeaders = {
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
      'Content-Type': 'application/json',
    };
  }

  // Generic fetch wrapper
  async request(endpoint, options = {}) {
    const url = `${this.supabaseUrl}/rest/v1/${endpoint}`;
    
    const config = {
      headers: this.baseHeaders,
      ...options,
      headers: {
        ...this.baseHeaders,
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Supabase error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // PROTOCOLS METHODS
  async getProtocols(limit = 50, offset = 0) {
    return this.request(`protocols?select=*&order=created_at.desc&limit=${limit}&offset=${offset}`);
  }

  async getProtocol(id) {
    const result = await this.request(`protocols?select=*&id=eq.${id}`);
    return result[0] || null;
  }

  async createProtocol(data) {
    return this.request('protocols', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProtocol(id, data) {
    return this.request(`protocols?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteProtocol(id) {
    return this.request(`protocols?id=eq.${id}`, {
      method: 'DELETE',
    });
  }

  // PROTOCOL ENTRIES METHODS
  async getProtocolEntries(protocolId) {
    return this.request(`protocol_entries?select=*&protocol_id=eq.${protocolId}&order=entry_date.desc`);
  }

  async createProtocolEntry(data) {
    return this.request('protocol_entries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProtocolEntry(id, data) {
    return this.request(`protocol_entries?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteProtocolEntry(id) {
    return this.request(`protocol_entries?id=eq.${id}`, {
      method: 'DELETE',
    });
  }

  // WIKI METHODS
  async getWikiArticles(category = null, limit = 50) {
    let endpoint = 'wiki_articles?select=*&status=eq.published&order=updated_at.desc';
    if (category) {
      endpoint += `&category=eq.${encodeURIComponent(category)}`;
    }
    endpoint += `&limit=${limit}`;
    return this.request(endpoint);
  }

  async getWikiArticle(slug) {
    const result = await this.request(`wiki_articles?select=*&slug=eq.${slug}&status=eq.published`);
    if (result[0]) {
      // Increment view count
      await this.request(`wiki_articles?slug=eq.${slug}`, {
        method: 'PATCH',
        body: JSON.stringify({ view_count: result[0].view_count + 1 }),
      });
    }
    return result[0] || null;
  }

  async createWikiArticle(data) {
    // Auto-generate slug from title
    if (!data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[äöüß]/g, (char) => ({
          'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss'
        })[char] || char)
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    
    return this.request('wiki_articles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateWikiArticle(id, data) {
    return this.request(`wiki_articles?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteWikiArticle(id) {
    return this.request(`wiki_articles?id=eq.${id}`, {
      method: 'DELETE',
    });
  }

  async getWikiCategories() {
    return this.request('wiki_categories?select=*&order=name.asc');
  }

  async searchWiki(query) {
    const encodedQuery = encodeURIComponent(`%${query}%`);
    return this.request(
      `wiki_articles?select=*&status=eq.published&or=(title.ilike.${encodedQuery},content.ilike.${encodedQuery},summary.ilike.${encodedQuery})`
    );
  }

  // DASHBOARD / STATISTICS METHODS
  async getDashboardStats() {
    const [protocols, activeProtocols, recentEntries] = await Promise.all([
      this.request('protocols?select=count'),
      this.request('protocols?select=count&status=eq.active'),
      this.request('protocol_entries?select=count&entry_date=gte.' + new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    ]);

    return {
      totalProtocols: protocols.length > 0 ? protocols[0].count : 0,
      activeProtocols: activeProtocols.length > 0 ? activeProtocols[0].count : 0,
      recentEntries: recentEntries.length > 0 ? recentEntries[0].count : 0,
      // Add more stats as needed
    };
  }
}

// Export singleton instance
const supabase = new SupabaseClient();

// For Node.js (Vercel functions)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = supabase;
}

// For browser
if (typeof window !== 'undefined') {
  window.supabase = supabase;
}