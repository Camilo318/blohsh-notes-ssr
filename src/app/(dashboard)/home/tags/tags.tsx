"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Session } from "next-auth";
import { Hash, Layers3 } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";
import { useDebounce } from "~/hooks/useDebounce";
import { getNotesGroupedByTag } from "~/server/queries";
import NotesGrid from "~/components/NotesGrid";
import NotesRouteTopBar from "~/components/NotesRouteTopBar";

export default function TagsNotes({ user }: { user: Session["user"] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 450);

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ["notes-grouped-by-tag", user.id, debouncedSearchQuery],
    queryFn: () => getNotesGroupedByTag(user.id, debouncedSearchQuery),
  });

  const totalGroupedCards = useMemo(
    () => groups.reduce((total, group) => total + group.notes.length, 0),
    [groups],
  );

  const uniqueNoteCount = useMemo(() => {
    const noteIds = new Set<string>();

    const totalNotes = groups
      .flatMap((group) => group.notes)
      .map((note) => note.id);

    totalNotes.forEach((noteId) => {
      noteIds.add(noteId);
    });

    return noteIds.size;
  }, [groups]);

  return (
    <>
      <NotesRouteTopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search notes by title or content"
      />

      <div className="relative mt-4 overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-background via-background to-secondary/35 p-4 shadow-sm">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Layers3 className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">Tag Collections</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              {groups.length} groups
            </Badge>
            <Badge variant="outline" className="rounded-full px-3 py-1">
              {uniqueNoteCount} unique notes
            </Badge>
            <Badge variant="outline" className="rounded-full px-3 py-1">
              {totalGroupedCards} grouped cards
            </Badge>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-4 space-y-4">
          <div className="h-44 rounded-2xl border bg-secondary/40" />
          <div className="h-44 rounded-2xl border bg-secondary/40" />
        </div>
      ) : groups.length === 0 ? (
        <div className="flex h-96 items-center justify-center">
          <h1 className="p-6 text-2xl font-semibold text-blohsh-foreground">
            {debouncedSearchQuery
              ? "No tagged notes match your search"
              : "No notes yet. Add tags to start building collections."}
          </h1>
        </div>
      ) : (
        <div className="mt-4 space-y-4 pb-4">
          {groups.map((group) => (
            <section
              key={group.tagName}
              className={cn(
                "liquid-glass overflow-hidden rounded-2xl border border-border/60",
                group.isUntagged &&
                  "border-amber-400/30 bg-gradient-to-br from-amber-50/70 to-background dark:from-amber-900/20",
              )}
            >
              <header className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-block h-2.5 w-2.5 rounded-full bg-primary/70",
                      group.isUntagged && "bg-amber-500/80",
                    )}
                  />
                  <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight text-foreground">
                    <Hash className="h-4 w-4 opacity-70" />
                    {group.tagName}
                  </h2>
                </div>
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  {group.notes.length}
                </Badge>
              </header>

              {group.notes.length === 0 ? (
                <div className="px-4 py-8 text-sm text-muted-foreground">
                  {group.isUntagged
                    ? "No untagged notes right now."
                    : "No notes in this group yet."}
                </div>
              ) : (
                <NotesGrid
                  notes={group.notes}
                  hasSearchQuery={Boolean(debouncedSearchQuery)}
                  emptyMessage=""
                  searchEmptyMessage=""
                  hideEmptyState
                  useContainerClass={false}
                  className="p-3 pt-4"
                />
              )}
            </section>
          ))}
        </div>
      )}
    </>
  );
}
