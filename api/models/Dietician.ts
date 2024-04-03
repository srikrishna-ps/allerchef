import mongoose, { Schema, Document } from 'mongoose';

export interface IDietician extends Document {
    name: string;
    email: string;
    specialization: string[];
    experience: number;
    rating: number;
    bio: string;
    image: string;
    availability: string[];
    price: number;
}

const DieticianSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    specialization: [{
        type: String
    }],
    experience: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    bio: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    availability: [{
        type: String
    }],
    price: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

export const Dietician = mongoose.model<IDietician>('Dietician', DieticianSchema); 