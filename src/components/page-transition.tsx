import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="page-transition-container">
      <div
        key={location.pathname}
        className="page-content animate-fade-in duration-150"
      >
        {children}
      </div>
    </div>
  );
}
