import { createFileRoute, notFound } from "@tanstack/react-router";
import { useMealById } from "@/hooks/useMealDB";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { RecipeDetail, RecipeDetailSkeleton } from "@/components/recipe-detail";

// Define the route
export const Route = createFileRoute("/recipe/$id")({
  component: RecipeDetailRoute,
  notFoundComponent: () => (
    <div className="container py-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Recipe Not Found</h1>
      <p className="text-muted-foreground mb-4">
        The recipe you're looking for doesn't exist or has been removed.
      </p>
      <Link to="/">
        <Button>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </Link>
    </div>
  ),
});

function RecipeDetailRoute() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const { data: recipe, isLoading, error } = useMealById(id);

  // Prefetch related recipes when component mounts
  useEffect(() => {
    if (recipe?.category) {
      // Prefetch recipes from the same category (you can implement this hook later)
      // queryClient.prefetchQuery({
      //   queryKey: ["meals", "category", recipe.category],
      //   queryFn: () => fetchRecipesByCategory(recipe.category),
      //   staleTime: 1000 * 60 * 30, // 30 minutes
      // });
    }
  }, [recipe?.category, queryClient]);

  if (isLoading) {
    return <RecipeDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4 text-destructive">
          Error Loading Recipe
        </h1>
        <p className="text-muted-foreground mb-4">
          {error.message || "Failed to load the recipe. Please try again."}
        </p>
        <Link to="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  if (!recipe) {
    throw notFound();
  }

  return <RecipeDetail recipe={recipe} />;
}
