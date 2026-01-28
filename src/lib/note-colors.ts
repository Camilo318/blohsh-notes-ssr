// Note color variants used across the app
export const noteColorVariants = [
  {
    name: "rose",
    bg: "bg-note-rose",
    headerText: "text-note-rose-text",
    border: "border-note-rose-text/20",
  },
  {
    name: "mint",
    bg: "bg-note-mint",
    headerText: "text-note-mint-text",
    border: "border-note-mint-text/20",
  },
  {
    name: "cream",
    bg: "bg-note-cream",
    headerText: "text-note-cream-text",
    border: "border-note-cream-text/20",
  },
  {
    name: "sky",
    bg: "bg-note-sky",
    headerText: "text-note-sky-text",
    border: "border-note-sky-text/20",
  },
  {
    name: "lavender",
    bg: "bg-note-lavender",
    headerText: "text-note-lavender-text",
    border: "border-note-lavender-text/20",
  },
] as const;

export type NoteColorVariant = (typeof noteColorVariants)[number];

// Generate consistent color based on note id
export function getColorVariant(noteId: string): NoteColorVariant {
  const hash = noteId.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  const index = Math.abs(hash) % noteColorVariants.length;
  return noteColorVariants[index]!;
}

