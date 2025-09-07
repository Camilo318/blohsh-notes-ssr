"use client";

import { useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useQuery } from "@tanstack/react-query";
import { type Session } from "next-auth";
import { getNotesByUser } from "~/server/queries";
import Note from "~/components/Note";
import { Input } from "~/components/ui/input";
import { useDebounce } from "~/lib/hooks/useDebounce";
import CreateNoteWizard from "~/components/CreateNoteWizard";

gsap.registerPlugin(useGSAP);

export default function NotesContainer({ user }: { user: Session["user"] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearchQuery = useDebounce<typeof searchQuery>(
    searchQuery,
    600,
  );

  const { data: userNotes, isSuccess } = useQuery({
    queryKey: ["notes", user.id, debouncedSearchQuery],
    queryFn: () => getNotesByUser(user.id, debouncedSearchQuery),
  });

  return (
    <>
      <div className="-mx-4 bg-blohsh-secondary p-4">
        <Input
          placeholder="Search notes"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <CreateNoteWizard />
      {isSuccess && userNotes.length < 1 && (
        <div className="flex h-96 items-center justify-center">
          <h1 className="p-6 text-2xl font-semibold text-blohsh-foreground">
            {debouncedSearchQuery
              ? "No results found"
              : "Looks quite empty around here. Create a note above 😏"}
          </h1>
        </div>
      )}
      {isSuccess && userNotes.length > 0 && (
        <>
          <div className="container grid auto-rows-[max-content_1fr_max-content] grid-cols-1 gap-4 px-0 py-4 sm:grid-cols-2 sm:px-4 lg:grid-cols-3">
            {userNotes.map((note) => (
              <Note
                key={note.id}
                note={note}
                className="row-span-3 grid grid-rows-subgrid"
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
