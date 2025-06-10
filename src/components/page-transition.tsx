import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();

  useEffect(() => {
    // Use View Transitions API if available (modern browsers)
    if ("startViewTransition" in document) {
      document.startViewTransition(() => {
        // Scroll to top when route changes
        window.scrollTo(0, 0);
      });
    } else {
      // Fallback for older browsers - just scroll
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return <div className="page-transition-container">{children}</div>;
}
