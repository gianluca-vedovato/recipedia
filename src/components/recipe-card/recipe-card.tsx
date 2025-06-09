import { useMemo, useState } from "react";
import { Heart } from "lucide-react";
import { Badge } from "../ui/badge";
import { Link } from "@tanstack/react-router";
import {
  RecipeCardContent,
  RecipeCardImage,
  RecipeCardWrapper,
} from "./recipe-card.layout";
import { useFavorites } from "@/hooks/useFavorites";

type RecipeCardProps = {
  id: string;
  name: string;
  category: string;
  image: string;
  ingredients: string[];
};

export function RecipeCard({
  id,
  name,
  category,
  image,
  ingredients,
}: RecipeCardProps) {
  const { isFavorite: checkIsFavorite, toggleFavorite } = useFavorites();

  const isFavorite = useMemo(() => checkIsFavorite(id), [checkIsFavorite, id]);

  const [imageError, setImageError] = useState(false);

  const onToggleFavorite = () => {
    toggleFavorite(id);
  };

  return (
    <Link
      to="/recipe/$id"
      params={{ id }}
      className="hover:opacity-80 transition-all duration-300"
    >
      <RecipeCardWrapper>
        <RecipeCardImage>
          {imageError ? (
            <div
              className="w-full h-full bg-orange-200 flex items-center justify-center text-gray-400"
              data-testid="recipe-card-error-placeholder"
            >
              <span>Image not available</span>
            </div>
          ) : (
            <img
              src={image}
              alt={name}
              className="w-full h-48 object-cover"
              onError={() => setImageError(true)}
              data-testid="recipe-card-img"
            />
          )}
          <button
            className="absolute top-2 right-2"
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite();
            }}
            data-testid="recipe-card-favorite-button"
          >
            <Heart
              className="lucide lucide-heart transition-[colors, transform] transform cursor-pointer duration-200 hover:scale-110 text-white"
              fill={isFavorite ? "red" : "rgba(0,0,0,0.5)"}
              data-testid="recipe-card-heart-icon"
            />
          </button>
        </RecipeCardImage>
        <RecipeCardContent>
          <div className="flex justify-between items-start">
            <h3
              className="text-lg font-bold flex-1"
              data-testid="recipe-card-name"
            >
              {name}
            </h3>
            <Badge data-testid="recipe-card-badge">{category}</Badge>
          </div>
          <p
            className="text-sm text-muted-foreground"
            data-testid="recipe-card-ingredients"
          >
            {ingredients.join(", ")}
          </p>
        </RecipeCardContent>
      </RecipeCardWrapper>
    </Link>
  );
}
