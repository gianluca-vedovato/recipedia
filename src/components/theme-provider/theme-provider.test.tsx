import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider, useTheme } from "./theme-provider";

// Mock the useLocalStorage hook
let mockThemeValue = "system";
const mockSetTheme = vi.fn();

vi.mock("../../hooks/useLocalStorage", () => ({
  useLocalStorage: () => [mockThemeValue, mockSetTheme],
}));

// Mock matchMedia
const mockMatchMedia = vi.fn();
Object.defineProperty(window, "matchMedia", {
  value: mockMatchMedia,
});

// Test component that uses the theme hook
function TestComponent() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button onClick={() => setTheme("light")} data-testid="set-light">
        Set Light
      </button>
      <button onClick={() => setTheme("dark")} data-testid="set-dark">
        Set Dark
      </button>
      <button onClick={() => setTheme("system")} data-testid="set-system">
        Set System
      </button>
    </div>
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Reset theme value
    mockThemeValue = "system";

    // Reset document classes
    document.documentElement.className = "";

    // Default matchMedia mock (light theme)
    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  describe("Theme Context", () => {
    it("should provide theme context when used within provider", () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId("current-theme")).toHaveTextContent("system");
    });
  });

  describe("Default Theme", () => {
    it('should use "system" as default theme', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId("current-theme")).toHaveTextContent("system");
    });

    it("should use custom default theme when provided", () => {
      mockThemeValue = "dark"; // Mock will return dark theme value

      render(
        <ThemeProvider defaultTheme="dark">
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId("current-theme")).toHaveTextContent("dark");
    });

    it("should prioritize stored theme over default theme", () => {
      mockThemeValue = "light";

      render(
        <ThemeProvider defaultTheme="dark">
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId("current-theme")).toHaveTextContent("light");
    });
  });

  describe("Theme Switching", () => {
    it("should call setTheme when switching to light theme", async () => {
      const user = userEvent.setup();

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await user.click(screen.getByTestId("set-light"));

      expect(mockSetTheme).toHaveBeenCalledWith("light");
    });

    it("should call setTheme when switching to dark theme", async () => {
      const user = userEvent.setup();

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await user.click(screen.getByTestId("set-dark"));

      expect(mockSetTheme).toHaveBeenCalledWith("dark");
    });

    it("should switch to system theme and update localStorage", async () => {
      const user = userEvent.setup();

      render(
        <ThemeProvider defaultTheme="light">
          <TestComponent />
        </ThemeProvider>
      );

      await user.click(screen.getByTestId("set-system"));

      expect(screen.getByTestId("current-theme")).toHaveTextContent("system");
      expect(mockSetTheme).toHaveBeenCalledWith("system");
    });
  });

  describe("DOM Class Manipulation", () => {
    it("should add light class to document root for light theme", async () => {
      const user = userEvent.setup();

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await user.click(screen.getByTestId("set-light"));

      expect(document.documentElement.classList.contains("light")).toBe(true);
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    it("should add dark class to document root for dark theme", () => {
      mockThemeValue = "dark"; // Mock returns dark theme

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // The component should add the dark class based on the mocked theme value
      expect(document.documentElement.classList.contains("dark")).toBe(true);
      expect(document.documentElement.classList.contains("light")).toBe(false);
    });
  });

  describe("Storage Integration", () => {
    it("should use stored theme on initialization", () => {
      mockThemeValue = "dark";

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId("current-theme")).toHaveTextContent("dark");
    });
  });
});
