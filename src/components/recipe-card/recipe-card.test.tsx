import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
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

const mockRecipeData = {
  id: "recipe-1",
  name: "Chocolate Cake",
  category: "Dessert",
  image: "https://example.com/chocolate-cake.jpg",
  ingredients: ["flour", "sugar", "cocoa powder", "eggs"],
};

describe("RecipeCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Data Display", () => {
    it("should display all recipe data correctly", () => {
      render(<RecipeCard {...mockRecipeData} />);

      expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();
      expect(screen.getByText("Dessert")).toBeInTheDocument();
      expect(
        screen.getByText("flour, sugar, cocoa powder, eggs")
      ).toBeInTheDocument();
      expect(screen.getByAltText("Chocolate Cake")).toBeInTheDocument();
    });

    it("should display recipe image with correct attributes", () => {
      render(<RecipeCard {...mockRecipeData} />);

      const image = screen.getByAltText("Chocolate Cake");
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
    it("should initialize as not favorite when localStorage is empty", () => {
      localStorageMock.getItem.mockReturnValue(null);
      render(<RecipeCard {...mockRecipeData} />);

      const heartButton = screen.getByRole("button");
      const heartIcon = heartButton.querySelector("svg");

      expect(heartIcon).toHaveAttribute("fill", "transparent");
      expect(heartIcon).toHaveClass("text-white");
    });

    it("should initialize as favorite when localStorage has 'true'", () => {
      localStorageMock.getItem.mockReturnValue("true");
      render(<RecipeCard {...mockRecipeData} />);

      const heartButton = screen.getByRole("button");
      const heartIcon = heartButton.querySelector("svg");

      expect(heartIcon).toHaveAttribute("fill", "red");
      expect(heartIcon).toHaveClass("text-red-500");
    });

    it("should toggle favorite state when heart button is clicked", () => {
      render(<RecipeCard {...mockRecipeData} />);

      const heartButton = screen.getByRole("button");
      const heartIcon = heartButton.querySelector("svg");

      // Initially not favorite
      expect(heartIcon).toHaveAttribute("fill", "transparent");
      expect(heartIcon).toHaveClass("text-white");

      // Click to add to favorites
      fireEvent.click(heartButton);

      expect(heartIcon).toHaveAttribute("fill", "red");
      expect(heartIcon).toHaveClass("text-red-500");

      // Click again to remove from favorites
      fireEvent.click(heartButton);

      expect(heartIcon).toHaveAttribute("fill", "transparent");
      expect(heartIcon).toHaveClass("text-white");
    });

    it("should save favorite state to localStorage", () => {
      render(<RecipeCard {...mockRecipeData} />);

      const heartButton = screen.getByRole("button");

      // Click to add to favorites
      fireEvent.click(heartButton);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "favorite-recipe-1",
        "true"
      );

      // Click again to remove from favorites
      fireEvent.click(heartButton);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "favorite-recipe-1",
        "false"
      );
    });

    it("should read favorite state from localStorage with correct key", () => {
      render(<RecipeCard {...mockRecipeData} />);

      expect(localStorageMock.getItem).toHaveBeenCalledWith(
        "favorite-recipe-1"
      );
    });

    it("should prevent default link behavior when clicking heart button", () => {
      render(<RecipeCard {...mockRecipeData} />);

      const heartButton = screen.getByRole("button");
      const clickEvent = new MouseEvent("click", { bubbles: true });
      const preventDefaultSpy = vi.spyOn(clickEvent, "preventDefault");

      fireEvent(heartButton, clickEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe("Image Error Handling", () => {
    it("should display image initially", () => {
      render(<RecipeCard {...mockRecipeData} />);

      const image = screen.getByAltText("Chocolate Cake");
      expect(image).toBeInTheDocument();
    });

    it("should show error placeholder when image fails to load", async () => {
      render(<RecipeCard {...mockRecipeData} />);

      const image = screen.getByAltText("Chocolate Cake");

      // Simulate image load error
      fireEvent.error(image);

      await waitFor(() => {
        // Check for the error placeholder div with orange background
        const errorDiv = document.querySelector(".bg-orange-200");
        expect(errorDiv).toBeInTheDocument();
        expect(errorDiv).toHaveClass(
          "w-full",
          "h-48",
          "bg-orange-200",
          "flex",
          "items-center",
          "justify-center",
          "text-gray-400"
        );
      });

      // Original image should not be in document anymore
      expect(screen.queryByAltText("Chocolate Cake")).not.toBeInTheDocument();
    });

    it("should display error placeholder with correct styling", async () => {
      render(<RecipeCard {...mockRecipeData} />);

      const image = screen.getByAltText("Chocolate Cake");
      fireEvent.error(image);

      await waitFor(() => {
        const errorDiv = document.querySelector(".bg-orange-200");
        expect(errorDiv).toBeInTheDocument();
        expect(errorDiv).toHaveClass(
          "w-full",
          "h-48",
          "bg-orange-200",
          "flex",
          "items-center",
          "justify-center",
          "text-gray-400"
        );
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper alt text for image", () => {
      render(<RecipeCard {...mockRecipeData} />);

      const image = screen.getByAltText("Chocolate Cake");
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

      const heartButton = screen.getByRole("button");
      expect(heartButton).toHaveClass("absolute", "top-2", "right-2");
    });

    it("should apply transition classes to heart icon", () => {
      render(<RecipeCard {...mockRecipeData} />);

      const heartButton = screen.getByRole("button");
      const heartIcon = heartButton.querySelector("svg");

      expect(heartIcon).toHaveClass("transition-colors", "duration-200");
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
      const ingredientsElement = screen.getByText("", {
        selector: ".text-sm.text-muted-foreground",
      });
      expect(ingredientsElement).toBeInTheDocument();
    });

    it("should handle very long recipe names", () => {
      const recipeWithLongName = {
        ...mockRecipeData,
        name: "This is a very long recipe name that might cause layout issues if not handled properly",
      };

      render(<RecipeCard {...recipeWithLongName} />);

      const nameElement = screen.getByText(recipeWithLongName.name);
      expect(nameElement).toBeInTheDocument();
      expect(nameElement).toHaveClass("flex-1"); // Should allow text to wrap
    });

    it("should handle localStorage errors gracefully", () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error("localStorage error");
      });

      // Should not throw error and default to false
      expect(() => render(<RecipeCard {...mockRecipeData} />)).not.toThrow();

      const heartButton = screen.getByRole("button");
      const heartIcon = heartButton.querySelector("svg");

      // Should default to not favorite
      expect(heartIcon).toHaveAttribute("fill", "transparent");
    });

    it("should handle setItem localStorage errors gracefully", () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error("localStorage setItem error");
      });

      render(<RecipeCard {...mockRecipeData} />);

      const heartButton = screen.getByRole("button");
      const heartIcon = heartButton.querySelector("svg");

      // Initially not favorite
      expect(heartIcon).toHaveAttribute("fill", "transparent");

      // Should not throw error when clicking, but should still update UI
      expect(() => fireEvent.click(heartButton)).not.toThrow();

      // UI should still update even if localStorage fails
      expect(heartIcon).toHaveAttribute("fill", "red");
    });
  });
});
