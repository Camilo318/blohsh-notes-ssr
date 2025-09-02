import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "./ui/button";
import {
  Trash2Icon,
  EditIcon,
  ArchiveIcon,
  PaletteIcon,
  ImagePlus,
} from "lucide-react";
import { deleteNote, editTodo } from "~/server/mutations";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "~/lib/utils";
import { Textarea } from "./ui/textarea";
import { type SelectNote } from "~/server/db/schema";

import { useRef, useState, forwardRef } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

const Note = forwardRef<
  HTMLDivElement,
  {
    note: SelectNote;
    className?: string;
  }
>(({ note, className }, ref) => {
  const { title, content } = note;
  const [noteImages, setNoteImages] = useState<
    {
      name: string;
      type: string;
      src: string;
    }[]
  >([]);
  const inputFileRef = useRef<HTMLInputElement>(null);

  return (
    <Card
      ref={ref}
      className={cn(
        "group relative overflow-hidden transition-all hover:translate-x-2 hover:translate-y-2",
        className,
      )}
    >
      <CardHeader className="p-0">
        {noteImages.length > 0 && (
          <div className="flex h-40 min-h-0 gap-1">
            {noteImages.map((image) => (
              <Image
                key={image.name}
                className="flex-1 object-cover"
                src={image.src}
                alt={image.name}
                width={100}
                height={100}
              />
            ))}
          </div>
        )}
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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"ghost"} size={"icon"}>
                <Trash2Icon className="h-[18px] w-[18px]" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                note
              </DialogDescription>

              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    variant={"destructive"}
                    onClick={() => deleteNote(note.id)}
                  >
                    Yes, delete
                  </Button>
                </DialogClose>

                <DialogClose asChild>
                  <Button variant={"ghost"}>Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant={"ghost"} size={"icon"}>
            <ArchiveIcon className="h-[18px] w-[18px]" />
          </Button>
          <Button variant={"ghost"} size={"icon"}>
            <PaletteIcon className="h-[18px] w-[18px]" />
          </Button>
          <Button
            aria-label="Add image"
            variant={"ghost"}
            size={"icon"}
            onClick={() => {
              if (!inputFileRef.current) return;
              inputFileRef.current.click();
            }}
          >
            <input
              type="file"
              hidden
              accept="image/*"
              ref={inputFileRef}
              onChange={(e) => {
                if (!e.target.files) return;
                const files = e.target.files;
                const images = Array.from(files).map((file) => ({
                  name: file.name,
                  type: file.type,
                  src: URL.createObjectURL(file),
                }));
                setNoteImages((prevImages) => [...prevImages, ...images]);
              }}
            />
            <ImagePlus className="h-[18px] w-[18px]" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"ghost"} size={"icon"}>
                <EditIcon className="h-[18px] w-[18px]" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit note</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Make changes to your note here. Click save when you&apos;re
                done.
              </DialogDescription>
              <form className={cn("grid items-start gap-4")} action={editTodo}>
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    type="text"
                    id="title"
                    name="title"
                    defaultValue={note.title}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    name="content"
                    defaultValue={note.content}
                  />
                </div>

                <input name="id" type="hidden" value={note.id} hidden />
                <DialogClose asChild>
                  <Button type="submit">Save changes</Button>
                </DialogClose>
              </form>
            </DialogContent>
          </Dialog>
        </>
      </CardFooter>
    </Card>
  );
});

Note.displayName = "Note";

export default Note;
