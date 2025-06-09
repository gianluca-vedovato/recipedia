export function RecipeCardWrapper({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4 max-w-sm">{children}</div>;
}

export function RecipeCardImage({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border shadow-sm w-full overflow-hidden relative">
      {children}
    </div>
  );
}

export function RecipeCardContent({ children }: { children: React.ReactNode }) {
  return <div className="px-2">{children}</div>;
}
