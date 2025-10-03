/**
 * File Upload API Endpoint
 * Handles photo uploads to Supabase Storage
 */

import { createClient } from '@supabase/supabase-js';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service role for uploads

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables for upload service');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const config = {
    api: {
        bodyParser: false, // Disable default body parser for file uploads
    },
};

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

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Parse form data
        const form = formidable({
            maxFileSize: 5 * 1024 * 1024, // 5MB limit
            keepExtensions: true,
            multiples: true
        });

        const [fields, files] = await form.parse(req);
        
        const bucket = Array.isArray(fields.bucket) ? fields.bucket[0] : (fields.bucket || 'protocol-photos');
        const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;

        if (!uploadedFile) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(uploadedFile.mimetype)) {
            return res.status(400).json({ 
                error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' 
            });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileExtension = path.extname(uploadedFile.originalFilename || '');
        const fileName = `${timestamp}-${randomString}${fileExtension}`;
        const filePath = `uploads/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${fileName}`;

        // Read file data
        const fileData = fs.readFileSync(uploadedFile.filepath);

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, fileData, {
                contentType: uploadedFile.mimetype,
                duplex: 'half'
            });

        if (error) {
            console.error('Supabase upload error:', error);
            return res.status(500).json({ 
                error: 'Upload failed', 
                details: error.message 
            });
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        // Clean up temporary file
        fs.unlinkSync(uploadedFile.filepath);

        res.status(200).json({
            success: true,
            fileName: fileName,
            filePath: filePath,
            publicUrl: publicUrlData.publicUrl,
            size: uploadedFile.size,
            type: uploadedFile.mimetype
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            details: error.message 
        });
    }
}

// Helper function to ensure bucket exists
export async function ensureBucketExists(bucketName) {
    try {
        const { data, error } = await supabase.storage.getBucket(bucketName);
        
        if (error && error.message.includes('not found')) {
            // Create bucket if it doesn't exist
            const { error: createError } = await supabase.storage.createBucket(bucketName, {
                public: true,
                allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
                fileSizeLimit: 5242880 // 5MB
            });
            
            if (createError) {
                console.error('Failed to create bucket:', createError);
                return false;
            }
            
            console.log(`Bucket '${bucketName}' created successfully`);
            return true;
        }
        
        return !error;
    } catch (error) {
        console.error('Bucket check error:', error);
        return false;
    }
}