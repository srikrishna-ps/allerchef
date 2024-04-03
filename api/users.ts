import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from './lib/db';
import { User } from './models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Middleware to verify JWT token
const verifyToken = (req: VercelRequest) => {
    const authHeader = (req.headers as any).authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.substring(7);
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    } catch (error) {
        return null;
    }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        await connectDB();

        const { method, body, url } = req;

        // Handle different endpoints
        if (url?.includes('/login')) {
            // POST /api/users/login
            if (method === 'POST') {
                const { email, password } = body;

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

                res.json({
                    token,
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email
                    }
                });
            }
        } else if (url?.includes('/register')) {
            // POST /api/users/register
            if (method === 'POST') {
                const { name, email, password } = body;

                // Check if user already exists
                const existingUser = await User.findOne({ $or: [{ email }, { username: name }] });
                if (existingUser) {
                    return res.status(400).json({ message: 'User already exists' });
                }

                // Hash password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Create user
                const user = new User({
                    username: name,
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

                res.json({
                    token,
                    user: {
                        id: user._id,
                        username: name,
                        email
                    }
                });
            }
        } else if (url?.includes('/delete')) {
            // DELETE /api/users/delete
            if (method === 'DELETE') {
                const user = verifyToken(req);
                if (!user) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }

                await User.findByIdAndDelete(user.userId);
                res.json({ message: 'Account deleted successfully' });
            }
        } else if (url?.includes('/saved')) {
            // GET /api/users/saved - Get saved recipes
            if (method === 'GET') {
                const user = verifyToken(req);
                if (!user) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }

                const userDoc = await User.findById(user.userId).populate('savedRecipes');
                res.json(userDoc?.savedRecipes || []);
            }
            // POST /api/users/saved - Add saved recipe
            else if (method === 'POST') {
                const user = verifyToken(req);
                if (!user) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }

                const { recipeId } = body;
                const userDoc = await User.findById(user.userId);
                if (!userDoc) {
                    return res.status(404).json({ message: 'User not found' });
                }

                if (!userDoc.savedRecipes.includes(recipeId)) {
                    userDoc.savedRecipes.push(recipeId);
                    await userDoc.save();
                }

                res.json(userDoc.savedRecipes);
            }
        } else if (url?.includes('/saved/') && method === 'DELETE') {
            // DELETE /api/users/saved/:recipeId - Remove saved recipe
            const user = verifyToken(req);
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const recipeId = url.split('/saved/')[1];
            const userDoc = await User.findById(user.userId);
            if (!userDoc) {
                return res.status(404).json({ message: 'User not found' });
            }

            userDoc.savedRecipes = userDoc.savedRecipes.filter((id: any) => id.toString() !== recipeId);
            await userDoc.save();

            res.json(userDoc.savedRecipes);
        }
    } catch (error) {
        console.error("Error in users API:", error);
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
} 