"use client";

import { type Session } from "next-auth";
import NotesRouteView from "~/components/NotesRouteView";

export default function NotesContainer({ user }: { user: Session["user"] }) {
  return (
    <NotesRouteView
      user={user}
      routeKey="all"
      showCreateNote
      searchPlaceholder="Search a note"
      emptyMessage="Looks quite empty around here. Create a note above 😏"
      searchEmptyMessage="No results found"
    />
  );
}
