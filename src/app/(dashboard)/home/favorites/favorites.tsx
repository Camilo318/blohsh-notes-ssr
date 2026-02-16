"use client";

import { type Session } from "next-auth";
import NotesRouteView from "~/components/NotesRouteView";

export default function FavoritesNotes({ user }: { user: Session["user"] }) {
  return (
    <NotesRouteView
      user={user}
      routeKey="favorites"
      queryOptions={{
        favoritesOnly: true,
        sortBy: "updatedAt",
        sortDirection: "desc",
      }}
      searchPlaceholder="Search favorites"
      emptyMessage="No favorites yet. Pin your best notes from the card menu."
      searchEmptyMessage="No favorites match your search"
    />
  );
}
