import { useState, useEffect } from 'react';
import { Search, Filter, Heart, Clock, Users, Star } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

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

const Recipes = () => {
  const [searchParams] = useSearchParams();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [selectedNutrients, setSelectedNutrients] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const allergens = [
    'Gluten', 'Dairy', 'Nuts', 'Eggs', 'Soy', 'Shellfish', 'Fish', 'Sesame'
  ];

  const nutrients = [
    'High Protein', 'High Fiber', 'Low Sugar', 'Iron Rich', 'Calcium Rich', 
    'Vitamin C', 'Heart Healthy', 'Low Sodium'
  ];

  // Mock recipe data
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
      isLiked: false
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
      isLiked: false
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
      isLiked: true
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
      isLiked: false
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
      isLiked: false
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
      isLiked: false
    }
  ];

  useEffect(() => {
    setRecipes(mockRecipes);
    
    // Check for filter from URL params
    const filterParam = searchParams.get('filter');
    if (filterParam) {
      const formatted = filterParam.replace('-', ' ');
      if (allergens.some(a => a.toLowerCase() === formatted)) {
        setSelectedAllergens([formatted]);
      } else if (nutrients.some(n => n.toLowerCase() === formatted)) {
        setSelectedNutrients([formatted]);
      }
    }
  }, [searchParams]);

  const toggleLike = (recipeId: string) => {
    setRecipes(prev => 
      prev.map(recipe => 
        recipe.id === recipeId 
          ? { ...recipe, isLiked: !recipe.isLiked }
          : recipe
      )
    );
    
    // In a real app, this would save to localStorage or backend
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    const recipe = recipes.find(r => r.id === recipeId);
    if (recipe) {
      if (recipe.isLiked) {
        // Remove from saved
        const filtered = savedRecipes.filter((r: Recipe) => r.id !== recipeId);
        localStorage.setItem('savedRecipes', JSON.stringify(filtered));
      } else {
        // Add to saved
        savedRecipes.push({ ...recipe, isLiked: true });
        localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
      }
    }
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = searchTerm === '' || 
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesAllergens = selectedAllergens.length === 0 || 
      selectedAllergens.every(allergen => 
        recipe.tags.some(tag => tag.toLowerCase().includes(allergen.toLowerCase() + '-free'))
      );
    
    const matchesNutrients = selectedNutrients.length === 0 ||
      selectedNutrients.some(nutrient => 
        recipe.tags.some(tag => tag.toLowerCase().includes(nutrient.toLowerCase()))
      );
    
    return matchesSearch && matchesAllergens && matchesNutrients;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 allerchef-text-gradient">Recipe Discovery</h1>
        <p className="text-xl text-muted-foreground">Find delicious recipes that fit your dietary needs</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="allerchef-card">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search recipes, ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          {/* Filter Button */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="allerchef-btn-secondary flex items-center gap-2"
          >
            <Filter className="h-5 w-5" />
            Filters
          </button>
        </div>

        {/* Filters Panel */}
        {isFilterOpen && (
          <div className="mt-6 pt-6 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Allergen Filters */}
            <div>
              <h3 className="font-semibold mb-3 text-foreground">Exclude Allergens</h3>
              <div className="flex flex-wrap gap-2">
                {allergens.map(allergen => (
                  <button
                    key={allergen}
                    onClick={() => {
                      setSelectedAllergens(prev => 
                        prev.includes(allergen)
                          ? prev.filter(a => a !== allergen)
                          : [...prev, allergen]
                      );
                    }}
                    className={`allerchef-pill ${
                      selectedAllergens.includes(allergen)
                        ? 'bg-destructive text-destructive-foreground border-destructive'
                        : ''
                    }`}
                  >
                    {allergen}
                  </button>
                ))}
              </div>
            </div>

            {/* Nutrient Filters */}
            <div>
              <h3 className="font-semibold mb-3 text-foreground">Nutritional Focus</h3>
              <div className="flex flex-wrap gap-2">
                {nutrients.map(nutrient => (
                  <button
                    key={nutrient}
                    onClick={() => {
                      setSelectedNutrients(prev => 
                        prev.includes(nutrient)
                          ? prev.filter(n => n !== nutrient)
                          : [...prev, nutrient]
                      );
                    }}
                    className={`allerchef-pill ${
                      selectedNutrients.includes(nutrient)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : ''
                    }`}
                  >
                    {nutrient}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-foreground">
          {filteredRecipes.length} Recipes Found
        </h2>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map(recipe => (
          <div key={recipe.id} className="allerchef-card group">
            {/* Recipe Image */}
            <div className="relative mb-4">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-48 object-cover rounded-xl"
              />
              <button
                onClick={() => toggleLike(recipe.id)}
                className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-all duration-300"
              >
                <Heart 
                  className={`h-5 w-5 ${
                    recipe.isLiked 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-muted-foreground'
                  }`} 
                />
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

      {/* Empty State */}
      {filteredRecipes.length === 0 && (
        <div className="text-center py-16">
          <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-foreground">No recipes found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
};

export default Recipes;