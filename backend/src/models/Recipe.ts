import mongoose, { Document, Schema } from "mongoose";

export interface IRecipe extends Document {
    spoonacularId: number;
    title: string;
    image: string;
    summary: string;
    instructions: string;
    ingredients: Array<{
        id: number;
        name: string;
        amount: number;
        unit: string;
    }>;
    nutrition: {
        calories: number;
        protein: string;
        fat: string;
        carbs: string;
    };
    cookTime: number; // in minutes
    servings: number;
    cuisine: string;
    diet: string[];
    tags: string[];
    difficulty: string;
    rating: number;
    reviewCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const RecipeSchema = new Schema<IRecipe>({
    spoonacularId: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    summary: { type: String },
    instructions: { type: String },
    ingredients: [{
        id: { type: Number },
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        unit: { type: String, required: true }
    }],
    nutrition: {
        calories: { type: Number, default: 0 },
        protein: { type: String, default: "0g" },
        fat: { type: String, default: "0g" },
        carbs: { type: String, default: "0g" }
    },
    cookTime: { type: Number, default: 0 },
    servings: { type: Number, default: 1 },
    cuisine: { type: String, default: "General" },
    diet: [{ type: String }],
    tags: [{ type: String }],
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
RecipeSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

export const Recipe = mongoose.model<IRecipe>("Recipe", RecipeSchema); 