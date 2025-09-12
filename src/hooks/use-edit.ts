import { create } from "zustand";

const useEditStore = create<{
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  noteToEditId: string | number | null;
  setNoteToEdit: (noteToEditId: string | number | null) => void;
}>((set) => ({
  isEditing: false,
  setIsEditing: (isEditing) => set({ isEditing }),
  noteToEditId: null,
  setNoteToEdit: (id) => set({ noteToEditId: id }),
}));

export const useEdit = () => {
  return useEditStore();
};
