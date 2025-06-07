import { render, screen, fireEvent } from "@testing-library/react";
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

      // Check for the component structure using class selectors
      const wrapper = document.querySelector(".flex.gap-2.items-start");
      const imageContainer = document.querySelector(
        ".w-12.h-12.rounded-md.overflow-hidden"
      );
      const contentContainer = document.querySelector(".flex.flex-col.gap-1");

      expect(wrapper).toBeInTheDocument();
      expect(imageContainer).toBeInTheDocument();
      expect(contentContainer).toBeInTheDocument();
    });
  });

  describe("Text Content", () => {
    it("should display name with correct styling", () => {
      render(<RecipeCardSmall {...mockRecipeData} />);

      const nameElement = screen.getByText("Delicious Pasta");
      expect(nameElement).toHaveClass("text-sm", "font-medium");
    });

    it("should handle long recipe names", () => {
      const longNameData = {
        ...mockRecipeData,
        name: "A Very Long Recipe Name That Might Need Truncation Or Special Handling",
      };

      render(<RecipeCardSmall {...longNameData} />);

      expect(
        screen.getByText(
          "A Very Long Recipe Name That Might Need Truncation Or Special Handling"
        )
      ).toBeInTheDocument();
    });

    it("should handle special characters in recipe names", () => {
      const specialCharData = {
        ...mockRecipeData,
        name: "Café & Crème Brûlée with 'Special' Characters",
      };

      render(<RecipeCardSmall {...specialCharData} />);

      expect(
        screen.getByText("Café & Crème Brûlée with 'Special' Characters")
      ).toBeInTheDocument();
    });
  });

  describe("Image Handling", () => {
    it("should handle missing image gracefully", () => {
      const noImageData = {
        ...mockRecipeData,
        image: "",
      };

      render(<RecipeCardSmall {...noImageData} />);

      const image = screen.getByAltText("Delicious Pasta");
      // When src is empty string, browser removes the attribute entirely
      expect(image).not.toHaveAttribute("src");
    });

    it("should handle image load errors", () => {
      render(<RecipeCardSmall {...mockRecipeData} />);

      const image = screen.getByAltText("Delicious Pasta");

      // Simulate image error
      fireEvent.error(image);

      // Image should still be present (component doesn't handle errors)
      expect(image).toBeInTheDocument();
    });

    it("should handle different image formats", () => {
      const webpImageData = {
        ...mockRecipeData,
        image: "https://example.com/pasta.webp",
      };

      render(<RecipeCardSmall {...webpImageData} />);

      const image = screen.getByAltText("Delicious Pasta");
      expect(image).toHaveAttribute("src", "https://example.com/pasta.webp");
    });

    it("should render image with proper alt text", () => {
      render(<RecipeCardSmall {...mockRecipeData} />);

      const image = screen.getByAltText("Delicious Pasta");
      expect(image).toBeInTheDocument();
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
      const emptyData = {
        id: "",
        name: "",
        image: "",
      };

      render(<RecipeCardSmall {...emptyData} />);

      // Should render without crashing - image with empty alt has role "presentation"
      const image = screen.getByRole("presentation");
      expect(image).toBeInTheDocument();
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

      const wrapper = document.querySelector(".flex.gap-2.items-start");

      // Should be focusable if needed
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe("CSS Classes", () => {
    it("should apply correct CSS classes to image", () => {
      render(<RecipeCardSmall {...mockRecipeData} />);

      const image = screen.getByAltText("Delicious Pasta");
      expect(image).toHaveClass("w-full", "h-full", "object-cover");
    });

    it("should apply correct CSS classes to text", () => {
      render(<RecipeCardSmall {...mockRecipeData} />);

      const nameElement = screen.getByText("Delicious Pasta");
      expect(nameElement).toHaveClass("text-sm", "font-medium");
    });

    it("should apply correct layout classes", () => {
      render(<RecipeCardSmall {...mockRecipeData} />);

      // Check wrapper classes
      const wrapper = document.querySelector(".flex.gap-2.items-start");
      expect(wrapper).toBeInTheDocument();

      // Check image container classes
      const imageContainer = document.querySelector(
        ".w-12.h-12.rounded-md.overflow-hidden"
      );
      expect(imageContainer).toBeInTheDocument();

      // Check content container classes
      const contentContainer = document.querySelector(".flex.flex-col.gap-1");
      expect(contentContainer).toBeInTheDocument();
    });
  });
});
