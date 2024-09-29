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

export default function NotesContainer({ user }: { user: Session["user"] }) {
  useGSAP(() => {
    const notes = gsap.utils.toArray<Element>(".note");

    gsap.from(notes, {
      autoAlpha: 0,
      y: 50,
      ease: "back.out",
      stagger: 0.1,
    });
  });

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
      <Input
        className="col-span-full"
        placeholder="Search notes"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {isSuccess && userNotes.length < 1 && (
        <div className="flex h-96 items-center justify-center">
          <h1 className="p-6 text-2xl font-bold text-blohsh-foreground">
            {debouncedSearchQuery
              ? "No results found"
              : "Looks quite empty around here. Create a note above 😏"}
          </h1>
        </div>
      )}

      {isSuccess && userNotes.length > 0 && (
        <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 lg:grid-cols-3">
          {userNotes.map((note) => (
            <Note key={note.id} note={note} />
          ))}
        </div>
      )}
    </>
  );
}
