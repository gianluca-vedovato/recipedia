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
      <div className="w-full">
        <SearchInput />
      </div>
      <div className="w-full">
        <RecipesGrid
          recipes={recipes || []}
          loading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}
