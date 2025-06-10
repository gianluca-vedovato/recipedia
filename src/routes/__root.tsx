import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { PageErrorBoundary } from "@/components/error-boundary";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div>
          <Header />
          <PageErrorBoundary>
            <Outlet />
          </PageErrorBoundary>
          <Footer />
        </div>
      </ThemeProvider>
    </>
  ),
});
