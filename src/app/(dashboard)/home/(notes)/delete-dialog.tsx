import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { deleteNote } from "~/server/mutations";

export default function DeleteNoteDialog({
  noteId,
  noteImageKeys,
  show,
  onClose,
}: {
  noteId: string;
  noteImageKeys: string[];
  show: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your note
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant={"destructive"}
              onClick={() => deleteNote(noteId, noteImageKeys ?? [])}
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
  );
}
