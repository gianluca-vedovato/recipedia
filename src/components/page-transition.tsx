import { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Trigger transition effect
    setIsTransitioning(true);

    // Scroll to top when route changes
    window.scrollTo(0, 0);

    // Reset transition state after animation completes
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="page-transition-container">
      <div
        key={location.pathname}
        className={`page-content ${isTransitioning ? "animate-fade-in" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}
