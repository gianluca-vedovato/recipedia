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

  return (
    <Link
      to="/recipe/$id"
      params={{ id }}
      className="hover:-translate-y-0.5 hover:opacity-80 transition-all duration-300"
    >
      <RecipeCardWrapper>
        <RecipeCardImage>
          {imageError ? (
            <div className="w-full h-48 bg-orange-200 flex items-center justify-center text-gray-400"></div>
          ) : (
            <img
              src={image}
              alt={name}
              className="w-full h-48 object-cover"
              onError={() => setImageError(true)}
            />
          )}
          <button
            className="absolute top-2 right-2"
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(id);
            }}
          >
            <Heart
              fill={isFavorite ? "red" : "transparent"}
              className="transition-[colors, transform] transform cursor-pointer duration-200 hover:scale-110 text-white"
            />
          </button>
        </RecipeCardImage>
        <RecipeCardContent>
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold flex-1">{name}</h3>
            <Badge variant="default">{category}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {ingredients.join(", ")}
          </p>
        </RecipeCardContent>
      </RecipeCardWrapper>
    </Link>
  );
}
