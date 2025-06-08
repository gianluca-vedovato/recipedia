import { useState, useEffect } from "react";
import { useStorage } from "./useLocalStorage";

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const { storage, getItem, setItem } = useStorage();

  // Load all favorite IDs from storage
  const loadFavorites = () => {
    try {
      const allKeys: string[] = [];
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key) {
          allKeys.push(key);
        }
      }

      const favoriteKeys = allKeys.filter((key) =>
        key.startsWith("recipedia:favorite:")
      );

      const ids: string[] = [];

      favoriteKeys.forEach((key) => {
        const isFavorite = getItem(key) === "true";
        if (isFavorite) {
          const recipeId = key.replace("recipedia:favorite:", "");
          ids.push(recipeId);
        }
      });

      setFavoriteIds(ids);
    } catch (error) {
      console.error("Failed to load favorites:", error);
      setFavoriteIds([]);
    }
  };

  // Check if a recipe is favorite
  const isFavorite = (recipeId: string): boolean => {
    try {
      return getItem(`recipedia:favorite:${recipeId}`) === "true";
    } catch {
      return false;
    }
  };

  // Toggle favorite status
  const toggleFavorite = (recipeId: string) => {
    try {
      const currentState = isFavorite(recipeId);
      const newState = !currentState;

      setItem(`recipedia:favorite:${recipeId}`, newState.toString());

      // Reload favorites list
      loadFavorites();

      return newState;
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      return false;
    }
  };

  // Load favorites on hook initialization
  useEffect(() => {
    loadFavorites();
  }, []);

  return {
    favoriteIds: favoriteIds || [],
    loadFavorites,
    isFavorite,
    toggleFavorite,
  };
}
