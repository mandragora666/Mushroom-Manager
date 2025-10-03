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

    const text = await response.text();
    if (!text) {
      return null; // Handle empty response
    }
    
    try {
      return JSON.parse(text);
    } catch (e) {
      throw new Error(`Invalid JSON response: ${text}`);
    }
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
    const result = await this.request('protocols', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Prefer': 'return=representation'
      }
    });
    return Array.isArray(result) ? result[0] : result;
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
    
    const result = await this.request('wiki_articles', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Prefer': 'return=representation'
      }
    });
    return Array.isArray(result) ? result[0] : result;
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

  // MUSHROOM SPECIES METHODS
  async getMushroomSpecies(activeOnly = true) {
    let endpoint = 'mushroom_species?select=*&order=name.asc';
    if (activeOnly) {
      endpoint += '&is_active=eq.true';
    }
    return this.request(endpoint);
  }

  async getMushroomSpeciesById(id) {
    const result = await this.request(`mushroom_species?select=*&id=eq.${id}`);
    return result[0] || null;
  }

  async createMushroomSpecies(data) {
    const result = await this.request('mushroom_species', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Prefer': 'return=representation'
      }
    });
    return Array.isArray(result) ? result[0] : result;
  }

  async updateMushroomSpecies(id, data) {
    return this.request(`mushroom_species?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // SUBSTRATE RECIPES METHODS
  async getSubstrateRecipes(activeOnly = true) {
    let endpoint = 'substrate_recipes?select=*,substrate_ingredients(*)&order=name.asc';
    if (activeOnly) {
      endpoint += '&is_active=eq.true';
    }
    return this.request(endpoint);
  }

  async getSubstrateRecipeById(id) {
    const result = await this.request(`substrate_recipes?select=*,substrate_ingredients(*)&id=eq.${id}`);
    return result[0] || null;
  }

  async createSubstrateRecipe(data) {
    const result = await this.request('substrate_recipes', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Prefer': 'return=representation'
      }
    });
    return Array.isArray(result) ? result[0] : result;
  }

  async updateSubstrateRecipe(id, data) {
    return this.request(`substrate_recipes?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // SUBSTRATE INGREDIENTS METHODS
  async getSubstrateIngredients(recipeId) {
    return this.request(`substrate_ingredients?select=*&recipe_id=eq.${recipeId}&order=sort_order.asc`);
  }

  async createSubstrateIngredient(data) {
    return this.request('substrate_ingredients', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Prefer': 'return=representation'
      }
    });
  }

  async updateSubstrateIngredient(id, data) {
    return this.request(`substrate_ingredients?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteSubstrateIngredient(id) {
    return this.request(`substrate_ingredients?id=eq.${id}`, {
      method: 'DELETE',
    });
  }

  // INOCULATION METHODS
  async getInoculationMethods(activeOnly = true) {
    let endpoint = 'inoculation_methods?select=*&order=name.asc';
    if (activeOnly) {
      endpoint += '&is_active=eq.true';
    }
    return this.request(endpoint);
  }

  async getInoculationMethodById(id) {
    const result = await this.request(`inoculation_methods?select=*&id=eq.${id}`);
    return result[0] || null;
  }

  async createInoculationMethod(data) {
    const result = await this.request('inoculation_methods', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Prefer': 'return=representation'
      }
    });
    return Array.isArray(result) ? result[0] : result;
  }

  async updateInoculationMethod(id, data) {
    return this.request(`inoculation_methods?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // GROWTH PHASES METHODS
  async getGrowthPhases() {
    return this.request('growth_phases?select=*&is_active=eq.true&order=phase_order.asc');
  }

  async getGrowthPhaseById(id) {
    const result = await this.request(`growth_phases?select=*&id=eq.${id}`);
    return result[0] || null;
  }

  async createGrowthPhase(data) {
    const result = await this.request('growth_phases', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Prefer': 'return=representation'
      }
    });
    return Array.isArray(result) ? result[0] : result;
  }

  async updateGrowthPhase(id, data) {
    return this.request(`growth_phases?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // DASHBOARD / STATISTICS METHODS
  async getDashboardStats() {
    const [protocols, activeProtocols, recentEntries, speciesCount, recipesCount] = await Promise.all([
      this.request('protocols?select=count'),
      this.request('protocols?select=count&status=eq.active'),
      this.request('protocol_entries?select=count&entry_date=gte.' + new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      this.request('mushroom_species?select=count&is_active=eq.true'),
      this.request('substrate_recipes?select=count&is_active=eq.true'),
    ]);

    return {
      totalProtocols: protocols.length > 0 ? protocols[0].count : 0,
      activeProtocols: activeProtocols.length > 0 ? activeProtocols[0].count : 0,
      recentEntries: recentEntries.length > 0 ? recentEntries[0].count : 0,
      mushroomSpecies: speciesCount.length > 0 ? speciesCount[0].count : 0,
      substrateRecipes: recipesCount.length > 0 ? recipesCount[0].count : 0,
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