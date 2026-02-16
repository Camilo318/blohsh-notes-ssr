"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Session } from "next-auth";
import { getNotesByUser, type GetNotesByUserOptions } from "~/server/queries";
import { useDebounce } from "~/hooks/useDebounce";
import CreateNoteWizard from "~/components/CreateNoteWizard";
import NotesGrid from "~/components/NotesGrid";
import NotesRouteTopBar from "~/components/NotesRouteTopBar";

type NotesRouteViewProps = {
  user: Session["user"];
  routeKey: string;
  queryOptions?: Omit<GetNotesByUserOptions, "searchQuery">;
  showCreateNote?: boolean;
  searchPlaceholder?: string;
  emptyMessage: string;
  searchEmptyMessage: string;
};

export default function NotesRouteView({
  user,
  routeKey,
  queryOptions,
  showCreateNote = false,
  searchPlaceholder,
  emptyMessage,
  searchEmptyMessage,
}: NotesRouteViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 450);

  const { data: userNotes = [], isLoading } = useQuery({
    queryKey: ["notes", routeKey, user.id, debouncedSearchQuery],
    queryFn: () =>
      getNotesByUser(user.id, {
        searchQuery: debouncedSearchQuery,
        ...queryOptions,
      }),
  });

  return (
    <>
      <NotesRouteTopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder={searchPlaceholder}
      />

      {showCreateNote ? (
        <div className="py-4">
          <CreateNoteWizard />
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 py-6 @lg/note-grid:grid-cols-2 @4xl/note-grid:grid-cols-3">
          <div className="h-52 rounded-2xl border bg-secondary/40" />
          <div className="h-52 rounded-2xl border bg-secondary/40" />
          <div className="h-52 rounded-2xl border bg-secondary/40" />
        </div>
      ) : (
        <NotesGrid
          notes={userNotes}
          hasSearchQuery={Boolean(debouncedSearchQuery)}
          emptyMessage={emptyMessage}
          searchEmptyMessage={searchEmptyMessage}
        />
      )}
    </>
  );
}
