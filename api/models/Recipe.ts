import mongoose, { Schema, Document } from 'mongoose';

export interface IRecipe extends Document {
    spoonacularId: number;
    title: string;
    description: string;
    image: string;
    ingredients: string[];
    instructions: string[];
    cookingTime: number;
    servings: number;
    difficulty: string;
    cuisine: string;
    tags: string[];
    nutrition: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        fiber: number;
        sugar: number;
    };
    rating: number;
    savedBy: string[];
    createdAt: Date;
    updatedAt: Date;
}

const RecipeSchema: Schema = new Schema({
    spoonacularId: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    ingredients: [{
        type: String
    }],
    instructions: [{
        type: String
    }],
    cookingTime: {
        type: Number,
        default: 0
    },
    servings: {
        type: Number,
        default: 1
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    cuisine: {
        type: String,
        default: 'International'
    },
    tags: [{
        type: String
    }],
    nutrition: {
        calories: { type: Number, default: 0 },
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        fat: { type: Number, default: 0 },
        fiber: { type: Number, default: 0 },
        sugar: { type: Number, default: 0 }
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    savedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

export const Recipe = mongoose.model<IRecipe>('Recipe', RecipeSchema); 