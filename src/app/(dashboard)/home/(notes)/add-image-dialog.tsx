import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { UploadDropzone } from "~/components/uploadthing";
import { useEdit } from "~/hooks/use-edit";

const AddNoteImageDialog = ({
  noteId,
  show,
  onClose,
}: {
  noteId: string;
  show: boolean;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();
  const { setIsEditing, setNoteToEdit } = useEdit();

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add image</DialogTitle>
          <DialogDescription>Add an image to your note</DialogDescription>
        </DialogHeader>
        <UploadDropzone
          input={{ noteId }}
          endpoint="imageUploader"
          onClientUploadComplete={async () => {
            await queryClient.invalidateQueries({
              queryKey: ["noteToEdit", noteId],
            });

            setIsEditing(true);
            setNoteToEdit(noteId);

            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddNoteImageDialog;
