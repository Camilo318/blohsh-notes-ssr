"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Session } from "next-auth";
import { getNotesByUser, type GetNotesByUserOptions } from "~/server/queries";
import { useDebounce } from "~/hooks/useDebounce";
import CreateNoteWizard from "~/components/CreateNoteWizard";
import NotesGrid from "~/components/NotesGrid";
import NotesRouteTopBar from "~/components/NotesRouteTopBar";
import NotesFilterPopover, {
  type NotesFilterState,
} from "~/components/NotesFilterPopover";

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
  const baselineFilters: NotesFilterState = {
    sortBy: queryOptions?.sortBy ?? "createdAt",
    sortDirection: queryOptions?.sortDirection ?? "desc",
    favoritesOnly: queryOptions?.favoritesOnly ?? false,
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<NotesFilterState>(baselineFilters);
  const debouncedSearchQuery = useDebounce(searchQuery, 450);

  const effectiveFavoritesOnly =
    queryOptions?.favoritesOnly === true ? true : filters.favoritesOnly;

  const { data: userNotes = [], isLoading } = useQuery({
    queryKey: [
      "notes",
      routeKey,
      user.id,
      debouncedSearchQuery,
      filters.sortBy,
      filters.sortDirection,
      effectiveFavoritesOnly,
    ],
    queryFn: () =>
      getNotesByUser(user.id, {
        searchQuery: debouncedSearchQuery,
        sortBy: filters.sortBy,
        sortDirection: filters.sortDirection,
        favoritesOnly: effectiveFavoritesOnly,
      }),
  });

  return (
    <>
      <NotesRouteTopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder={searchPlaceholder}
        rightActions={
          <NotesFilterPopover
            value={{ ...filters, favoritesOnly: effectiveFavoritesOnly }}
            onChange={setFilters}
            baseline={baselineFilters}
            showFavoritesToggle={queryOptions?.favoritesOnly !== true}
          />
        }
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
