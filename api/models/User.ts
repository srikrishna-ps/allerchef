import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    googleId?: string;
    profilePicture?: string;
    dietaryRestrictions: string[];
    allergies: string[];
    savedRecipes: string[];
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    googleId: {
        type: String,
        sparse: true
    },
    profilePicture: {
        type: String
    },
    dietaryRestrictions: [{
        type: String,
        enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo', 'mediterranean']
    }],
    allergies: [{
        type: String
    }],
    savedRecipes: [{
        type: Schema.Types.ObjectId,
        ref: 'Recipe'
    }]
}, {
    timestamps: true
});

export const User = mongoose.model<IUser>('User', UserSchema); 