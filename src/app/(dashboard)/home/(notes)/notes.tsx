"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useQuery } from "@tanstack/react-query";
import { type Session } from "next-auth";
import { getNotesByUser } from "~/server/queries";
import Note from "~/components/Note";
import { useDebounce } from "~/lib/hooks/useDebounce";
import CreateNoteWizard from "~/components/CreateNoteWizard";
import DeleteNoteDialog from "./delete-dialog";
import AddNoteImageDialog from "./add-image-dialog";
import { Search } from "lucide-react";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { ModeToggle } from "~/components/ModeToggle";
gsap.registerPlugin(useGSAP);

export default function NotesContainer({ user }: { user: Session["user"] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedSearchQuery = useDebounce<typeof searchQuery>(
    searchQuery,
    600,
  );

  const { data: userNotes, isSuccess } = useQuery({
    queryKey: ["notes", user.id, debouncedSearchQuery],
    queryFn: () => getNotesByUser(user.id, debouncedSearchQuery),
  });

  const [noteId, setNoteId] = useState<string | null>(null);
  const [noteImageKeys, setNoteImageKeys] = useState<string[]>([]);

  const [activeDialog, setActiveDialog] = useState<
    "delete" | "addImage" | null
  >(null);

  const openDeleteDialog = (noteId: string, noteImageKeys: string[]) => {
    setActiveDialog("delete");
    setNoteId(noteId);
    setNoteImageKeys(noteImageKeys);
  };

  const openAddImageDialog = (noteId: string) => {
    setActiveDialog("addImage");
    setNoteId(noteId);
  };

  const closeDialog = () => {
    setActiveDialog(null);
    setNoteId(null);
    setNoteImageKeys([]);
  };

  useGSAP(
    (context) => {
      console.log(context.data);
      if (!isSuccess || userNotes.length < 1) return;
      const notes = gsap.utils.toArray<Element>(".note-card");

      gsap.from(notes, {
        autoAlpha: 0,
        duration: 0.5,
        y: -50,
        ease: "back.out",
        stagger: 0.1,
      });
    },
    {
      dependencies: [isSuccess, userNotes],
      scope: containerRef,
    },
  );

  return (
    <>
      <DeleteNoteDialog
        show={activeDialog === "delete"}
        noteId={noteId ?? ""}
        noteImageKeys={noteImageKeys ?? []}
        onClose={closeDialog}
      />
      <AddNoteImageDialog
        show={activeDialog === "addImage"}
        noteId={noteId ?? ""}
        onClose={closeDialog}
      />

      {/* Search Header */}
      <div className="-mx-4 -mt-4 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="h-9 w-9 shrink-0 rounded-full hover:bg-blohsh-hover" />

          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search a note"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-xl border-0 bg-secondary/60 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 dark:bg-secondary/80"
            />
          </div>

          <ModeToggle
            variant="ghost"
            className="h-9 w-9 rounded-full hover:bg-blohsh-hover"
          />
        </div>
      </div>

      {/* Create Note */}
      <div className="py-4">
        <CreateNoteWizard />
      </div>

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
        <div
          ref={containerRef}
          className="container grid auto-rows-[max-content_1fr] grid-cols-1 gap-4 px-0 py-4 @lg/note-grid:grid-cols-2 @4xl/note-grid:grid-cols-3"
        >
          {userNotes.map((note) => (
            <Note
              key={note.id}
              className="note-card row-span-2 grid grid-rows-subgrid gap-0"
              note={note}
              openDeleteDialog={openDeleteDialog}
              openAddImageDialog={openAddImageDialog}
            />
          ))}
        </div>
      )}
    </>
  );
}
