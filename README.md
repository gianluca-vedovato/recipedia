# Recipedia - Recipe Discovery Application

An application built for discovering and managing recipes using TheMealDB API.

## 🌐 Live Demo

**[View Live Application](https://recipedia-black.vercel.app/)**

The application is deployed and ready to use at https://recipedia-black.vercel.app/

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd recipedia
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

### Available Scripts

- **`npm run dev`** - Start development server with hot reload
- **`npm run build`** - Build for production
- **`npm run preview`** - Preview production build locally
- **`npm run test`** - Run tests in watch mode
- **`npm run test:coverage`** - Run tests with coverage report
- **`npm run lint`** - Run ESLint for code quality checks

## 🛠️ Technology Stack

### Core Framework & Language

- **React 19.1.0** - Chosen for the extensive ecosystem
- **TypeScript** - Chosen for type safety and better development experience
- **Vite** - Chosen for fast development server and build

### UI & Styling

- **shadcn/ui** - Modern, accessible, and customizable component library built on Radix UI
  - Provides production-ready components with excellent accessibility
  - Easy to customize and extend
  - Built-in support for themes and variants
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
  - Comes integrated with shadcn/ui
  - Provides consistent design system
  - Excellent for responsive designs and maintainable styles
- **Lucide React** - Consistent icon library

### State Management & Data Fetching

- **TanStack Query (React Query)** - Data synchronization for server state
  - Powerful caching that reduce API calls
  - Background updates and optimistic updates
  - Perfect for recipe data that doesn't change frequently
  - Built-in loading states and error handling
- **TanStack Router** - Type-safe client-side routing
  - Combined with TanStack Query for excellent cache management
  - File-based routing with automatic code splitting
  - Type-safe navigation and parameters

### Testing Framework

- **Vitest** - Modern testing framework designed for Vite projects
  - Maintains Jest-compatible API for familiarity
  - Faster execution compared to Jest
  - Better integration with Vite's build system
  - Native TypeScript support
- **React Testing Library** - Component testing utilities
- **jsdom** - DOM environment for testing

### Code Quality & Automation

- **ESLint** - Code linting with React and TypeScript rules
- **Husky** - Git hooks for automation
- **lint-staged** - Pre-commit hooks for staged files
- **Pipeline automation**:
  - Pre-commit: Runs linting and tests on staged files
  - Pre-push: Runs full test suite before pushing

## 🏗️ Architecture & Design Decisions

### Custom Hooks for API Management

All API interactions are centralized in `src/hooks/useMealDB.ts` for:

- **Maintainability**: Single source of truth for API logic
- **Organization**: Clear separation of concerns
- **Reusability**: Hooks can be used across components
- **Caching Strategy**: Leverages TanStack Query's caching with `useQuery`

### Local Storage with Fallback

The `useLocalStorage` hook (`src/hooks/useLocalStorage.ts`) provides:

- **Favorites management**: Persistent user preferences
- **Recently viewed recipes**: Enhanced user experience
- **Fallback mechanism**: In-memory storage for browsers without localStorage support
- **Error handling**: Graceful degradation when storage operations fail

### Caching Strategy

- **useQuery for recipe data**: Recipes rarely change, making them perfect for caching
- **Smart cache invalidation**: Targeted cache updates for different data types
- **Background updates**: Stale-while-revalidate pattern for better UX

### Error Boundary Implementation

The application implements a comprehensive **3-tier error boundary system** for robust error handling:

- **Global Error Boundary**: Catches application-wide errors and provides full-page error recovery
- **Page Error Boundary**: Isolates route-level errors to prevent full app crashes
- **Component Error Boundary**: Wraps individual components (like recipe cards) for granular error isolation
- **Class-based implementation**: Uses React class components (required for error boundaries) with modern TypeScript

```typescript
// Usage examples:
<GlobalErrorBoundary>        // App-level protection
  <PageErrorBoundary>        // Route-level protection
    <ComponentErrorBoundary> // Component-level protection
      <RecipeCard {...props} />
    </ComponentErrorBoundary>
  </PageErrorBoundary>
</GlobalErrorBoundary>
```

### Component Structure

- **Modular design**: Components are organized by feature and reusability
- **shadcn/ui integration**: Consistent design system across the application
- **Accessibility first**: Using Radix UI primitives ensures WCAG compliance

## 🚀 Future Optimizations & Improvements

### Performance Optimizations

- **Image Optimization**:
  - WebP format support with fallbacks
  - Progressive image loading with blur-up effect
  - Responsive image sizing based on viewport
- **Bundle Optimization**:
  - Code splitting at route level with React.lazy()
  - Tree shaking optimization for unused dependencies
  - Preloading critical routes
- **Service Worker**: Implement for offline functionality and caching strategies

### User Experience Enhancements

- **Advanced Search**:
  - Multi-filter search (dietary restrictions, cooking time, difficulty)
  - Search suggestions and autocomplete
  - Search history and trending recipes
- **Progressive Web App**:
  - App-like installation experience
  - Push notifications for recipe updates
  - Offline recipe viewing

### Testing & Quality Assurance

- **End-to-End Testing**: Implement Playwright for critical user journeys
- **Performance Testing**: Add Lighthouse CI for automated performance regression detection
- **Accessibility Testing**: Automated a11y testing in CI pipeline
- **Load Testing**: Stress testing for high traffic scenarios

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── error-boundary/ # Error boundary system
│   ├── ui/             # shadcn/ui components
│   └── ...            # Feature-specific components
├── hooks/              # Custom React hooks
│   ├── useMealDB.ts    # API hooks and caching
│   ├── useLocalStorage.ts # Local storage with fallback
│   └── useFavorites.ts # Favorites management
├── routes/             # File-based routing
└── lib/                # Utility functions
```

## 📝 Key Features

- **Recipe Search**: Search recipes by name and keywords with instant results
- **Recipe Discovery**: Random recipe suggestions in homepage
- **Detailed Recipe View**: Full ingredient lists, step-by-step instructions, and cooking information
- **Favorites System**: Save and manage favorite recipes with persistent storage
- **Recently Viewed**: Track recently accessed recipes for better user experience
- **Related Meals**: Improves UX avoiding an interruption of user navigation flow once in recipe detail page.
- **Smart Error Handling**: Graceful error states and empty search handling
- **Theming**: Support for light and dark theme modes
- **Responsive Design**: Works seamlessly across all devices and screen sizes
- **Accessibility**: Full keyboard navigation and screen reader support
