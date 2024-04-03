import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from './lib/db';
import { Recipe } from './models/Recipe';

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
        if (url?.includes('/search')) {
            // GET /api/recipes/search - Search recipes
            if (method === 'GET') {
                const { query: searchQuery, cuisine, diet, intolerances, maxReadyTime } = query;

                let apiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.SPOONACULAR_API_KEY}&addRecipeInformation=true&number=20`;

                if (searchQuery) apiUrl += `&query=${searchQuery}`;
                if (cuisine) apiUrl += `&cuisine=${cuisine}`;
                if (diet) apiUrl += `&diet=${diet}`;
                if (intolerances) apiUrl += `&intolerances=${intolerances}`;
                if (maxReadyTime) apiUrl += `&maxReadyTime=${maxReadyTime}`;

                const response = await fetch(apiUrl);
                const data = await response.json();

                if (data.results) {
                    // Transform and save recipes
                    const transformedRecipes = data.results.map((recipe: any) => ({
                        spoonacularId: recipe.id,
                        title: recipe.title,
                        description: recipe.summary.replace(/<[^>]*>/g, ''),
                        image: recipe.image,
                        ingredients: recipe.extendedIngredients?.map((ing: any) => ing.original) || [],
                        instructions: recipe.analyzedInstructions?.[0]?.steps?.map((step: any) => step.step) || [],
                        cookingTime: recipe.readyInMinutes || 0,
                        servings: recipe.servings || 1,
                        difficulty: recipe.readyInMinutes <= 30 ? 'easy' : recipe.readyInMinutes <= 60 ? 'medium' : 'hard',
                        cuisine: recipe.cuisines?.[0] || 'International',
                        tags: recipe.dishTypes || [],
                        nutrition: {
                            calories: recipe.nutrition?.nutrients?.find((n: any) => n.name === 'Calories')?.amount || 0,
                            protein: recipe.nutrition?.nutrients?.find((n: any) => n.name === 'Protein')?.amount || 0,
                            carbs: recipe.nutrition?.nutrients?.find((n: any) => n.name === 'Carbohydrates')?.amount || 0,
                            fat: recipe.nutrition?.nutrients?.find((n: any) => n.name === 'Fat')?.amount || 0,
                            fiber: recipe.nutrition?.nutrients?.find((n: any) => n.name === 'Fiber')?.amount || 0,
                            sugar: recipe.nutrition?.nutrients?.find((n: any) => n.name === 'Sugar')?.amount || 0
                        },
                        rating: (recipe.spoonacularScore || 0) / 20 // Convert to 5-star scale
                    }));

                    // Save to database
                    for (const recipeData of transformedRecipes) {
                        await Recipe.findOneAndUpdate(
                            { spoonacularId: recipeData.spoonacularId },
                            recipeData,
                            { upsert: true, new: true }
                        );
                    }

                    res.json({ recipes: transformedRecipes });
                } else {
                    res.json({ recipes: [] });
                }
            }
        } else if (url?.includes('/allergy-safe')) {
            // GET /api/recipes/allergy-safe - Get allergy-safe recipes
            if (method === 'GET') {
                const { intolerances } = query;

                let apiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.SPOONACULAR_API_KEY}&addRecipeInformation=true&number=20`;

                if (intolerances) apiUrl += `&intolerances=${intolerances}`;

                const response = await fetch(apiUrl);
                const data = await response.json();

                if (data.results) {
                    const transformedRecipes = data.results.map((recipe: any) => ({
                        spoonacularId: recipe.id,
                        title: recipe.title,
                        description: recipe.summary.replace(/<[^>]*>/g, ''),
                        image: recipe.image,
                        ingredients: recipe.extendedIngredients?.map((ing: any) => ing.original) || [],
                        instructions: recipe.analyzedInstructions?.[0]?.steps?.map((step: any) => step.step) || [],
                        cookingTime: recipe.readyInMinutes || 0,
                        servings: recipe.servings || 1,
                        difficulty: recipe.readyInMinutes <= 30 ? 'easy' : recipe.readyInMinutes <= 60 ? 'medium' : 'hard',
                        cuisine: recipe.cuisines?.[0] || 'International',
                        tags: recipe.dishTypes || [],
                        nutrition: {
                            calories: recipe.nutrition?.nutrients?.find((n: any) => n.name === 'Calories')?.amount || 0,
                            protein: recipe.nutrition?.nutrients?.find((n: any) => n.name === 'Protein')?.amount || 0,
                            carbs: recipe.nutrition?.nutrients?.find((n: any) => n.name === 'Carbohydrates')?.amount || 0,
                            fat: recipe.nutrition?.nutrients?.find((n: any) => n.name === 'Fat')?.amount || 0,
                            fiber: recipe.nutrition?.nutrients?.find((n: any) => n.name === 'Fiber')?.amount || 0,
                            sugar: recipe.nutrition?.nutrients?.find((n: any) => n.name === 'Sugar')?.amount || 0
                        },
                        rating: (recipe.spoonacularScore || 0) / 20
                    }));

                    // Save to database
                    for (const recipeData of transformedRecipes) {
                        await Recipe.findOneAndUpdate(
                            { spoonacularId: recipeData.spoonacularId },
                            recipeData,
                            { upsert: true, new: true }
                        );
                    }

                    res.json({ recipes: transformedRecipes });
                } else {
                    res.json({ recipes: [] });
                }
            }
        } else if (url?.includes('/spoonacular/')) {
            // GET /api/recipes/spoonacular/:id - Get recipe by Spoonacular ID
            if (method === 'GET') {
                const spoonacularId = url.split('/spoonacular/')[1];

                // Fetch from Spoonacular API
                const response = await fetch(`https://api.spoonacular.com/recipes/${spoonacularId}/information?apiKey=${process.env.SPOONACULAR_API_KEY}`);
                const data = await response.json();

                if (data.id) {
                    const recipe = {
                        spoonacularId: data.id,
                        title: data.title,
                        description: data.summary.replace(/<[^>]*>/g, ''),
                        image: data.image,
                        ingredients: data.extendedIngredients?.map((ing: any) => ing.original) || [],
                        instructions: data.analyzedInstructions?.[0]?.steps?.map((step: any) => step.step) || [],
                        cookingTime: data.readyInMinutes || 0,
                        servings: data.servings || 1,
                        difficulty: data.readyInMinutes <= 30 ? 'easy' : data.readyInMinutes <= 60 ? 'medium' : 'hard',
                        cuisine: data.cuisines?.[0] || 'International',
                        tags: data.dishTypes || [],
                        nutrition: {
                            calories: data.nutrition?.nutrients?.find((n: any) => n.name === 'Calories')?.amount || 0,
                            protein: data.nutrition?.nutrients?.find((n: any) => n.name === 'Protein')?.amount || 0,
                            carbs: data.nutrition?.nutrients?.find((n: any) => n.name === 'Carbohydrates')?.amount || 0,
                            fat: data.nutrition?.nutrients?.find((n: any) => n.name === 'Fat')?.amount || 0,
                            fiber: data.nutrition?.nutrients?.find((n: any) => n.name === 'Fiber')?.amount || 0,
                            sugar: data.nutrition?.nutrients?.find((n: any) => n.name === 'Sugar')?.amount || 0
                        },
                        rating: (data.spoonacularScore || 0) / 20
                    };

                    res.json(recipe);
                } else {
                    res.status(404).json({ message: "Recipe not found" });
                }
            }
        } else if (query.id) {
            // GET /api/recipes/:id - Get recipe by ID
            if (method === 'GET') {
                const { id } = query;

                // First try to get from database
                let recipe = await Recipe.findById(id);

                if (!recipe) {
                    // If not in database, fetch from Spoonacular
                    const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${process.env.SPOONACULAR_API_KEY}`);
                    const data = await response.json();

                    if (data.id) {
                        recipe = await Recipe.findOneAndUpdate(
                            { spoonacularId: data.id },
                            {
                                spoonacularId: data.id,
                                title: data.title,
                                description: data.summary.replace(/<[^>]*>/g, ''),
                                image: data.image,
                                ingredients: data.extendedIngredients?.map((ing: any) => ing.original) || [],
                                instructions: data.analyzedInstructions?.[0]?.steps?.map((step: any) => step.step) || [],
                                cookingTime: data.readyInMinutes || 0,
                                servings: data.servings || 1,
                                difficulty: data.readyInMinutes <= 30 ? 'easy' : data.readyInMinutes <= 60 ? 'medium' : 'hard',
                                cuisine: data.cuisines?.[0] || 'International',
                                tags: data.dishTypes || [],
                                nutrition: {
                                    calories: data.nutrition?.nutrients?.find((n: any) => n.name === 'Calories')?.amount || 0,
                                    protein: data.nutrition?.nutrients?.find((n: any) => n.name === 'Protein')?.amount || 0,
                                    carbs: data.nutrition?.nutrients?.find((n: any) => n.name === 'Carbohydrates')?.amount || 0,
                                    fat: data.nutrition?.nutrients?.find((n: any) => n.name === 'Fat')?.amount || 0,
                                    fiber: data.nutrition?.nutrients?.find((n: any) => n.name === 'Fiber')?.amount || 0,
                                    sugar: data.nutrition?.nutrients?.find((n: any) => n.name === 'Sugar')?.amount || 0
                                },
                                rating: (data.spoonacularScore || 0) / 20
                            },
                            { upsert: true, new: true }
                        );
                    }
                }

                if (!recipe) {
                    return res.status(404).json({ message: "Recipe not found" });
                }

                res.json(recipe);
            }
        } else {
            // GET /api/recipes - Get all recipes
            if (method === 'GET') {
                const recipes = await Recipe.find().sort({ createdAt: -1 }).limit(20);
                res.json({ recipes });
            }
        }
    } catch (error) {
        console.error("Error in recipes API:", error);
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
} 