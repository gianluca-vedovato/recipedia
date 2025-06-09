import { Link } from "@tanstack/react-router";
import {
  RecipeCardSmallContent,
  RecipeCardSmallImage,
  RecipeCardSmallWrapper,
} from "./recipe-card-small.layout";
import { Badge } from "../ui/badge";

type RecipeCardSmallProps = {
  id: string;
  name: string;
  image: string;
  isRecentlyViewed?: boolean;
};

export function RecipeCardSmall({
  id,
  name,
  image,
  isRecentlyViewed,
}: RecipeCardSmallProps) {
  return (
    <Link
      to="/recipe/$id"
      params={{ id }}
      className="hover:opacity-80 transition-opacity"
      data-testid="recipe-card-small-link"
    >
      <RecipeCardSmallWrapper>
        <RecipeCardSmallImage>
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
              data-testid="recipe-card-small-img"
            />
          ) : (
            <div
              className="w-full h-full bg-orange-200 flex items-center justify-center"
              data-testid="recipe-card-small-img-placeholder"
            />
          )}
        </RecipeCardSmallImage>
        <RecipeCardSmallContent>
          {isRecentlyViewed && (
            <Badge
              className="text-xs mb-1 text-primary border-primary"
              variant="outline"
              data-testid="recipe-card-small-recently-viewed-badge"
            >
              Seen recently
            </Badge>
          )}
          <p
            className="text-sm font-medium line-clamp-1"
            data-testid="recipe-card-small-name"
          >
            {name}
          </p>
        </RecipeCardSmallContent>
      </RecipeCardSmallWrapper>
    </Link>
  );
}
