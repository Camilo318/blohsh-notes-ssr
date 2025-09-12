"use client";

import { useQuery } from "@tanstack/react-query";
import NoteSideBar from "./NoteSideBar";
import { useEdit } from "~/hooks/use-edit";
import { getNoteById } from "~/server/queries";

export default function NoteSideBarDemo() {
  const { isEditing, noteToEditId, setIsEditing, setNoteToEdit } = useEdit();

  const { data: note, isLoading } = useQuery({
    queryKey: ["noteToEdit", noteToEditId],
    queryFn: () => getNoteById(noteToEditId as string),
    enabled: !!noteToEditId,
  });

  const handleClose = () => {
    setIsEditing(false);
    setNoteToEdit(null);
  };

  return (
    <NoteSideBar
      isOpen={isEditing}
      onClose={handleClose}
      note={note}
      isLoading={isLoading}
    />
  );
}
