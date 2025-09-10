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
import { useEdit } from "~/hooks/use-edit";

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
  const { setIsEditing, setNoteToEdit } = useEdit();
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
          <Button
            variant={"destructive"}
            onClick={async () => {
              await deleteNote(noteId, noteImageKeys ?? []);
              setIsEditing(false);
              setNoteToEdit(null);
              onClose();
            }}
          >
            Yes, delete
          </Button>

          <DialogClose asChild>
            <Button variant={"ghost"}>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
