import { useEffect, useMemo, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Heart, ExternalLink, SquarePlay, ArrowLeft } from "lucide-react";
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
import { useFavorites } from "@/hooks/useFavorites";
import { useStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";

type RecipeDetailProps = {
  recipe: ProcessedRecipe;
};

export function RecipeDetail({ recipe }: RecipeDetailProps) {
  const { isFavorite: checkIsFavorite, toggleFavorite } = useFavorites();
  const { getItem, setItem } = useStorage();

  const isFavorite = useMemo(
    () => checkIsFavorite(recipe.id),
    [checkIsFavorite, recipe.id]
  );

  /*
   * Add the recipe to the recently viewed list
   * If the recipe is already in the list, remove it and add it to the top
   * If the list is full, remove the last item
   */
  useEffect(() => {
    const recentlyViewed = getItem("recipedia:recentlyviewed");
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

    setItem("recipedia:recentlyviewed", JSON.stringify(newRecentlyViewed));
  }, [recipe]);

  const [imageError, setImageError] = useState(false);

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
                data-testid="recipe-detail-img"
              />
            )}
          </RecipeDetailImage>

          {/* Action buttons */}
          <RecipeDetailActions>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleFavorite(recipe.id)}
              data-testid="recipe-detail-favorite-button"
            >
              <Heart
                className={cn(
                  "mr-2 h-4 w-4",
                  isFavorite && "fill-red-500 stroke-red-500"
                )}
                data-testid="recipe-detail-heart-icon"
              />
              {isFavorite ? "Saved" : "Save Recipe"}
            </Button>
            {recipe.youtube && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={recipe.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="recipe-detail-video-link"
                >
                  <SquarePlay className="mr-2 h-4 w-4" />
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
                <RecipeDetailIngredientItem
                  key={index}
                  data-testid="recipe-detail-ingredient-item"
                >
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
                    <p
                      key={index}
                      className="mb-3"
                      data-testid="recipe-detail-instruction-item"
                    >
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
