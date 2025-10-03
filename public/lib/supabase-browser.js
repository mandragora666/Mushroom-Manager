// Browser-compatible Supabase Client for Mushroom Manager
// Fallback implementation when Supabase is not available

class BrowserSupabaseClient {
    constructor() {
        this.baseUrl = '/api'; // Use our local API endpoints
    }

    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Call failed:', error);
            throw error;
        }
    }

    // Mushroom Species Methods
    async getMushroomSpecies(activeOnly = true) {
        try {
            return await this.request('/mushroom-species' + (activeOnly ? '?active=true' : ''));
        } catch (error) {
            console.warn('Mushroom species API not available, using fallback data');
            return this.getFallbackMushroomSpecies();
        }
    }

    async getMushroomSpeciesById(id) {
        try {
            return await this.request(`/mushroom-species?id=${id}`);
        } catch (error) {
            const species = this.getFallbackMushroomSpecies();
            return species.find(s => s.id === id) || null;
        }
    }

    async createMushroomSpecies(data) {
        return await this.request('/mushroom-species', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateMushroomSpecies(id, data) {
        return await this.request(`/mushroom-species?id=${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // Substrate Recipes Methods
    async getSubstrateRecipes(activeOnly = true) {
        try {
            return await this.request('/substrate-recipes' + (activeOnly ? '?active=true' : ''));
        } catch (error) {
            console.warn('Substrate recipes API not available, using fallback data');
            return this.getFallbackSubstrateRecipes();
        }
    }

    async getSubstrateRecipeById(id) {
        try {
            return await this.request(`/substrate-recipes?id=${id}`);
        } catch (error) {
            const recipes = this.getFallbackSubstrateRecipes();
            return recipes.find(r => r.id === id) || null;
        }
    }

    async createSubstrateRecipe(data) {
        return await this.request('/substrate-recipes', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateSubstrateRecipe(id, data) {
        return await this.request(`/substrate-recipes?id=${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // Inoculation Methods
    async getInoculationMethods(activeOnly = true) {
        try {
            return await this.request('/inoculation-methods' + (activeOnly ? '?active=true' : ''));
        } catch (error) {
            console.warn('Inoculation methods API not available, using fallback data');
            return this.getFallbackInoculationMethods();
        }
    }

    async getInoculationMethodById(id) {
        try {
            return await this.request(`/inoculation-methods?id=${id}`);
        } catch (error) {
            const methods = this.getFallbackInoculationMethods();
            return methods.find(m => m.id === id) || null;
        }
    }

    async createInoculationMethod(data) {
        return await this.request('/inoculation-methods', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async updateInoculationMethod(id, data) {
        return await this.request(`/inoculation-methods?id=${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // Growth Phases
    async getGrowthPhases() {
        try {
            return await this.request('/growth-phases');
        } catch (error) {
            console.warn('Growth phases API not available, using fallback data');
            return this.getFallbackGrowthPhases();
        }
    }

    async getGrowthPhaseById(id) {
        try {
            return await this.request(`/growth-phases?id=${id}`);
        } catch (error) {
            const phases = this.getFallbackGrowthPhases();
            return phases.find(p => p.id === id) || null;
        }
    }

    // Fallback data methods
    getFallbackMushroomSpecies() {
        return [
            {
                id: '1',
                name: 'Austernpilz',
                scientific_name: 'Pleurotus ostreatus',
                description: 'Robuster und ertragreicher Pilz, ideal für Anfänger',
                difficulty_level: 'easy',
                optimal_temperature_min: 15.0,
                optimal_temperature_max: 25.0,
                optimal_humidity_min: 85.0,
                optimal_humidity_max: 95.0
            },
            {
                id: '2',
                name: 'Shiitake',
                scientific_name: 'Lentinula edodes',
                description: 'Anspruchsvoller, aber sehr schmackhafter Pilz',
                difficulty_level: 'hard',
                optimal_temperature_min: 12.0,
                optimal_temperature_max: 18.0,
                optimal_humidity_min: 80.0,
                optimal_humidity_max: 90.0
            },
            {
                id: '3',
                name: 'Kräuterseitling',
                scientific_name: 'Pleurotus eryngii',
                description: 'Großfruchtige Pilze mit festem Fleisch',
                difficulty_level: 'medium',
                optimal_temperature_min: 12.0,
                optimal_temperature_max: 20.0,
                optimal_humidity_min: 85.0,
                optimal_humidity_max: 95.0
            }
        ];
    }

    getFallbackSubstrateRecipes() {
        return [
            {
                id: '1',
                name: 'Standard Weizenstroh',
                description: 'Bewährtes Rezept für Austernpilze',
                total_weight: 5.0,
                sterilization_method: 'Pasteurisierung',
                ph_target: 7.0,
                moisture_content: 65.0,
                substrate_ingredients: [
                    {
                        ingredient_name: 'Weizenstroh',
                        quantity: 4.5,
                        unit: 'kg',
                        percentage: 90.0
                    },
                    {
                        ingredient_name: 'Kalk (gebrannt)',
                        quantity: 50.0,
                        unit: 'g',
                        percentage: 1.0
                    }
                ]
            },
            {
                id: '2',
                name: 'Kaffeesatz-Mix',
                description: 'Nachhaltiges Substrat aus Kaffeesatz',
                total_weight: 3.0,
                sterilization_method: 'Dampfsterilisation',
                ph_target: 6.5,
                moisture_content: 70.0,
                substrate_ingredients: [
                    {
                        ingredient_name: 'Kaffeesatz',
                        quantity: 2.0,
                        unit: 'kg',
                        percentage: 66.7
                    },
                    {
                        ingredient_name: 'Strohpellets',
                        quantity: 800.0,
                        unit: 'g',
                        percentage: 26.7
                    }
                ]
            }
        ];
    }

    getFallbackInoculationMethods() {
        return [
            {
                id: '1',
                name: 'Sporensyringe',
                description: 'Inokulation mit Sporenlösung per Spritze',
                method_type: 'spore_syringe',
                difficulty_level: 'easy',
                success_rate: 80,
                duration_minutes: 15
            },
            {
                id: '2',
                name: 'Flüssigkultur',
                description: 'Inokulation mit Pilzmyzel in Nährlösung',
                method_type: 'liquid_culture',
                difficulty_level: 'medium',
                success_rate: 90,
                duration_minutes: 20
            },
            {
                id: '3',
                name: 'Kornbrut-Impfung',
                description: 'Mischung von bewachsener Kornbrut ins Substrat',
                method_type: 'grain_spawn',
                difficulty_level: 'easy',
                success_rate: 95,
                duration_minutes: 10
            }
        ];
    }

    getFallbackGrowthPhases() {
        return [
            {
                id: '1',
                name: 'Inokulation',
                description: 'Einbringung des Pilzmyzels ins Substrat',
                phase_order: 1,
                duration_days_min: 0,
                duration_days_max: 1
            },
            {
                id: '2',
                name: 'Durchwachsung',
                description: 'Myzel durchzieht das Substrat',
                phase_order: 2,
                duration_days_min: 7,
                duration_days_max: 21
            },
            {
                id: '3',
                name: 'Primordien-Bildung',
                description: 'Erste Pilzansätze entstehen',
                phase_order: 3,
                duration_days_min: 3,
                duration_days_max: 7
            },
            {
                id: '4',
                name: 'Fruchtentwicklung',
                description: 'Pilze wachsen zu erntefähiger Größe',
                phase_order: 4,
                duration_days_min: 4,
                duration_days_max: 10
            },
            {
                id: '5',
                name: 'Ernte',
                description: 'Pilze sind erntereif',
                phase_order: 5,
                duration_days_min: 1,
                duration_days_max: 3
            }
        ];
    }
}

// Create global instance
window.supabase = new BrowserSupabaseClient();

// Also make it available as a module export for import statements
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.supabase;
}