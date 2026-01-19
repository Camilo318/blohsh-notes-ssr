import {
  ArchiveIcon,
  EditIcon,
  ImagePlus,
  MoreHorizontal,
  PaletteIcon,
  Plus,
  Trash2Icon,
} from "lucide-react";

import { cn } from "~/lib/utils";
import { getColorVariant } from "~/lib/note-colors";
import { type SelectNote } from "~/server/db/schema";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useEdit } from "~/hooks/use-edit";

// Generate a category display name from the note
function getCategoryDisplay(note: SelectNote): string {
  if (note.category) return note.category;
  // Use first word of title or fallback
  const firstWord = note.title.split(" ")[0];
  return firstWord && firstWord.length > 2 ? firstWord : "Notes";
}

// Generate mock tags based on note content
function getMockTags(note: SelectNote): { label: string; emoji: string }[] {
  const category = note.category?.toLowerCase() ?? "";
  const title = note.title.toLowerCase();
  const content = note.content.toLowerCase();

  const tags: { label: string; emoji: string }[] = [];

  // Add tags based on content keywords
  if (
    title.includes("study") ||
    content.includes("study") ||
    title.includes("lecture")
  ) {
    tags.push({ label: "Studies", emoji: "📚" });
  }
  if (
    title.includes("university") ||
    content.includes("university") ||
    title.includes("school")
  ) {
    tags.push({ label: "University", emoji: "🏫" });
  }
  if (
    title.includes("food") ||
    content.includes("recipe") ||
    title.includes("grocery") ||
    title.includes("chicken")
  ) {
    tags.push({ label: "Food", emoji: "🍔" });
  }
  if (title.includes("diary") || content.includes("feeling")) {
    tags.push({ label: "Diary", emoji: "📔" });
  }
  if (title.includes("thought") || content.includes("thinking")) {
    tags.push({ label: "Thoughts", emoji: "💭" });
  }
  if (
    category === "work" ||
    title.includes("work") ||
    title.includes("meeting")
  ) {
    tags.push({ label: "Work", emoji: "💼" });
  }
  if (title.includes("idea") || content.includes("idea")) {
    tags.push({ label: "Ideas", emoji: "💡" });
  }

  // If no tags matched, add a default one
  if (tags.length === 0) {
    tags.push({ label: "Personal", emoji: "✨" });
  }

  return tags.slice(0, 2); // Max 2 tags
}

const Note = ({
  note,
  className,
  openDeleteDialog,
  openAddImageDialog,
}: {
  note: SelectNote;
  className?: string;
  openDeleteDialog: (noteId: string, noteImageKeys: string[]) => void;
  openAddImageDialog: (noteId: string) => void;
}) => {
  const { title, content } = note;
  const noteImageKeys = note.images?.map((image) => image.key ?? "") ?? [];
  const { setIsEditing, setNoteToEdit, noteToEditId } = useEdit();

  const colorVariant = getColorVariant(note.id);
  const categoryDisplay = getCategoryDisplay(note);
  const tags = getMockTags(note);

  return (
    <Card
      className={cn(
        className,
        "group relative overflow-hidden rounded-2xl shadow-sm",
        colorVariant.bg,
        noteToEditId === note.id && "ring-2 ring-primary",
        colorVariant.headerText,
      )}
    >
      {/* Colored Header */}
      <CardHeader className="flex-row items-center justify-between space-y-0 px-5 py-3">
        <CardTitle
          className={cn("text-base font-semibold", colorVariant.headerText)}
        >
          {categoryDisplay}
        </CardTitle>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={cn(colorVariant.headerText)}
            onClick={() => openAddImageDialog(note.id)}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(colorVariant.headerText)}
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                className="cursor-pointer gap-2"
                onClick={() => {
                  setIsEditing(true);
                  setNoteToEdit(note.id);
                }}
              >
                <EditIcon className="h-4 w-4" />
                Edit note
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer gap-2"
                onClick={() => openAddImageDialog(note.id)}
              >
                <ImagePlus className="h-4 w-4" />
                Add image
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2">
                <PaletteIcon className="h-4 w-4" />
                Change color
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2">
                <ArchiveIcon className="h-4 w-4" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                onClick={() => openDeleteDialog(note.id, noteImageKeys)}
              >
                <Trash2Icon className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      {/* Outer Content Card */}
      <div
        className="cursor-pointer p-4 transition-transform ease-out hover:scale-[1.02]"
        onClick={() => {
          setIsEditing(true);
          setNoteToEdit(note.id);
        }}
      >
        {/* Inner Content Card */}
        <CardContent className="bg-note-content-bg flex h-full flex-col gap-4 rounded-2xl py-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-2.5 py-1 text-xs font-medium"
              >
                {tag.label} {tag.emoji}
              </Badge>
            ))}
          </div>

          {/* Title */}
          <CardTitle className="line-clamp-2 text-xl leading-snug text-card-foreground">
            {title}
          </CardTitle>

          {/* Content Preview */}
          <CardDescription className="line-clamp-5 leading-relaxed">
            {content}
          </CardDescription>
        </CardContent>
      </div>
    </Card>
  );
};

Note.displayName = "Note";

export default Note;
