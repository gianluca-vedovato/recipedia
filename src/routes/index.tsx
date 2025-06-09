import { RecipesGrid } from "@/components/recipes-grid";
import { SearchInput } from "@/components/search-input";
import { createFileRoute } from "@tanstack/react-router";
import { useRandomMeals } from "@/hooks/useMealDB";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { data: recipes, isLoading, error } = useRandomMeals();

  return (
    <div className="container py-6 flex flex-col gap-6">
      <div className="w-full py-4 lg:py-8">
        <h1 className="text-4xl font-bold text-center">Recipedia</h1>
        <p className="text-center text-muted-foreground text-sm mt-1">
          Discover delicious recipes from around the world
        </p>
        <div className="w-full mt-4 lg:mt-6">
          <SearchInput />
        </div>
      </div>
      <div className="w-full py-6 lg:py-12 border-t border-border">
        <div className="text-center mb-6 lg:mb-12">
          <h2 className="text-xl font-bold text-center">
            Can't decide what to cook?
          </h2>
          <p className="text-center text-muted-foreground text-sm mt-1">
            We've got you covered with a random selection of recipes
          </p>
        </div>
        <RecipesGrid
          recipes={recipes || []}
          loading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}
