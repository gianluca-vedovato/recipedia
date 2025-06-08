import { useFavorites } from "@/hooks/useFavorites";
import { useMultipleMealsById } from "@/hooks/useMealDB";
import { RecipesGrid } from "@/components/recipes-grid";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";

export function FavoritesPage() {
  const { favoriteIds } = useFavorites();
  const {
    data: favorites,
    isLoading,
    error,
  } = useMultipleMealsById(favoriteIds);

  return (
    <div className="container py-6 flex flex-col gap-6">
      <div className="w-full">
        <h1 className="text-3xl font-bold text-center mb-2">Your Favorites</h1>
        <p className="text-muted-foreground text-center">
          All the recipes you really love ♥
        </p>
      </div>

      {favoriteIds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-6xl mb-4">💔</div>
          <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
          <p className="text-muted-foreground max-w-md">
            Start exploring recipes and click the heart icon to save your
            favorite dishes!
          </p>
          <Link to="/" className="mt-4">
            <Button>Start Exploring</Button>
          </Link>
        </div>
      ) : (
        <div className="w-full">
          <RecipesGrid
            recipes={favorites || []}
            loading={isLoading}
            error={error ? new Error("Failed to load some favorites") : null}
          />
        </div>
      )}
    </div>
  );
}
