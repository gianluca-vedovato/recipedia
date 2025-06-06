import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModeToggle } from "./mode-toggle";
import { ThemeProvider } from "../theme-provider";

// Mock the useTheme hook
const mockSetTheme = vi.fn();
vi.mock("../theme-provider", async () => {
  const actual = await vi.importActual("../theme-provider");
  return {
    ...actual,
    useTheme: () => ({
      theme: "system",
      setTheme: mockSetTheme,
    }),
  };
});

// Helper function to render ModeToggle with ThemeProvider
const renderModeToggle = () => {
  return render(
    <ThemeProvider>
      <ModeToggle />
    </ThemeProvider>
  );
};

describe("ModeToggle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the theme toggle button", () => {
    renderModeToggle();

    const toggleButton = screen.getByRole("button", { name: /toggle theme/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it("has correct accessibility attributes", () => {
    renderModeToggle();

    const toggleButton = screen.getByRole("button", { name: /toggle theme/i });
    expect(toggleButton).toHaveAttribute("aria-haspopup", "menu");
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
  });

  it("displays sun and moon icons", () => {
    renderModeToggle();

    const sunIcon = document.querySelector(".lucide-sun");
    const moonIcon = document.querySelector(".lucide-moon");

    expect(sunIcon).toBeInTheDocument();
    expect(moonIcon).toBeInTheDocument();
  });

  it("opens dropdown menu when clicked", async () => {
    const user = userEvent.setup();
    renderModeToggle();

    const toggleButton = screen.getByRole("button", { name: /toggle theme/i });
    await user.click(toggleButton);

    // Check if dropdown menu items are visible
    expect(screen.getByText("Light")).toBeInTheDocument();
    expect(screen.getByText("Dark")).toBeInTheDocument();
    expect(screen.getByText("System")).toBeInTheDocument();
  });

  it("calls setTheme with 'light' when Light option is clicked", async () => {
    const user = userEvent.setup();
    renderModeToggle();

    const toggleButton = screen.getByRole("button", { name: /toggle theme/i });
    await user.click(toggleButton);

    const lightOption = screen.getByText("Light");
    await user.click(lightOption);

    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });

  it("calls setTheme with 'dark' when Dark option is clicked", async () => {
    const user = userEvent.setup();
    renderModeToggle();

    const toggleButton = screen.getByRole("button", { name: /toggle theme/i });
    await user.click(toggleButton);

    const darkOption = screen.getByText("Dark");
    await user.click(darkOption);

    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("calls setTheme with 'system' when System option is clicked", async () => {
    const user = userEvent.setup();
    renderModeToggle();

    const toggleButton = screen.getByRole("button", { name: /toggle theme/i });
    await user.click(toggleButton);

    const systemOption = screen.getByText("System");
    await user.click(systemOption);

    expect(mockSetTheme).toHaveBeenCalledWith("system");
  });

  it("closes dropdown menu after selecting an option", async () => {
    const user = userEvent.setup();
    renderModeToggle();

    const toggleButton = screen.getByRole("button", { name: /toggle theme/i });
    await user.click(toggleButton);

    // Menu should be open
    expect(screen.getByText("Light")).toBeInTheDocument();

    const lightOption = screen.getByText("Light");
    await user.click(lightOption);

    // Wait for menu to close
    await waitFor(() => {
      expect(screen.queryByText("Light")).not.toBeInTheDocument();
    });
  });

  it("supports keyboard navigation", async () => {
    const user = userEvent.setup();
    renderModeToggle();

    const toggleButton = screen.getByRole("button", { name: /toggle theme/i });

    // Focus the button and press Enter to open
    toggleButton.focus();
    await user.keyboard("{Enter}");

    expect(screen.getByText("Light")).toBeInTheDocument();

    // Navigate with arrow keys and select with Enter
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    expect(mockSetTheme).toHaveBeenCalled();
  });

  // Note: Testing "click outside to close" behavior is complex with Radix UI
  // as it involves internal focus management and DOM manipulation.
  // The Escape key test above covers the main dismissal functionality.

  it("closes dropdown when pressing Escape", async () => {
    const user = userEvent.setup();
    renderModeToggle();

    const toggleButton = screen.getByRole("button", { name: /toggle theme/i });
    await user.click(toggleButton);

    // Menu should be open
    expect(screen.getByText("Light")).toBeInTheDocument();

    // Press Escape
    await user.keyboard("{Escape}");

    // Wait for menu to close
    await waitFor(() => {
      expect(screen.queryByText("Light")).not.toBeInTheDocument();
    });
  });
});
