import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // For now, just return a message instead of redirecting
        // This will help us test if the endpoint works without database issues
        return res.status(200).json({
            message: 'Google OAuth endpoint is working!',
            note: 'Google OAuth needs to be configured with proper credentials and database setup.',
            nextSteps: [
                '1. Set up Google OAuth credentials in Google Cloud Console',
                '2. Add GOOGLE_CLIENT_ID to Vercel environment variables',
                '3. Configure database connection for user storage'
            ]
        });

    } catch (error) {
        console.error("Error in Google OAuth API:", error);
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
} 