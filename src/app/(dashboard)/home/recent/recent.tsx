"use client";

import { type Session } from "next-auth";
import NotesRouteView from "~/components/NotesRouteView";

export default function RecentNotes({ user }: { user: Session["user"] }) {
  return (
    <NotesRouteView
      user={user}
      routeKey="recent"
      queryOptions={{
        sortBy: "updatedAt",
        sortDirection: "desc",
      }}
      searchPlaceholder="Search recently edited notes"
      emptyMessage="No notes yet. Start writing and your recent activity will show here."
      searchEmptyMessage="No recent notes match your search"
    />
  );
}
