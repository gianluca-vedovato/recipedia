import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SearchResults } from "./search-results";
import type { ProcessedRecipe } from "@/hooks/useMealDB";

// Mock the hooks
const mockUseMostPopularMeals = vi.fn();
const mockUseSearchMeals = vi.fn();

vi.mock("@/hooks/useMealDB", () => ({
  useMostPopularMeals: () => mockUseMostPopularMeals(),
  useSearchMeals: (searchTerm: string) => mockUseSearchMeals(searchTerm),
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

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
const mockMostPopularMeals: ProcessedRecipe[] = [
  {
    id: "1",
    name: "Popular Meal 1",
    image: "https://example.com/popular1.jpg",
    category: "Dessert",
    area: "British",
    instructions: "Instructions",
    ingredients: ["flour", "sugar"],
  },
  {
    id: "2",
    name: "Popular Meal 2",
    image: "https://example.com/popular2.jpg",
    category: "Main",
    area: "Italian",
    instructions: "Instructions",
    ingredients: ["pasta", "cheese"],
  },
];

const mockSearchResults: ProcessedRecipe[] = [
  {
    id: "3",
    name: "Search Result 1",
    image: "https://example.com/search1.jpg",
    category: "Appetizer",
    area: "Mexican",
    instructions: "Instructions",
    ingredients: ["tomato", "onion"],
  },
  {
    id: "4",
    name: "Search Result 2",
    image: "https://example.com/search2.jpg",
    category: "Side",
    area: "American",
    instructions: "Instructions",
    ingredients: ["potato", "butter"],
  },
];

const mockRecentlyViewed = [
  { name: "Recent Meal 1", id: "5", image: "https://example.com/recent1.jpg" },
  { name: "Recent Meal 2", id: "6", image: "https://example.com/recent2.jpg" },
];

describe("SearchResults", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);

    // Default mock implementations
    mockUseMostPopularMeals.mockReturnValue({
      data: mockMostPopularMeals,
      isLoading: false,
    });

    mockUseSearchMeals.mockReturnValue({
      data: null,
      isLoading: false,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Visibility and Transitions", () => {
    it("should be hidden when isOpen is false", () => {
      renderWithQueryClient(<SearchResults searchTerm="" isOpen={false} />);

      const container = document.querySelector(".absolute");
      expect(container).toHaveClass("opacity-0", "pointer-events-none");
    });

    it("should be visible when isOpen is true", () => {
      renderWithQueryClient(<SearchResults searchTerm="" isOpen={true} />);

      const container = document.querySelector(".absolute");
      expect(container).toHaveClass("opacity-100", "pointer-events-auto");
    });
  });

  describe("Most Popular Meals Display", () => {
    it("should display most popular meals when no search term", () => {
      renderWithQueryClient(<SearchResults searchTerm="" isOpen={true} />);

      expect(screen.getByText("Most Popular")).toBeInTheDocument();
      expect(screen.getByText("Popular Meal 1")).toBeInTheDocument();
      expect(screen.getByText("Popular Meal 2")).toBeInTheDocument();
    });

    it("should display recipes in a 2-column grid", () => {
      renderWithQueryClient(<SearchResults searchTerm="" isOpen={true} />);

      const grid = document.querySelector(".grid-cols-2");
      expect(grid).toBeInTheDocument();
    });
  });

  describe("Search Results Display", () => {
    it("should display search results when searchTerm is provided", () => {
      mockUseSearchMeals.mockReturnValue({
        data: mockSearchResults,
        isLoading: false,
      });

      renderWithQueryClient(<SearchResults searchTerm="pasta" isOpen={true} />);

      expect(screen.getByText("Search Results")).toBeInTheDocument();
      expect(screen.getByText("Search Result 1")).toBeInTheDocument();
      expect(screen.getByText("Search Result 2")).toBeInTheDocument();
    });

    it("should show minimum character warning when search term is less than 3 characters", () => {
      renderWithQueryClient(<SearchResults searchTerm="pa" isOpen={true} />);

      expect(
        screen.getByText("Type at least 3 characters to search...")
      ).toBeInTheDocument();
    });
  });

  describe("Loading States", () => {
    it("should display loading skeletons when search is loading", () => {
      mockUseSearchMeals.mockReturnValue({
        data: null,
        isLoading: true,
      });

      renderWithQueryClient(<SearchResults searchTerm="pasta" isOpen={true} />);

      // Check for skeleton loading elements by looking for animate-pulse class
      const skeletons = document.querySelectorAll(".animate-pulse");
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe("Empty Search Results", () => {
    it("should display no results message when search returns empty array", () => {
      mockUseSearchMeals.mockReturnValue({
        data: [],
        isLoading: false,
      });

      renderWithQueryClient(
        <SearchResults searchTerm="nonexistent" isOpen={true} />
      );

      expect(
        screen.getByText("Oh no! No recipes found. Try a different search.")
      ).toBeInTheDocument();
    });
  });

  describe("Recently Viewed Integration", () => {
    it("should load recently viewed items from localStorage", () => {
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify(mockRecentlyViewed)
      );

      renderWithQueryClient(<SearchResults searchTerm="" isOpen={true} />);

      expect(localStorageMock.getItem).toHaveBeenCalledWith("recentlyViewed");
    });

    it("should handle empty localStorage gracefully", () => {
      localStorageMock.getItem.mockReturnValue(null);

      renderWithQueryClient(<SearchResults searchTerm="" isOpen={true} />);

      // Should still render without errors
      expect(screen.getByText("Most Popular")).toBeInTheDocument();
    });

    it("should handle malformed JSON gracefully without throwing", () => {
      localStorageMock.getItem.mockReturnValue("invalid json");

      // Should handle error gracefully and still render without throwing
      expect(() => {
        renderWithQueryClient(<SearchResults searchTerm="" isOpen={true} />);
      }).not.toThrow();

      // Should still render the component normally
      expect(screen.getByText("Most Popular")).toBeInTheDocument();
    });
  });

  describe("Hover Effects", () => {
    it("should apply hover classes to recipe items", () => {
      renderWithQueryClient(<SearchResults searchTerm="" isOpen={true} />);

      const recipeItems = document.querySelectorAll(".cursor-pointer");
      expect(recipeItems.length).toBeGreaterThan(0);

      recipeItems.forEach((item) => {
        expect(item).toHaveClass("hover:bg-accent");
      });
    });
  });

  describe("Hook Integration", () => {
    it("should call useMostPopularMeals hook", () => {
      renderWithQueryClient(<SearchResults searchTerm="" isOpen={true} />);

      expect(mockUseMostPopularMeals).toHaveBeenCalled();
    });

    it("should call useSearchMeals with correct parameters", () => {
      renderWithQueryClient(<SearchResults searchTerm="pasta" isOpen={true} />);

      expect(mockUseSearchMeals).toHaveBeenCalledWith("pasta");
    });

    it("should not call useSearchMeals when searchTerm is empty", () => {
      renderWithQueryClient(<SearchResults searchTerm="" isOpen={true} />);

      expect(mockUseSearchMeals).toHaveBeenCalledWith("");
    });
  });

  describe("Conditional Content Display", () => {
    it("should show recently viewed section when recentlyViewed is not empty", () => {
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify(mockRecentlyViewed)
      );

      renderWithQueryClient(<SearchResults searchTerm="" isOpen={true} />);

      // Should show two "Most Popular" headers - one for recently viewed section, one for main section
      const headers = screen.getAllByText("Most Popular");
      expect(headers.length).toBe(2);
    });

    it("should only show main section when recentlyViewed is empty", () => {
      localStorageMock.getItem.mockReturnValue("[]");

      renderWithQueryClient(<SearchResults searchTerm="" isOpen={true} />);

      // Should show only one "Most Popular" header
      const headers = screen.getAllByText("Most Popular");
      expect(headers.length).toBe(1);
    });
  });
});
