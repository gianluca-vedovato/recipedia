import { Skeleton } from "../ui/skeleton";
import {
  RecipeDetailWrapper,
  RecipeDetailBackButton,
  RecipeDetailContent,
  RecipeDetailImageSection,
  RecipeDetailImage,
  RecipeDetailActions,
  RecipeDetailInfoSection,
  RecipeDetailHeader,
  RecipeDetailBadges,
  RecipeDetailSection,
  RecipeDetailSectionTitle,
  RecipeDetailIngredientsList,
} from "./recipe-detail.layout";

export function RecipeDetailSkeleton() {
  return (
    <RecipeDetailWrapper>
      <RecipeDetailBackButton>
        <Skeleton className="h-9 w-32" />
      </RecipeDetailBackButton>

      <RecipeDetailContent>
        <RecipeDetailImageSection>
          <RecipeDetailImage>
            <Skeleton className="w-full h-full" />
          </RecipeDetailImage>
          <RecipeDetailActions>
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </RecipeDetailActions>
        </RecipeDetailImageSection>

        <RecipeDetailInfoSection>
          <RecipeDetailHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <RecipeDetailBadges>
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </RecipeDetailBadges>
          </RecipeDetailHeader>

          <RecipeDetailSection>
            <RecipeDetailSectionTitle>
              <Skeleton className="h-6 w-24" />
            </RecipeDetailSectionTitle>
            <RecipeDetailIngredientsList>
              {Array.from({ length: 6 }).map((_, i) => (
                <li key={i} className="flex items-center">
                  <span className="w-2 h-2 bg-gray-300 rounded-full mr-3 flex-shrink-0" />
                  <Skeleton className="h-4 w-full" />
                </li>
              ))}
            </RecipeDetailIngredientsList>
          </RecipeDetailSection>

          <RecipeDetailSection>
            <RecipeDetailSectionTitle>
              <Skeleton className="h-6 w-24" />
            </RecipeDetailSectionTitle>
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </RecipeDetailSection>
        </RecipeDetailInfoSection>
      </RecipeDetailContent>
    </RecipeDetailWrapper>
  );
}
