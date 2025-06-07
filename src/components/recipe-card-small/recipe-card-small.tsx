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

export function RecipeCardSmall({ name, image }: RecipeCardSmallProps) {
  return (
    <RecipeCardSmallWrapper>
      <RecipeCardSmallImage>
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </RecipeCardSmallImage>
      <RecipeCardSmallContent>
        <p className="text-sm font-medium">{name}</p>
      </RecipeCardSmallContent>
    </RecipeCardSmallWrapper>
  );
}
