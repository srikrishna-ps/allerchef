import mongoose, { Schema, Document } from 'mongoose';

export interface INews extends Document {
    title: string;
    description: string;
    content: string;
    url: string;
    image_url: string;
    publishedAt: Date;
    source_id: string;
    source_name: string;
    category: string[];
    language: string;
    country: string[];
    keywords: string[];
    apiId: string; // NewsData.io article ID for deduplication
    lastUpdated: Date;
}

const NewsSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true,
        unique: true
    },
    image_url: {
        type: String,
        default: null
    },
    publishedAt: {
        type: Date,
        required: true,
        index: true
    },
    source_id: {
        type: String,
        required: true
    },
    source_name: {
        type: String,
        required: true
    },
    category: [{
        type: String,
        enum: ['health', 'nutrition', 'wellness', 'fitness', 'medical', 'diet']
    }],
    language: {
        type: String,
        default: 'en'
    },
    country: [{
        type: String
    }],
    keywords: [{
        type: String
    }],
    apiId: {
        type: String,
        unique: true,
        sparse: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for better query performance
NewsSchema.index({ publishedAt: -1 });
NewsSchema.index({ category: 1 });
NewsSchema.index({ source_name: 1 });
NewsSchema.index({ title: 'text', description: 'text', content: 'text' });

export const News = mongoose.model<INews>('News', NewsSchema); 