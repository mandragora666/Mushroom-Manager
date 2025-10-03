/**
 * Inoculation Methods API Endpoint
 * CRUD operations for inoculation methods management
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
                    // Get single inoculation method
                    const method = await supabase.getInoculationMethodById(req.query.id);
                    if (!method) {
                        return res.status(404).json({ error: 'Inoculation method not found' });
                    }
                    res.status(200).json(method);
                } else {
                    // Get all inoculation methods
                    const activeOnly = req.query.active !== 'false';
                    const methods = await supabase.getInoculationMethods(activeOnly);
                    res.status(200).json(methods);
                }
                break;

            case 'POST':
                // Create new inoculation method
                const newMethod = await supabase.createInoculationMethod(req.body);
                res.status(201).json(newMethod);
                break;

            case 'PUT':
            case 'PATCH':
                // Update inoculation method
                if (!req.query.id) {
                    return res.status(400).json({ error: 'Method ID is required' });
                }
                const updatedMethod = await supabase.updateInoculationMethod(req.query.id, req.body);
                res.status(200).json(updatedMethod);
                break;

            case 'DELETE':
                // Soft delete inoculation method (set is_active to false)
                if (!req.query.id) {
                    return res.status(400).json({ error: 'Method ID is required' });
                }
                await supabase.updateInoculationMethod(req.query.id, { is_active: false });
                res.status(204).end();
                break;

            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
                res.status(405).json({ error: `Method ${req.method} not allowed` });
                break;
        }
    } catch (error) {
        console.error('Inoculation methods API error:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            message: error.message 
        });
    }
}