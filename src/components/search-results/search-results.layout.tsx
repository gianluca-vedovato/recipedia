export function SearchResultsWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="container py-6 flex flex-col gap-6">{children}</div>;
}

export function SearchResultsInputSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full">{children}</div>;
}

export function SearchResultsHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}

export function SearchResultsTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return <h1 className="text-2xl font-bold">{children}</h1>;
}

export function SearchResultsQuery({
  children,
}: {
  children: React.ReactNode;
}) {
  return <span className="text-primary">{children}</span>;
}

export function SearchResultsContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}

export function SearchResultsEmptyState({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="text-center py-12">{children}</div>;
}

export function SearchResultsEmptyTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h2 className="text-xl font-semibold mb-2 text-muted-foreground">
      {children}
    </h2>
  );
}

export function SearchResultsEmptyMessage({
  children,
}: {
  children: React.ReactNode;
}) {
  return <p className="text-muted-foreground">{children}</p>;
}

export function SearchResultsErrorState({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="text-center py-12">{children}</div>;
}

export function SearchResultsErrorTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h2 className="text-xl font-semibold mb-2 text-destructive">{children}</h2>
  );
}

export function SearchResultsErrorMessage({
  children,
}: {
  children: React.ReactNode;
}) {
  return <p className="text-muted-foreground mb-4">{children}</p>;
}
