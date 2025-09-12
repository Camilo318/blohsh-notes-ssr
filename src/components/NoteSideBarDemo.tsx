"use client";

import { useQuery } from "@tanstack/react-query";
import NoteSideBar from "./NoteSideBar";
import { useEdit } from "~/hooks/use-edit";
import { getNoteById } from "~/server/queries";

export default function NoteSideBarDemo() {
  const { isEditing, noteToEditId, setIsEditing, setNoteToEdit } = useEdit();

  const { data: note } = useQuery({
    queryKey: ["noteToEdit", noteToEditId],
    queryFn: () => getNoteById(noteToEditId as string),
    enabled: !!noteToEditId,
  });

  return (
    <NoteSideBar
      isOpen={isEditing}
      onClose={() => {
        setIsEditing(false);
        setNoteToEdit(null);
      }}
      note={note}
    />
  );
}
