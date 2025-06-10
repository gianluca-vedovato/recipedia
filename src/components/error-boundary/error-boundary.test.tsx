import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  ErrorBoundary,
  GlobalErrorBoundary,
  PageErrorBoundary,
  ComponentErrorBoundary,
} from "./error-boundary";

// Test component that throws an error
const ThrowError = ({
  shouldThrow = false,
  message = "Test error",
}: {
  shouldThrow?: boolean;
  message?: string;
}) => {
  if (shouldThrow) {
    throw new Error(message);
  }
  return <div data-testid="working-component">Component is working</div>;
};

// Mock console methods to test error logging
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleGroup = console.group;
const originalConsoleGroupEnd = console.groupEnd;

describe("ErrorBoundary", () => {
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console methods to prevent error spam in tests
    console.error = vi.fn();
    console.warn = vi.fn();
    console.group = vi.fn();
    console.groupEnd = vi.fn();
  });

  afterEach(() => {
    // Restore console methods
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
    console.group = originalConsoleGroup;
    console.groupEnd = originalConsoleGroupEnd;
  });

  describe("Normal Operation", () => {
    it("should render children when no error occurs", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId("working-component")).toBeInTheDocument();
      expect(screen.getByText("Component is working")).toBeInTheDocument();
    });

    it("should not display error fallback when children render successfully", () => {
      render(
        <ErrorBoundary>
          <div data-testid="success-component">All good!</div>
        </ErrorBoundary>
      );

      expect(screen.getByTestId("success-component")).toBeInTheDocument();
      expect(
        screen.queryByTestId("error-boundary-fallback")
      ).not.toBeInTheDocument();
    });
  });

  describe("Error Catching", () => {
    it("should catch errors and display fallback UI", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} message="Component crashed" />
        </ErrorBoundary>
      );

      expect(screen.getByTestId("error-boundary-fallback")).toBeInTheDocument();
      expect(screen.getByText("Component Error")).toBeInTheDocument();
      expect(screen.queryByTestId("working-component")).not.toBeInTheDocument();
    });

    it("should call onError callback when error occurs", () => {
      render(
        <ErrorBoundary onError={mockOnError}>
          <ThrowError shouldThrow={true} message="Test error" />
        </ErrorBoundary>
      );

      expect(mockOnError).toHaveBeenCalledTimes(1);
      expect(mockOnError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String),
        })
      );
    });

    it("should display error details when showDetails is true", () => {
      render(
        <ErrorBoundary showDetails={true}>
          <ThrowError shouldThrow={true} message="Detailed error" />
        </ErrorBoundary>
      );

      expect(
        screen.getByText("Error Details (for developers)")
      ).toBeInTheDocument();

      // Click to expand details
      fireEvent.click(screen.getByText("Error Details (for developers)"));

      expect(screen.getByText("Error: Detailed error")).toBeInTheDocument();
    });

    it("should not display error details when showDetails is false", () => {
      render(
        <ErrorBoundary showDetails={false}>
          <ThrowError shouldThrow={true} message="Hidden error" />
        </ErrorBoundary>
      );

      expect(
        screen.queryByText("Error Details (for developers)")
      ).not.toBeInTheDocument();
    });
  });

  describe("Retry Functionality", () => {
    it("should display retry button when error occurs", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(
        screen.getByTestId("error-boundary-retry-button")
      ).toBeInTheDocument();
      expect(screen.getByText("Try Again")).toBeInTheDocument();
    });

    it("should reset error state when retry button is clicked", () => {
      let shouldThrow = true;
      const TestComponent = () => <ThrowError shouldThrow={shouldThrow} />;

      const { rerender } = render(
        <ErrorBoundary>
          <TestComponent />
        </ErrorBoundary>
      );

      // Initially should show error
      expect(screen.getByTestId("error-boundary-fallback")).toBeInTheDocument();

      // Fix the error condition
      shouldThrow = false;

      // Click retry
      fireEvent.click(screen.getByTestId("error-boundary-retry-button"));

      // Re-render with fixed component
      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId("working-component")).toBeInTheDocument();
      expect(
        screen.queryByTestId("error-boundary-fallback")
      ).not.toBeInTheDocument();
    });

    it("should track retry count and show remaining attempts", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      let retryButton = screen.getByTestId("error-boundary-retry-button");

      // Initially should show just "Try Again"
      expect(screen.getByText("Try Again")).toBeInTheDocument();

      // First retry
      fireEvent.click(retryButton);
      retryButton = screen.getByTestId("error-boundary-retry-button");
      expect(retryButton).toHaveTextContent("Try Again (2 left)");

      // Second retry
      fireEvent.click(retryButton);
      retryButton = screen.getByTestId("error-boundary-retry-button");
      expect(retryButton).toHaveTextContent("Try Again (1 left)");

      // Third retry (max reached)
      fireEvent.click(retryButton);
      expect(
        screen.queryByTestId("error-boundary-retry-button")
      ).not.toBeInTheDocument();
      expect(
        screen.getByText(
          "Maximum retry attempts reached. Please reload the page or contact support."
        )
      ).toBeInTheDocument();
    });
  });

  describe("Error Levels", () => {
    it("should render component-level error styling by default", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const fallback = screen.getByTestId("error-boundary-fallback");
      expect(fallback).toHaveClass("min-h-[200px]");
      expect(screen.getByText("Component Error")).toBeInTheDocument();
    });

    it("should render page-level error styling", () => {
      render(
        <ErrorBoundary level="page">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const fallback = screen.getByTestId("error-boundary-fallback");
      expect(fallback).toHaveClass("min-h-[400px]");
      expect(screen.getByText("Page Error")).toBeInTheDocument();
      expect(
        screen.getByTestId("error-boundary-home-button")
      ).toBeInTheDocument();
    });

    it("should render global-level error styling", () => {
      render(
        <ErrorBoundary level="global">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const fallback = screen.getByTestId("error-boundary-fallback");
      expect(fallback).toHaveClass("min-h-screen");
      expect(
        screen.getByText("Oops! Something went wrong")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("error-boundary-home-button")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("error-boundary-reload-button")
      ).toBeInTheDocument();
    });
  });

  describe("Navigation Actions", () => {
    // Mock window.location methods
    const mockReload = vi.fn();
    const originalLocation = window.location;

    beforeEach(() => {
      delete (window as unknown as { location: unknown }).location;
      (window as unknown as { location: Location }).location = {
        ...originalLocation,
        reload: mockReload,
        href: "",
      } as Location;
    });

    afterEach(() => {
      (window as unknown as { location: Location }).location = originalLocation;
    });

    it("should reload page when reload button is clicked", () => {
      render(
        <ErrorBoundary level="global">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      fireEvent.click(screen.getByTestId("error-boundary-reload-button"));
      expect(mockReload).toHaveBeenCalledTimes(1);
    });

    it("should navigate to home when home button is clicked", () => {
      render(
        <ErrorBoundary level="page">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      fireEvent.click(screen.getByTestId("error-boundary-home-button"));
      expect(window.location.href).toBe("/");
    });
  });

  describe("Custom Fallback", () => {
    it("should render custom fallback when provided", () => {
      const customFallback = (
        <div data-testid="custom-fallback">Custom Error UI</div>
      );

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
      expect(screen.getByText("Custom Error UI")).toBeInTheDocument();
      expect(
        screen.queryByTestId("error-boundary-fallback")
      ).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes", () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const fallback = screen.getByTestId("error-boundary-fallback");
      expect(fallback).toHaveAttribute("role", "alert");
      expect(fallback).toHaveAttribute("aria-live", "assertive");
    });

    it("should have proper heading hierarchy", () => {
      render(
        <ErrorBoundary level="global">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const heading = screen.getByRole("heading");
      expect(heading).toHaveTextContent("Oops! Something went wrong");
    });
  });

  describe("Convenience Wrappers", () => {
    it("should render GlobalErrorBoundary with global level", () => {
      render(
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      );

      expect(
        screen.getByText("Oops! Something went wrong")
      ).toBeInTheDocument();
      expect(screen.getByTestId("error-boundary-fallback")).toHaveClass(
        "min-h-screen"
      );
    });

    it("should render PageErrorBoundary with page level", () => {
      render(
        <PageErrorBoundary>
          <ThrowError shouldThrow={true} />
        </PageErrorBoundary>
      );

      expect(screen.getByText("Page Error")).toBeInTheDocument();
      expect(screen.getByTestId("error-boundary-fallback")).toHaveClass(
        "min-h-[400px]"
      );
    });

    it("should render ComponentErrorBoundary with component level", () => {
      render(
        <ComponentErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ComponentErrorBoundary>
      );

      expect(screen.getByText("Component Error")).toBeInTheDocument();
      expect(screen.getByTestId("error-boundary-fallback")).toHaveClass(
        "min-h-[200px]"
      );
    });
  });

  describe("Error Reporting", () => {
    it("should log errors in development mode", () => {
      // Set NODE_ENV to development
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} message="Dev error" />
        </ErrorBoundary>
      );

      expect(console.group).toHaveBeenCalledWith(
        "🔴 Error Boundary Caught Error"
      );
      expect(console.error).toHaveBeenCalledWith("Error:", expect.any(Error));
      expect(console.groupEnd).toHaveBeenCalled();

      // Restore NODE_ENV
      process.env.NODE_ENV = originalNodeEnv;
    });

    it("should report errors in production mode", () => {
      // Set NODE_ENV to production
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} message="Prod error" />
        </ErrorBoundary>
      );

      expect(console.warn).toHaveBeenCalledWith(
        "Error reported:",
        expect.objectContaining({
          message: "Prod error",
          level: "component",
          timestamp: expect.any(String),
        })
      );

      // Restore NODE_ENV
      process.env.NODE_ENV = originalNodeEnv;
    });
  });
});
