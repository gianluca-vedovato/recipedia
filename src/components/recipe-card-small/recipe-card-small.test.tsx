import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { RecipeCardSmall } from "./recipe-card-small";

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

const mockRecipeData = {
  id: "recipe-1",
  name: "Delicious Pasta",
  image: "https://example.com/pasta.jpg",
};

describe("RecipeCardSmall", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render recipe name correctly", () => {
      render(<RecipeCardSmall {...mockRecipeData} />);

      expect(screen.getByText("Delicious Pasta")).toBeInTheDocument();
    });

    it("should render recipe image with correct attributes", () => {
      render(<RecipeCardSmall {...mockRecipeData} />);

      const image = screen.getByAltText("Delicious Pasta");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "https://example.com/pasta.jpg");
      expect(image).toHaveClass("w-full", "h-full", "object-cover");
    });

    it("should render with proper structure", () => {
      render(<RecipeCardSmall {...mockRecipeData} />);

      // Check for the component structure using data-testid attributes
      const wrapper = screen.getByTestId("recipe-card-small-wrapper");
      const imageContainer = screen.getByTestId("recipe-card-small-image");
      const contentContainer = screen.getByTestId("recipe-card-small-content");

      expect(wrapper).toBeInTheDocument();
      expect(imageContainer).toBeInTheDocument();
      expect(contentContainer).toBeInTheDocument();
    });
  });

  describe("Text Content", () => {
    it("should display name with correct styling", () => {
      render(<RecipeCardSmall {...mockRecipeData} />);

      const nameElement = screen.getByTestId("recipe-card-small-name");
      expect(nameElement).toHaveTextContent("Delicious Pasta");
      expect(nameElement).toHaveClass("text-sm", "font-medium");
    });

    it("should handle long recipe names", () => {
      const longNameData = {
        ...mockRecipeData,
        name: "A Very Long Recipe Name That Might Need Truncation Or Special Handling",
      };

      render(<RecipeCardSmall {...longNameData} />);

      const nameElement = screen.getByTestId("recipe-card-small-name");
      expect(nameElement).toHaveTextContent(
        "A Very Long Recipe Name That Might Need Truncation Or Special Handling"
      );
    });

    it("should handle special characters in recipe names", () => {
      const specialCharData = {
        ...mockRecipeData,
        name: "Café & Crème Brûlée with 'Special' Characters",
      };

      render(<RecipeCardSmall {...specialCharData} />);

      const nameElement = screen.getByTestId("recipe-card-small-name");
      expect(nameElement).toHaveTextContent(
        "Café & Crème Brûlée with 'Special' Characters"
      );
    });
  });

  describe("Image Handling", () => {
    it("should handle missing image gracefully", () => {
      const noImageData = {
        ...mockRecipeData,
        image: "",
      };

      render(<RecipeCardSmall {...noImageData} />);

      const placeholder = screen.getByTestId(
        "recipe-card-small-img-placeholder"
      );
      expect(placeholder).toBeInTheDocument();
      expect(placeholder).toHaveClass("bg-orange-200");
    });

    it("should handle image load errors", () => {
      render(<RecipeCardSmall {...mockRecipeData} />);

      const image = screen.getByTestId("recipe-card-small-img");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", mockRecipeData.image);
    });

    it("should handle different image formats", () => {
      const webpImageData = {
        ...mockRecipeData,
        image: "https://example.com/pasta.webp",
      };

      render(<RecipeCardSmall {...webpImageData} />);

      const image = screen.getByTestId("recipe-card-small-img");
      expect(image).toHaveAttribute("src", "https://example.com/pasta.webp");
    });

    it("should render image with proper alt text", () => {
      render(<RecipeCardSmall {...mockRecipeData} />);

      const image = screen.getByTestId("recipe-card-small-img");
      expect(image).toHaveAttribute("alt", "Delicious Pasta");
    });
  });

  describe("Props Handling", () => {
    it("should handle minimum required props", () => {
      const minimalData = {
        id: "test-id",
        name: "Test Recipe",
        image: "test.jpg",
      };

      render(<RecipeCardSmall {...minimalData} />);

      expect(screen.getByText("Test Recipe")).toBeInTheDocument();
      expect(screen.getByAltText("Test Recipe")).toBeInTheDocument();
    });

    it("should handle empty string props", () => {
      render(<RecipeCardSmall id="123" name="" image="" />);

      const placeholder = screen.getByTestId(
        "recipe-card-small-img-placeholder"
      );
      expect(placeholder).toBeInTheDocument();

      const nameElement = screen.getByTestId("recipe-card-small-name");
      expect(nameElement).toHaveTextContent("");
    });
  });

  describe("Accessibility", () => {
    it("should have proper image alt text for screen readers", () => {
      render(<RecipeCardSmall {...mockRecipeData} />);

      const image = screen.getByAltText("Delicious Pasta");
      expect(image).toBeInTheDocument();
    });

    it("should be keyboard accessible", () => {
      render(<RecipeCardSmall {...mockRecipeData} />);

      const wrapper = screen.getByTestId("recipe-card-small-wrapper");
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe("CSS Classes", () => {
    it("should apply correct CSS classes to image", () => {
      render(<RecipeCardSmall {...mockRecipeData} />);

      const image = screen.getByTestId("recipe-card-small-img");
      expect(image).toHaveClass("w-full", "h-full", "object-cover");
    });

    it("should apply correct CSS classes to text", () => {
      render(<RecipeCardSmall {...mockRecipeData} />);

      const nameElement = screen.getByTestId("recipe-card-small-name");
      expect(nameElement).toHaveClass("text-sm", "font-medium");
    });

    it("should apply correct layout classes", () => {
      render(<RecipeCardSmall {...mockRecipeData} />);

      // Check wrapper
      const wrapper = screen.getByTestId("recipe-card-small-wrapper");
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveClass("flex", "gap-2", "items-start");

      // Check image container
      const imageContainer = screen.getByTestId("recipe-card-small-image");
      expect(imageContainer).toBeInTheDocument();
      expect(imageContainer).toHaveClass(
        "w-16",
        "h-16",
        "lg:w-12",
        "lg:h-12",
        "rounded-md",
        "overflow-hidden"
      );

      // Check content container
      const contentContainer = screen.getByTestId("recipe-card-small-content");
      expect(contentContainer).toBeInTheDocument();
      expect(contentContainer).toHaveClass(
        "flex",
        "flex-col",
        "gap-1",
        "flex-1"
      );
    });
  });

  describe("Recently Viewed Badge", () => {
    it("should show 'Seen recently' badge when isRecentlyViewed is true", () => {
      render(<RecipeCardSmall {...mockRecipeData} isRecentlyViewed={true} />);

      const badge = screen.getByTestId(
        "recipe-card-small-recently-viewed-badge"
      );
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent("Seen recently");
    });

    it("should not show badge when isRecentlyViewed is false or undefined", () => {
      render(<RecipeCardSmall {...mockRecipeData} isRecentlyViewed={false} />);

      expect(
        screen.queryByTestId("recipe-card-small-recently-viewed-badge")
      ).not.toBeInTheDocument();
    });
  });
});
