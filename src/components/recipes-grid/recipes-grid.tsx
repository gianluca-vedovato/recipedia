import type { ProcessedRecipe } from "@/hooks/useMealDB";
import { RecipeCard } from "../recipe-card/recipe-card";
import { RecipeCardSkeleton } from "../recipe-card/recipe-card.skeleton";
import { Button } from "../ui/button";
import { useState } from "react";

type RecipesGridProps = {
  recipes: ProcessedRecipe[];
  loading: boolean;
  error: Error | null;
  retry?: () => void;
};

export function RecipesGrid({
  recipes,
  loading,
  error,
  retry,
}: RecipesGridProps) {
  const [attemptsCount, setAttemptsCount] = useState(0);

  const handleRetry = () => {
    setAttemptsCount((prev) => prev + 1);
    retry?.();
  };

  const cardsRender = () => {
    if (loading) {
      return Array.from({ length: 9 }).map((_, index) => (
        <RecipeCardSkeleton key={index} />
      ));
    }
    if (error) {
      return (
        <div className="text-center flex flex-col items-center gap-4">
          <p className="text-center">Oh no! Something went wrong. 😪</p>
          {typeof retry === "function" && attemptsCount < 3 && (
            <Button onClick={handleRetry}>Retry</Button>
          )}
        </div>
      );
    }
    if (recipes.length === 0) {
      return <p>No recipes found.</p>;
    }
    return recipes.map((recipe) => <RecipeCard key={recipe.id} {...recipe} />);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cardsRender()}
    </div>
  );
}
