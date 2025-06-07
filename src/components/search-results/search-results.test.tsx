import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { SearchResults } from "./search-results";
import type { ProcessedRecipe } from "@/hooks/useMealDB";

// Mock TanStack Router
vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    to,
    ...props
  }: {
    children: React.ReactNode;
    to: string;
    [key: string]: unknown;
  }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

// Mock SearchInput component
vi.mock("@/components/search-input", () => ({
  SearchInput: ({ defaultValue }: { defaultValue: string }) => (
    <input data-testid="search-input" defaultValue={defaultValue} />
  ),
}));

// Mock RecipesGrid component
vi.mock("@/components/recipes-grid", () => ({
  RecipesGrid: ({
    recipes,
    loading,
    error,
    retry,
  }: {
    recipes: ProcessedRecipe[];
    loading: boolean;
    error: Error | null;
    retry?: () => void;
  }) => (
    <div data-testid="recipes-grid">
      {loading && <div data-testid="loading">Loading...</div>}
      {error && (
        <div data-testid="error">
          {error.message}
          {retry && (
            <button onClick={retry} data-testid="retry-button">
              Retry
            </button>
          )}
        </div>
      )}
      {!loading &&
        !error &&
        recipes.map((recipe) => (
          <div key={recipe.id} data-testid={`recipe-${recipe.id}`}>
            {recipe.name}
          </div>
        ))}
    </div>
  ),
}));

// Mock useMealDB hook with simplified implementation
const mockSearchHookResult = {
  data: [] as ProcessedRecipe[],
  isLoading: false,
  error: null as Error | null,
  refetch: vi.fn(),
};

vi.mock("@/hooks/useMealDB", () => ({
  useSearchMeals: vi.fn(() => mockSearchHookResult),
}));

const mockRecipes: ProcessedRecipe[] = [
  {
    id: "1",
    name: "Chocolate Cake",
    category: "Dessert",
    area: "American",
    instructions: "Mix and bake",
    image: "https://example.com/cake.jpg",
    ingredients: ["flour", "sugar", "cocoa"],
    tags: ["sweet"],
    youtube: "https://youtube.com/1",
    source: "https://example.com/1",
  },
  {
    id: "2",
    name: "Chicken Curry",
    category: "Main Course",
    area: "Indian",
    instructions: "Cook chicken with spices",
    image: "https://example.com/curry.jpg",
    ingredients: ["chicken", "curry powder"],
    tags: ["spicy"],
    youtube: "https://youtube.com/2",
    source: "https://example.com/2",
  },
];

describe("SearchResults", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock to default state
    mockSearchHookResult.data = mockRecipes;
    mockSearchHookResult.isLoading = false;
    mockSearchHookResult.error = null;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Data Display", () => {
    it("should display search input with correct default value", () => {
      render(<SearchResults query="chocolate" />);

      const searchInput = screen.getByTestId("search-input");
      expect(searchInput).toHaveValue("chocolate");
    });

    it("should display search results title with query", () => {
      render(<SearchResults query="chocolate" />);

      expect(screen.getByText("Search results for")).toBeInTheDocument();
      expect(screen.getByText("chocolate")).toBeInTheDocument();
    });

    it("should display recipes grid when recipes are available", () => {
      render(<SearchResults query="chocolate" />);

      expect(screen.getByTestId("recipes-grid")).toBeInTheDocument();
      expect(screen.getByTestId("recipe-1")).toBeInTheDocument();
      expect(screen.getByTestId("recipe-2")).toBeInTheDocument();
    });

    it("should pass correct props to RecipesGrid", () => {
      render(<SearchResults query="chocolate" />);

      const recipesGrid = screen.getByTestId("recipes-grid");
      expect(recipesGrid).toBeInTheDocument();

      // Check that recipes are passed
      expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();
      expect(screen.getByText("Chicken Curry")).toBeInTheDocument();
    });
  });

  describe("Loading States", () => {
    it("should show loading state when isLoading is true", () => {
      mockSearchHookResult.isLoading = true;
      mockSearchHookResult.data = [];

      render(<SearchResults query="chocolate" />);

      expect(screen.getByTestId("loading")).toBeInTheDocument();
    });

    it("should not show loading state when isLoading is false", () => {
      render(<SearchResults query="chocolate" />);

      expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
    });
  });

  describe("Error States", () => {
    it("should display error state when error occurs", () => {
      const mockError = new Error("Network error");
      mockSearchHookResult.error = mockError;
      mockSearchHookResult.data = [];

      render(<SearchResults query="chocolate" />);

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });

    it("should display default error message when error has no message", () => {
      const mockError = new Error();
      mockSearchHookResult.error = mockError;
      mockSearchHookResult.data = [];

      render(<SearchResults query="chocolate" />);

      expect(
        screen.getByText("Failed to search for recipes. Please try again.")
      ).toBeInTheDocument();
    });

    it("should show retry button in error state", () => {
      const mockError = new Error("Network error");
      mockSearchHookResult.error = mockError;
      mockSearchHookResult.data = [];

      render(<SearchResults query="chocolate" />);

      const retryButton = screen.getByText("Try Again");
      expect(retryButton).toBeInTheDocument();
    });

    it("should call refetch when retry button is clicked", () => {
      const mockError = new Error("Network error");
      mockSearchHookResult.error = mockError;
      mockSearchHookResult.data = [];

      render(<SearchResults query="chocolate" />);

      const retryButton = screen.getByText("Try Again");
      fireEvent.click(retryButton);

      expect(mockSearchHookResult.refetch).toHaveBeenCalledOnce();
    });

    it("should show back to home button in error state", () => {
      const mockError = new Error("Network error");
      mockSearchHookResult.error = mockError;
      mockSearchHookResult.data = [];

      render(<SearchResults query="chocolate" />);

      const homeButton = screen.getByText("Back to Home");
      expect(homeButton).toBeInTheDocument();
      expect(homeButton.closest("a")).toHaveAttribute("href", "/");
    });
  });

  describe("Empty States", () => {
    it("should display empty state when no recipes found", () => {
      mockSearchHookResult.data = [];

      render(<SearchResults query="nonexistent" />);

      expect(screen.getByText("No recipes found")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Try searching for something else or check your spelling."
        )
      ).toBeInTheDocument();
    });

    it("should not display empty state when loading", () => {
      mockSearchHookResult.data = [];
      mockSearchHookResult.isLoading = true;

      render(<SearchResults query="nonexistent" />);

      expect(screen.queryByText("No recipes found")).not.toBeInTheDocument();
    });

    it("should display empty state when data is empty and not loading", () => {
      mockSearchHookResult.data = [];

      render(<SearchResults query="nonexistent" />);

      expect(screen.getByText("No recipes found")).toBeInTheDocument();
    });

    it("should show back to home button in empty state", () => {
      mockSearchHookResult.data = [];

      render(<SearchResults query="nonexistent" />);

      const homeButton = screen.getByText("Back to Home");
      expect(homeButton).toBeInTheDocument();
      expect(homeButton.closest("a")).toHaveAttribute("href", "/");
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading structure", () => {
      render(<SearchResults query="chocolate" />);

      const mainTitle = screen.getByRole("heading", { level: 1 });
      expect(mainTitle).toHaveTextContent("Search results for chocolate");
    });

    it("should have proper link attributes for external links", () => {
      const mockError = new Error("Network error");
      mockSearchHookResult.error = mockError;
      mockSearchHookResult.data = [];

      render(<SearchResults query="chocolate" />);

      const homeLinks = screen.getAllByText("Back to Home");
      homeLinks.forEach((link) => {
        expect(link.closest("a")).toHaveAttribute("href", "/");
      });
    });

    it("should have accessible button text", () => {
      const mockError = new Error("Network error");
      mockSearchHookResult.error = mockError;
      mockSearchHookResult.data = [];

      render(<SearchResults query="chocolate" />);

      expect(
        screen.getByRole("button", { name: /try again/i })
      ).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty query string", () => {
      render(<SearchResults query="" />);

      expect(screen.getByText("Search results for")).toBeInTheDocument();
    });

    it("should handle very long query string", () => {
      const longQuery = "a".repeat(100);
      render(<SearchResults query={longQuery} />);

      expect(screen.getByText("Search results for")).toBeInTheDocument();
    });

    it("should handle special characters in query", () => {
      const specialQuery = "chicken & rice @home #delicious";
      render(<SearchResults query={specialQuery} />);

      expect(screen.getByText(specialQuery)).toBeInTheDocument();
    });
  });
});
