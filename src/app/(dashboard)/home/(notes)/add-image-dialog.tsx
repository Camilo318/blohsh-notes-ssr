import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { UploadDropzone } from "~/components/uploadthing";

const AddNoteImageDialog = ({
  noteId,
  show,
  onClose,
}: {
  noteId: string;
  show: boolean;
  onClose: () => void;
}) => {
  const router = useRouter();
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
          onClientUploadComplete={() => {
            router.refresh();
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddNoteImageDialog;
