import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { SearchResults } from "./search-results";
import { cn } from "@/lib/utils";
import { useNavigate, useRouter } from "@tanstack/react-router";

export function SearchInput({ defaultValue }: { defaultValue?: string }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(defaultValue || "");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  // Preload the search route
  useEffect(() => {
    router.preloadRoute({
      to: "/search",
      search: {
        q: debouncedSearchTerm,
      },
    });
  }, [router, debouncedSearchTerm]);

  // Debounce the search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/search",
      search: {
        q: searchTerm,
      },
    });
  };

  return (
    <>
      <div className="flex items-center justify-center gap-2 z-50">
        <div className="relative w-full max-w-lg" ref={containerRef}>
          <form className="relative h-12 z-50" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Find recipe"
              className="border border-input-200 bg-background h-12 rounded-full py-2 px-5 pr-14 z-50 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setOpen(true)}
              onClick={() => setOpen(true)}
            />
            <Button
              type="submit"
              variant="default"
              className="absolute right-1 top-1 rounded-full h-10 w-10 z-50"
              onClick={handleSubmit}
            >
              <SearchIcon />
            </Button>
          </form>
          <SearchResults searchTerm={debouncedSearchTerm} isOpen={open} />
        </div>
      </div>
      <div
        className={cn(
          "bg-black/20 fixed inset-0 z-40 opacity-0 transition-opacity duration-300 pointer-events-none",
          open && "opacity-100 pointer-events-auto"
        )}
        onClick={() => setOpen(false)}
      />
    </>
  );
}
