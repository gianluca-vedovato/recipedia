import React, { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Button } from "../ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: "page" | "component" | "global";
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Log error for development
    if (process.env.NODE_ENV === "development") {
      console.group("🔴 Error Boundary Caught Error");
      console.error("Error:", error);
      console.error("Error Info:", errorInfo);
      console.error("Component Stack:", errorInfo.componentStack);
      console.groupEnd();
    }

    // In production, you would send this to an error reporting service
    if (process.env.NODE_ENV === "production") {
      this.reportError(error, errorInfo);
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // Integration with error reporting services

    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      level: this.props.level || "component",
    };

    console.warn("Error reported:", errorReport);
  };

  private handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState((prevState) => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
      }));
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  private getErrorLevel = () => {
    return this.props.level || "component";
  };

  private renderErrorFallback = () => {
    const { error, retryCount } = this.state;
    const { showDetails = false } = this.props;
    const level = this.getErrorLevel();
    const canRetry = retryCount < this.maxRetries;

    const isGlobalError = level === "global";
    const isPageError = level === "page";

    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-6 p-8 text-center",
          isGlobalError && "min-h-screen bg-background",
          isPageError && "min-h-[400px] rounded-lg border bg-card",
          !isGlobalError &&
            !isPageError &&
            "min-h-[200px] rounded-md border bg-muted/50"
        )}
        role="alert"
        aria-live="assertive"
        data-testid="error-boundary-fallback"
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              "rounded-full p-3",
              isGlobalError && "bg-destructive/10 text-destructive",
              !isGlobalError && "bg-muted text-muted-foreground"
            )}
          >
            <AlertTriangle
              className={cn(
                isGlobalError && "h-8 w-8",
                !isGlobalError && "h-6 w-6"
              )}
            />
          </div>

          <div className="space-y-2">
            <h2
              className={cn(
                "font-semibold",
                isGlobalError && "text-2xl",
                isPageError && "text-xl",
                !isGlobalError && !isPageError && "text-lg"
              )}
            >
              {isGlobalError && "Oops! Something went wrong"}
              {isPageError && "Page Error"}
              {!isGlobalError && !isPageError && "Component Error"}
            </h2>

            <p className="text-muted-foreground max-w-md">
              {isGlobalError &&
                "We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists."}
              {isPageError &&
                "This page encountered an error. You can try again or go back to the home page."}
              {!isGlobalError &&
                !isPageError &&
                "This component failed to load properly. You can try again or continue using the rest of the application."}
            </p>

            {showDetails && error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                  Error Details (for developers)
                </summary>
                <div className="mt-2 rounded-md bg-muted p-3 text-xs font-mono">
                  <div className="text-destructive font-semibold">
                    {error.name}: {error.message}
                  </div>
                  {error.stack && (
                    <pre className="mt-2 overflow-auto text-muted-foreground whitespace-pre-wrap">
                      {error.stack}
                    </pre>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {canRetry && (
            <Button
              onClick={this.handleRetry}
              variant="default"
              size={isGlobalError ? "lg" : "default"}
              data-testid="error-boundary-retry-button"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
              {retryCount > 0 && ` (${this.maxRetries - retryCount} left)`}
            </Button>
          )}

          {(isGlobalError || isPageError) && (
            <Button
              onClick={this.handleGoHome}
              variant="outline"
              size={isGlobalError ? "lg" : "default"}
              data-testid="error-boundary-home-button"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          )}

          {isGlobalError && (
            <Button
              onClick={this.handleReload}
              variant="ghost"
              size="lg"
              data-testid="error-boundary-reload-button"
            >
              <RefreshCw className="h-4 w-4" />
              Reload Page
            </Button>
          )}
        </div>

        {retryCount >= this.maxRetries && (
          <p className="text-sm text-muted-foreground">
            Maximum retry attempts reached. Please reload the page or contact
            support.
          </p>
        )}
      </div>
    );
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback || this.renderErrorFallback();
    }

    return this.props.children;
  }
}

// Convenience wrapper components for different error boundary levels
export const GlobalErrorBoundary: React.FC<Omit<Props, "level">> = ({
  children,
  ...props
}) => (
  <ErrorBoundary level="global" {...props}>
    {children}
  </ErrorBoundary>
);

export const PageErrorBoundary: React.FC<Omit<Props, "level">> = ({
  children,
  ...props
}) => (
  <ErrorBoundary level="page" {...props}>
    {children}
  </ErrorBoundary>
);

export const ComponentErrorBoundary: React.FC<Omit<Props, "level">> = ({
  children,
  ...props
}) => (
  <ErrorBoundary level="component" {...props}>
    {children}
  </ErrorBoundary>
);
