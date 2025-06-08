import { createFileRoute } from "@tanstack/react-router";
import { FavoritesPage } from "@/components/favorites-page";

export const Route = createFileRoute("/favorites")({
  component: FavoritesPage,
});
