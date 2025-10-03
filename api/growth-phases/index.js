/**
 * Growth Phases API Endpoint
 * CRUD operations for growth phases management
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
                    // Get single growth phase
                    const phase = await supabase.getGrowthPhaseById(req.query.id);
                    if (!phase) {
                        return res.status(404).json({ error: 'Growth phase not found' });
                    }
                    res.status(200).json(phase);
                } else {
                    // Get all growth phases (ordered by phase_order)
                    const phases = await supabase.getGrowthPhases();
                    res.status(200).json(phases);
                }
                break;

            case 'POST':
                // Create new growth phase
                const newPhase = await supabase.createGrowthPhase(req.body);
                res.status(201).json(newPhase);
                break;

            case 'PUT':
            case 'PATCH':
                // Update growth phase
                if (!req.query.id) {
                    return res.status(400).json({ error: 'Phase ID is required' });
                }
                const updatedPhase = await supabase.updateGrowthPhase(req.query.id, req.body);
                res.status(200).json(updatedPhase);
                break;

            case 'DELETE':
                // Soft delete growth phase (set is_active to false)
                if (!req.query.id) {
                    return res.status(400).json({ error: 'Phase ID is required' });
                }
                await supabase.updateGrowthPhase(req.query.id, { is_active: false });
                res.status(204).end();
                break;

            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
                res.status(405).json({ error: `Method ${req.method} not allowed` });
                break;
        }
    } catch (error) {
        console.error('Growth phases API error:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            message: error.message 
        });
    }
}