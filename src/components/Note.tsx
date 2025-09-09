import { forwardRef } from "react";
import Image from "next/image";
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

  const noteImages = [...(note.images ?? [])];
  const noteImageKeys = note.images?.map((image) => image.key ?? "") ?? [];

  return (
    <Card
      ref={ref}
      className={cn(
        "group relative overflow-hidden transition-transform ease-in-out hover:scale-105",
        className,
      )}
    >
      <CardHeader className="p-0">
        {/* {noteImages.length > 0 && (
          <div className="flex h-40 min-h-0 gap-1">
            {noteImages.map((image) => (
              <Image
                key={image.id}
                className="min-w-0 flex-1 object-cover object-center duration-300 ease-in-out animate-in fade-in zoom-in-125"
                src={image.imageSrc ?? ""}
                alt={image.altText ?? ""}
                width={300}
                height={300}
              />
            ))}
          </div>
        )} */}
        <CardTitle className="mb-1 px-6 pt-6">{title}</CardTitle>
        <CardDescription className="inline-block min-w-9 rounded-md px-6 py-1 text-xs font-semibold opacity-90">
          {formatDistanceToNow(new Date(note.createdAt), {
            addSuffix: true,
          })}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-0">
        <p className="line-clamp-6 hyphens-auto whitespace-pre-line text-pretty break-words">
          {content}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-around gap-2 pb-3 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
        <>
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => openDeleteDialog(note.id, noteImageKeys)}
          >
            <Trash2Icon className="h-[18px] w-[18px]" />
          </Button>

          <Button variant={"ghost"} size={"icon"}>
            <ArchiveIcon className="h-[18px] w-[18px]" />
          </Button>

          <Button variant={"ghost"} size={"icon"}>
            <PaletteIcon className="h-[18px] w-[18px]" />
          </Button>

          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => openAddImageDialog(note.id)}
          >
            <ImagePlus className="h-[18px] w-[18px]" />
          </Button>

          <Button variant={"ghost"} size={"icon"}>
            <EditIcon className="h-[18px] w-[18px]" />
          </Button>
        </>
      </CardFooter>
    </Card>
  );
});

Note.displayName = "Note";

export default Note;
