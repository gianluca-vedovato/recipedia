import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { RecipeDetail } from "./recipe-detail";
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

const mockRecipeData: ProcessedRecipe = {
  id: "recipe-1",
  name: "Chocolate Cake",
  category: "Dessert",
  area: "American",
  instructions:
    "Step 1: Mix ingredients\nStep 2: Bake for 30 minutes\nStep 3: Let cool",
  image: "https://example.com/chocolate-cake.jpg",
  ingredients: ["flour", "sugar", "cocoa powder", "eggs", "butter"],
  tags: ["sweet", "chocolate"],
  youtube: "https://youtube.com/watch?v=123",
  source: "https://example.com/recipe",
};

describe("RecipeDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Data Display", () => {
    it("should display all recipe data correctly", () => {
      render(<RecipeDetail recipe={mockRecipeData} />);

      expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();
      expect(screen.getByText("Dessert")).toBeInTheDocument();
      expect(screen.getByText("American")).toBeInTheDocument();
      expect(screen.getByText("sweet")).toBeInTheDocument();
      expect(screen.getByText("chocolate")).toBeInTheDocument();
      expect(screen.getByAltText("Chocolate Cake")).toBeInTheDocument();
    });

    it("should display recipe image with correct attributes", () => {
      render(<RecipeDetail recipe={mockRecipeData} />);

      const image = screen.getByAltText("Chocolate Cake");
      expect(image).toHaveAttribute("src", mockRecipeData.image);
      expect(image).toHaveClass("w-full", "h-full", "object-cover");
    });

    it("should display all ingredients in a list", () => {
      render(<RecipeDetail recipe={mockRecipeData} />);

      expect(screen.getByText("Ingredients")).toBeInTheDocument();
      expect(screen.getByText("flour")).toBeInTheDocument();
      expect(screen.getByText("sugar")).toBeInTheDocument();
      expect(screen.getByText("cocoa powder")).toBeInTheDocument();
      expect(screen.getByText("eggs")).toBeInTheDocument();
      expect(screen.getByText("butter")).toBeInTheDocument();
    });

    it("should display instructions with proper formatting", () => {
      render(<RecipeDetail recipe={mockRecipeData} />);

      expect(screen.getByText("Instructions")).toBeInTheDocument();
      expect(screen.getByText("Step 1: Mix ingredients")).toBeInTheDocument();
      expect(
        screen.getByText("Step 2: Bake for 30 minutes")
      ).toBeInTheDocument();
      expect(screen.getByText("Step 3: Let cool")).toBeInTheDocument();
    });

    it("should display back to recipes button", () => {
      render(<RecipeDetail recipe={mockRecipeData} />);

      const backButton = screen.getByText("Back to Recipes");
      expect(backButton).toBeInTheDocument();
      expect(backButton.closest("a")).toHaveAttribute("href", "/");
    });

    it("should display YouTube button when youtube URL is provided", () => {
      render(<RecipeDetail recipe={mockRecipeData} />);

      const youtubeButton = screen.getByText("Watch Video");
      expect(youtubeButton).toBeInTheDocument();
      expect(youtubeButton.closest("a")).toHaveAttribute(
        "href",
        mockRecipeData.youtube
      );
      expect(youtubeButton.closest("a")).toHaveAttribute("target", "_blank");
    });

    it("should display source button when source URL is provided", () => {
      render(<RecipeDetail recipe={mockRecipeData} />);

      const sourceButton = screen.getByText("Source");
      expect(sourceButton).toBeInTheDocument();
      expect(sourceButton.closest("a")).toHaveAttribute(
        "href",
        mockRecipeData.source
      );
      expect(sourceButton.closest("a")).toHaveAttribute("target", "_blank");
    });

    it("should not display YouTube button when youtube URL is not provided", () => {
      const recipeWithoutYoutube = { ...mockRecipeData, youtube: undefined };
      render(<RecipeDetail recipe={recipeWithoutYoutube} />);

      expect(screen.queryByText("Watch Video")).not.toBeInTheDocument();
    });

    it("should not display source button when source URL is not provided", () => {
      const recipeWithoutSource = { ...mockRecipeData, source: undefined };
      render(<RecipeDetail recipe={recipeWithoutSource} />);

      expect(screen.queryByText("Source")).not.toBeInTheDocument();
    });

    it("should not display tags when none are provided", () => {
      const recipeWithoutTags = { ...mockRecipeData, tags: undefined };
      render(<RecipeDetail recipe={recipeWithoutTags} />);

      expect(screen.queryByText("sweet")).not.toBeInTheDocument();
      expect(screen.queryByText("chocolate")).not.toBeInTheDocument();
    });
  });

  describe("Favorites Functionality", () => {
    it("should initialize as not favorite when localStorage is empty", () => {
      localStorageMock.getItem.mockReturnValue(null);
      render(<RecipeDetail recipe={mockRecipeData} />);

      const saveButton = screen.getByText("Save Recipe");
      expect(saveButton).toBeInTheDocument();
    });

    it("should initialize as favorite when localStorage has 'true'", () => {
      localStorageMock.getItem.mockReturnValue("true");
      render(<RecipeDetail recipe={mockRecipeData} />);

      const savedButton = screen.getByText("Saved");
      expect(savedButton).toBeInTheDocument();
    });

    it("should toggle favorite state when save button is clicked", () => {
      render(<RecipeDetail recipe={mockRecipeData} />);

      const saveButton = screen.getByText("Save Recipe");

      // Click to add to favorites
      fireEvent.click(saveButton);
      expect(screen.getByText("Saved")).toBeInTheDocument();

      // Click again to remove from favorites
      fireEvent.click(screen.getByText("Saved"));
      expect(screen.getByText("Save Recipe")).toBeInTheDocument();
    });

    it("should save favorite state to localStorage", () => {
      render(<RecipeDetail recipe={mockRecipeData} />);

      const saveButton = screen.getByText("Save Recipe");

      // Click to add to favorites
      fireEvent.click(saveButton);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "favorite-recipe-1",
        "true"
      );

      // Click again to remove from favorites
      fireEvent.click(screen.getByText("Saved"));

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "favorite-recipe-1",
        "false"
      );
    });

    it("should read favorite state from localStorage with correct key", () => {
      render(<RecipeDetail recipe={mockRecipeData} />);

      expect(localStorageMock.getItem).toHaveBeenCalledWith(
        "favorite-recipe-1"
      );
    });

    it("should handle localStorage errors gracefully", () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error("localStorage not available");
      });

      expect(() => {
        render(<RecipeDetail recipe={mockRecipeData} />);
      }).not.toThrow();

      // Should default to not favorite
      expect(screen.getByText("Save Recipe")).toBeInTheDocument();
    });

    it("should handle localStorage setItem errors gracefully", () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error("localStorage not available");
      });

      render(<RecipeDetail recipe={mockRecipeData} />);

      const saveButton = screen.getByText("Save Recipe");

      expect(() => {
        fireEvent.click(saveButton);
      }).not.toThrow();

      // Should still toggle the UI state
      expect(screen.getByText("Saved")).toBeInTheDocument();
    });
  });

  describe("Image Error Handling", () => {
    it("should display image initially", () => {
      render(<RecipeDetail recipe={mockRecipeData} />);

      const image = screen.getByAltText("Chocolate Cake");
      expect(image).toBeInTheDocument();
    });

    it("should show error placeholder when image fails to load", async () => {
      render(<RecipeDetail recipe={mockRecipeData} />);

      const image = screen.getByAltText("Chocolate Cake");

      // Simulate image load error
      fireEvent.error(image);

      await waitFor(() => {
        expect(screen.getByText("Image not available")).toBeInTheDocument();
      });

      // Original image should not be in document anymore
      expect(screen.queryByAltText("Chocolate Cake")).not.toBeInTheDocument();
    });
  });

  describe("Content Formatting", () => {
    it("should handle instructions with multiple paragraphs", () => {
      const recipeWithMultipleParagraphs = {
        ...mockRecipeData,
        instructions:
          "First paragraph.\n\nSecond paragraph.\n\nThird paragraph.",
      };

      render(<RecipeDetail recipe={recipeWithMultipleParagraphs} />);

      expect(screen.getByText("First paragraph.")).toBeInTheDocument();
      expect(screen.getByText("Second paragraph.")).toBeInTheDocument();
      expect(screen.getByText("Third paragraph.")).toBeInTheDocument();
    });

    it("should handle empty ingredient list", () => {
      const recipeWithNoIngredients = {
        ...mockRecipeData,
        ingredients: [],
      };

      render(<RecipeDetail recipe={recipeWithNoIngredients} />);

      expect(screen.getByText("Ingredients")).toBeInTheDocument();
      // Should not have any ingredient items - find the ul element
      const ingredientsList = document.querySelector('ul[class*="space-y-2"]');
      expect(ingredientsList?.children).toHaveLength(0);
    });

    it("should display proper section headings", () => {
      render(<RecipeDetail recipe={mockRecipeData} />);

      expect(screen.getByText("Ingredients")).toBeInTheDocument();
      expect(screen.getByText("Instructions")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper alt text for images", () => {
      render(<RecipeDetail recipe={mockRecipeData} />);

      const image = screen.getByAltText("Chocolate Cake");
      expect(image).toBeInTheDocument();
    });

    it("should have proper link attributes for external links", () => {
      render(<RecipeDetail recipe={mockRecipeData} />);

      const youtubeLink = screen.getByText("Watch Video").closest("a");
      const sourceLink = screen.getByText("Source").closest("a");

      expect(youtubeLink).toHaveAttribute("rel", "noopener noreferrer");
      expect(sourceLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should have proper heading structure", () => {
      render(<RecipeDetail recipe={mockRecipeData} />);

      const mainTitle = screen.getByRole("heading", { level: 1 });
      expect(mainTitle).toHaveTextContent("Chocolate Cake");

      const sectionHeadings = screen.getAllByRole("heading", { level: 2 });
      expect(sectionHeadings).toHaveLength(2);
      expect(sectionHeadings[0]).toHaveTextContent("Ingredients");
      expect(sectionHeadings[1]).toHaveTextContent("Instructions");
    });
  });
});
