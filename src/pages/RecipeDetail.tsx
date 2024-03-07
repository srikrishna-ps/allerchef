import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Clock, Users, Star, ChevronLeft } from 'lucide-react';

interface Recipe {
    id: string;
    title: string;
    image: string;
    cookTime: string;
    servings: number;
    calories: number;
    protein: string;
    tags: string[];
    ingredients: string[];
    isLiked: boolean;
    instructions: string[];
    nutrition: { [key: string]: string | number };
}

// Mock data (should match Recipes.tsx, but with instructions and nutrition)
const mockRecipes: Recipe[] = [
    {
        id: '1',
        title: 'Quinoa Buddha Bowl with Tahini Dressing',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
        cookTime: '25 min',
        servings: 2,
        calories: 420,
        protein: '18g',
        tags: ['Vegan', 'Gluten-Free', 'High Protein'],
        ingredients: ['Quinoa', 'Chickpeas', 'Avocado', 'Tahini'],
        isLiked: false,
        instructions: [
            'Cook quinoa according to package instructions.',
            'Roast chickpeas until crispy.',
            'Slice avocado.',
            'Whisk tahini with lemon juice and water for dressing.',
            'Assemble bowl and drizzle with dressing.'
        ],
        nutrition: {
            Calories: 420,
            Protein: '18g',
            Carbs: '60g',
            Fat: '14g',
            Fiber: '10g'
        }
    },
    {
        id: '2',
        title: 'Dairy-Free Creamy Mushroom Risotto',
        image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400',
        cookTime: '35 min',
        servings: 4,
        calories: 380,
        protein: '12g',
        tags: ['Dairy-Free', 'Vegetarian', 'Comfort Food'],
        ingredients: ['Arborio Rice', 'Mushrooms', 'Coconut Milk', 'Nutritional Yeast'],
        isLiked: false,
        instructions: [
            'Sauté mushrooms until golden.',
            'Add rice and stir for 2 minutes.',
            'Gradually add broth, stirring constantly.',
            'Stir in coconut milk and nutritional yeast at the end.',
            'Serve creamy and hot.'
        ],
        nutrition: {
            Calories: 380,
            Protein: '12g',
            Carbs: '68g',
            Fat: '8g',
            Fiber: '4g'
        }
    },
    {
        id: '3',
        title: 'Nut-Free Energy Balls',
        image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400',
        cookTime: '15 min',
        servings: 12,
        calories: 120,
        protein: '4g',
        tags: ['Nut-Free', 'No-Bake', 'Healthy Snack'],
        ingredients: ['Dates', 'Sunflower Seeds', 'Cocoa Powder', 'Coconut'],
        isLiked: true,
        instructions: [
            'Blend dates and sunflower seeds until sticky.',
            'Add cocoa powder and coconut, blend again.',
            'Roll into balls and chill before serving.'
        ],
        nutrition: {
            Calories: 120,
            Protein: '4g',
            Carbs: '18g',
            Fat: '4g',
            Fiber: '3g'
        }
    },
    {
        id: '4',
        title: 'Mediterranean Herb-Crusted Salmon',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
        cookTime: '20 min',
        servings: 2,
        calories: 350,
        protein: '28g',
        tags: ['High Protein', 'Heart Healthy', 'Gluten-Free'],
        ingredients: ['Salmon', 'Herbs', 'Olive Oil', 'Lemon'],
        isLiked: false,
        instructions: [
            'Preheat oven to 200°C (400°F).',
            'Coat salmon with olive oil and herbs.',
            'Bake for 12-15 minutes.',
            'Squeeze lemon over before serving.'
        ],
        nutrition: {
            Calories: 350,
            Protein: '28g',
            Carbs: '2g',
            Fat: '22g',
            Fiber: '0g'
        }
    },
    {
        id: '5',
        title: 'Coconut Flour Pancakes',
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
        cookTime: '15 min',
        servings: 3,
        calories: 200,
        protein: '8g',
        tags: ['Gluten-Free', 'Dairy-Free', 'Low Sugar'],
        ingredients: ['Coconut Flour', 'Eggs', 'Almond Milk', 'Vanilla'],
        isLiked: false,
        instructions: [
            'Mix all ingredients until smooth.',
            'Pour batter onto hot skillet.',
            'Cook until bubbles form, then flip.',
            'Serve warm with toppings of choice.'
        ],
        nutrition: {
            Calories: 200,
            Protein: '8g',
            Carbs: '16g',
            Fat: '10g',
            Fiber: '5g'
        }
    },
    {
        id: '6',
        title: 'Iron-Rich Spinach and Lentil Curry',
        image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400',
        cookTime: '30 min',
        servings: 4,
        calories: 280,
        protein: '15g',
        tags: ['Vegan', 'Iron Rich', 'High Fiber'],
        ingredients: ['Red Lentils', 'Spinach', 'Coconut Milk', 'Turmeric'],
        isLiked: false,
        instructions: [
            'Cook lentils until soft.',
            'Add spinach and spices, simmer.',
            'Stir in coconut milk and cook 5 more minutes.',
            'Serve with rice or flatbread.'
        ],
        nutrition: {
            Calories: 280,
            Protein: '15g',
            Carbs: '42g',
            Fat: '6g',
            Fiber: '9g'
        }
    }
];

const RecipeDetail = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState<Recipe | null>(null);

    useEffect(() => {
        const found = mockRecipes.find(r => r.id === id);
        setRecipe(found || null);
    }, [id]);

    if (!recipe) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4 text-foreground">Recipe Not Found</h2>
                <Link to="/recipes" className="allerchef-btn-secondary">Back to Recipes</Link>
            </div>
        );
    }

    return (
        <>
            <Link to="/recipes" className="inline-flex items-center gap-2 mb-6 text-green-700 hover:underline">
                <ChevronLeft className="h-5 w-5" /> Back to Recipes
            </Link>
            <div className="allerchef-card bg-[#fafaf7] p-6 md:p-10 flex flex-col md:flex-row gap-8">
                <img src={recipe.image} alt={recipe.title} className="w-full md:w-80 h-56 object-cover rounded-2xl shadow mb-6 md:mb-0" />
                <div className="flex-1 flex flex-col gap-4">
                    <h1 className="text-3xl font-bold text-green-800 mb-2">{recipe.title}</h1>
                    <div className="flex flex-wrap gap-3 mb-2">
                        {recipe.tags.map(tag => (
                            <span key={tag} className="allerchef-pill bg-secondary text-secondary-foreground text-xs px-3 py-1 rounded-full font-medium">{tag}</span>
                        ))}
                    </div>
                    <div className="flex items-center gap-6 text-muted-foreground text-sm mb-2">
                        <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {recipe.cookTime}</span>
                        <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {recipe.servings} servings</span>
                        <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> 4.8</span>
                    </div>
                    <div className="flex gap-6">
                        <div className="text-sm"><span className="font-medium">{recipe.calories}</span> cal</div>
                        <div className="text-sm"><span className="font-medium">{recipe.protein}</span> protein</div>
                    </div>
                </div>
            </div>
            {/* Ingredients & Instructions */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="allerchef-card bg-[#fafaf7] p-6">
                    <h2 className="text-xl font-semibold mb-3 text-green-800">Ingredients</h2>
                    <ul className="list-disc list-inside space-y-2 text-foreground">
                        {recipe.ingredients.map((ing, i) => (
                            <li key={i}>{ing}</li>
                        ))}
                    </ul>
                </div>
                <div className="allerchef-card bg-[#fafaf7] p-6">
                    <h2 className="text-xl font-semibold mb-3 text-green-800">Instructions</h2>
                    <ol className="list-decimal list-inside space-y-2 text-foreground">
                        {recipe.instructions.map((step, i) => (
                            <li key={i}>{step}</li>
                        ))}
                    </ol>
                </div>
            </div>
            {/* Nutrition Info */}
            <div className="mt-10 allerchef-card bg-[#fafaf7] p-6">
                <h2 className="text-xl font-semibold mb-3 text-green-800">Nutrition Information</h2>
                <div className="bg-white rounded-xl shadow p-4 flex flex-wrap gap-6">
                    {Object.entries(recipe.nutrition).map(([key, value]) => (
                        <div key={key} className="text-sm text-foreground">
                            <span className="font-medium">{key}:</span> {value}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default RecipeDetail; 