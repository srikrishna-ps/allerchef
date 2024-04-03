declare module '@vercel/node' {
    export interface VercelRequest extends Request {
        method: string;
        query: Record<string, string | string[] | undefined>;
        body: any;
        url?: string;
    }

    export interface VercelResponse extends Response {
        status(code: number): VercelResponse;
        json(data: any): VercelResponse;
        end(): void;
        setHeader(name: string, value: string): void;
    }
}

declare module 'mongoose' {
    export interface Document {
        _id: any;
    }

    export interface Model<T> {
        find(query?: any): any;
        findById(id: string): any;
        findOneAndUpdate(filter: any, update: any, options?: any): any;
        countDocuments(query?: any): any;
        distinct(field: string): any;
    }

    export function connect(uri: string, options?: any): Promise<typeof mongoose>;
    export function model<T>(name: string, schema: any): Model<T>;
    export function Schema(definition: any, options?: any): any;
} 