import { Link } from "@tanstack/react-router";
import {
  RecipeCardSmallContent,
  RecipeCardSmallImage,
  RecipeCardSmallWrapper,
} from "./recipe-card-small.layout";

type RecipeCardSmallProps = {
  id: string;
  name: string;
  image: string;
};

export function RecipeCardSmall({ id, name, image }: RecipeCardSmallProps) {
  return (
    <Link
      to="/recipe/$id"
      params={{ id }}
      className="hover:opacity-80 transition-opacity"
    >
      <RecipeCardSmallWrapper>
        <RecipeCardSmallImage>
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </RecipeCardSmallImage>
        <RecipeCardSmallContent>
          <p className="text-sm font-medium">{name}</p>
        </RecipeCardSmallContent>
      </RecipeCardSmallWrapper>
    </Link>
  );
}
