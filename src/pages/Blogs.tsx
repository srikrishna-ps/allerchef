import { ExternalLink } from "lucide-react";

const blogs = [
    {
        title: "Top 10 Allergy-Friendly Breakfasts",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
        source: "Healthline",
        readTime: "5 min read",
        url: "https://www.healthline.com/nutrition/allergy-friendly-breakfasts"
    },
    {
        title: "How to Read Food Labels for Allergens",
        image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400",
        source: "Allergy UK",
        readTime: "3 min read",
        url: "https://www.allergyuk.org/resources/reading-food-labels/"
    },
    {
        title: "Meal Planning for Multiple Allergies",
        image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?w=400",
        source: "Verywell Family",
        readTime: "6 min read",
        url: "https://www.verywellfamily.com/meal-planning-for-multiple-allergies-1456762"
    }
];

const Blogs = () => (
    <div className="max-w-screen-xl px-4 mx-auto py-12">
        <h1 className="text-4xl font-bold mb-8 text-center allerchef-text-gradient">Health Blogs</h1>
        <div className="space-y-8">
            {blogs.map((blog, idx) => (
                <a
                    key={idx}
                    href={blog.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col md:flex-row items-center gap-6 bg-[#fafaf7] rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-5 group"
                >
                    <img src={blog.image} alt={blog.title} className="w-full md:w-48 h-32 object-cover rounded-xl" />
                    <div className="flex-1 text-left">
                        <h2 className="text-2xl font-semibold mb-2 text-foreground group-hover:text-primary">{blog.title}</h2>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <span>{blog.source}</span>
                            <span>•</span>
                            <span>{blog.readTime}</span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-primary font-medium">
                            Read Article <ExternalLink className="h-4 w-4" />
                        </span>
                    </div>
                </a>
            ))}
        </div>
    </div>
);

export default Blogs; 