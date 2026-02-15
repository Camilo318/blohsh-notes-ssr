"use client";

import { useState, useId } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { createNote } from "~/server/mutations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import * as ResizablePanel from "./resizable-panel";
import Composer, {
  ComposerCommonButtons,
  ComposerEditor,
  ComposerSaveContentButton,
} from "./Composer";

export default function CreateNoteWizard() {
  const [collapsibleState, setCollapsibleState] = useState<"open" | "closed">(
    "closed",
  );
  const [note, setNote] = useState({ title: "", content: "" });

  const collapsibleId = useId();
  const queryClient = useQueryClient();

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      setNote({ title: "", content: "" });
      toast.success("Note created successfully", {
        description: "Your new note has been saved.",
        position: "top-right",
      });

      setCollapsibleState("closed");

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["notes"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["notes-grouped-by-tag"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["tags"],
        }),
      ]);
    },
    onError: (error) => {
      console.error("Failed to create note:", error);
      toast.error("Failed to create note", {
        description: "There was an error creating your note. Please try again.",
      });
    },
  });

  return (
    <ResizablePanel.Root
      value={collapsibleState}
      className="liquid-glass mx-auto w-full max-w-5xl rounded-lg "
      aria-expanded={collapsibleState === "open"}
      data-state={collapsibleState}
    >
      <ResizablePanel.Content
        value="closed"
        data-state={collapsibleState}
        className="cursor-text px-4 py-3"
        onClick={() => setCollapsibleState("open")}
      >
        Create a note
      </ResizablePanel.Content>

      <ResizablePanel.Content
        value="open"
        data-state={collapsibleState}
        className="flex max-h-[600px] flex-col gap-3 px-4 py-4"
        id={collapsibleId}
      >
        <div>
          <Input
            value={note.title}
            onChange={(e) => {
              setNote((prevNote) => ({
                ...prevNote,
                title: e.target.value,
              }));
            }}
            aria-label="Note title"
            className="h-10 rounded-md py-3 text-base placeholder:text-base"
            data-state={collapsibleState}
            placeholder="Title"
          />
        </div>
        <Composer>
          <div className="flex-1 overflow-y-auto px-2 pb-2">
            <div className="sticky top-0 z-10 -mb-2">
              <ComposerCommonButtons />
            </div>
            <ComposerEditor />
          </div>
          <div className="flex justify-end gap-3">
            <ComposerSaveContentButton
              onSave={(content) => {
                createNoteMutation.mutate({
                  title: note.title,
                  content,
                  createdById: "",
                });
              }}
              disabled={createNoteMutation.isPending}
            >
              {createNoteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </ComposerSaveContentButton>
            <Button
              variant="ghost"
              onClick={() => setCollapsibleState("closed")}
              disabled={createNoteMutation.isPending}
            >
              Close
            </Button>
          </div>
        </Composer>
      </ResizablePanel.Content>
    </ResizablePanel.Root>
  );
}
