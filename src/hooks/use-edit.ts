import { create } from "zustand";
import { type SelectNote } from "~/server/db/schema";

const useEditStore = create<{
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  noteToEdit: SelectNote | null;
  setNoteToEdit: (noteToEdit: SelectNote | null) => void;
}>((set) => ({
  isEditing: false,
  setIsEditing: (isEditing) => set({ isEditing }),
  noteToEdit: null,
  setNoteToEdit: (noteToEdit) => set({ noteToEdit }),
}));

export const useEdit = () => {
  return useEditStore();
};
