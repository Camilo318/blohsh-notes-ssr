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
  const tags = note.tags ?? [];

  return (
    <Card
      className={cn(
        className,
        "liquid-glass group relative overflow-hidden rounded-2xl",
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
          {note.title ?? "Note title"}
        </CardTitle>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              colorVariant.headerText,
              "hover:bg-white/20 dark:hover:bg-white/10",
            )}
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
                className={cn(
                  colorVariant.headerText,
                  "hover:bg-white/20 dark:hover:bg-white/10",
                )}
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
        className="cursor-pointer p-4 transition-all duration-300 ease-out hover:scale-[1.02]"
        onClick={() => {
          setIsEditing(true);
          setNoteToEdit(note.id);
        }}
      >
        {/* Inner Content Card */}
        <CardContent className="flex h-full flex-col gap-4 rounded-2xl bg-note-content-bg/80 py-6 backdrop-blur-sm">
          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className={cn(
                    "px-2.5 py-1 text-xs font-medium",
                    colorVariant.border,
                    "border bg-white/50 dark:bg-white/10",
                  )}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

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
