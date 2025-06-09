export function RecipeCardSmallWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-testid="recipe-card-small-wrapper"
      className="flex gap-2 items-start"
    >
      {children}
    </div>
  );
}

export function RecipeCardSmallImage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-testid="recipe-card-small-image"
      className="w-16 h-16 lg:w-12 lg:h-12 rounded-md overflow-hidden"
    >
      {children}
    </div>
  );
}

export function RecipeCardSmallContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-testid="recipe-card-small-content"
      className="flex flex-col gap-1 flex-1"
    >
      {children}
    </div>
  );
}
