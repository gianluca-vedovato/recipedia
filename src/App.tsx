import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { useRandomMeals } from "@/hooks/useMealDB";
import { RecipesGrid } from "@/components/recipes-grid";
import { SearchInput } from "@/components/search-input";

function App() {
  const { data: recipes, isLoading, error } = useRandomMeals();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div>
        <Header />
        <div className="container py-6 flex flex-col gap-6">
          <div className="w-full">
            <SearchInput />
          </div>
          <RecipesGrid recipes={recipes} loading={isLoading} error={error} />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
