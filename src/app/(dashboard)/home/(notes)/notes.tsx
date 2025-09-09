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
import DeleteNoteDialog from "./delete-dialog";
import AddNoteImageDialog from "./add-image-dialog";
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

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [noteId, setNoteId] = useState<string | null>(null);
  const [noteImageKeys, setNoteImageKeys] = useState<string[]>([]);
  const [showAddImageDialog, setShowAddImageDialog] = useState(false);

  const openDeleteDialog = (noteId: string, noteImageKeys: string[]) => {
    setShowDeleteDialog(true);
    setNoteId(noteId);
    setNoteImageKeys(noteImageKeys);
  };
  const closeDeleteDialog = () => {
    setShowDeleteDialog(false);
    setNoteId(null);
    setNoteImageKeys([]);
  };

  const openAddImageDialog = (noteId: string) => {
    setShowAddImageDialog(true);
    setNoteId(noteId);
  };

  const closeAddImageDialog = () => {
    setShowAddImageDialog(false);
    setNoteId(null);
  };

  return (
    <>
      <DeleteNoteDialog
        show={showDeleteDialog}
        noteId={noteId ?? ""}
        noteImageKeys={noteImageKeys ?? []}
        onClose={closeDeleteDialog}
      />
      <AddNoteImageDialog
        noteId={noteId ?? ""}
        show={showAddImageDialog}
        onClose={closeAddImageDialog}
      />

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
          <div className="@lg/note-grid:grid-cols-2 container grid auto-rows-[max-content_1fr_max-content] grid-cols-1 gap-4 px-0 py-4">
            {userNotes.map((note) => (
              <Note
                key={note.id}
                note={note}
                className="row-span-3 grid grid-rows-subgrid"
                openDeleteDialog={openDeleteDialog}
                openAddImageDialog={openAddImageDialog}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
