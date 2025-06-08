import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FavoritesPage } from "./favorites-page";
import type { ProcessedRecipe } from "@/hooks/useMealDB";

// Mock TanStack Router
const mockNavigate = vi.fn();

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
    <a href={to} {...props} data-testid={`link-to-${to}`}>
      {children}
    </a>
  ),
  useNavigate: () => mockNavigate,
}));

// Mock the hooks
const mockUseFavorites = vi.fn();
const mockUseMultipleMealsById = vi.fn();

vi.mock("@/hooks/useFavorites", () => ({
  useFavorites: () => mockUseFavorites(),
}));

vi.mock("@/hooks/useMealDB", () => ({
  useMultipleMealsById: (ids: string[]) => mockUseMultipleMealsById(ids),
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
  }) => {
    if (loading) {
      return (
        <div data-testid="recipes-grid-loading">
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={i}
              data-testid="recipe-skeleton"
              className="animate-pulse"
            >
              Loading skeleton {i + 1}
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div data-testid="recipes-grid-error">
          <p>Error: {error.message}</p>
          {retry && (
            <button onClick={retry} data-testid="retry-button">
              Retry
            </button>
          )}
        </div>
      );
    }

    return (
      <div data-testid="recipes-grid">
        {recipes.map((recipe) => (
          <div key={recipe.id} data-testid={`recipe-${recipe.id}`}>
            <h3>{recipe.name}</h3>
            <button
              data-testid={`remove-favorite-${recipe.id}`}
              onClick={() => {
                // Simulate removing favorite
                const currentFavorites = mockUseFavorites();
                const newFavoriteIds = currentFavorites.favoriteIds.filter(
                  (id: string) => id !== recipe.id
                );
                mockUseFavorites.mockReturnValue({
                  ...currentFavorites,
                  favoriteIds: newFavoriteIds,
                });
              }}
            >
              Remove from favorites
            </button>
          </div>
        ))}
      </div>
    );
  },
}));

// Mock Button component
vi.mock("../ui/button", () => ({
  Button: ({
    children,
    onClick,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    [key: string]: unknown;
  }) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

// Create a test QueryClient
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

// Helper to render with QueryClient
const renderWithQueryClient = (ui: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
  );
};

// Mock data
const mockFavoriteRecipes: ProcessedRecipe[] = [
  {
    id: "1",
    name: "Chocolate Cake",
    category: "Dessert",
    area: "American",
    instructions: "Mix ingredients and bake",
    image: "https://example.com/cake.jpg",
    ingredients: ["flour", "sugar", "cocoa"],
    tags: ["sweet"],
    youtube: "https://youtube.com/watch?v=1",
    source: "https://example.com/recipe1",
  },
  {
    id: "2",
    name: "Chicken Curry",
    category: "Main Course",
    area: "Indian",
    instructions: "Cook chicken with spices",
    image: "https://example.com/curry.jpg",
    ingredients: ["chicken", "curry powder", "onions"],
    tags: ["spicy"],
    youtube: "https://youtube.com/watch?v=2",
    source: "https://example.com/recipe2",
  },
  {
    id: "3",
    name: "Caesar Salad",
    category: "Salad",
    area: "Italian",
    instructions: "Mix salad ingredients",
    image: "https://example.com/salad.jpg",
    ingredients: ["lettuce", "croutons", "parmesan"],
    tags: ["healthy"],
    youtube: "https://youtube.com/watch?v=3",
    source: "https://example.com/recipe3",
  },
];

describe("FavoritesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Show Favorites", () => {
    it("should display favorites when user has favorite recipes", () => {
      // Mock favorites hook with favorite IDs
      mockUseFavorites.mockReturnValue({
        favoriteIds: ["1", "2", "3"],
        loadFavorites: vi.fn(),
        isFavorite: vi.fn(),
        toggleFavorite: vi.fn(),
      });

      // Mock API call to return favorite recipes
      mockUseMultipleMealsById.mockReturnValue({
        data: mockFavoriteRecipes,
        isLoading: false,
        error: null,
      });

      renderWithQueryClient(<FavoritesPage />);

      // Check page title and description
      expect(screen.getByText("Your Favorites")).toBeInTheDocument();
      expect(
        screen.getByText("All the recipes you really love ♥")
      ).toBeInTheDocument();

      // Check that RecipesGrid is rendered with favorites
      expect(screen.getByTestId("recipes-grid")).toBeInTheDocument();
      expect(screen.getByTestId("recipe-1")).toBeInTheDocument();
      expect(screen.getByTestId("recipe-2")).toBeInTheDocument();
      expect(screen.getByTestId("recipe-3")).toBeInTheDocument();

      // Check recipe names are displayed
      expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();
      expect(screen.getByText("Chicken Curry")).toBeInTheDocument();
      expect(screen.getByText("Caesar Salad")).toBeInTheDocument();
    });

    it("should pass correct props to RecipesGrid", () => {
      mockUseFavorites.mockReturnValue({
        favoriteIds: ["1", "2"],
        loadFavorites: vi.fn(),
        isFavorite: vi.fn(),
        toggleFavorite: vi.fn(),
      });

      mockUseMultipleMealsById.mockReturnValue({
        data: mockFavoriteRecipes.slice(0, 2),
        isLoading: false,
        error: null,
      });

      renderWithQueryClient(<FavoritesPage />);

      const recipesGrid = screen.getByTestId("recipes-grid");
      expect(recipesGrid).toBeInTheDocument();
    });
  });

  describe("Empty Favorites", () => {
    it("should show correct empty state message when no favorites", () => {
      mockUseFavorites.mockReturnValue({
        favoriteIds: [],
        loadFavorites: vi.fn(),
        isFavorite: vi.fn(),
        toggleFavorite: vi.fn(),
      });

      mockUseMultipleMealsById.mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      });

      renderWithQueryClient(<FavoritesPage />);

      // Check empty state elements
      expect(screen.getByText("💔")).toBeInTheDocument();
      expect(screen.getByText("No favorites yet")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Start exploring recipes and click the heart icon to save your favorite dishes!"
        )
      ).toBeInTheDocument();
    });

    it("should show Start Exploring button that links to homepage", () => {
      mockUseFavorites.mockReturnValue({
        favoriteIds: [],
        loadFavorites: vi.fn(),
        isFavorite: vi.fn(),
        toggleFavorite: vi.fn(),
      });

      mockUseMultipleMealsById.mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      });

      renderWithQueryClient(<FavoritesPage />);

      // Check the button exists and links correctly
      const startExploringButton = screen.getByText("Start Exploring");
      expect(startExploringButton).toBeInTheDocument();

      // Check the link wrapper
      const linkElement = screen.getByTestId("link-to-/");
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute("href", "/");
    });

    it("should not show RecipesGrid when no favorites", () => {
      mockUseFavorites.mockReturnValue({
        favoriteIds: [],
        loadFavorites: vi.fn(),
        isFavorite: vi.fn(),
        toggleFavorite: vi.fn(),
      });

      mockUseMultipleMealsById.mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      });

      renderWithQueryClient(<FavoritesPage />);

      expect(screen.queryByTestId("recipes-grid")).not.toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("should show skeletons when loading favorites", () => {
      mockUseFavorites.mockReturnValue({
        favoriteIds: ["1", "2", "3"],
        loadFavorites: vi.fn(),
        isFavorite: vi.fn(),
        toggleFavorite: vi.fn(),
      });

      // Mock loading state
      mockUseMultipleMealsById.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      });

      renderWithQueryClient(<FavoritesPage />);

      // Check that loading skeletons are shown
      expect(screen.getByTestId("recipes-grid-loading")).toBeInTheDocument();
      const skeletons = screen.getAllByTestId("recipe-skeleton");
      expect(skeletons).toHaveLength(9);

      // Check that skeletons have loading animation
      skeletons.forEach((skeleton) => {
        expect(skeleton).toHaveClass("animate-pulse");
      });
    });

    it("should not show empty state while loading even if favoriteIds exist", () => {
      mockUseFavorites.mockReturnValue({
        favoriteIds: ["1", "2", "3"],
        loadFavorites: vi.fn(),
        isFavorite: vi.fn(),
        toggleFavorite: vi.fn(),
      });

      mockUseMultipleMealsById.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      });

      renderWithQueryClient(<FavoritesPage />);

      // Should not show empty state
      expect(screen.queryByText("No favorites yet")).not.toBeInTheDocument();
      expect(screen.queryByText("💔")).not.toBeInTheDocument();
    });
  });

  describe("Error State", () => {
    it("should show error message when failed to load favorites", () => {
      mockUseFavorites.mockReturnValue({
        favoriteIds: ["1", "2", "3"],
        loadFavorites: vi.fn(),
        isFavorite: vi.fn(),
        toggleFavorite: vi.fn(),
      });

      const mockError = new Error("Failed to fetch favorites");
      mockUseMultipleMealsById.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: mockError,
      });

      renderWithQueryClient(<FavoritesPage />);

      // Check that error state is shown through RecipesGrid
      expect(screen.getByTestId("recipes-grid-error")).toBeInTheDocument();
      expect(
        screen.getByText("Error: Failed to load some favorites")
      ).toBeInTheDocument();
    });

    it("should pass correct error message to RecipesGrid", () => {
      mockUseFavorites.mockReturnValue({
        favoriteIds: ["1", "2", "3"],
        loadFavorites: vi.fn(),
        isFavorite: vi.fn(),
        toggleFavorite: vi.fn(),
      });

      const mockError = new Error("Network error");
      mockUseMultipleMealsById.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: mockError,
      });

      renderWithQueryClient(<FavoritesPage />);

      // The component should transform the error message
      expect(
        screen.getByText("Error: Failed to load some favorites")
      ).toBeInTheDocument();
    });
  });

  describe("Remove Favorites", () => {
    it("should render remove buttons for each favorite recipe", () => {
      // Start with 3 favorites
      const mockToggleFavorite = vi.fn();
      mockUseFavorites.mockReturnValue({
        favoriteIds: ["1", "2", "3"],
        loadFavorites: vi.fn(),
        isFavorite: vi.fn(),
        toggleFavorite: mockToggleFavorite,
      });

      mockUseMultipleMealsById.mockReturnValue({
        data: mockFavoriteRecipes,
        isLoading: false,
        error: null,
      });

      renderWithQueryClient(<FavoritesPage />);

      // Verify all 3 recipes are shown initially
      expect(screen.getByTestId("recipe-1")).toBeInTheDocument();
      expect(screen.getByTestId("recipe-2")).toBeInTheDocument();
      expect(screen.getByTestId("recipe-3")).toBeInTheDocument();

      // Verify remove buttons exist
      expect(screen.getByTestId("remove-favorite-1")).toBeInTheDocument();
      expect(screen.getByTestId("remove-favorite-2")).toBeInTheDocument();
      expect(screen.getByTestId("remove-favorite-3")).toBeInTheDocument();
    });

    it("should show different states based on favoriteIds length", () => {
      // Test with favorites
      const mockToggleFavorite = vi.fn();
      mockUseFavorites.mockReturnValue({
        favoriteIds: ["1"],
        loadFavorites: vi.fn(),
        isFavorite: vi.fn(),
        toggleFavorite: mockToggleFavorite,
      });

      mockUseMultipleMealsById.mockReturnValue({
        data: [mockFavoriteRecipes[0]],
        isLoading: false,
        error: null,
      });

      const { unmount } = renderWithQueryClient(<FavoritesPage />);

      // Verify recipe is shown when favorites exist
      expect(screen.getByTestId("recipe-1")).toBeInTheDocument();
      expect(screen.queryByText("No favorites yet")).not.toBeInTheDocument();

      // Clean up
      unmount();

      // Test empty state
      mockUseFavorites.mockReturnValue({
        favoriteIds: [],
        loadFavorites: vi.fn(),
        isFavorite: vi.fn(),
        toggleFavorite: mockToggleFavorite,
      });

      mockUseMultipleMealsById.mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      });

      renderWithQueryClient(<FavoritesPage />);

      // Verify empty state is shown
      expect(screen.getByText("No favorites yet")).toBeInTheDocument();
      expect(screen.getByText("💔")).toBeInTheDocument();
      expect(screen.getByText("Start Exploring")).toBeInTheDocument();
    });
  });

  describe("Page Layout", () => {
    it("should have correct container classes and structure", () => {
      mockUseFavorites.mockReturnValue({
        favoriteIds: ["1"],
        loadFavorites: vi.fn(),
        isFavorite: vi.fn(),
        toggleFavorite: vi.fn(),
      });

      mockUseMultipleMealsById.mockReturnValue({
        data: [mockFavoriteRecipes[0]],
        isLoading: false,
        error: null,
      });

      const { container } = renderWithQueryClient(<FavoritesPage />);

      // Check main container has correct classes
      const mainContainer = container.querySelector(".container");
      expect(mainContainer).toHaveClass(
        "container",
        "py-6",
        "flex",
        "flex-col",
        "gap-6"
      );
    });

    it("should always show page title and description", () => {
      // Test with favorites
      mockUseFavorites.mockReturnValue({
        favoriteIds: ["1"],
        loadFavorites: vi.fn(),
        isFavorite: vi.fn(),
        toggleFavorite: vi.fn(),
      });

      mockUseMultipleMealsById.mockReturnValue({
        data: [mockFavoriteRecipes[0]],
        isLoading: false,
        error: null,
      });

      const { unmount } = renderWithQueryClient(<FavoritesPage />);

      expect(screen.getByText("Your Favorites")).toBeInTheDocument();
      expect(
        screen.getByText("All the recipes you really love ♥")
      ).toBeInTheDocument();

      // Clean up before next render
      unmount();

      // Test with empty favorites
      mockUseFavorites.mockReturnValue({
        favoriteIds: [],
        loadFavorites: vi.fn(),
        isFavorite: vi.fn(),
        toggleFavorite: vi.fn(),
      });

      mockUseMultipleMealsById.mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      });

      renderWithQueryClient(<FavoritesPage />);

      expect(screen.getByText("Your Favorites")).toBeInTheDocument();
      expect(
        screen.getByText("All the recipes you really love ♥")
      ).toBeInTheDocument();
    });
  });
});
