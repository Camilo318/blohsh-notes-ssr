"use client";

import { useQuery } from "@tanstack/react-query";
import NoteSideBar from "./NoteSideBar";
import { useEdit } from "~/hooks/use-edit";
import { getNoteById, getTagsByUser } from "~/server/queries";
import { useSession } from "next-auth/react";

export default function NoteSideBarDemo() {
  const { isEditing, noteToEditId, setIsEditing, setNoteToEdit } = useEdit();
  const { data: session } = useSession();

  const { data: note, isLoading: noteLoading } = useQuery({
    queryKey: ["noteToEdit", noteToEditId],
    queryFn: () => getNoteById(noteToEditId as string),
    enabled: !!noteToEditId,
  });

  const { data: tags, isLoading: tagsLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: () => getTagsByUser(session?.user.id),
    enabled: !!session?.user.id && !!noteToEditId,
  });

  const handleOpenChanges = (open: boolean) => {
    if (!open) {
      setNoteToEdit(null);
    }
    setIsEditing(open);
  };

  return (
    <NoteSideBar
      isOpen={isEditing}
      handleOpenChanges={handleOpenChanges}
      note={note ?? undefined}
      isLoading={noteLoading || tagsLoading}
      tags={tags ?? []}
    />
  );
}
