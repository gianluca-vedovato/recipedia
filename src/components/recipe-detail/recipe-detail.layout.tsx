export function RecipeDetailWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="container py-8">{children}</div>;
}

export function RecipeDetailBackButton({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="mb-6">{children}</div>;
}

export function RecipeDetailContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">{children}</div>
  );
}

export function RecipeDetailImageSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="space-y-4">{children}</div>;
}

export function RecipeDetailImage({ children }: { children: React.ReactNode }) {
  return (
    <div className="aspect-square overflow-hidden rounded-lg">{children}</div>
  );
}

export function RecipeDetailActions({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-col lg:flex-row gap-2">{children}</div>;
}

export function RecipeDetailInfoSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="space-y-6">{children}</div>;
}

export function RecipeDetailHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}

export function RecipeDetailTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="text-3xl font-bold mb-2">{children}</h1>;
}

export function RecipeDetailBadges({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex gap-2 mb-4">{children}</div>;
}

export function RecipeDetailSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}

export function RecipeDetailSectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return <h2 className="text-xl font-semibold mb-3">{children}</h2>;
}

export function RecipeDetailIngredientsList({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ul className="space-y-2" data-testid="recipe-detail-ingredients-list">
      {children}
    </ul>
  );
}

export function RecipeDetailIngredientItem({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center">
      <span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0" />
      {children}
    </li>
  );
}

export function RecipeDetailInstructions({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      {children}
    </div>
  );
}
