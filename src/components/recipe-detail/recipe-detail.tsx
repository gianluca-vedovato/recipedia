import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Heart, ExternalLink, Youtube, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { ProcessedRecipe } from "@/hooks/useMealDB";
import {
  RecipeDetailWrapper,
  RecipeDetailBackButton,
  RecipeDetailContent,
  RecipeDetailImageSection,
  RecipeDetailImage,
  RecipeDetailActions,
  RecipeDetailInfoSection,
  RecipeDetailHeader,
  RecipeDetailTitle,
  RecipeDetailBadges,
  RecipeDetailSection,
  RecipeDetailSectionTitle,
  RecipeDetailIngredientsList,
  RecipeDetailIngredientItem,
  RecipeDetailInstructions,
} from "./recipe-detail.layout";

type RecipeDetailProps = {
  recipe: ProcessedRecipe;
};

export function RecipeDetail({ recipe }: RecipeDetailProps) {
  useEffect(() => {
    try {
      const recentlyViewed = localStorage.getItem("recentlyViewed");
      const newRecentlyViewed = JSON.parse(recentlyViewed || "[]");

      if (
        !newRecentlyViewed.find(
          (item: { name: string; id: string; image: string }) =>
            item.id === recipe.id
        )
      ) {
        newRecentlyViewed.unshift({
          name: recipe.name,
          id: recipe.id,
          image: recipe.image,
        });
      }

      if (newRecentlyViewed.length > 4) {
        newRecentlyViewed.pop();
      }

      localStorage.setItem("recentlyViewed", JSON.stringify(newRecentlyViewed));
    } catch {
      // Silently fail if localStorage is not available
    }
  }, [recipe]);

  const [isFavorite, setIsFavorite] = useState(() => {
    try {
      const saved = localStorage.getItem(`favorite-${recipe.id}`);
      return saved === "true";
    } catch {
      return false;
    }
  });

  const [imageError, setImageError] = useState(false);

  const toggleFavorite = () => {
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);

    try {
      localStorage.setItem(
        `favorite-${recipe.id}`,
        newFavoriteState.toString()
      );
    } catch {
      // Silently fail if localStorage is not available
    }
  };

  return (
    <RecipeDetailWrapper>
      {/* Back button */}
      <RecipeDetailBackButton>
        <Link to="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Recipes
          </Button>
        </Link>
      </RecipeDetailBackButton>

      <RecipeDetailContent>
        {/* Recipe Image */}
        <RecipeDetailImageSection>
          <RecipeDetailImage>
            {imageError ? (
              <div className="w-full h-full bg-orange-200 flex items-center justify-center text-gray-400">
                <span>Image not available</span>
              </div>
            ) : (
              <img
                src={recipe.image}
                alt={recipe.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            )}
          </RecipeDetailImage>

          {/* Action buttons */}
          <RecipeDetailActions>
            <Button variant="outline" size="sm" onClick={toggleFavorite}>
              <Heart
                className={`mr-2 h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
              />
              {isFavorite ? "Saved" : "Save Recipe"}
            </Button>
            {recipe.youtube && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={recipe.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Youtube className="mr-2 h-4 w-4" />
                  Watch Video
                </a>
              </Button>
            )}
            {recipe.source && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={recipe.source}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Source
                </a>
              </Button>
            )}
          </RecipeDetailActions>
        </RecipeDetailImageSection>

        {/* Recipe Details */}
        <RecipeDetailInfoSection>
          {/* Header */}
          <RecipeDetailHeader>
            <RecipeDetailTitle>{recipe.name}</RecipeDetailTitle>
            <RecipeDetailBadges>
              <Badge variant="secondary">{recipe.category}</Badge>
              <Badge variant="outline">{recipe.area}</Badge>
              {recipe.tags?.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </RecipeDetailBadges>
          </RecipeDetailHeader>

          {/* Ingredients */}
          <RecipeDetailSection>
            <RecipeDetailSectionTitle>Ingredients</RecipeDetailSectionTitle>
            <RecipeDetailIngredientsList>
              {recipe.ingredients.map((ingredient, index) => (
                <RecipeDetailIngredientItem key={index}>
                  {ingredient}
                </RecipeDetailIngredientItem>
              ))}
            </RecipeDetailIngredientsList>
          </RecipeDetailSection>

          {/* Instructions */}
          <RecipeDetailSection>
            <RecipeDetailSectionTitle>Instructions</RecipeDetailSectionTitle>
            <RecipeDetailInstructions>
              {recipe.instructions.split(/\r?\n/).map(
                (paragraph, index) =>
                  paragraph.trim() && (
                    <p key={index} className="mb-3">
                      {paragraph}
                    </p>
                  )
              )}
            </RecipeDetailInstructions>
          </RecipeDetailSection>
        </RecipeDetailInfoSection>
      </RecipeDetailContent>
    </RecipeDetailWrapper>
  );
}
