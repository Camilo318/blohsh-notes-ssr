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

import {
  useState,
  forwardRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { UploadDropzone } from "./uploadthing";
import { useRouter } from "next/navigation";

type PlaceholderImage = {
  id: string;
  noteId: string;
  altText: string;
  imageSrc: string;
  contentType: string;
};

const Note = forwardRef<
  HTMLDivElement,
  {
    note: SelectNote;
    className?: string;
  }
>(({ note, className }, ref) => {
  const { title, content } = note;

  // these are placeholder images, once the user uploads images, they will come from the note (left join)
  const [placeholderImages, setPlaceholderImages] = useState<
    PlaceholderImage[]
  >([]);

  const noteImages = [...(note.images ?? []), ...placeholderImages];

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
                key={image.id}
                className="min-w-0 flex-1 object-cover object-center duration-300 ease-in-out animate-in fade-in zoom-in-75"
                src={image.imageSrc ?? ""}
                alt={image.altText ?? ""}
                width={300}
                height={300}
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
          <DeleteNoteDialog noteId={note.id} />

          <Button variant={"ghost"} size={"icon"}>
            <ArchiveIcon className="h-[18px] w-[18px]" />
          </Button>

          <Button variant={"ghost"} size={"icon"}>
            <PaletteIcon className="h-[18px] w-[18px]" />
          </Button>

          <AddNoteImageDialog
            noteId={note.id}
            setPlaceholderImages={setPlaceholderImages}
          />

          <EditNoteDialog
            noteId={note.id}
            title={note.title}
            content={note.content}
          />
        </>
      </CardFooter>
    </Card>
  );
});

Note.displayName = "Note";

export default Note;

const DeleteNoteDialog = ({ noteId }: { noteId: string }) => {
  return (
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
          This action cannot be undone. This will permanently delete your note
        </DialogDescription>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"destructive"} onClick={() => deleteNote(noteId)}>
              Yes, delete
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button variant={"ghost"}>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EditNoteDialog = ({
  noteId,
  title,
  content,
}: {
  noteId: string;
  title: string;
  content: string;
}) => {
  return (
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
          Make changes to your note here. Click save when you&apos;re done.
        </DialogDescription>
        <form className={cn("grid items-start gap-4")} action={editTodo}>
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input type="text" id="title" name="title" defaultValue={title} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" name="content" defaultValue={content} />
          </div>

          <input name="id" type="hidden" value={noteId} hidden />
          <DialogClose asChild>
            <Button type="submit">Save changes</Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const AddNoteImageDialog = ({
  noteId,
  setPlaceholderImages,
}: {
  noteId: string;
  setPlaceholderImages: Dispatch<SetStateAction<PlaceholderImage[]>>;
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <ImagePlus className="h-[18px] w-[18px]" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add image</DialogTitle>
          <DialogDescription>Add an image to your note</DialogDescription>
        </DialogHeader>
        <UploadDropzone
          input={{ noteId }}
          endpoint="imageUploader"
          onBeforeUploadBegin={(files) => {
            const images: PlaceholderImage[] = files.map((file) => ({
              // this is a placeholder id, the actual id will be set by the server
              id: crypto.randomUUID(),
              noteId: noteId,
              altText: file.name,
              imageSrc: URL.createObjectURL(file),
              contentType: file.type,
            }));
            setPlaceholderImages((prevImages) => [...prevImages, ...images]);

            return files;
          }}
          onClientUploadComplete={() => {
            setPlaceholderImages((prevImages) => {
              prevImages.forEach((image) => {
                URL.revokeObjectURL(image.imageSrc);
              });
              return [];
            });
            router.refresh();
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
