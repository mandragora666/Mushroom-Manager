/**
 * Mushroom Species API Endpoint
 * CRUD operations for mushroom species management
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
                    // Get single mushroom species
                    const species = await supabase.getMushroomSpeciesById(req.query.id);
                    if (!species) {
                        return res.status(404).json({ error: 'Mushroom species not found' });
                    }
                    res.status(200).json(species);
                } else {
                    // Get all mushroom species
                    const activeOnly = req.query.active !== 'false';
                    const species = await supabase.getMushroomSpecies(activeOnly);
                    res.status(200).json(species);
                }
                break;

            case 'POST':
                // Create new mushroom species
                const newSpecies = await supabase.createMushroomSpecies(req.body);
                res.status(201).json(newSpecies);
                break;

            case 'PUT':
            case 'PATCH':
                // Update mushroom species
                if (!req.query.id) {
                    return res.status(400).json({ error: 'Species ID is required' });
                }
                const updatedSpecies = await supabase.updateMushroomSpecies(req.query.id, req.body);
                res.status(200).json(updatedSpecies);
                break;

            case 'DELETE':
                // Soft delete mushroom species (set is_active to false)
                if (!req.query.id) {
                    return res.status(400).json({ error: 'Species ID is required' });
                }
                await supabase.updateMushroomSpecies(req.query.id, { is_active: false });
                res.status(204).end();
                break;

            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
                res.status(405).json({ error: `Method ${req.method} not allowed` });
                break;
        }
    } catch (error) {
        console.error('Mushroom species API error:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            message: error.message 
        });
    }
}