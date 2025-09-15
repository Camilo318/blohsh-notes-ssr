import { forwardRef } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  ArchiveIcon,
  EditIcon,
  ImagePlus,
  PaletteIcon,
  Trash2Icon,
} from "lucide-react";

import { cn } from "~/lib/utils";
import { type SelectNote } from "~/server/db/schema";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useEdit } from "~/hooks/use-edit";

const Note = forwardRef<
  HTMLDivElement,
  {
    note: SelectNote;
    className?: string;
    openDeleteDialog: (noteId: string, noteImageKeys: string[]) => void;
    openAddImageDialog: (noteId: string) => void;
  }
>(({ note, className, openDeleteDialog, openAddImageDialog }, ref) => {
  const { title, content } = note;

  const noteImageKeys = note.images?.map((image) => image.key ?? "") ?? [];
  const { setIsEditing, setNoteToEdit } = useEdit();

  return (
    <Card
      ref={ref}
      className={cn(
        "group relative overflow-hidden transition-transform ease-in-out hover:scale-[102%]",
        className,
      )}
    >
      <CardHeader className="justify-between p-0">
        <CardTitle className="mb-1 line-clamp-2 px-6 pt-6 leading-normal">
          {title}
        </CardTitle>
        <CardDescription className="inline-block min-w-9 rounded-md px-6 py-1 text-xs font-semibold opacity-90">
          {formatDistanceToNow(new Date(note.createdAt), {
            addSuffix: true,
          })}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-0">
        <p className="@2xl/note-grid:line-clamp-6 line-clamp-3 hyphens-auto whitespace-pre-line text-pretty break-words">
          {content}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-around gap-2 pb-3 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
        <>
          <Button
            title="Delete"
            variant={"ghost"}
            size={"icon"}
            onClick={() => openDeleteDialog(note.id, noteImageKeys)}
          >
            <Trash2Icon className="h-[18px] w-[18px]" />
            <span className="sr-only">Delete</span>
          </Button>

          <Button title="Archive" variant={"ghost"} size={"icon"}>
            <ArchiveIcon className="h-[18px] w-[18px]" />
            <span className="sr-only">Archive</span>
          </Button>

          <Button title="Change Color" variant={"ghost"} size={"icon"}>
            <PaletteIcon className="h-[18px] w-[18px]" />
            <span className="sr-only">Change Color</span>
          </Button>

          <Button
            title="Add Image"
            variant={"ghost"}
            size={"icon"}
            onClick={() => openAddImageDialog(note.id)}
          >
            <ImagePlus className="h-[18px] w-[18px]" />
            <span className="sr-only">Add Image</span>
          </Button>

          <Button
            title="Edit"
            variant={"ghost"}
            size={"icon"}
            onClick={() => {
              setIsEditing(true);
              setNoteToEdit(note.id);
            }}
          >
            <EditIcon className="h-[18px] w-[18px]" />
            <span className="sr-only">Edit</span>
          </Button>
        </>
      </CardFooter>
    </Card>
  );
});

Note.displayName = "Note";

export default Note;
