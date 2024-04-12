import mongoose, { Schema, Document } from 'mongoose';

export interface IDietician extends Document {
    name: string;
    image: string;
    bio: string;
    specializations: string[];
}

const DieticianSchema = new Schema<IDietician>({
    name: { type: String, required: true },
    image: { type: String, required: true },
    bio: { type: String, required: true },
    specializations: { type: [String], required: true },
});

export const Dietician = mongoose.model<IDietician>('Dietician', DieticianSchema); 