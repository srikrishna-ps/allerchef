import React, { useEffect, useState } from "react";
import { Heart, Clock, Users, Star, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../context/AuthContext";

interface Recipe {
  _id: string;
  spoonacularId?: string;
  title: string;
  image: string;
  cookTime: number;
  servings: number;
  nutrition: {
    calories: number;
    protein: string;
    fat: string;
    carbs: string;
  };
  cuisine: string;
  diet: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
}

const Saved: React.FC = () => {
  const { isLoggedIn, savedRecipes, fetchSavedRecipes, removeSavedRecipe } = useAuthStore();
  const [savedRecipeDetails, setSavedRecipeDetails] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      fetchSavedRecipes();
    }
  }, [isLoggedIn, fetchSavedRecipes]);

  useEffect(() => {
    if (savedRecipes.length > 0) {
      fetchSavedRecipeDetails();
    } else {
      setSavedRecipeDetails([]);
      setLoading(false);
    }
  }, [savedRecipes]);

  const fetchSavedRecipeDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const recipePromises = savedRecipes.map(async (recipeId) => {
        let recipe: Recipe;
        try {
          const response = await fetch(`/api/recipes/${recipeId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch recipe ${recipeId}`);
          }
          recipe = await response.json();
        } catch (e) {
          // If fetching by _id fails, try fetching by spoonacularId
          try {
            const spoonacularResponse = await fetch(`/api/recipes/spoonacular/${recipeId}`);
            if (!spoonacularResponse.ok) {
              throw new Error(`Failed to fetch recipe ${recipeId} by spoonacularId`);
            }
            recipe = await spoonacularResponse.json();
          } catch (spoonacularError) {
            throw new Error(`Failed to fetch recipe ${recipeId} with _id or spoonacularId`);
          }
        }
        return recipe;
      });

      const recipes = await Promise.all(recipePromises);
      setSavedRecipeDetails(recipes);
    } catch (err) {
      setError("Failed to fetch saved recipe details");
      console.error("Error fetching saved recipe details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromSaved = async (recipeId: string) => {
    try {
      await removeSavedRecipe(recipeId);
      // The savedRecipes state will update automatically, triggering the useEffect
    } catch (error) {
      console.error("Error removing recipe from saved:", error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#E6F2EA] pt-16">
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 allerchef-text-gradient">Saved Recipes</h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8">Please log in to view your saved recipes</p>
            <Link to="/auth" className="allerchef-btn-primary text-sm sm:text-base">
              Login to Continue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E6F2EA] pt-16">
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-3 sm:mt-4 text-muted-foreground text-sm sm:text-base">Loading your saved recipes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#E6F2EA] pt-16">
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <div className="text-center">
            <p className="text-red-500 mb-3 sm:mb-4 text-sm sm:text-base">{error}</p>
            <button
              onClick={fetchSavedRecipeDetails}
              className="allerchef-btn-primary text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E6F2EA] pt-16">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 allerchef-text-gradient">Saved Recipes</h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
            Your personal collection of favorite recipes ({savedRecipeDetails.length})
          </p>
        </div>

        {/* Stats Card */}
        {savedRecipeDetails.length > 0 && (
          <div className="allerchef-card bg-[#fafaf7] mb-6 sm:mb-8 p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-center">
              <div>
                <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-primary mx-auto mb-1 sm:mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-foreground">{savedRecipeDetails.length}</div>
                <div className="text-muted-foreground text-sm sm:text-base">Saved Recipes</div>
              </div>
              <div>
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-accent mx-auto mb-1 sm:mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-foreground">
                  {Math.round(savedRecipeDetails.reduce((acc, recipe) => acc + recipe.cookTime, 0) / savedRecipeDetails.length || 0)}m
                </div>
                <div className="text-muted-foreground text-sm sm:text-base">Avg Cook Time</div>
              </div>
              <div>
                <Star className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 mx-auto mb-1 sm:mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-foreground">
                  {(savedRecipeDetails.reduce((acc, recipe) => acc + recipe.rating, 0) / savedRecipeDetails.length || 0).toFixed(1)}
                </div>
                <div className="text-muted-foreground text-sm sm:text-base">Avg Rating</div>
              </div>
            </div>
          </div>
        )}

        {/* Saved Recipes Grid */}
        {savedRecipeDetails.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {savedRecipeDetails.map((recipe) => (
              <div key={recipe._id || recipe.spoonacularId} className="allerchef-card group">
                {/* Recipe Image */}
                <div className="relative mb-3 sm:mb-4">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-40 sm:h-48 object-cover rounded-xl"
                  />
                  <button
                    onClick={() => handleRemoveFromSaved(recipe._id || recipe.spoonacularId || '')}
                    className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 bg-white/90 rounded-full hover:bg-white transition-all duration-300"
                    title="Remove from saved"
                  >
                    <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  </button>
                </div>

                {/* Recipe Info */}
                <div className="space-y-2 sm:space-y-3 p-3 sm:p-4">
                  <h3 className="font-semibold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {recipe.title}
                  </h3>

                  <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                      {recipe.cookTime}min
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                      {recipe.servings} servings
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xs sm:text-sm">
                      {recipe.nutrition?.calories && ((typeof recipe.nutrition.calories === 'number' && recipe.nutrition.calories !== 0) || (typeof recipe.nutrition.calories === 'string' && recipe.nutrition.calories !== '0g')) ? (
                        <><span className="font-medium">{typeof recipe.nutrition.calories === 'string' ? recipe.nutrition.calories : `${recipe.nutrition.calories} cal`}</span></>
                      ) : null}
                      {recipe.nutrition?.protein && ((typeof recipe.nutrition.protein === 'string' && recipe.nutrition.protein !== '0g') || (typeof recipe.nutrition.protein === 'number' && recipe.nutrition.protein !== 0)) ? (
                        <><span className="text-muted-foreground mx-1 sm:mx-2">•</span><span className="font-medium">{recipe.nutrition.protein} protein</span></>
                      ) : null}
                    </div>
                    {recipe.rating && recipe.rating > 0 ? (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs sm:text-sm font-medium">{recipe.rating.toFixed(1)}</span>
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {(recipe.tags || []).slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-secondary text-secondary-foreground text-xs rounded-lg font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* View Recipe Button */}
                  {(recipe.spoonacularId || recipe._id) ? (
                    <Link
                      to={`/recipe/${recipe.spoonacularId || recipe._id}`}
                      className="allerchef-btn-primary w-full text-center text-sm sm:text-base"
                    >
                      View Recipe
                    </Link>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12 sm:py-16 allerchef-card">
            <Heart className="h-16 w-16 sm:h-24 sm:w-24 text-muted-foreground mx-auto mb-4 sm:mb-6" />
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-foreground">No saved recipes yet</h3>
            <p className="text-muted-foreground mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
              Start exploring our recipe collection and save your favorites for easy access later.
            </p>
            <Link
              to="/recipes"
              className="allerchef-btn-primary inline-flex items-center gap-2 text-sm sm:text-base"
            >
              <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
              Discover Recipes
            </Link>
          </div>
        )}

        {/* Quick Actions */}
        {savedRecipeDetails.length > 0 && (
          <div className="allerchef-card text-center mt-6 sm:mt-8 p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-foreground">Quick Actions</h3>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                to="/recipes"
                className="allerchef-btn-primary text-sm sm:text-base"
              >
                Find More Recipes
              </Link>
              <button
                onClick={() => {
                  // In a real app, this would generate a shopping list
                  alert('Shopping list feature coming soon!');
                }}
                className="allerchef-btn-secondary text-sm sm:text-base"
              >
                Generate Shopping List
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Saved;