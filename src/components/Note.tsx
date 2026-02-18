"use client";

import {
  ArchiveIcon,
  Bookmark,
  BookmarkCheck,
  EditIcon,
  ImagePlus,
  MoreHorizontal,
  PaletteIcon,
  Plus,
  Trash2Icon,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { cn } from "~/lib/utils";
import { getColorVariant } from "~/lib/note-colors";
import { type SelectNote } from "~/server/db/schema";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useEdit } from "~/hooks/use-edit";
import { toggleNoteFavorite } from "~/server/mutations";
import Composer, { ComposerEditor } from "./Composer";

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
  const queryClient = useQueryClient();

  const colorVariant = getColorVariant(note.id);
  const tags = note.tags ?? [];

  const toggleFavoriteMutation = useMutation({
    mutationFn: () => toggleNoteFavorite(note.id),
    onSuccess: async (updatedNote) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["notes"] }),
        queryClient.invalidateQueries({ queryKey: ["notes-grouped-by-tag"] }),
        queryClient.invalidateQueries({ queryKey: ["noteToEdit", note.id] }),
      ]);

      const isFavorite = updatedNote?.isFavorite ?? !note.isFavorite;
      toast.success(
        isFavorite ? "Added to favorites" : "Removed from favorites",
      );
    },
    onError: () => {
      toast.error("Could not update favorites");
    },
  });

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
          {title ?? "Note title"}
        </CardTitle>

        {note.isFavorite ? (
          <span
            className={cn(
              "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-white/45 shadow-sm backdrop-blur-sm dark:bg-white/10",
              colorVariant.border,
            )}
            aria-label="Favorited note"
          >
            <BookmarkCheck className="h-3.5 w-3.5" />
          </span>
        ) : null}

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
                onClick={() => toggleFavoriteMutation.mutate()}
                disabled={toggleFavoriteMutation.isPending}
              >
                {note.isFavorite ? (
                  <BookmarkCheck className="h-4 w-4" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
                {toggleFavoriteMutation.isPending
                  ? "Updating..."
                  : note.isFavorite
                    ? "Remove from favorites"
                    : "Add to favorites"}
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
        className="will-change-box-shadow cursor-pointer p-4 transition-[transform,box-shadow] duration-200 ease-out will-change-transform hover:scale-[1.02] hover:shadow-lg"
        onClick={() => {
          setIsEditing(true);
          setNoteToEdit(note.id);
        }}
      >
        {/* Inner Content Card */}
        <CardContent className="flex h-full w-full min-w-0 flex-col gap-4 overflow-hidden rounded-2xl bg-note-content-bg/80 py-6 backdrop-blur-sm">
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

          {/* Content Preview */}
          <div className="line-clamp-5 min-h-0 w-full min-w-0 text-sm leading-relaxed text-muted-foreground">
            <Composer key={content} defaultContent={content} editable={false}>
              <ComposerEditor />
            </Composer>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

Note.displayName = "Note";

export default Note;
