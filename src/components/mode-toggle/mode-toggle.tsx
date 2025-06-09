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
        onClick={() => setTheme("light")}
        className={cn(
          "rounded-full cursor-pointer",
          theme === "light"
            ? "text-foreground"
            : "dark:text-neutral-600 text-neutral-400"
        )}
      >
        <Sun />
      </Button>
      <Button
        variant="ghost"
        onClick={() => setTheme("dark")}
        className={cn(
          "rounded-full cursor-pointer",
          theme === "dark"
            ? "text-foreground"
            : "dark:text-neutral-600 text-neutral-400"
        )}
      >
        <Moon />
      </Button>
      <Button
        variant="ghost"
        onClick={() => setTheme("system")}
        className={cn(
          "rounded-full cursor-pointer",
          theme === "system"
            ? "text-foreground"
            : "dark:text-neutral-600 text-neutral-400"
        )}
      >
        <Monitor />
      </Button>
    </div>
  );
}
