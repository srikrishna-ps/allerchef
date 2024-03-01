import { useState, useEffect } from 'react';
import { Heart, Clock, Users, Star, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';

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
}

const Saved = () => {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    setSavedRecipes(saved);
  }, []);

  const removeSaved = (recipeId: string) => {
    const updated = savedRecipes.filter(recipe => recipe.id !== recipeId);
    setSavedRecipes(updated);
    localStorage.setItem('savedRecipes', JSON.stringify(updated));
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 allerchef-text-gradient">Saved Recipes</h1>
        <p className="text-xl text-muted-foreground">Your personal collection of favorite recipes</p>
      </div>

      {/* Stats Card */}
      <div className="allerchef-card bg-secondary">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{savedRecipes.length}</div>
            <div className="text-muted-foreground">Saved Recipes</div>
          </div>
          <div>
            <Clock className="h-8 w-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {Math.round(savedRecipes.reduce((acc, recipe) => 
                acc + parseInt(recipe.cookTime), 0) / savedRecipes.length || 0)}m
            </div>
            <div className="text-muted-foreground">Avg Cook Time</div>
          </div>
          <div>
            <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">4.8</div>
            <div className="text-muted-foreground">Avg Rating</div>
          </div>
        </div>
      </div>

      {/* Saved Recipes Grid */}
      {savedRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedRecipes.map(recipe => (
            <div key={recipe.id} className="allerchef-card group">
              {/* Recipe Image */}
              <div className="relative mb-4">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-48 object-cover rounded-xl"
                />
                <button
                  onClick={() => removeSaved(recipe.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-all duration-300"
                >
                  <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                </button>
              </div>

              {/* Recipe Info */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                  {recipe.title}
                </h3>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {recipe.cookTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {recipe.servings} servings
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <span className="font-medium">{recipe.calories}</span> cal
                    <span className="text-muted-foreground mx-2">•</span>
                    <span className="font-medium">{recipe.protein}</span> protein
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {recipe.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-lg font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 allerchef-card">
          <ChefHat className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h3 className="text-2xl font-semibold mb-4 text-foreground">No saved recipes yet</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Start exploring our recipe collection and save your favorites for easy access later.
          </p>
          <Link 
            to="/recipes" 
            className="allerchef-btn-primary inline-flex items-center gap-2"
          >
            <Heart className="h-5 w-5" />
            Discover Recipes
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      {savedRecipes.length > 0 && (
        <div className="allerchef-card text-center">
          <h3 className="text-xl font-semibold mb-4 text-foreground">Quick Actions</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/recipes" 
              className="allerchef-btn-primary"
            >
              Find More Recipes
            </Link>
            <button 
              onClick={() => {
                // In a real app, this would generate a shopping list
                alert('Shopping list feature coming soon!');
              }}
              className="allerchef-btn-secondary"
            >
              Generate Shopping List
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Saved;