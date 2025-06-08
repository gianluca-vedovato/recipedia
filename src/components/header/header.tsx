import { ModeToggle } from "@/components/mode-toggle";
import { Link } from "@tanstack/react-router";
import { Heart, Home } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center justify-between w-full border-b border-border p-4">
      <Link
        to="/"
        className="text-2xl font-bold hover:opacity-80 transition-opacity"
      >
        🍜 Recipedia
      </Link>

      <nav className="flex items-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">Home</span>
        </Link>
        <Link
          to="/favorites"
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Heart className="h-4 w-4" />
          <span className="hidden sm:inline">Favorites</span>
        </Link>
        <ModeToggle />
      </nav>
    </header>
  );
}
