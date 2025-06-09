import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModeToggle } from "./mode-toggle";
import { ThemeProvider } from "../theme-provider";

// Mock the useTheme hook
const mockSetTheme = vi.fn();

vi.mock("../theme-provider", async () => {
  const actual = await vi.importActual("../theme-provider");
  return {
    ...actual,
    useTheme: vi.fn(() => ({
      theme: "system",
      setTheme: mockSetTheme,
    })),
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

  it("renders all three theme toggle buttons", () => {
    renderModeToggle();

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
  });

  it("displays sun, moon, and monitor icons", () => {
    renderModeToggle();

    const sunIcon = document.querySelector(".lucide-sun");
    const moonIcon = document.querySelector(".lucide-moon");
    const monitorIcon = document.querySelector(".lucide-monitor");

    expect(sunIcon).toBeInTheDocument();
    expect(moonIcon).toBeInTheDocument();
    expect(monitorIcon).toBeInTheDocument();
  });

  it("calls setTheme with 'light' when sun button is clicked", async () => {
    const user = userEvent.setup();
    renderModeToggle();

    const buttons = screen.getAllByRole("button");
    const sunButton = buttons[0]; // First button is sun/light
    await user.click(sunButton);

    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });

  it("calls setTheme with 'dark' when moon button is clicked", async () => {
    const user = userEvent.setup();
    renderModeToggle();

    const buttons = screen.getAllByRole("button");
    const moonButton = buttons[1]; // Second button is moon/dark
    await user.click(moonButton);

    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("calls setTheme with 'system' when monitor button is clicked", async () => {
    const user = userEvent.setup();
    renderModeToggle();

    const buttons = screen.getAllByRole("button");
    const monitorButton = buttons[2]; // Third button is monitor/system
    await user.click(monitorButton);

    expect(mockSetTheme).toHaveBeenCalledWith("system");
  });
});
