import React, { useEffect, useState } from "react";
import { Search, Filter, Heart, Clock, Users, Star, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuthStore } from "../context/AuthContext";

interface Recipe {
  _id?: string;
  id?: number;
  title: string;
  image: string;
  cookTime?: number;
  readyInMinutes?: number;
  servings?: number;
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
  cuisine?: string;
  cuisines?: string[];
  diet?: string[];
  diets?: string[];
  tags?: string[];
  dishTypes?: string[];
  rating?: number;
  aggregateLikes?: number;
  reviewCount?: number;
  spoonacularId?: string;
}

const Recipes: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [selectedDiet, setSelectedDiet] = useState("");
  const [selectedIntolerances, setSelectedIntolerances] = useState<string[]>([]);
  const [nutrientFilters, setNutrientFilters] = useState({
    minProtein: "",
    maxProtein: "",
    minCarbs: "",
    maxCarbs: "",
    minFat: "",
    maxFat: "",
    minCalories: "",
    maxCalories: "",
    minFiber: "",
    maxFiber: "",
    minSugar: "",
    maxSugar: ""
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isLoggedIn, savedRecipes, addSavedRecipe, removeSavedRecipe, fetchSavedRecipes } = useAuthStore();

  const cuisines = [
    "Italian", "Mexican", "Chinese", "Indian", "Japanese", "Thai",
    "French", "Mediterranean", "American", "Greek", "Spanish", "Korean"
  ];

  const diets = [
    "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Keto",
    "Paleo", "Low-Carb", "High-Protein", "Low-Fat"
  ];

  const intolerances = [
    "Dairy", "Egg", "Gluten", "Grain", "Peanut", "Seafood",
    "Sesame", "Shellfish", "Soy", "Sulfite", "Tree Nut", "Wheat"
  ];

  useEffect(() => {
    if (isLoggedIn) {
      fetchSavedRecipes();
    }
  }, [isLoggedIn, fetchSavedRecipes]);

  useEffect(() => {
    fetchRecipes();
  }, [searchParams]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);
      if (selectedCuisine) params.append('cuisine', selectedCuisine);
      if (selectedDiet) params.append('diet', selectedDiet);
      if (selectedIntolerances.length > 0) params.append('intolerances', selectedIntolerances.join(','));

      const endpoint = params.toString() ? `/api/recipes/search?${params.toString()}` : '/api/recipes';

      // console.log('[DEBUG] Fetching recipes from:', endpoint);
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      // console.log('[DEBUG] Recipes data:', data);
      setRecipes(data.recipes || []);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Failed to load recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCuisine) params.set('cuisine', selectedCuisine);
    if (selectedDiet) params.set('diet', selectedDiet);
    if (selectedIntolerances.length > 0) params.set('intolerances', selectedIntolerances.join(','));
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleNutrientFilter = () => {
    const params = new URLSearchParams();
    Object.entries(nutrientFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    params.set('page', '1');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCuisine("");
    setSelectedDiet("");
    setSelectedIntolerances([]);
    setNutrientFilters({
      minProtein: "", maxProtein: "", minCarbs: "", maxCarbs: "",
      minFat: "", maxFat: "", minCalories: "", maxCalories: "",
      minFiber: "", maxFiber: "", minSugar: "", maxSugar: ""
    });
    setSearchParams({});
  };

  const toggleIntolerance = (intolerance: string) => {
    setSelectedIntolerances(prev =>
      prev.includes(intolerance)
        ? prev.filter(i => i !== intolerance)
        : [...prev, intolerance]
    );
  };

  const updateNutrientFilter = (key: string, value: string) => {
    setNutrientFilters(prev => ({ ...prev, [key]: value }));
  };

  const isRecipeSaved = (recipeId: string) => savedRecipes.includes(recipeId);

  const handleLikeToggle = async (recipeId: string) => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    try {
      if (isRecipeSaved(recipeId)) {
        await removeSavedRecipe(recipeId);
      } else {
        await addSavedRecipe(recipeId);
      }
    } catch (error) {
      console.error('Error toggling recipe save:', error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#E6F2EA] pt-16">
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 allerchef-text-gradient">Recipes</h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8">Please log in to view recipes</p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="allerchef-btn-primary"
            >
              Login to Continue
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 allerchef-text-gradient">Discover Recipes</h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground">Find your next favorite meal</p>
        </div>

        {/* Search and Filters */}
        <div className="allerchef-card mb-6 sm:mb-8 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 sm:py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="allerchef-btn-secondary flex items-center gap-2 text-sm sm:text-base"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="allerchef-btn-primary text-sm sm:text-base"
            >
              Search
            </button>
          </div>

          {/* Filter Panel */}
          {isFilterOpen && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Basic Filters */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">Basic Filters</h3>

                  {/* Cuisine Filter */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Cuisine</label>
                    <select
                      value={selectedCuisine}
                      onChange={(e) => setSelectedCuisine(e.target.value)}
                      className="w-full p-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    >
                      <option value="">All Cuisines</option>
                      {cuisines.map((cuisine) => (
                        <option key={cuisine} value={cuisine}>{cuisine}</option>
                      ))}
                    </select>
                  </div>

                  {/* Diet Filter */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">Diet</label>
                    <select
                      value={selectedDiet}
                      onChange={(e) => setSelectedDiet(e.target.value)}
                      className="w-full p-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    >
                      <option value="">All Diets</option>
                      {diets.map((diet) => (
                        <option key={diet} value={diet}>{diet}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Intolerances */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">Allergies & Intolerances</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {intolerances.map((intolerance) => (
                      <label key={intolerance} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedIntolerances.includes(intolerance)}
                          onChange={() => toggleIntolerance(intolerance)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-xs sm:text-sm">{intolerance}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Nutrient Filters */}
                <div className="space-y-3 sm:space-y-4 md:col-span-2 lg:col-span-1">
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">Nutrients</h3>

                  {/* Protein */}
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-medium">Protein (g)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={nutrientFilters.minProtein}
                        onChange={(e) => updateNutrientFilter('minProtein', e.target.value)}
                        className="w-1/2 p-2 border border-input rounded-lg text-xs sm:text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={nutrientFilters.maxProtein}
                        onChange={(e) => updateNutrientFilter('maxProtein', e.target.value)}
                        className="w-1/2 p-2 border border-input rounded-lg text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  {/* Calories */}
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-medium">Calories</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={nutrientFilters.minCalories}
                        onChange={(e) => updateNutrientFilter('minCalories', e.target.value)}
                        className="w-1/2 p-2 border border-input rounded-lg text-xs sm:text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={nutrientFilters.maxCalories}
                        onChange={(e) => updateNutrientFilter('maxCalories', e.target.value)}
                        className="w-1/2 p-2 border border-input rounded-lg text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  {/* Carbs */}
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-medium">Carbs (g)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={nutrientFilters.minCarbs}
                        onChange={(e) => updateNutrientFilter('minCarbs', e.target.value)}
                        className="w-1/2 p-2 border border-input rounded-lg text-xs sm:text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={nutrientFilters.maxCarbs}
                        onChange={(e) => updateNutrientFilter('maxCarbs', e.target.value)}
                        className="w-1/2 p-2 border border-input rounded-lg text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  {/* Fat */}
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-medium">Fat (g)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={nutrientFilters.minFat}
                        onChange={(e) => updateNutrientFilter('minFat', e.target.value)}
                        className="w-1/2 p-2 border border-input rounded-lg text-xs sm:text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={nutrientFilters.maxFat}
                        onChange={(e) => updateNutrientFilter('maxFat', e.target.value)}
                        className="w-1/2 p-2 border border-input rounded-lg text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  {/* Fiber */}
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-medium">Fiber (g)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={nutrientFilters.minFiber}
                        onChange={(e) => updateNutrientFilter('minFiber', e.target.value)}
                        className="w-1/2 p-2 border border-input rounded-lg text-xs sm:text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={nutrientFilters.maxFiber}
                        onChange={(e) => updateNutrientFilter('maxFiber', e.target.value)}
                        className="w-1/2 p-2 border border-input rounded-lg text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  {/* Sugar */}
                  <div className="space-y-1 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-medium">Sugar (g)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={nutrientFilters.minSugar}
                        onChange={(e) => updateNutrientFilter('minSugar', e.target.value)}
                        className="w-1/2 p-2 border border-input rounded-lg text-xs sm:text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={nutrientFilters.maxSugar}
                        onChange={(e) => updateNutrientFilter('maxSugar', e.target.value)}
                        className="w-1/2 p-2 border border-input rounded-lg text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  {/* Apply Nutrient Filters Button */}
                  <button
                    onClick={handleNutrientFilter}
                    className="w-full allerchef-btn-secondary text-xs sm:text-sm"
                  >
                    Apply Nutrient Filters
                  </button>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 sm:py-16">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-3 sm:mt-4 text-muted-foreground text-sm sm:text-base">Loading recipes...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12 sm:py-16">
            <p className="text-red-500 mb-3 sm:mb-4 text-sm sm:text-base">{error}</p>
            <button
              onClick={fetchRecipes}
              className="allerchef-btn-primary text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Recipes Grid */}
        {!loading && !error && (
          <>
            {recipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {recipes.map((recipe) => (
                  <div key={recipe._id} className="allerchef-card group flex flex-col h-full">
                    {/* Recipe Image */}
                    <div className="relative mb-3 sm:mb-4">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-40 sm:h-48 object-cover rounded-xl"
                      />
                      <button
                        onClick={() => handleLikeToggle(recipe._id || recipe.id?.toString() || '')}
                        className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 bg-white/90 rounded-full hover:bg-white transition-all duration-300"
                      >
                        <Heart
                          className={`h-4 w-4 sm:h-5 sm:w-5 ${isRecipeSaved(recipe._id || recipe.id?.toString() || '')
                            ? 'fill-red-500 text-red-500'
                            : 'text-muted-foreground'
                            }`}
                        />
                      </button>
                    </div>

                    {/* Recipe Info */}
                    <div className="flex flex-col flex-1 space-y-2 sm:space-y-3 p-3 sm:p-4">
                      <h3 className="font-semibold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {recipe.title}
                      </h3>

                      <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                          {(recipe.cookTime || recipe.readyInMinutes) !== undefined && (recipe.cookTime || recipe.readyInMinutes) !== null ?
                            `${recipe.cookTime || recipe.readyInMinutes}min` : 'N/A'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                          {(recipe.servings) !== undefined && (recipe.servings) !== null ?
                            `${recipe.servings} servings` : 'N/A'}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-xs sm:text-sm">
                          {(() => {
                            const calories = recipe.nutrition?.calories;
                            const protein = recipe.nutrition?.protein;
                            const hasCalories = calories !== undefined && calories !== null && calories !== 0;
                            const hasProtein = protein !== undefined && protein !== null &&
                              (typeof protein === 'string' ? protein !== '0g' : protein !== 0);

                            if (!hasCalories && !hasProtein) {
                              return <span className="text-muted-foreground">N/A</span>;
                            }

                            return (
                              <>
                                {hasCalories && (
                                  <span className="font-medium">
                                    {typeof calories === 'string' ? calories : `${calories} cal`}
                                  </span>
                                )}
                                {hasCalories && hasProtein && (
                                  <span className="text-muted-foreground mx-1 sm:mx-2">•</span>
                                )}
                                {hasProtein && (
                                  <span className="font-medium">{protein} protein</span>
                                )}
                              </>
                            );
                          })()}
                        </div>
                        {(() => {
                          const score = recipe.rating || recipe.aggregateLikes;
                          if (score !== undefined && score !== null && score > 0) {
                            return (
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs sm:text-sm font-medium">
                                  {(score / 20).toFixed(1)}
                                </span>
                              </div>
                            );
                          }
                          return (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                              <span className="text-xs sm:text-sm text-muted-foreground">N/A</span>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Tags - Only show if there are tags */}
                      {(() => {
                        const tags = recipe.tags || recipe.dishTypes || [];
                        console.log('Recipe tags for', recipe.title, ':', tags);
                        if (tags.length > 0) {
                          return (
                            <div className="flex flex-wrap gap-1">
                              {tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-secondary text-secondary-foreground text-xs rounded-lg font-medium"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          );
                        }
                        return (
                          <div className="text-xs text-muted-foreground">
                            N/A
                          </div>
                        );
                      })()}

                      {/* Spacer to push button to bottom */}
                      <div className="flex-1"></div>

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
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-foreground">No recipes found or data incomplete.</h3>
                <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
                  Try adjusting your search criteria or browse our recipe collection.
                </p>
                <button
                  onClick={clearFilters}
                  className="allerchef-btn-primary text-sm sm:text-base"
                >
                  Browse All Recipes
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Recipes;