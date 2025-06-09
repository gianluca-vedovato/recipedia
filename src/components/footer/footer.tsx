import { ModeToggle } from "../mode-toggle";

export function Footer() {
  return (
    <footer className="bg-[var(--footer-background)] w-full py-8 mt-16 border-t border-border text-xs">
      <div className="container mx-auto">
        <div className="flex justify-between w-full items-center">
          <p>© {new Date().getFullYear()} Recipedia. All rights reserved</p>
          <ModeToggle />
        </div>
      </div>
    </footer>
  );
}
