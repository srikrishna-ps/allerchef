import express from "express";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import auth from "../middleware/auth";
import { Request, Response } from "express";

const router = express.Router();

// Helper to generate JWT
const generateToken = (userId: string) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
        expiresIn: "7d",
    });
};

// Register new user
router.post("/register", async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        const user = new User({ name, email, password });
        await user.save();
        // Generate JWT token
        const token = generateToken((user._id as string));
        console.log("DEBUG: Register endpoint hit, should return token");
        console.log("DEBUG: Token generated:", token);
        res.status(201).json({ token, debug: "You are using the correct code!" });
    } catch (error) {
        console.error("🔴 ERROR:", error);
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
});

// Login user
router.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = generateToken((user._id as string));
        res.json({ token });
    } catch (error) {
        console.error("🔴 ERROR:", error);
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
});

// Get current user
router.get("/me", auth, async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?.id || (req.user as any)?._id;
        const user = await User.findById(userId).select("-password");
        res.json(user);
    } catch (error) {
        console.error("🔴 ERROR:", error);
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
});

// Delete user account
router.delete("/delete", auth, async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?.id || (req.user as any)?._id;
        await User.findByIdAndDelete(userId);
        res.json({ message: "User deleted" });
    } catch (error) {
        console.error("🔴 ERROR:", error);
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
});

// Get saved recipes for the logged-in user
router.get("/saved", auth, async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?.id || (req.user as any)?._id;
        const user = await User.findById(userId);
        res.json(user?.savedRecipes || []);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Add a recipe to saved
router.post("/saved", auth, async (req: Request, res: Response) => {
    try {
        const { recipeId } = req.body;
        if (!recipeId) return res.status(400).json({ message: "recipeId is required" });
        const userId = (req.user as any)?.id || (req.user as any)?._id;
        console.log("[DEBUG] userId:", userId);
        const user = await User.findById(userId);
        console.log("[DEBUG] User document:", user);
        if (!user) return res.status(404).json({ message: "User not found" });
        console.log("[DEBUG] Before adding, savedRecipes:", user.savedRecipes);
        if (!user.savedRecipes.includes(recipeId)) {
            user.savedRecipes.push(recipeId);
            await user.save();
            console.log("[DEBUG] After adding, savedRecipes:", user.savedRecipes);
        } else {
            console.log("[DEBUG] Recipe already saved.");
        }
        res.json(user.savedRecipes);
    } catch (error) {
        console.error("[DEBUG] Error in POST /saved:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// Remove a recipe from saved
router.delete("/saved/:id", auth, async (req: Request, res: Response) => {
    try {
        const recipeId = req.params.id;
        const userId = (req.user as any)?.id || (req.user as any)?._id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        user.savedRecipes = user.savedRecipes.filter((rid: string) => rid !== recipeId);
        await user.save();
        res.json(user.savedRecipes);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

export default router; 