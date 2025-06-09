import { ModeToggle } from "../mode-toggle";

export function Footer() {
  return (
    <footer className="bg-[var(--footer-background)] w-full py-6 lg:py-10 mt-16 border-t border-border text-xs">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 justify-between w-full items-center">
          <p>© {new Date().getFullYear()} Recipedia. All rights reserved</p>
          <ModeToggle />
        </div>
      </div>
    </footer>
  );
}
