import { Monitor, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center border border-border rounded-full p-1.5">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("light")}
        data-testid="mode-toggle-light-button"
        className={cn(
          "rounded-full cursor-pointer",
          theme === "light"
            ? "text-foreground"
            : "dark:text-neutral-600 text-neutral-400"
        )}
      >
        <Sun className="h-5 w-5" data-testid="mode-toggle-sun-icon" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("dark")}
        data-testid="mode-toggle-dark-button"
        className={cn(
          "rounded-full cursor-pointer",
          theme === "dark"
            ? "text-foreground"
            : "dark:text-neutral-600 text-neutral-400"
        )}
      >
        <Moon className="h-5 w-5" data-testid="mode-toggle-moon-icon" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("system")}
        data-testid="mode-toggle-system-button"
        className={cn(
          "rounded-full cursor-pointer",
          theme === "system"
            ? "text-foreground"
            : "dark:text-neutral-600 text-neutral-400"
        )}
      >
        <Monitor className="h-5 w-5" data-testid="mode-toggle-monitor-icon" />
      </Button>
    </div>
  );
}
