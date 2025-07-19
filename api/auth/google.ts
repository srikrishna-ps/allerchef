import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../lib/db';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';

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
        await connectDB();

        // For now, redirect to Google OAuth URL
        // You'll need to set up Google OAuth credentials in your Google Cloud Console
        const googleClientId = process.env.GOOGLE_CLIENT_ID;

        if (!googleClientId) {
            return res.status(500).json({
                message: 'Google OAuth not configured. Please set GOOGLE_CLIENT_ID environment variable.'
            });
        }

        const origin = (req.headers as any).origin || (req.headers as any).host || 'https://your-domain.vercel.app';
        const redirectUri = `${origin}/auth/callback`;
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${googleClientId}&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `response_type=code&` +
            `scope=${encodeURIComponent('openid email profile')}&` +
            `access_type=offline&` +
            `prompt=consent`;

        res.setHeader('Location', googleAuthUrl);
        res.status(302).end();

    } catch (error) {
        console.error("Error in Google OAuth API:", error);
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
} 