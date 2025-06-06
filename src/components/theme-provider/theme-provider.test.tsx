import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider, useTheme } from "./theme-provider";

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

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

    // Reset document classes
    document.documentElement.className = "";

    // Default localStorage mock
    mockLocalStorage.getItem.mockReturnValue(null);

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
      render(
        <ThemeProvider defaultTheme="dark">
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId("current-theme")).toHaveTextContent("dark");
    });

    it("should prioritize localStorage over default theme", () => {
      mockLocalStorage.getItem.mockReturnValue("light");

      render(
        <ThemeProvider defaultTheme="dark">
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId("current-theme")).toHaveTextContent("light");
    });
  });

  describe("Theme Switching", () => {
    it("should switch to light theme and update localStorage", async () => {
      const user = userEvent.setup();

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await user.click(screen.getByTestId("set-light"));

      expect(screen.getByTestId("current-theme")).toHaveTextContent("light");
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "vite-ui-theme",
        "light"
      );
    });

    it("should switch to dark theme and update localStorage", async () => {
      const user = userEvent.setup();

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await user.click(screen.getByTestId("set-dark"));

      expect(screen.getByTestId("current-theme")).toHaveTextContent("dark");
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "vite-ui-theme",
        "dark"
      );
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
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "vite-ui-theme",
        "system"
      );
    });

    it("should use custom storage key", async () => {
      const user = userEvent.setup();

      render(
        <ThemeProvider storageKey="custom-theme-key">
          <TestComponent />
        </ThemeProvider>
      );

      await user.click(screen.getByTestId("set-light"));

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "custom-theme-key",
        "light"
      );
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

    it("should add dark class to document root for dark theme", async () => {
      const user = userEvent.setup();

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await user.click(screen.getByTestId("set-dark"));

      expect(document.documentElement.classList.contains("dark")).toBe(true);
      expect(document.documentElement.classList.contains("light")).toBe(false);
    });

    it("should remove existing theme classes when switching themes", async () => {
      const user = userEvent.setup();

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Set to light first
      await user.click(screen.getByTestId("set-light"));
      expect(document.documentElement.classList.contains("light")).toBe(true);

      // Switch to dark
      await user.click(screen.getByTestId("set-dark"));
      expect(document.documentElement.classList.contains("light")).toBe(false);
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
  });

  describe("System Theme Detection", () => {
    it("should apply light theme when system prefers light", () => {
      mockMatchMedia.mockReturnValue({
        matches: false, // prefers-color-scheme: dark is false
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      render(
        <ThemeProvider defaultTheme="system">
          <TestComponent />
        </ThemeProvider>
      );

      expect(document.documentElement.classList.contains("light")).toBe(true);
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    it("should apply dark theme when system prefers dark", () => {
      mockMatchMedia.mockReturnValue({
        matches: true, // prefers-color-scheme: dark is true
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      render(
        <ThemeProvider defaultTheme="system">
          <TestComponent />
        </ThemeProvider>
      );

      expect(document.documentElement.classList.contains("dark")).toBe(true);
      expect(document.documentElement.classList.contains("light")).toBe(false);
    });

    it("should update system theme when switching to system", async () => {
      const user = userEvent.setup();

      // Mock system prefers dark
      mockMatchMedia.mockReturnValue({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      render(
        <ThemeProvider defaultTheme="light">
          <TestComponent />
        </ThemeProvider>
      );

      // Initially should be light
      expect(document.documentElement.classList.contains("light")).toBe(true);

      // Switch to system (which prefers dark)
      await user.click(screen.getByTestId("set-system"));

      expect(document.documentElement.classList.contains("dark")).toBe(true);
      expect(document.documentElement.classList.contains("light")).toBe(false);
    });
  });

  describe("LocalStorage Integration", () => {
    it("should read theme from localStorage on initialization", () => {
      mockLocalStorage.getItem.mockReturnValue("dark");

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("vite-ui-theme");
      expect(screen.getByTestId("current-theme")).toHaveTextContent("dark");
    });

    it("should use invalid localStorage values as-is (current behavior)", () => {
      mockLocalStorage.getItem.mockReturnValue("invalid-theme");

      render(
        <ThemeProvider defaultTheme="light">
          <TestComponent />
        </ThemeProvider>
      );

      // Current implementation doesn't validate localStorage values
      expect(screen.getByTestId("current-theme")).toHaveTextContent(
        "invalid-theme"
      );
    });

    it("should crash when localStorage throws errors (current behavior)", () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error("localStorage error");
      });

      // Current implementation doesn't handle localStorage errors
      expect(() => {
        render(
          <ThemeProvider defaultTheme="dark">
            <TestComponent />
          </ThemeProvider>
        );
      }).toThrow("localStorage error");
    });
  });
});
