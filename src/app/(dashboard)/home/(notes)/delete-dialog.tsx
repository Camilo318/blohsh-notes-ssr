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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

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
  const queryClient = useQueryClient();

  const { setIsEditing, setNoteToEdit } = useEdit();

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteNote(noteId, noteImageKeys ?? []),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["noteToEdit", noteId],
      });
      setIsEditing(false);
      setNoteToEdit(null);
      onClose();
    },
  });

  return (
    <Dialog
      open={show}
      onOpenChange={(open) => !isPending && !open && onClose()}
    >
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
            onClick={() => mutate()}
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Deleting..." : "Yes, delete"}
          </Button>

          <DialogClose asChild>
            <Button variant={"ghost"} disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
