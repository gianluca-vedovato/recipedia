import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";

// Create a test QueryClient
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries in tests
        gcTime: 0, // Disable caching in tests
      },
    },
  });

// Helper to render App with QueryClient
const renderWithQueryClient = (ui: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
  );
};

describe("App", () => {
  it("renders without crashing", () => {
    renderWithQueryClient(<App />);
    // Note: Since the app now loads random meals, we should check for loading state or mock the API
    expect(screen.getByRole("banner")).toBeInTheDocument(); // Header should be present
  });

  it("renders the header", () => {
    renderWithQueryClient(<App />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders the theme toggle button", () => {
    renderWithQueryClient(<App />);
    expect(screen.getByText("Toggle theme")).toBeInTheDocument();
  });
});
