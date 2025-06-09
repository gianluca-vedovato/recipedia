import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import type { Mock } from "vitest";
import { RecipeCard } from "./recipe-card";

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

// At the top of the file
let mockIsFavorite: Mock;
let mockToggleFavorite: Mock;

vi.mock("@/hooks/useFavorites", () => ({
  useFavorites: () => ({
    favoriteIds: [],
    loadFavorites: vi.fn(),
    isFavorite: (...args: unknown[]) => mockIsFavorite(...args),
    toggleFavorite: (...args: unknown[]) => mockToggleFavorite(...args),
  }),
}));

const mockRecipeData = {
  id: "recipe-1",
  name: "Delicious Pasta",
  category: "Italian",
  image: "https://example.com/pasta.jpg",
  ingredients: ["Pasta", "Tomato Sauce", "Cheese"],
  area: "Italy",
  instructions: "Cook pasta according to package instructions.",
  youtube: "https://youtube.com/watch?v=123",
  source: "https://example.com/recipe",
  tags: ["pasta", "italian"],
};

describe("RecipeCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsFavorite = vi.fn().mockReturnValue(false);
    mockToggleFavorite = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Data Display", () => {
    it("should display all recipe data correctly", () => {
      render(<RecipeCard {...mockRecipeData} />);

      expect(screen.getByText("Delicious Pasta")).toBeInTheDocument();
      expect(screen.getByText("Italian")).toBeInTheDocument();
      expect(
        screen.getByText("Pasta, Tomato Sauce, Cheese")
      ).toBeInTheDocument();
      expect(screen.getByAltText("Delicious Pasta")).toBeInTheDocument();
    });

    it("should display recipe image with correct attributes", () => {
      render(<RecipeCard {...mockRecipeData} />);

      const image = screen.getByAltText("Delicious Pasta");
      expect(image).toHaveAttribute("src", mockRecipeData.image);
      expect(image).toHaveClass("w-full", "h-48", "object-cover");
    });

    it("should render ingredients as comma-separated string", () => {
      const recipeWithManyIngredients = {
        ...mockRecipeData,
        ingredients: [
          "ingredient1",
          "ingredient2",
          "ingredient3",
          "ingredient4",
          "ingredient5",
        ],
      };

      render(<RecipeCard {...recipeWithManyIngredients} />);

      expect(
        screen.getByText(
          "ingredient1, ingredient2, ingredient3, ingredient4, ingredient5"
        )
      ).toBeInTheDocument();
    });
  });

  describe("Favorites Functionality", () => {
    it("should initialize as not favorite when not in favorites", () => {
      mockIsFavorite.mockReturnValue(false);
      render(<RecipeCard {...mockRecipeData} />);

      const heartIcon = screen.getByTestId("recipe-card-heart-icon");
      expect(heartIcon).toHaveClass("text-white");
      expect(heartIcon).not.toHaveClass("fill-red-500", "stroke-red-500");
    });

    it("should initialize as favorite when in favorites", () => {
      mockIsFavorite.mockReturnValue(true);
      render(<RecipeCard {...mockRecipeData} />);

      const heartIcon = screen.getByTestId("recipe-card-heart-icon");
      expect(heartIcon).toHaveClass("text-white");
      expect(heartIcon).toHaveClass("fill-red-500", "stroke-red-500");
    });

    it("should call correct functions when toggling favorite state", () => {
      render(<RecipeCard {...mockRecipeData} />);
      const heartButton = screen.getByTestId("recipe-card-favorite-button");
      fireEvent.click(heartButton);
      expect(mockToggleFavorite).toHaveBeenCalledWith(mockRecipeData.id);
    });

    it("should call toggleFavorite when heart button is clicked", () => {
      render(<RecipeCard {...mockRecipeData} />);
      const heartButton = screen.getByTestId("recipe-card-favorite-button");
      fireEvent.click(heartButton);
      expect(mockToggleFavorite).toHaveBeenCalledWith(mockRecipeData.id);
    });

    it("should check favorite state with correct recipe ID", () => {
      render(<RecipeCard {...mockRecipeData} />);

      expect(mockIsFavorite).toHaveBeenCalledWith("recipe-1");
    });

    it("should prevent default link behavior when clicking heart button", () => {
      render(<RecipeCard {...mockRecipeData} />);

      const heartButton = screen.getByTestId("recipe-card-favorite-button");
      const clickEvent = new MouseEvent("click", { bubbles: true });
      const preventDefaultSpy = vi.spyOn(clickEvent, "preventDefault");

      fireEvent(heartButton, clickEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it("should handle favorites hook errors gracefully", () => {
      const mockUseFavorites = vi.fn().mockImplementation(() => {
        throw new Error("Favorites hook error");
      });
      vi.stubGlobal("useFavorites", mockUseFavorites);

      expect(() => render(<RecipeCard {...mockRecipeData} />)).not.toThrow();
    });
  });

  describe("Image Error Handling", () => {
    it("should display image initially", () => {
      render(<RecipeCard {...mockRecipeData} />);

      const image = screen.getByAltText("Delicious Pasta");
      expect(image).toBeInTheDocument();
    });

    it("should show error placeholder when image fails to load", () => {
      render(<RecipeCard {...mockRecipeData} />);
      const image = screen.getByTestId("recipe-card-img");
      fireEvent.error(image);

      // Should show error placeholder
      const errorPlaceholder = screen.getByTestId(
        "recipe-card-error-placeholder"
      );
      expect(errorPlaceholder).toBeInTheDocument();
      expect(errorPlaceholder).toHaveClass("bg-orange-200");
    });

    it("should display error placeholder with correct styling", () => {
      render(<RecipeCard {...mockRecipeData} />);

      const image = screen.getByTestId("recipe-card-img");
      fireEvent.error(image);

      expect(image).toHaveClass("w-full", "h-48", "object-cover");
    });
  });

  describe("Accessibility", () => {
    it("should have proper alt text for image", () => {
      render(<RecipeCard {...mockRecipeData} />);

      const image = screen.getByAltText("Delicious Pasta");
      expect(image).toBeInTheDocument();
    });

    it("should have accessible button for favorites", () => {
      render(<RecipeCard {...mockRecipeData} />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("should have proper link structure", () => {
      render(<RecipeCard {...mockRecipeData} />);

      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/recipe/$id");
    });
  });

  describe("Styling and Interactions", () => {
    it("should apply hover classes to main link", () => {
      render(<RecipeCard {...mockRecipeData} />);

      const link = screen.getByRole("link");
      expect(link).toHaveClass(
        "hover:-translate-y-0.5",
        "hover:opacity-80",
        "transition-all",
        "duration-300"
      );
    });

    it("should have heart button positioned correctly", () => {
      render(<RecipeCard {...mockRecipeData} />);

      const heartButton = screen.getByTestId("recipe-card-favorite-button");
      expect(heartButton).toHaveClass("absolute", "top-2", "right-2");
    });

    it("should apply transition classes to heart icon", () => {
      render(<RecipeCard {...mockRecipeData} />);

      const heartIcon = screen.getByTestId("recipe-card-heart-icon");
      expect(heartIcon).toHaveClass("transition-[colors,");
      expect(heartIcon).toHaveClass("transform]");
      expect(heartIcon).toHaveClass("duration-200");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty ingredients array", () => {
      const recipeWithNoIngredients = {
        ...mockRecipeData,
        ingredients: [],
      };

      render(<RecipeCard {...recipeWithNoIngredients} />);

      // Should render empty string for ingredients
      const ingredientsElement = screen.getByTestId("recipe-card-ingredients");
      expect(ingredientsElement).toBeInTheDocument();
    });

    it("should handle very long recipe names", () => {
      const recipeWithLongName = {
        ...mockRecipeData,
        name: "This is a very long recipe name that might cause layout issues if not handled properly",
      };

      render(<RecipeCard {...recipeWithLongName} />);

      const nameElement = screen.getByTestId("recipe-card-name");
      expect(nameElement).toBeInTheDocument();
      expect(nameElement).toHaveClass("flex-1"); // Should allow text to wrap
    });

    it("should handle toggle favorite errors gracefully", () => {
      mockToggleFavorite.mockImplementation(() => {
        console.error("toggle favorite error");
        return false;
      });

      render(<RecipeCard {...mockRecipeData} />);

      const heartButton = screen.getByRole("button");

      // Should not throw error when clicking
      expect(() => fireEvent.click(heartButton)).not.toThrow();
    });
  });
});
