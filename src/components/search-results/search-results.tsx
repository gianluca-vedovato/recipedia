import { SearchInput } from "@/components/search-input";
import { RecipesGrid } from "@/components/recipes-grid";
import { useSearchMeals } from "@/hooks/useMealDB";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  SearchResultsWrapper,
  SearchResultsInputSection,
  SearchResultsHeader,
  SearchResultsTitle,
  SearchResultsQuery,
  SearchResultsContent,
  SearchResultsEmptyState,
  SearchResultsEmptyTitle,
  SearchResultsEmptyMessage,
  SearchResultsErrorState,
  SearchResultsErrorTitle,
  SearchResultsErrorMessage,
} from "./search-results.layout";

type SearchResultsProps = {
  query: string;
};

export function SearchResults({ query }: SearchResultsProps) {
  const { data: recipes, isLoading, error, refetch } = useSearchMeals(query);

  return (
    <SearchResultsWrapper>
      <SearchResultsInputSection>
        <SearchInput defaultValue={query} />
      </SearchResultsInputSection>

      <SearchResultsHeader>
        <SearchResultsTitle>
          Search results for <SearchResultsQuery>{query}</SearchResultsQuery>
        </SearchResultsTitle>
      </SearchResultsHeader>

      {error ? (
        <SearchResultsErrorState>
          <SearchResultsErrorTitle>
            Something went wrong
          </SearchResultsErrorTitle>
          <SearchResultsErrorMessage>
            {error.message || "Failed to search for recipes. Please try again."}
          </SearchResultsErrorMessage>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
            <Link to="/">
              <Button variant="ghost">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </SearchResultsErrorState>
      ) : (!recipes || recipes.length === 0) && !isLoading ? (
        <SearchResultsEmptyState>
          <SearchResultsEmptyTitle>No recipes found</SearchResultsEmptyTitle>
          <SearchResultsEmptyMessage>
            Try searching for something else or check your spelling.
          </SearchResultsEmptyMessage>
          <div className="mt-4">
            <Link to="/">
              <Button variant="outline">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </SearchResultsEmptyState>
      ) : (
        <SearchResultsContent>
          <RecipesGrid
            recipes={recipes || []}
            loading={isLoading}
            error={error}
            retry={refetch}
          />
        </SearchResultsContent>
      )}
    </SearchResultsWrapper>
  );
}
