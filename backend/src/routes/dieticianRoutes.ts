import express from 'express';
import { Dietician } from '../models/Dietician';

const router = express.Router();

// GET /api/dieticians - fetch all dieticians
router.get('/', async (req, res) => {
    try {
        const dieticians = await Dietician.find();
        res.json(dieticians);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// POST /api/dieticians - add a new dietician
router.post('/', async (req, res) => {
    try {
        const { name, image, bio, specializations } = req.body;
        if (!name || !image || !bio || !specializations) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const dietician = new Dietician({ name, image, bio, specializations });
        await dietician.save();
        res.status(201).json(dietician);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

export default router; 