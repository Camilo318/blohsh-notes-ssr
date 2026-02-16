"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { type SelectNote } from "~/server/db/schema";
import Note from "~/components/Note";
import DeleteNoteDialog from "~/app/(dashboard)/home/(notes)/delete-dialog";
import AddNoteImageDialog from "~/app/(dashboard)/home/(notes)/add-image-dialog";
import { cn } from "~/lib/utils";

gsap.registerPlugin(useGSAP);

type NotesGridProps = {
  notes: SelectNote[];
  emptyMessage: string;
  searchEmptyMessage: string;
  hasSearchQuery: boolean;
  className?: string;
  hideEmptyState?: boolean;
  useContainerClass?: boolean;
};

export default function NotesGrid({
  notes,
  emptyMessage,
  searchEmptyMessage,
  hasSearchQuery,
  className,
  hideEmptyState = false,
  useContainerClass = true,
}: NotesGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [noteId, setNoteId] = useState<string | null>(null);
  const [noteImageKeys, setNoteImageKeys] = useState<string[]>([]);
  const [activeDialog, setActiveDialog] = useState<"delete" | "addImage" | null>(
    null,
  );

  useGSAP(
    () => {
      if (notes.length < 1) return;
      const noteCards = gsap.utils.toArray<Element>(".note-card");

      gsap.from(noteCards, {
        autoAlpha: 0,
        duration: 0.45,
        y: -32,
        ease: "back.out(1.6)",
        stagger: 0.06,
      });
    },
    {
      dependencies: [notes],
      scope: containerRef,
    },
  );

  const openDeleteDialog = (targetNoteId: string, imageKeys: string[]) => {
    setActiveDialog("delete");
    setNoteId(targetNoteId);
    setNoteImageKeys(imageKeys);
  };

  const openAddImageDialog = (targetNoteId: string) => {
    setActiveDialog("addImage");
    setNoteId(targetNoteId);
  };

  const closeDialog = () => {
    setActiveDialog(null);
    setNoteId(null);
    setNoteImageKeys([]);
  };

  if (notes.length < 1) {
    if (hideEmptyState) return null;

    return (
      <div className="flex h-96 items-center justify-center">
        <h1 className="p-6 text-2xl font-semibold text-blohsh-foreground">
          {hasSearchQuery ? searchEmptyMessage : emptyMessage}
        </h1>
      </div>
    );
  }

  return (
    <>
      <DeleteNoteDialog
        show={activeDialog === "delete"}
        noteId={noteId ?? ""}
        noteImageKeys={noteImageKeys}
        onClose={closeDialog}
      />
      <AddNoteImageDialog
        show={activeDialog === "addImage"}
        noteId={noteId ?? ""}
        onClose={closeDialog}
      />

      <div
        ref={containerRef}
        className={cn(
          useContainerClass
            ? "container grid auto-rows-[max-content_1fr] grid-cols-1 gap-4 px-0 py-4 @lg/note-grid:grid-cols-2 @4xl/note-grid:grid-cols-3"
            : "grid auto-rows-[max-content_1fr] grid-cols-1 gap-4 @lg/note-grid:grid-cols-2 @4xl/note-grid:grid-cols-3",
          className,
        )}
      >
        {notes.map((note) => (
          <Note
            key={note.id}
            className="note-card row-span-2 grid grid-rows-subgrid gap-0"
            note={note}
            openDeleteDialog={openDeleteDialog}
            openAddImageDialog={openAddImageDialog}
          />
        ))}
      </div>
    </>
  );
}
