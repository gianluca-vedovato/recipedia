import { useQuery, useQueryClient } from "@tanstack/react-query";

// Types for TheMealDB API responses
export interface Recipe {
  idMeal: string;
  strMeal: string;
  strDrinkAlternate?: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags?: string;
  strYoutube?: string;
  strIngredient1?: string;
  strIngredient2?: string;
  strIngredient3?: string;
  strIngredient4?: string;
  strIngredient5?: string;
  strIngredient6?: string;
  strIngredient7?: string;
  strIngredient8?: string;
  strIngredient9?: string;
  strIngredient10?: string;
  strIngredient11?: string;
  strIngredient12?: string;
  strIngredient13?: string;
  strIngredient14?: string;
  strIngredient15?: string;
  strIngredient16?: string;
  strIngredient17?: string;
  strIngredient18?: string;
  strIngredient19?: string;
  strIngredient20?: string;
  strMeasure1?: string;
  strMeasure2?: string;
  strMeasure3?: string;
  strMeasure4?: string;
  strMeasure5?: string;
  strMeasure6?: string;
  strMeasure7?: string;
  strMeasure8?: string;
  strMeasure9?: string;
  strMeasure10?: string;
  strMeasure11?: string;
  strMeasure12?: string;
  strMeasure13?: string;
  strMeasure14?: string;
  strMeasure15?: string;
  strMeasure16?: string;
  strMeasure17?: string;
  strMeasure18?: string;
  strMeasure19?: string;
  strMeasure20?: string;
  strSource?: string;
  strImageSource?: string;
  strCreativeCommonsConfirmed?: string;
  dateModified?: string;
}

export interface MealDBResponse {
  meals: Recipe[] | null;
}

export interface ProcessedRecipe {
  id: string;
  name: string;
  category: string;
  area: string;
  instructions: string;
  image: string;
  ingredients: string[];
  tags?: string[];
  youtube?: string;
  source?: string;
}

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

// Helper function to process meal data and extract ingredients
const processMeal = (recipe: Recipe): ProcessedRecipe => {
  const ingredients: string[] = [];

  // Extract ingredients
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}` as keyof Recipe] as string;
    if (ingredient) {
      ingredients.push(ingredient);
    }
  }

  return {
    id: recipe.idMeal,
    name: recipe.strMeal,
    category: recipe.strCategory,
    area: recipe.strArea,
    instructions: recipe.strInstructions,
    image: recipe.strMealThumb,
    ingredients,
    tags: recipe.strTags
      ? recipe.strTags.split(",").map((tag) => tag.trim())
      : undefined,
    youtube: recipe.strYoutube,
    source: recipe.strSource,
  };
};

// API functions
const fetchRecipesByName = async (name: string): Promise<ProcessedRecipe[]> => {
  console.log(name);
  const response = await fetch(
    `${BASE_URL}/search.php?s=${encodeURIComponent(name)}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: MealDBResponse = await response.json();

  if (!data.meals) {
    return [];
  }

  return data.meals.map(processMeal);
};

const fetchRecipeById = async (id: string): Promise<ProcessedRecipe | null> => {
  const response = await fetch(
    `${BASE_URL}/lookup.php?i=${encodeURIComponent(id)}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: MealDBResponse = await response.json();

  if (!data.meals || data.meals.length === 0) {
    return null;
  }

  return processMeal(data.meals[0]);
};

const fetchRandomRecipes = async (): Promise<ProcessedRecipe[]> => {
  // Make 9 parallel calls to get random meals
  const randomPromises = Array.from({ length: 9 }, () =>
    fetch(`${BASE_URL}/random.php`).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
  );

  const results = await Promise.all(randomPromises);

  const allMeals: Recipe[] = [];
  results.forEach((data: MealDBResponse) => {
    if (data.meals && data.meals.length > 0) {
      allMeals.push(data.meals[0]);
    }
  });

  return allMeals.map(processMeal);
};

const fetchMostPopularRecipes = async (): Promise<ProcessedRecipe[]> => {
  // Hardcoded for testing purposes
  const MOST_POPULAR_RECIPES_IDS = [52982, 52806, 53014, 52995];

  const promises = MOST_POPULAR_RECIPES_IDS.map((id) =>
    fetch(`${BASE_URL}/lookup.php?i=${encodeURIComponent(id.toString())}`).then(
      (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      }
    )
  );

  const results = await Promise.all(promises);

  const allMeals: Recipe[] = [];
  results.forEach((data: MealDBResponse) => {
    if (data.meals && data.meals.length > 0) {
      allMeals.push(data.meals[0]);
    }
  });

  return allMeals.map(processMeal);
};

// React Query hooks
export const useSearchMeals = (name: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["meals", "search", name.toLowerCase()],
    queryFn: () => fetchRecipesByName(name),
    enabled: enabled && name.trim().length > 2,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour (formerly cacheTime)
  });
};

export const useMealById = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["meals", "lookup", id],
    queryFn: () => fetchRecipeById(id),
    enabled: enabled && id.trim().length > 0,
    staleTime: 1000 * 60 * 60, // 1 hour (meals don't change often)
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
  });
};

export const useRandomMeals = () => {
  return useQuery({
    queryKey: ["meals", "random", Math.floor(Date.now() / (1000 * 60 * 60))], // New key every hour
    queryFn: fetchRandomRecipes,
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useMostPopularMeals = () => {
  return useQuery({
    queryKey: ["meals", "most-popular"],
    queryFn: fetchMostPopularRecipes,
  });
};

// Utility hook for cache management
export const useMealDBCache = () => {
  const queryClient = useQueryClient();

  const clearCache = () => {
    queryClient.clear();
  };

  const invalidateSearches = () => {
    queryClient.invalidateQueries({ queryKey: ["meals", "search"] });
  };

  const invalidateRandom = () => {
    queryClient.invalidateQueries({ queryKey: ["meals", "random"] });
  };

  const getCacheSize = () => {
    const cache = queryClient.getQueryCache();
    return cache.getAll().length;
  };

  const getCacheStats = () => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();

    return {
      total: queries.length,
      stale: queries.filter((query) => query.isStale()).length,
      loading: queries.filter((query) => query.state.fetchStatus === "fetching")
        .length,
      error: queries.filter((query) => query.state.status === "error").length,
    };
  };

  return {
    clearCache,
    invalidateSearches,
    invalidateRandom,
    getCacheSize,
    getCacheStats,
  };
};
