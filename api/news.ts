import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from './lib/db';
import { News } from './models/News';

// Cache for API responses to avoid hitting rate limits
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Helper function to fetch from NewsData.io API
const fetchFromNewsData = async (endpoint: string) => {
    const apiKey = process.env.NEWSDATA_API_KEY;
    if (!apiKey) {
        throw new Error("NewsData.io API key not configured");
    }

    const response = await fetch(`https://newsdata.io/api/1/news?${endpoint}&apikey=${apiKey}`);
    if (!response.ok) {
        throw new Error(`NewsData.io API error: ${response.status}`);
    }
    return response.json();
};

// Helper function to check cache
const getCachedData = (key: string) => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    return null;
};

// Helper function to set cache
const setCachedData = (key: string, data: any) => {
    cache.set(key, {
        data,
        timestamp: Date.now()
    });
};

// Helper function to transform NewsData.io article to our format
const transformArticle = (article: any) => ({
    title: article.title || '',
    description: article.description || '',
    content: article.content || article.description || '',
    url: article.link || '',
    image_url: article.image_url || null,
    publishedAt: new Date(article.pubDate || Date.now()),
    source_id: article.source_id || '',
    source_name: article.source_id || 'Unknown',
    category: article.category || ['health'],
    language: article.language || 'en',
    country: article.country || [],
    keywords: article.keywords || [],
    apiId: article.article_id || article.link || ''
});

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

        const { method, query, url } = req;

        // Handle different endpoints
        if (url?.includes('/fetch')) {
            // GET /api/news/fetch - Fetch fresh articles from NewsData.io API
            if (method === 'GET') {
                const { category = 'health', language = 'en', country = 'us' } = query;

                // Check cache first
                const cacheKey = `news_${category}_${language}_${country}`;
                const cachedData = getCachedData(cacheKey);

                if (cachedData) {
                    // console.log('[DEBUG] Returning cached news data');
                    return res.json(cachedData);
                }

                // Build API endpoint with health-specific query
                let endpoint = `q=health nutrition wellness medical fitness&size=10`;

                // console.log(`[DEBUG] Fetching from NewsData.io: ${endpoint}`);
                const data = await fetchFromNewsData(endpoint);

                if (!data.results || data.results.length === 0) {
                    return res.json({
                        articles: [],
                        totalResults: 0,
                        message: "No health articles found"
                    });
                }

                // Filter articles to ensure they are health-related
                const healthKeywords = [
                    'health', 'medical', 'nutrition', 'wellness', 'fitness', 'diet',
                    'medicine', 'doctor', 'hospital', 'treatment', 'therapy', 'exercise',
                    'vitamin', 'supplement', 'disease', 'condition', 'symptom', 'prevention'
                ];

                const filteredResults = data.results.filter((article: any) => {
                    const title = (article.title || '').toLowerCase();
                    const description = (article.description || '').toLowerCase();
                    const content = (article.content || '').toLowerCase();

                    return healthKeywords.some(keyword =>
                        title.includes(keyword) ||
                        description.includes(keyword) ||
                        content.includes(keyword)
                    );
                });

                // console.log(`[DEBUG] Filtered ${data.results.length} articles down to ${filteredResults.length} health-related articles`);

                // Transform and save articles
                const articlesToSave = filteredResults.map(transformArticle);

                // Save articles to database (upsert to avoid duplicates)
                const savedArticles = [];
                for (const articleData of articlesToSave) {
                    try {
                        const savedArticle = await News.findOneAndUpdate(
                            { apiId: articleData.apiId },
                            articleData,
                            { upsert: true, new: true }
                        );
                        savedArticles.push(savedArticle);
                    } catch (error) {
                        console.error(`Error saving article ${articleData.apiId}:`, error);
                    }
                }

                const result = {
                    articles: savedArticles,
                    totalResults: data.totalResults || savedArticles.length,
                    message: `Fetched ${savedArticles.length} articles`
                };

                // Cache the result
                setCachedData(cacheKey, result);

                res.json(result);
            }
        } else if (url?.includes('/categories')) {
            // GET /api/news/categories - Get available categories
            if (method === 'GET') {
                const categories = await News.distinct("category");
                res.json({ categories: categories.filter((c: any) => c) });
            }
        } else if (url?.includes('/sources')) {
            // GET /api/news/sources - Get available sources
            if (method === 'GET') {
                const sources = await News.distinct("source_name");
                res.json({ sources: sources.filter((s: any) => s) });
            }
        } else if (query.id) {
            // GET /api/news/:id - Get article by ID
            if (method === 'GET') {
                const { id } = query;
                const article = await News.findById(id);
                if (!article) {
                    return res.status(404).json({ message: "Article not found" });
                }
                res.json(article);
            }
        } else {
            // GET /api/news - Get all news articles with pagination and filters
            if (method === 'GET') {
                const {
                    page = 1,
                    limit = 12,
                    search,
                    category,
                    source,
                    sortBy = 'publishedAt'
                } = query;

                const skip = (Number(page) - 1) * Number(limit);

                // Build query - always filter for health-related articles
                let dbQuery: any = {
                    $or: [
                        { category: { $in: ['health', 'nutrition', 'wellness', 'fitness', 'medical', 'diet'] } },
                        {
                            $text: {
                                $search: 'health medical nutrition wellness fitness diet medicine doctor hospital treatment therapy exercise vitamin supplement disease condition symptom prevention'
                            }
                        }
                    ]
                };

                if (search) {
                    dbQuery.$and = [{ $text: { $search: search as string } }];
                }

                if (category) {
                    dbQuery.category = { $in: Array.isArray(category) ? category : [category] };
                }

                if (source) {
                    dbQuery.source_name = { $regex: source, $options: 'i' };
                }

                // Build sort object
                let sort: any = {};
                switch (sortBy) {
                    case 'publishedAt':
                        sort.publishedAt = -1;
                        break;
                    case 'title':
                        sort.title = 1;
                        break;
                    case 'source':
                        sort.source_name = 1;
                        break;
                    default:
                        sort.publishedAt = -1;
                }

                const articles = await News.find(dbQuery)
                    .sort(sort)
                    .skip(skip)
                    .limit(Number(limit));

                const total = await News.countDocuments(dbQuery);

                res.json({
                    articles,
                    pagination: {
                        page: Number(page),
                        limit: Number(limit),
                        total,
                        pages: Math.ceil(total / Number(limit))
                    }
                });
            }
        }
    } catch (error) {
        console.error("Error in news API:", error);
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
} 