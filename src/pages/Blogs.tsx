import React, { useEffect, useState } from "react";
import { Search, Calendar, ExternalLink, RefreshCw } from 'lucide-react';

interface Article {
    _id: string;
    title: string;
    description: string;
    content: string;
    url: string;
    image_url: string;
    publishedAt: string;
    source_name: string;
    category: string[];
    keywords: string[];
}

const Blogs: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            setError(null);

            // console.log('[DEBUG] Fetching articles...');
            const response = await fetch('/api/news?limit=12');
            // console.log('[DEBUG] Response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            // console.log('[DEBUG] Articles data:', data);
            setArticles(data.articles || []);
        } catch (err) {
            console.error('Error fetching articles:', err);
            setError('Failed to load articles. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchFreshArticles = async () => {
        try {
            setLoading(true);
            // console.log('[DEBUG] Fetching fresh articles...');
            const response = await fetch('/api/news/fetch?category=health&language=en&country=us');

            if (response.ok) {
                const data = await response.json();
                // console.log('[DEBUG] Fresh articles fetched:', data.message);
                // Refresh the articles list
                fetchArticles();
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error fetching fresh articles:', error);
            setError('Failed to fetch fresh articles. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            fetchArticles();
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <div className="min-h-screen bg-[#E6F2EA] pt-16">
            <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
                {/* Header */}
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
                        Health & Wellness News
                    </h1>
                    <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
                        Stay updated with the latest health, nutrition, and wellness news from trusted sources.
                    </p>
                </div>

                {/* Search and Refresh */}
                <div className="allerchef-card mb-6 sm:mb-8 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
                        {/* Search Bar */}
                        <div className="flex-1 w-full">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search health articles..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    className="w-full pl-10 pr-4 py-2 sm:py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                                />
                            </div>
                        </div>

                        {/* Refresh Articles Button */}
                        <button
                            onClick={fetchFreshArticles}
                            className="allerchef-btn-primary flex items-center gap-2 text-sm sm:text-base"
                            disabled={loading}
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline">{loading ? 'Loading...' : 'Refresh Articles'}</span>
                            <span className="sm:hidden">{loading ? 'Loading...' : 'Refresh'}</span>
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12 sm:py-16">
                        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-3 sm:mt-4 text-muted-foreground text-sm sm:text-base">Loading health articles...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-12 sm:py-16">
                        <p className="text-red-500 mb-3 sm:mb-4 text-sm sm:text-base">{error}</p>
                        <button
                            onClick={fetchArticles}
                            className="allerchef-btn-primary text-sm sm:text-base"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Articles Grid */}
                {!loading && !error && (
                    <>
                        {articles.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {articles.map((article) => (
                                    <div key={article._id} className="allerchef-card group flex flex-col h-full">
                                        {/* Article Image */}
                                        <div className="relative mb-3 sm:mb-4">
                                            <img
                                                src={article.image_url || '/placeholder.svg'}
                                                alt={article.title}
                                                className="w-full h-40 sm:h-48 object-cover rounded-xl"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/placeholder.svg';
                                                }}
                                            />
                                            <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                                                <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-primary/90 text-white text-xs rounded-full font-medium">
                                                    Health
                                                </span>
                                            </div>
                                        </div>

                                        {/* Article Info */}
                                        <div className="flex flex-col flex-1 space-y-2 sm:space-y-3 p-3 sm:p-4">
                                            <h3 className="font-semibold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                                {article.title}
                                            </h3>

                                            <p className="text-muted-foreground text-xs sm:text-sm line-clamp-3">
                                                {truncateText(article.description, 120)}
                                            </p>

                                            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                                    {formatDate(article.publishedAt)}
                                                </div>
                                                <div className="text-xs bg-secondary px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                                                    {article.source_name}
                                                </div>
                                            </div>

                                            {/* Keywords */}
                                            {article.keywords && article.keywords.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {article.keywords.slice(0, 3).map((keyword) => (
                                                        <span
                                                            key={keyword}
                                                            className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-secondary/50 text-secondary-foreground text-xs rounded-lg"
                                                        >
                                                            {keyword}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Spacer */}
                                            <div className="flex-1"></div>

                                            {/* Read More Button */}
                                            <a
                                                href={article.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="allerchef-btn-primary w-full text-center flex items-center justify-center gap-2 text-sm sm:text-base"
                                            >
                                                Read Article
                                                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="text-center py-12 sm:py-16 allerchef-card">
                                <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-foreground">No health articles found.</h3>
                                <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
                                    Click "Refresh Articles" to fetch the latest health news.
                                </p>
                                <button
                                    onClick={fetchFreshArticles}
                                    className="allerchef-btn-primary text-sm sm:text-base"
                                >
                                    Fetch Fresh Articles
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Blogs; 