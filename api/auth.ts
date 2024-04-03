import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from './lib/db';
import { User } from './models/User';
import bcrypt from 'bcrypt';
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

    try {
        await connectDB();

        const { method, body } = req;

        if (method === 'POST') {
            const { action, ...data } = body;

            if (action === 'register') {
                const { username, email, password } = data;

                // Check if user already exists
                const existingUser = await User.findOne({ $or: [{ email }, { username }] });
                if (existingUser) {
                    return res.status(400).json({ message: 'User already exists' });
                }

                // Hash password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Create user
                const user = new User({
                    username,
                    email,
                    password: hashedPassword
                });

                await user.save();

                // Generate JWT
                const token = jwt.sign(
                    { userId: user._id, email: user.email },
                    process.env.JWT_SECRET || 'fallback-secret',
                    { expiresIn: '7d' }
                );

                res.json({ token, user: { id: user._id, username, email } });
            } else if (action === 'login') {
                const { email, password } = data;

                // Find user
                const user = await User.findOne({ email });
                if (!user) {
                    return res.status(400).json({ message: 'Invalid credentials' });
                }

                // Check password
                const isValidPassword = await bcrypt.compare(password, user.password);
                if (!isValidPassword) {
                    return res.status(400).json({ message: 'Invalid credentials' });
                }

                // Generate JWT
                const token = jwt.sign(
                    { userId: user._id, email: user.email },
                    process.env.JWT_SECRET || 'fallback-secret',
                    { expiresIn: '7d' }
                );

                res.json({ token, user: { id: user._id, username: user.username, email } });
            }
        }
    } catch (error) {
        console.error("Error in auth API:", error);
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
} 