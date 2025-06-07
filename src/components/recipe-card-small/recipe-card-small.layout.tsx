export function RecipeCardSmallWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex gap-2 items-start">{children}</div>;
}

export function RecipeCardSmallImage({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-12 h-12 rounded-md overflow-hidden">{children}</div>;
}

export function RecipeCardSmallContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-col gap-1">{children}</div>;
}
