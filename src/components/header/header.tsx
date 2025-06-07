import { ModeToggle } from "@/components/mode-toggle";

export function Header() {
  return (
    <header className="flex items-center justify-between w-full border-b border-border p-4">
      <a href="/" className="text-2xl font-bold">
        🍜 Recipedia
      </a>

      <ModeToggle />
    </header>
  );
}
