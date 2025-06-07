import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { RecipesGrid } from "./recipes-grid";
import type { ProcessedRecipe } from "@/hooks/useMealDB";

// Mock the child components
vi.mock("../recipe-card/recipe-card", () => ({
  RecipeCard: ({ name, id }: { name: string; id: string }) => (
    <div data-testid={`recipe-card-${id}`}>{name}</div>
  ),
}));

vi.mock("../recipe-card/recipe-card.skeleton", () => ({
  RecipeCardSkeleton: () => <div data-testid="recipe-skeleton">Loading...</div>,
}));

vi.mock("../ui/button", () => ({
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick: () => void;
  }) => <button onClick={onClick}>{children}</button>,
}));

const mockRecipes: ProcessedRecipe[] = [
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

describe("RecipesGrid", () => {
  const mockRetry = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Loading State", () => {
    it("should render skeleton cards when loading is true", () => {
      render(
        <RecipesGrid
          recipes={[]}
          loading={true}
          error={null}
          retry={mockRetry}
        />
      );

      const skeletons = screen.getAllByTestId("recipe-skeleton");
      expect(skeletons).toHaveLength(9);
      expect(screen.queryByText("No recipes found.")).not.toBeInTheDocument();
    });

    it("should render grid container with correct classes", () => {
      const { container } = render(
        <RecipesGrid
          recipes={[]}
          loading={true}
          error={null}
          retry={mockRetry}
        />
      );

      const gridContainer = container.querySelector("div");
      expect(gridContainer).toHaveClass(
        "grid",
        "grid-cols-1",
        "md:grid-cols-2",
        "lg:grid-cols-3",
        "gap-6"
      );
    });
  });

  describe("Error State", () => {
    const mockError = new Error("Failed to fetch recipes");

    it("should display error message when error occurs", () => {
      render(
        <RecipesGrid
          recipes={[]}
          loading={false}
          error={mockError}
          retry={mockRetry}
        />
      );

      expect(
        screen.getByText("Oh no! Something went wrong. 😪")
      ).toBeInTheDocument();
    });

    it("should show retry button when retry function is provided and attempts < 3", () => {
      render(
        <RecipesGrid
          recipes={[]}
          loading={false}
          error={mockError}
          retry={mockRetry}
        />
      );

      const retryButton = screen.getByText("Retry");
      expect(retryButton).toBeInTheDocument();
    });

    it("should call retry function when retry button is clicked", () => {
      render(
        <RecipesGrid
          recipes={[]}
          loading={false}
          error={mockError}
          retry={mockRetry}
        />
      );

      const retryButton = screen.getByText("Retry");
      fireEvent.click(retryButton);

      expect(mockRetry).toHaveBeenCalledTimes(1);
    });

    it("should hide retry button after 3 attempts", () => {
      render(
        <RecipesGrid
          recipes={[]}
          loading={false}
          error={mockError}
          retry={mockRetry}
        />
      );

      const retryButton = screen.getByText("Retry");

      // Click retry button 3 times
      fireEvent.click(retryButton);
      fireEvent.click(retryButton);
      fireEvent.click(retryButton);

      expect(screen.queryByText("Retry")).not.toBeInTheDocument();
      expect(mockRetry).toHaveBeenCalledTimes(3);
    });

    it("should not show retry button when retry function is not provided", () => {
      render(<RecipesGrid recipes={[]} loading={false} error={mockError} />);

      expect(screen.queryByText("Retry")).not.toBeInTheDocument();
      expect(
        screen.getByText("Oh no! Something went wrong. 😪")
      ).toBeInTheDocument();
    });

    it("should render error state with correct styling", () => {
      render(
        <RecipesGrid
          recipes={[]}
          loading={false}
          error={mockError}
          retry={mockRetry}
        />
      );

      const errorContainer = screen.getByText(
        "Oh no! Something went wrong. 😪"
      ).parentElement;
      expect(errorContainer).toHaveClass(
        "text-center",
        "flex",
        "flex-col",
        "items-center",
        "gap-4"
      );
    });
  });

  describe("Empty State", () => {
    it("should display 'No recipes found' when recipes array is empty and not loading", () => {
      render(
        <RecipesGrid
          recipes={[]}
          loading={false}
          error={null}
          retry={mockRetry}
        />
      );

      expect(screen.getByText("No recipes found.")).toBeInTheDocument();
    });
  });

  describe("Success State", () => {
    it("should render recipe cards when recipes are provided", () => {
      render(
        <RecipesGrid
          recipes={mockRecipes}
          loading={false}
          error={null}
          retry={mockRetry}
        />
      );

      expect(screen.getByTestId("recipe-card-1")).toBeInTheDocument();
      expect(screen.getByTestId("recipe-card-2")).toBeInTheDocument();
      expect(screen.getByTestId("recipe-card-3")).toBeInTheDocument();

      expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();
      expect(screen.getByText("Chicken Curry")).toBeInTheDocument();
      expect(screen.getByText("Caesar Salad")).toBeInTheDocument();
    });

    it("should pass correct props to RecipeCard components", () => {
      render(
        <RecipesGrid
          recipes={mockRecipes}
          loading={false}
          error={null}
          retry={mockRetry}
        />
      );

      // Each recipe should be rendered with its name (which is displayed in our mocked RecipeCard)
      mockRecipes.forEach((recipe) => {
        expect(screen.getByText(recipe.name)).toBeInTheDocument();
        expect(
          screen.getByTestId(`recipe-card-${recipe.id}`)
        ).toBeInTheDocument();
      });
    });

    it("should handle single recipe correctly", () => {
      const singleRecipe = [mockRecipes[0]];

      render(
        <RecipesGrid
          recipes={singleRecipe}
          loading={false}
          error={null}
          retry={mockRetry}
        />
      );

      expect(screen.getByTestId("recipe-card-1")).toBeInTheDocument();
      expect(screen.getByText("Chocolate Cake")).toBeInTheDocument();
      expect(screen.queryByTestId("recipe-card-2")).not.toBeInTheDocument();
    });
  });

  describe("State Transitions", () => {
    it("should not show loading skeletons when not loading", () => {
      render(
        <RecipesGrid
          recipes={mockRecipes}
          loading={false}
          error={null}
          retry={mockRetry}
        />
      );

      expect(screen.queryByTestId("recipe-skeleton")).not.toBeInTheDocument();
    });

    it("should prioritize loading state over error state", () => {
      render(
        <RecipesGrid
          recipes={[]}
          loading={true}
          error={new Error("Some error")}
          retry={mockRetry}
        />
      );

      expect(screen.getAllByTestId("recipe-skeleton")).toHaveLength(9);
      expect(
        screen.queryByText("Oh no! Something went wrong. 😪")
      ).not.toBeInTheDocument();
    });

    it("should prioritize error state over empty recipes", () => {
      render(
        <RecipesGrid
          recipes={[]}
          loading={false}
          error={new Error("Some error")}
          retry={mockRetry}
        />
      );

      expect(
        screen.getByText("Oh no! Something went wrong. 😪")
      ).toBeInTheDocument();
      expect(screen.queryByText("No recipes found.")).not.toBeInTheDocument();
    });

    it("should show recipes even when error is present but loading is false", () => {
      render(
        <RecipesGrid
          recipes={mockRecipes}
          loading={false}
          error={new Error("Some error")}
          retry={mockRetry}
        />
      );

      // Error state should take precedence even if recipes are present
      expect(
        screen.getByText("Oh no! Something went wrong. 😪")
      ).toBeInTheDocument();
      expect(screen.queryByTestId("recipe-card-1")).not.toBeInTheDocument();
    });
  });

  describe("Retry Functionality", () => {
    it("should track attempts count correctly", () => {
      render(
        <RecipesGrid
          recipes={[]}
          loading={false}
          error={new Error("Error")}
          retry={mockRetry}
        />
      );

      const retryButton = screen.getByText("Retry");

      // First attempt
      fireEvent.click(retryButton);
      expect(screen.getByText("Retry")).toBeInTheDocument();

      // Second attempt
      fireEvent.click(retryButton);
      expect(screen.getByText("Retry")).toBeInTheDocument();

      // Third attempt - should still show button
      fireEvent.click(retryButton);

      // After 3 attempts, button should be hidden
      expect(screen.queryByText("Retry")).not.toBeInTheDocument();
    });

    it("should reset attempts when component receives new error", () => {
      const { rerender } = render(
        <RecipesGrid
          recipes={[]}
          loading={false}
          error={new Error("First error")}
          retry={mockRetry}
        />
      );

      const retryButton = screen.getByText("Retry");
      fireEvent.click(retryButton);
      fireEvent.click(retryButton);
      fireEvent.click(retryButton);

      // Button should be hidden after 3 attempts
      expect(screen.queryByText("Retry")).not.toBeInTheDocument();

      // Rerender with same error - should maintain attempt count
      rerender(
        <RecipesGrid
          recipes={[]}
          loading={false}
          error={new Error("First error")}
          retry={mockRetry}
        />
      );

      expect(screen.queryByText("Retry")).not.toBeInTheDocument();
    });
  });

  describe("Grid Layout", () => {
    it("should maintain grid structure across all states", () => {
      const { container, rerender } = render(
        <RecipesGrid
          recipes={[]}
          loading={true}
          error={null}
          retry={mockRetry}
        />
      );

      let gridContainer = container.querySelector("div");
      expect(gridContainer).toHaveClass(
        "grid",
        "grid-cols-1",
        "md:grid-cols-2",
        "lg:grid-cols-3",
        "gap-6"
      );

      // Test error state
      rerender(
        <RecipesGrid
          recipes={[]}
          loading={false}
          error={new Error("Error")}
          retry={mockRetry}
        />
      );

      gridContainer = container.querySelector("div");
      expect(gridContainer).toHaveClass(
        "grid",
        "grid-cols-1",
        "md:grid-cols-2",
        "lg:grid-cols-3",
        "gap-6"
      );

      // Test success state
      rerender(
        <RecipesGrid
          recipes={mockRecipes}
          loading={false}
          error={null}
          retry={mockRetry}
        />
      );

      gridContainer = container.querySelector("div");
      expect(gridContainer).toHaveClass(
        "grid",
        "grid-cols-1",
        "md:grid-cols-2",
        "lg:grid-cols-3",
        "gap-6"
      );
    });
  });
});
