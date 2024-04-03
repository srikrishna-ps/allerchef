import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from './lib/db';
import { Dietician } from './models/Dietician';

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

        const { method, query } = req;

        if (method === 'GET') {
            const { specialization, experience, maxPrice } = query;

            let dbQuery: any = {};

            if (specialization) {
                dbQuery.specialization = { $in: Array.isArray(specialization) ? specialization : [specialization] };
            }

            if (experience) {
                dbQuery.experience = { $gte: Number(experience) };
            }

            if (maxPrice) {
                dbQuery.price = { $lte: Number(maxPrice) };
            }

            const dieticians = await Dietician.find(dbQuery).sort({ rating: -1, experience: -1 });

            res.json({ dieticians });
        }
    } catch (error) {
        console.error("Error in dieticians API:", error);
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
} 