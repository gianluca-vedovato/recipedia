import { useMostPopularMeals, useSearchMeals } from "@/hooks/useMealDB";
import { RecipeCardSmall, RecipeCardSmallSkeleton } from "../recipe-card-small";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { useStorage } from "@/hooks/useLocalStorage";

interface SearchResultsProps {
  searchTerm: string;
  isOpen: boolean;
}

export function SearchResults({ searchTerm, isOpen }: SearchResultsProps) {
  const { getItem } = useStorage();
  const recentlyViewed = useMemo(() => {
    const stored = getItem("recipedia:recentlyviewed");
    if (!stored) return [];

    try {
      return JSON.parse(stored);
    } catch (error) {
      console.warn("Failed to parse recently viewed data:", error);
      return [];
    }
  }, [getItem]);

  const { data: mostPopularMeals } = useMostPopularMeals();
  const { data: searchResults, isLoading } = useSearchMeals(searchTerm);

  const renderList = useMemo(() => {
    if (!searchTerm) {
      return mostPopularMeals?.map((meal) => (
        <div
          key={meal.id}
          className="cursor-pointer hover:bg-accent rounded-md p-2"
          data-testid="search-results-recipe-item"
        >
          <RecipeCardSmall {...meal} />
        </div>
      ));
    }

    if (searchResults && searchResults.length > 0) {
      return searchResults.map((meal) => (
        <div
          key={meal.id}
          className="cursor-pointer hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground rounded-md p-2"
          data-testid="search-results-recipe-item"
        >
          <RecipeCardSmall
            {...meal}
            isRecentlyViewed={recentlyViewed
              .map((m: { id: string }) => m.id)
              .includes(meal.id)}
          />
        </div>
      ));
    }

    if (isLoading) {
      return Array.from({ length: 4 }).map((_, index) => (
        <RecipeCardSmallSkeleton key={index} />
      ));
    }

    if (searchResults?.length === 0) {
      return (
        <div className="flex flex-col gap-2 col-span-2">
          <p className="text-sm text-muted-foreground">
            Oh no! No recipes found. Try a different search.
          </p>
        </div>
      );
    }
  }, [searchTerm, mostPopularMeals, searchResults]);

  return (
    <div
      className={cn(
        "absolute top-full left-0 right-0 z-50 mt-1 max-h-120 overflow-auto rounded-4xl border bg-popover px-4 lg:px-6 py-4 text-popover-foreground shadow-lg transition-all duration-300 transform",
        isOpen
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-5 pointer-events-none"
      )}
      data-testid="search-results-container"
    >
      {/* Recently viewed section - only show when there are recently viewed items and no search term */}
      {recentlyViewed.length > 0 && !searchTerm && (
        <div className="flex flex-col gap-2 mb-4">
          <h2 className="text-sm font-bold text-primary">Recently Viewed</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {recentlyViewed.map(
              (meal: { id: string; name: string; image: string }) => (
                <div
                  key={meal.id}
                  className="cursor-pointer hover:bg-accent rounded-md p-2"
                >
                  <RecipeCardSmall {...meal} />
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Main section */}
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-bold text-primary">
          {searchTerm ? "Search Results" : "Most Popular"}
        </h2>
        {searchTerm && searchTerm.length < 3 && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              Type at least 3 characters to search...
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex gap-2 items-start"
                  data-testid="search-results-skeleton"
                >
                  <div className="w-16 h-16 lg:w-12 lg:h-12 rounded-md overflow-hidden">
                    <div className="bg-accent animate-pulse rounded-md w-full h-full" />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="bg-accent animate-pulse rounded-md w-20 h-4" />
                  </div>
                </div>
              ))
            : renderList}
        </div>
      </div>
    </div>
  );
}
