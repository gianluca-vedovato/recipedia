import { createFileRoute } from "@tanstack/react-router";
import {
  SearchResults,
  SearchResultsSkeleton,
} from "@/components/search-results";

export const Route = createFileRoute("/search")({
  component: RouteComponent,
  validateSearch: (search) => {
    return {
      q: search.q as string,
    };
  },
});

function RouteComponent() {
  const { q } = Route.useSearch();

  // Show skeleton if no query is provided
  if (!q) {
    return <SearchResultsSkeleton />;
  }

  return <SearchResults query={q} />;
}
