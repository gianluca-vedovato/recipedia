import { Skeleton } from "../ui/skeleton";
import { RecipeCardSkeleton } from "../recipe-card";
import {
  SearchResultsWrapper,
  SearchResultsInputSection,
  SearchResultsHeader,
  SearchResultsContent,
} from "./search-results.layout";

export function SearchResultsSkeleton() {
  return (
    <SearchResultsWrapper>
      <SearchResultsInputSection>
        <Skeleton className="h-12 w-full rounded-lg" />
      </SearchResultsInputSection>

      <SearchResultsHeader>
        <Skeleton className="h-8 w-64" />
      </SearchResultsHeader>

      <SearchResultsContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      </SearchResultsContent>
    </SearchResultsWrapper>
  );
}
