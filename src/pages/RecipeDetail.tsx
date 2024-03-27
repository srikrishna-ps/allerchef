import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, Clock, Users, Star, ArrowLeft, ChefHat, Utensils } from "lucide-react";
import { useAuthStore } from "../context/AuthContext";

interface Recipe {
    _id?: string;
    id?: number;
    spoonacularId?: string;
    title: string;
    image: string;
    summary: string;
    instructions: string;
    extendedIngredients?: Array<{
        id: number;
        name: string;
        amount: number;
        unit: string;
    }>;
    ingredients?: Array<{
        id: number;
        name: string;
        amount: number;
        unit: string;
    }>;
    nutrition?: {
        calories?: number;
        protein?: string;
        fat?: string;
        carbs?: string;
        nutrients?: Array<{
            name: string;
            amount: number;
            unit: string;
        }>;
    };
    cookTime?: number;
    readyInMinutes?: number;
    servings?: number;
    cuisine?: string;
    cuisines?: string[];
    diet?: string[];
    diets?: string[];
    tags?: string[];
    difficulty?: string;
    rating?: number;
    reviewCount?: number;
    aggregateLikes?: number;
}

const RecipeDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isLoggedIn, savedRecipes, addSavedRecipe, removeSavedRecipe } = useAuthStore();

    useEffect(() => {
        if (id) {
            fetchRecipe();
        }
    }, [id]);

    const fetchRecipe = async () => {
        try {
            setLoading(true);
            setError(null);

            let response = await fetch(`/api/recipes/${id}`);
            let data;
            if (!response.ok) {
                // Fallback: try Spoonacular endpoint
                response = await fetch(`/api/recipes/spoonacular/${id}`);
                if (!response.ok) {
                    throw new Error('Recipe not found');
                }
            }
            data = await response.json();
            // console.log('Recipe data received:', data); // Debug log
            setRecipe(data);
        } catch (err) {
            setError('Failed to load recipe');
            console.error('Error fetching recipe:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLikeToggle = async () => {
        if (!isLoggedIn || !recipe) return;

        try {
            const recipeId = recipe._id || recipe.spoonacularId || recipe.id?.toString() || '';
            if (isRecipeSaved(recipeId)) {
                await removeSavedRecipe(recipeId);
            } else {
                await addSavedRecipe(recipeId);
            }
        } catch (error) {
            console.error('Error toggling recipe save:', error);
        }
    };

    const isRecipeSaved = (recipeId: string) => savedRecipes.includes(recipeId);

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'easy': return 'text-green-600 bg-green-100';
            case 'medium': return 'text-yellow-600 bg-yellow-100';
            case 'hard': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    // Helper function to get ingredients
    const getIngredients = () => {
        console.log('getIngredients called with recipe:', recipe);
        if (recipe?.extendedIngredients && recipe.extendedIngredients.length > 0) {
            console.log('Using extendedIngredients:', recipe.extendedIngredients);
            return recipe.extendedIngredients;
        }
        if (recipe?.ingredients && recipe.ingredients.length > 0) {
            console.log('Using ingredients:', recipe.ingredients);
            return recipe.ingredients;
        }
        console.log('No ingredients found');
        return [];
    };

    // Helper function to get nutrition values
    const getNutritionValue = (nutrientName: string) => {
        if (!recipe?.nutrition?.nutrients) return 'N/A';
        const nutrient = recipe.nutrition.nutrients.find(n =>
            n.name.toLowerCase().includes(nutrientName.toLowerCase())
        );
        return nutrient ? `${nutrient.amount} ${nutrient.unit}` : 'N/A';
    };

    // Helper function to get cook time
    const getCookTime = () => {
        return recipe?.readyInMinutes || recipe?.cookTime || 0;
    };

    // Helper function to get servings
    const getServings = () => {
        return recipe?.servings || 0;
    };

    // Helper function to get rating
    const getRating = () => {
        const score = recipe?.rating || recipe?.aggregateLikes || 0;
        // Convert all Spoonacular scores to 5-star rating
        return score / 20;
    };

    // Helper function to get cuisines
    const getCuisines = () => {
        return recipe?.cuisines || (recipe?.cuisine ? [recipe.cuisine] : []);
    };

    // Helper function to get diets
    const getDiets = () => {
        return recipe?.diets || recipe?.diet || [];
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#E6F2EA] pt-16">
                <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-3 sm:mt-4 text-muted-foreground text-sm sm:text-base">Loading recipe...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !recipe) {
        return (
            <div className="min-h-screen bg-[#E6F2EA] pt-16">
                <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
                    <div className="text-center">
                        <p className="text-red-500 mb-3 sm:mb-4 text-sm sm:text-base">{error || 'Recipe not found'}</p>
                        <Link to="/recipes" className="allerchef-btn-primary text-sm sm:text-base">
                            Back to Recipes
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const ingredients = getIngredients();
    const cookTime = getCookTime();
    const servings = getServings();
    const rating = getRating();
    const cuisines = getCuisines();
    const diets = getDiets();

    return (
        <div className="min-h-screen bg-[#E6F2EA] pt-16">
            <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
                {/* Back Button */}
                <Link
                    to="/recipes"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 sm:mb-6 text-sm sm:text-base"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Recipes
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Recipe Header */}
                        <div className="allerchef-card mb-6 sm:mb-8">
                            <div className="relative mb-4 sm:mb-6">
                                <img
                                    src={recipe.image}
                                    alt={recipe.title}
                                    className="w-full h-48 sm:h-64 lg:h-80 object-cover rounded-xl"
                                />
                                {isLoggedIn && (
                                    <button
                                        onClick={handleLikeToggle}
                                        className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 sm:p-3 bg-white/90 rounded-full hover:bg-white transition-all duration-300"
                                    >
                                        <Heart
                                            className={`h-5 w-5 sm:h-6 sm:w-6 ${isRecipeSaved(recipe._id || recipe.id?.toString() || '')
                                                ? 'fill-red-500 text-red-500'
                                                : 'text-muted-foreground'
                                                }`}
                                        />
                                    </button>
                                )}
                            </div>

                            <div className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                                    {recipe.title}
                                </h1>

                                {/* Recipe Stats */}
                                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
                                    {cookTime > 0 && (
                                        <div className="flex items-center gap-1 sm:gap-2">
                                            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                                            {cookTime} minutes
                                        </div>
                                    )}
                                    {servings > 0 && (
                                        <div className="flex items-center gap-1 sm:gap-2">
                                            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                                            {servings} servings
                                        </div>
                                    )}
                                    {rating > 0 && (
                                        <div className="flex items-center gap-1 sm:gap-2">
                                            <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                                            {rating.toFixed(1)} ({recipe.reviewCount || 0} reviews)
                                        </div>
                                    )}
                                    {recipe.difficulty && (
                                        <div className="flex items-center gap-1 sm:gap-2">
                                            <ChefHat className="h-3 w-3 sm:h-4 sm:w-4" />
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                                                {recipe.difficulty}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Tags */}
                                {(recipe.tags && recipe.tags.length > 0) && (
                                    <div className="flex flex-wrap gap-1 sm:gap-2">
                                        {recipe.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2 sm:px-3 py-1 bg-secondary text-secondary-foreground text-xs sm:text-sm rounded-full font-medium"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Diet Info */}
                                {diets.length > 0 && (
                                    <div className="flex flex-wrap gap-1 sm:gap-2">
                                        {diets.map((diet) => (
                                            <span
                                                key={diet}
                                                className="px-2 sm:px-3 py-1 bg-primary/10 text-primary text-xs sm:text-sm rounded-full font-medium"
                                            >
                                                {diet}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recipe Summary */}
                        {recipe.summary && (
                            <div className="allerchef-card mb-6 sm:mb-8 p-4 sm:p-6">
                                <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-foreground">About This Recipe</h2>
                                <div
                                    className="prose prose-sm max-w-none text-muted-foreground text-sm sm:text-base"
                                    dangerouslySetInnerHTML={{ __html: recipe.summary }}
                                />
                            </div>
                        )}

                        {/* Ingredients */}
                        {ingredients.length > 0 && (
                            <div className="allerchef-card mb-6 sm:mb-8 p-4 sm:p-6">
                                <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-foreground flex items-center gap-2">
                                    <Utensils className="h-5 w-5 sm:h-6 sm:w-6" />
                                    Ingredients
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                    {ingredients.map((ingredient, index) => (
                                        <div key={index} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-secondary/50 rounded-lg">
                                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full flex-shrink-0"></div>
                                            <span className="font-medium text-xs sm:text-sm">{ingredient.amount} {ingredient.unit}</span>
                                            <span className="text-muted-foreground text-xs sm:text-sm">{ingredient.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Instructions */}
                        {recipe.instructions && (
                            <div className="allerchef-card p-4 sm:p-6">
                                <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-foreground">Instructions</h2>
                                <div
                                    className="prose prose-sm max-w-none text-muted-foreground text-sm sm:text-base"
                                    dangerouslySetInnerHTML={{ __html: recipe.instructions }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4 sm:space-y-6">
                        {/* Nutrition Facts */}
                        <div className="allerchef-card p-4 sm:p-6">
                            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-foreground">Nutrition Facts</h3>
                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-border">
                                    <span className="text-muted-foreground text-sm">Calories</span>
                                    <span className="font-semibold text-sm">{getNutritionValue('calories')}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-border">
                                    <span className="text-muted-foreground text-sm">Protein</span>
                                    <span className="font-semibold text-sm">{getNutritionValue('protein')}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-border">
                                    <span className="text-muted-foreground text-sm">Fat</span>
                                    <span className="font-semibold text-sm">{getNutritionValue('fat')}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-muted-foreground text-sm">Carbohydrates</span>
                                    <span className="font-semibold text-sm">{getNutritionValue('carbohydrates')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Recipe Info */}
                        <div className="allerchef-card p-4 sm:p-6">
                            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-foreground">Recipe Info</h3>
                            <div className="space-y-2 sm:space-y-3">
                                {cuisines.length > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground text-sm">Cuisine</span>
                                        <span className="font-medium text-sm">{cuisines.join(', ')}</span>
                                    </div>
                                )}
                                {recipe.difficulty && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground text-sm">Difficulty</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                                            {recipe.difficulty}
                                        </span>
                                    </div>
                                )}
                                {rating > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground text-sm">Rating</span>
                                        <div className="flex items-center gap-1">
                                            <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-medium text-sm">{rating.toFixed(1)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Save Recipe */}
                        {isLoggedIn && (
                            <div className="allerchef-card p-4 sm:p-6">
                                <button
                                    onClick={handleLikeToggle}
                                    className={`w-full py-2 sm:py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base ${isRecipeSaved(recipe._id || recipe.id?.toString() || '')
                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                        : 'bg-primary text-white hover:bg-primary/90'
                                        }`}
                                >
                                    <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isRecipeSaved(recipe._id || recipe.id?.toString() || '') ? 'fill-current' : ''}`} />
                                    {isRecipeSaved(recipe._id || recipe.id?.toString() || '') ? 'Remove from Saved' : 'Save Recipe'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail; 