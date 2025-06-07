import { Skeleton } from "../ui/skeleton";
import {
  RecipeCardSmallContent,
  RecipeCardSmallImage,
  RecipeCardSmallWrapper,
} from "./recipe-card-small.layout";

export function RecipeCardSmallSkeleton() {
  return (
    <RecipeCardSmallWrapper>
      <RecipeCardSmallImage>
        <Skeleton className="w-full h-full" />
      </RecipeCardSmallImage>
      <RecipeCardSmallContent>
        <Skeleton className="w-20 h-4" />
      </RecipeCardSmallContent>
    </RecipeCardSmallWrapper>
  );
}
