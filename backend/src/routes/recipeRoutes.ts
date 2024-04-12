import express from "express";
import { Recipe } from "../models/Recipe";
import { Request, Response } from "express";

const router = express.Router();

// Helper function to fetch from Spoonacular API
const fetchFromSpoonacular = async (endpoint: string) => {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    if (!apiKey) {
        throw new Error("Spoonacular API key not configured");
    }

    const response = await fetch(`https://api.spoonacular.com/recipes/${endpoint}&apiKey=${apiKey}`);
    if (!response.ok) {
        throw new Error(`Spoonacular API error: ${response.status}`);
    }
    return response.json();
};

// GET /api/recipes - Get all recipes (with pagination and search)
router.get("/", async (req: Request, res: Response) => {
    try {
        const {
            page = 1,
            limit = 12,
            search,
            cuisine,
            diet,
            maxReadyTime,
            minProtein,
            maxCalories
        } = req.query;

        const skip = (Number(page) - 1) * Number(limit);

        // Build query
        let query: any = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search as string, 'i')] } }
            ];
        }

        if (cuisine) {
            query.cuisine = { $regex: cuisine, $options: 'i' };
        }

        if (diet) {
            query.diet = { $in: Array.isArray(diet) ? diet : [diet] };
        }

        if (maxReadyTime) {
            query.cookTime = { $lte: Number(maxReadyTime) };
        }

        if (minProtein) {
            query['nutrition.protein'] = { $gte: `${minProtein}g` };
        }

        if (maxCalories) {
            query['nutrition.calories'] = { $lte: Number(maxCalories) };
        }

        const recipes = await Recipe.find(query)
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        const total = await Recipe.countDocuments(query);

        res.json({
            recipes,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        console.error("Error fetching recipes:", error);
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
});

// GET /api/recipes/search - Search recipes from Spoonacular
router.get("/search", async (req: Request, res: Response) => {
    try {
        const {
            query,
            cuisine,
            diet,
            intolerances,
            maxReadyTime,
            minProtein,
            maxCalories,
            number = 12
        } = req.query;

        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }

        // Build Spoonacular API endpoint
        let endpoint = `complexSearch?query=${encodeURIComponent(query as string)}&number=${number}&addRecipeInformation=true&fillIngredients=true&addRecipeNutrition=true`;

        if (cuisine) endpoint += `&cuisine=${cuisine}`;
        if (diet) endpoint += `&diet=${diet}`;
        if (intolerances) endpoint += `&intolerances=${intolerances}`;
        if (maxReadyTime) endpoint += `&maxReadyTime=${maxReadyTime}`;
        if (minProtein) endpoint += `&minProtein=${minProtein}`;
        if (maxCalories) endpoint += `&maxCalories=${maxCalories}`;

        const data = await fetchFromSpoonacular(endpoint);

        // Transform the data to match our expected format
        const transformedRecipes = data.results.map((recipe: any) => {
            console.log(`[DEBUG] Processing recipe ${recipe.id}:`, {
                title: recipe.title,
                dishTypes: recipe.dishTypes,
                tags: recipe.dishTypes || [],
                readyInMinutes: recipe.readyInMinutes,
                servings: recipe.servings,
                nutrition: recipe.nutrition
            });

            return {
                _id: undefined, // Not in DB yet
                id: recipe.id,
                spoonacularId: recipe.id,
                title: recipe.title,
                image: recipe.image,
                summary: recipe.summary || '',
                instructions: recipe.instructions || '',
                extendedIngredients: recipe.extendedIngredients || [],
                ingredients: recipe.extendedIngredients || [],
                nutrition: {
                    calories: recipe.nutrition?.nutrients?.find((n: any) => n.name === "Calories")?.amount || 0,
                    protein: `${recipe.nutrition?.nutrients?.find((n: any) => n.name === "Protein")?.amount || 0}g`,
                    fat: `${recipe.nutrition?.nutrients?.find((n: any) => n.name === "Fat")?.amount || 0}g`,
                    carbs: `${recipe.nutrition?.nutrients?.find((n: any) => n.name === "Carbohydrates")?.amount || 0}g`,
                    nutrients: recipe.nutrition?.nutrients || []
                },
                cookTime: recipe.readyInMinutes || 0,
                readyInMinutes: recipe.readyInMinutes || 0,
                servings: recipe.servings || 1,
                cuisine: recipe.cuisines?.[0] || "General",
                cuisines: recipe.cuisines || [],
                diet: recipe.diets || [],
                diets: recipe.diets || [],
                tags: recipe.dishTypes || [],
                dishTypes: recipe.dishTypes || [],
                difficulty: recipe.readyInMinutes ? (recipe.readyInMinutes <= 30 ? "Easy" : recipe.readyInMinutes <= 60 ? "Medium" : "Hard") : "Unknown",
                rating: recipe.spoonacularScore || 0,
                aggregateLikes: recipe.aggregateLikes || 0,
                reviewCount: 0
            };
        });

        // Store recipes in database for future use
        const recipesToSave = transformedRecipes.map((recipe: any) => ({
            spoonacularId: recipe.spoonacularId,
            title: recipe.title,
            image: recipe.image,
            summary: recipe.summary,
            cookTime: recipe.cookTime,
            servings: recipe.servings,
            cuisine: recipe.cuisine,
            diet: recipe.diet,
            tags: recipe.tags,
            nutrition: recipe.nutrition
        }));

        // Save recipes to database (upsert to avoid duplicates)
        for (const recipeData of recipesToSave) {
            await Recipe.findOneAndUpdate(
                { spoonacularId: recipeData.spoonacularId },
                recipeData,
                { upsert: true, new: true }
            );
        }

        res.json({
            recipes: transformedRecipes,
            totalResults: data.totalResults
        });
    } catch (error) {
        console.error("Error searching recipes:", error);
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
});

// GET /api/recipes/nutrients - Find recipes by specific nutrients
router.get("/nutrients", async (req: Request, res: Response) => {
    try {
        const {
            minProtein,
            maxProtein,
            minCarbs,
            maxCarbs,
            minFat,
            maxFat,
            minCalories,
            maxCalories,
            minFiber,
            maxFiber,
            minSugar,
            maxSugar,
            number = 12
        } = req.query;

        // Build nutrient search parameters
        const params = new URLSearchParams();
        params.append('number', number as string);

        if (minProtein) params.append('minProtein', minProtein as string);
        if (maxProtein) params.append('maxProtein', maxProtein as string);
        if (minCarbs) params.append('minCarbs', minCarbs as string);
        if (maxCarbs) params.append('maxCarbs', maxCarbs as string);
        if (minFat) params.append('minFat', minFat as string);
        if (maxFat) params.append('maxFat', maxFat as string);
        if (minCalories) params.append('minCalories', minCalories as string);
        if (maxCalories) params.append('maxCalories', maxCalories as string);
        if (minFiber) params.append('minFiber', minFiber as string);
        if (maxFiber) params.append('maxFiber', maxFiber as string);
        if (minSugar) params.append('minSugar', minSugar as string);
        if (maxSugar) params.append('maxSugar', maxSugar as string);

        const endpoint = `findByNutrients?${params.toString()}`;
        const data = await fetchFromSpoonacular(endpoint);

        // Transform and save recipes
        const transformedRecipes = data.map((recipeItem: any) => ({
            _id: undefined, // Not in DB yet
            id: recipeItem.id,
            spoonacularId: recipeItem.id,
            title: recipeItem.title,
            image: recipeItem.image,
            summary: '', // Not provided by this endpoint
            instructions: '', // Not provided by this endpoint
            extendedIngredients: [], // Not provided by this endpoint
            ingredients: [], // Not provided by this endpoint
            nutrition: {
                calories: recipeItem.calories || 0,
                protein: `${recipeItem.protein || 0}g`,
                fat: `${recipeItem.fat || 0}g`,
                carbs: `${recipeItem.carbs || 0}g`,
                nutrients: []
            },
            cookTime: 0, // Not provided by this endpoint
            readyInMinutes: 0, // Not provided by this endpoint
            servings: 1, // Not provided by this endpoint
            cuisine: "General",
            cuisines: [],
            diet: [],
            diets: [],
            tags: [],
            dishTypes: [],
            difficulty: "Unknown",
            rating: 0,
            aggregateLikes: 0,
            reviewCount: 0
        }));

        // Save to database
        const recipesToSave = transformedRecipes.map((recipe: any) => ({
            spoonacularId: recipe.spoonacularId,
            title: recipe.title,
            image: recipe.image,
            cookTime: recipe.cookTime,
            servings: recipe.servings,
            cuisine: recipe.cuisine,
            diet: recipe.diet,
            tags: recipe.tags,
            nutrition: recipe.nutrition
        }));

        for (const recipeData of recipesToSave) {
            await Recipe.findOneAndUpdate(
                { spoonacularId: recipeData.spoonacularId },
                recipeData,
                { upsert: true, new: true }
            );
        }

        res.json({
            recipes: transformedRecipes,
            totalResults: data.length
        });
    } catch (error) {
        console.error("Error fetching nutrient-based recipes:", error);
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
});

// GET /api/recipes/allergy-safe - Find recipes safe for specific allergies/intolerances
router.get("/allergy-safe", async (req: Request, res: Response) => {
    try {
        const {
            intolerances,
            allergies,
            diet,
            cuisine,
            maxReadyTime,
            number = 12
        } = req.query;

        // Build allergy-safe search endpoint
        let endpoint = `complexSearch?number=${number}&addRecipeInformation=true&fillIngredients=true&addRecipeNutrition=true`;

        // Handle intolerances (Spoonacular parameter)
        if (intolerances) {
            endpoint += `&intolerances=${intolerances}`;
        }

        // Handle diet restrictions
        if (diet) {
            endpoint += `&diet=${diet}`;
        }

        // Handle cuisine
        if (cuisine) {
            endpoint += `&cuisine=${cuisine}`;
        }

        // Handle max ready time
        if (maxReadyTime) {
            endpoint += `&maxReadyTime=${maxReadyTime}`;
        }

        const data = await fetchFromSpoonacular(endpoint);

        // Transform the data to match our expected format
        const transformedRecipes = data.results.map((recipe: any) => ({
            _id: undefined, // Not in DB yet
            id: recipe.id,
            spoonacularId: recipe.id,
            title: recipe.title,
            image: recipe.image,
            summary: recipe.summary || '',
            instructions: recipe.instructions || '',
            extendedIngredients: recipe.extendedIngredients || [],
            ingredients: recipe.extendedIngredients || [],
            nutrition: {
                calories: recipe.nutrition?.nutrients?.find((n: any) => n.name === "Calories")?.amount || 0,
                protein: `${recipe.nutrition?.nutrients?.find((n: any) => n.name === "Protein")?.amount || 0}g`,
                fat: `${recipe.nutrition?.nutrients?.find((n: any) => n.name === "Fat")?.amount || 0}g`,
                carbs: `${recipe.nutrition?.nutrients?.find((n: any) => n.name === "Carbohydrates")?.amount || 0}g`,
                nutrients: recipe.nutrition?.nutrients || []
            },
            cookTime: recipe.readyInMinutes || 0,
            readyInMinutes: recipe.readyInMinutes || 0,
            servings: recipe.servings || 1,
            cuisine: recipe.cuisines?.[0] || "General",
            cuisines: recipe.cuisines || [],
            diet: recipe.diets || [],
            diets: recipe.diets || [],
            tags: recipe.dishTypes || [],
            dishTypes: recipe.dishTypes || [],
            difficulty: recipe.readyInMinutes ? (recipe.readyInMinutes <= 30 ? "Easy" : recipe.readyInMinutes <= 60 ? "Medium" : "Hard") : "Unknown",
            rating: recipe.spoonacularScore || 0,
            aggregateLikes: recipe.aggregateLikes || 0,
            reviewCount: 0
        }));

        // Store recipes in database
        const recipesToSave = transformedRecipes.map((recipe: any) => ({
            spoonacularId: recipe.spoonacularId,
            title: recipe.title,
            image: recipe.image,
            summary: recipe.summary,
            cookTime: recipe.cookTime,
            servings: recipe.servings,
            cuisine: recipe.cuisine,
            diet: recipe.diet,
            tags: recipe.tags,
            nutrition: recipe.nutrition
        }));

        // Save to database
        for (const recipeData of recipesToSave) {
            await Recipe.findOneAndUpdate(
                { spoonacularId: recipeData.spoonacularId },
                recipeData,
                { upsert: true, new: true }
            );
        }

        res.json({
            recipes: transformedRecipes,
            totalResults: data.totalResults,
            intolerances: intolerances ? intolerances.toString().split(',') : [],
            diet: diet || null
        });
    } catch (error) {
        console.error("Error fetching allergy-safe recipes:", error);
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
});

// GET /api/recipes/:id - Get recipe by ID
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Check if it's a valid MongoDB ObjectId
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);

        let recipe = null;

        if (isValidObjectId) {
            // Try to find by MongoDB _id first
            recipe = await Recipe.findById(id);
        }

        // If not found by _id or not a valid ObjectId, try by spoonacularId
        if (!recipe) {
            recipe = await Recipe.findOne({ spoonacularId: id });
        }

        // Check if we need to fetch fresh data from Spoonacular
        const needsFreshData = !recipe ||
            !recipe.ingredients || recipe.ingredients.length === 0 ||
            !recipe.instructions ||
            !recipe.tags || recipe.tags.length === 0;

        // If we need fresh data or don't have a recipe, fetch from Spoonacular API
        if (needsFreshData) {
            const apiKey = process.env.SPOONACULAR_API_KEY;
            if (!apiKey) {
                return res.status(500).json({ message: "Spoonacular API key not configured" });
            }

            const spoonacularId = recipe?.spoonacularId || id;
            const url = `https://api.spoonacular.com/recipes/${spoonacularId}/information?includeNutrition=true&apiKey=${apiKey}`;
            console.log(`[DEBUG] Fetching fresh data from Spoonacular: ${url}`);
            const response = await fetch(url);
            if (!response.ok) {
                const text = await response.text();
                console.error(`[ERROR] Spoonacular fetch failed: ${response.status} ${text}`);
                return res.status(404).json({ message: "Recipe not found from Spoonacular", status: response.status, details: text });
            }

            const data = await response.json();
            console.log('[DEBUG] Fresh Spoonacular response received');

            // Return the original Spoonacular data structure with additional transformed fields
            recipe = {
                // Original Spoonacular fields
                id: data.id,
                title: data.title || '',
                image: data.image || '',
                summary: data.summary || '',
                instructions: data.instructions || '',
                extendedIngredients: Array.isArray(data.extendedIngredients) ? data.extendedIngredients : [],
                nutrition: data.nutrition || {},
                readyInMinutes: data.readyInMinutes || 0,
                servings: data.servings || 1,
                cuisines: Array.isArray(data.cuisines) ? data.cuisines : [],
                diets: Array.isArray(data.diets) ? data.diets : [],
                dishTypes: Array.isArray(data.dishTypes) ? data.dishTypes : [],
                aggregateLikes: data.aggregateLikes || 0,
                spoonacularScore: data.spoonacularScore || 0,

                // Transformed fields for compatibility
                spoonacularId: data.id,
                ingredients: Array.isArray(data.extendedIngredients)
                    ? data.extendedIngredients.map((ing: any) => ({
                        id: ing.id,
                        name: ing.name,
                        amount: ing.amount,
                        unit: ing.unit
                    })) : [],
                cookTime: data.readyInMinutes || 0,
                cuisine: Array.isArray(data.cuisines) && data.cuisines.length > 0 ? data.cuisines[0] : "General",
                diet: Array.isArray(data.diets) ? data.diets : [],
                tags: Array.isArray(data.dishTypes) ? data.dishTypes : [],
                difficulty: data.readyInMinutes ? (data.readyInMinutes <= 30 ? "Easy" : data.readyInMinutes <= 60 ? "Medium" : "Hard") : "Unknown",
                rating: data.spoonacularScore || 0,
                reviewCount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                _id: undefined // Not in DB
            };

            // Update the database record with fresh data if it exists
            if (recipe && recipe.spoonacularId) {
                const updateData = {
                    title: recipe.title,
                    image: recipe.image,
                    summary: recipe.summary,
                    instructions: recipe.instructions,
                    ingredients: recipe.ingredients,
                    nutrition: recipe.nutrition,
                    cookTime: recipe.cookTime,
                    servings: recipe.servings,
                    cuisine: recipe.cuisine,
                    diet: recipe.diet,
                    tags: recipe.tags,
                    difficulty: recipe.difficulty,
                    rating: recipe.rating,
                    updatedAt: new Date()
                };

                await Recipe.findOneAndUpdate(
                    { spoonacularId: recipe.spoonacularId },
                    updateData,
                    { upsert: true, new: true }
                );
                console.log('[DEBUG] Updated database record with fresh data');
            }
        }

        res.json(recipe);
    } catch (error) {
        console.error("Error fetching recipe:", error);
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
});

// GET /api/recipes/spoonacular/:id - Fetch recipe by Spoonacular ID from Spoonacular API
router.get("/spoonacular/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const apiKey = process.env.SPOONACULAR_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: "Spoonacular API key not configured" });
        }
        const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=${apiKey}`);
        if (!response.ok) {
            return res.status(404).json({ message: "Recipe not found in Spoonacular" });
        }
        const data = await response.json();
        // Transform to your schema
        const recipe = {
            spoonacularId: data.id,
            title: data.title,
            image: data.image,
            summary: data.summary || "",
            instructions: data.instructions || "",
            ingredients: (data.extendedIngredients || []).map((ing: any) => ({
                id: ing.id,
                name: ing.name,
                amount: ing.amount,
                unit: ing.unit
            })),
            nutrition: {
                calories: data.nutrition?.nutrients?.find((n: any) => n.name === "Calories")?.amount || 0,
                protein: `${data.nutrition?.nutrients?.find((n: any) => n.name === "Protein")?.amount || 0}g`,
                fat: `${data.nutrition?.nutrients?.find((n: any) => n.name === "Fat")?.amount || 0}g`,
                carbs: `${data.nutrition?.nutrients?.find((n: any) => n.name === "Carbohydrates")?.amount || 0}g`
            },
            cookTime: data.readyInMinutes || 0,
            servings: data.servings || 1,
            cuisine: data.cuisines?.[0] || "General",
            diet: data.diets || [],
            tags: data.dishTypes || [],
            difficulty: data.readyInMinutes <= 30 ? "Easy" : data.readyInMinutes <= 60 ? "Medium" : "Hard",
            rating: data.spoonacularScore || 0,
            reviewCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            _id: undefined // Not in DB
        };
        res.json(recipe);
    } catch (error) {
        console.error("Error fetching recipe from Spoonacular:", error);
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
});

// GET /api/recipes/random/random - Get random recipes
router.get("/random/random", async (req: Request, res: Response) => {
    try {
        const { number = 6, tags } = req.query;

        let endpoint = `random?number=${number}`;
        if (tags) endpoint += `&tags=${tags}`;

        const data = await fetchFromSpoonacular(endpoint);

        // Save random recipes to database
        const recipesToSave = data.recipes.map((recipe: any) => ({
            spoonacularId: recipe.id,
            title: recipe.title,
            image: recipe.image,
            summary: recipe.summary,
            cookTime: recipe.readyInMinutes || 0,
            servings: recipe.servings || 1,
            cuisine: recipe.cuisines?.[0] || "General",
            diet: recipe.diets || [],
            tags: recipe.dishTypes || []
        }));

        for (const recipeData of recipesToSave) {
            await Recipe.findOneAndUpdate(
                { spoonacularId: recipeData.spoonacularId },
                recipeData,
                { upsert: true, new: true }
            );
        }

        res.json({ recipes: data.recipes });
    } catch (error) {
        console.error("Error fetching random recipes:", error);
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
});

// GET /api/recipes/cuisines/cuisines - Get available cuisines
router.get("/cuisines/cuisines", async (req: Request, res: Response) => {
    try {
        const cuisines = await Recipe.distinct("cuisine");
        res.json({ cuisines: cuisines.filter(c => c && c !== "General") });
    } catch (error) {
        console.error("Error fetching cuisines:", error);
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
});

// GET /api/recipes/diets/diets - Get available diets
router.get("/diets/diets", async (req: Request, res: Response) => {
    try {
        const diets = await Recipe.distinct("diet");
        res.json({ diets: diets.flat().filter(d => d) });
    } catch (error) {
        console.error("Error fetching diets:", error);
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
});

export default router; 