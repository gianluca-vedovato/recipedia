import { Skeleton } from "../ui/skeleton";
import {
  RecipeCardContent,
  RecipeCardImage,
  RecipeCardWrapper,
} from "./recipe-card.layout";

export function RecipeCardSkeleton() {
  return (
    <RecipeCardWrapper>
      <RecipeCardImage>
        <Skeleton className="w-full h-48" />
      </RecipeCardImage>
      <RecipeCardContent>
        <Skeleton className="w-full h-4" />
      </RecipeCardContent>
    </RecipeCardWrapper>
  );
}
