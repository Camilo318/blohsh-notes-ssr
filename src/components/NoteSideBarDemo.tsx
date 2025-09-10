"use client";

import NoteSideBar from "./NoteSideBar";
import { useEdit } from "~/hooks/use-edit";

export default function NoteSideBarDemo() {
  const { isEditing, noteToEdit, setIsEditing, setNoteToEdit } = useEdit();

  return (
    <NoteSideBar
      isOpen={isEditing}
      onClose={() => {
        setIsEditing(false);
        setNoteToEdit(null);
      }}
      setNoteToEdit={setNoteToEdit}
      note={noteToEdit ?? undefined}
    />
  );
}
