/**
 * Substrate Recipes API Endpoint
 * CRUD operations for substrate recipes and ingredients management
 */

const supabase = require('../../lib/supabase');

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        switch (req.method) {
            case 'GET':
                if (req.query.id) {
                    // Get single substrate recipe with ingredients
                    const recipe = await supabase.getSubstrateRecipeById(req.query.id);
                    if (!recipe) {
                        return res.status(404).json({ error: 'Substrate recipe not found' });
                    }
                    res.status(200).json(recipe);
                } else {
                    // Get all substrate recipes
                    const activeOnly = req.query.active !== 'false';
                    const recipes = await supabase.getSubstrateRecipes(activeOnly);
                    res.status(200).json(recipes);
                }
                break;

            case 'POST':
                // Create new substrate recipe with ingredients
                const { substrate_ingredients, ...recipeData } = req.body;
                
                // Create recipe first
                const newRecipe = await supabase.createSubstrateRecipe(recipeData);
                
                // Add ingredients if provided
                if (substrate_ingredients && substrate_ingredients.length > 0) {
                    for (let i = 0; i < substrate_ingredients.length; i++) {
                        const ingredient = substrate_ingredients[i];
                        await supabase.createSubstrateIngredient({
                            ...ingredient,
                            recipe_id: newRecipe.id,
                            sort_order: ingredient.sort_order || (i + 1)
                        });
                    }
                }
                
                // Return complete recipe with ingredients
                const completeRecipe = await supabase.getSubstrateRecipeById(newRecipe.id);
                res.status(201).json(completeRecipe);
                break;

            case 'PUT':
            case 'PATCH':
                // Update substrate recipe and ingredients
                if (!req.query.id) {
                    return res.status(400).json({ error: 'Recipe ID is required' });
                }
                
                const { substrate_ingredients: newIngredients, ...updateData } = req.body;
                
                // Update recipe
                await supabase.updateSubstrateRecipe(req.query.id, updateData);
                
                // Handle ingredients update if provided
                if (newIngredients) {
                    // Get existing ingredients
                    const existingIngredients = await supabase.getSubstrateIngredients(req.query.id);
                    
                    // Remove ingredients not in new list
                    for (const existing of existingIngredients) {
                        const stillExists = newIngredients.find(ing => ing.id === existing.id);
                        if (!stillExists) {
                            await supabase.deleteSubstrateIngredient(existing.id);
                        }
                    }
                    
                    // Add or update ingredients
                    for (let i = 0; i < newIngredients.length; i++) {
                        const ingredient = newIngredients[i];
                        
                        if (ingredient.id) {
                            // Update existing ingredient
                            await supabase.updateSubstrateIngredient(ingredient.id, {
                                ...ingredient,
                                sort_order: ingredient.sort_order || (i + 1)
                            });
                        } else {
                            // Create new ingredient
                            await supabase.createSubstrateIngredient({
                                ...ingredient,
                                recipe_id: req.query.id,
                                sort_order: ingredient.sort_order || (i + 1)
                            });
                        }
                    }
                }
                
                // Return updated recipe with ingredients
                const updatedRecipe = await supabase.getSubstrateRecipeById(req.query.id);
                res.status(200).json(updatedRecipe);
                break;

            case 'DELETE':
                // Soft delete substrate recipe (set is_active to false)
                if (!req.query.id) {
                    return res.status(400).json({ error: 'Recipe ID is required' });
                }
                await supabase.updateSubstrateRecipe(req.query.id, { is_active: false });
                res.status(204).end();
                break;

            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
                res.status(405).json({ error: `Method ${req.method} not allowed` });
                break;
        }
    } catch (error) {
        console.error('Substrate recipes API error:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            message: error.message 
        });
    }
}