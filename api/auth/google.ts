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
        const googleClientId = process.env.GOOGLE_CLIENT_ID;
        const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

        if (!googleClientId || !googleClientSecret) {
            return res.status(500).json({
                message: 'Google OAuth not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.'
            });
        }

        // Get the current domain
        const protocol = (req.headers as any)['x-forwarded-proto'] || 'https';
        const host = (req.headers as any).host;
        const baseUrl = `${protocol}://${host}`;

        // Check if this is a callback (has code parameter)
        const { code } = req.query;

        if (code) {
            // Handle OAuth callback
            await handleOAuthCallback(req, res, code as string, googleClientSecret, baseUrl);
        } else {
            // Initial OAuth redirect
            const redirectUri = `${baseUrl}/api/auth/google`;
            const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
                `client_id=${googleClientId}&` +
                `redirect_uri=${encodeURIComponent(redirectUri)}&` +
                `response_type=code&` +
                `scope=${encodeURIComponent('openid email profile')}&` +
                `access_type=offline&` +
                `prompt=consent`;

            res.setHeader('Location', googleAuthUrl);
            res.status(302).end();
        }

    } catch (error) {
        console.error("Error in Google OAuth API:", error);
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
}

async function handleOAuthCallback(req: VercelRequest, res: VercelResponse, code: string, clientSecret: string, baseUrl: string) {
    try {
        await connectDB();

        // Exchange code for access token
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: clientSecret,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: `${baseUrl}/api/auth/google`,
            }),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error('Token exchange failed:', tokenData);
            return res.status(400).json({ message: 'Failed to exchange code for token' });
        }

        // Get user info from Google
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
            },
        });

        const userData = await userResponse.json();

        if (!userResponse.ok) {
            return res.status(400).json({ message: 'Failed to get user info' });
        }

        // Find or create user
        let user = await User.findOne({ email: userData.email });

        if (!user) {
            // Create new user
            user = new User({
                username: userData.name || userData.email.split('@')[0],
                email: userData.email,
                googleId: userData.id,
                // No password for Google users
            });
            await user.save();
        } else if (!user.googleId) {
            // Link existing user to Google
            user.googleId = userData.id;
            await user.save();
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '7d' }
        );

        // Redirect to frontend with token
        const frontendUrl = `${baseUrl}?token=${token}`;
        res.setHeader('Location', frontendUrl);
        res.status(302).end();

    } catch (error) {
        console.error('OAuth callback error:', error);
        res.status(500).json({ message: 'OAuth callback failed', error: (error as Error).message });
    }
} 