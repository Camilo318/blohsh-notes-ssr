"use client";

import { useState, useId } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { createNote } from "~/server/mutations";

export default function CreateNoteWizard() {
  const [collapsibleState, setCollapsibleState] = useState<"open" | "closed">(
    "closed",
  );
  const [note, setNote] = useState({ title: "", content: "" });

  const collapsibleId = useId();

  return (
    <div
      className="mx-auto mb-4 mt-8 min-h-11 max-w-[600px] rounded-lg border border-[#e0e0e0] bg-card shadow-3xl"
      aria-expanded={collapsibleState === "open"}
      data-state={collapsibleState}
    >
      <div
        data-state={collapsibleState}
        className="cursor-text px-4 py-3 data-[state=open]:hidden"
        aria-controls={collapsibleId}
        onClick={() => setCollapsibleState("open")}
      >
        Create a note
      </div>

      <div
        data-state={collapsibleState}
        className="flex flex-col gap-3 px-4 py-4 data-[state=closed]:hidden"
        id={collapsibleId}
        hidden={collapsibleState === "closed"}
      >
        {collapsibleState === "open" && (
          <>
            <Input
              value={note.title}
              onChange={(e) => {
                setNote((prevNote) => ({
                  ...prevNote,
                  title: e.target.value,
                }));
              }}
              aria-label="Note title"
              className="py-3 placeholder:text-base data-[state=closed]:hidden"
              data-state={collapsibleState}
              placeholder="Title"
            />

            <div>
              <Textarea
                autoFocus
                value={note.content}
                onChange={(e) => {
                  setNote((prevNote) => ({
                    ...prevNote,
                    content: e.target.value,
                  }));
                }}
                aria-label="Note content"
                placeholder="Create note"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                disabled={!note.content && !note.title}
                onClick={async () => {
                  await createNote({ ...note, createdById: "" });

                  setNote({
                    title: "",
                    content: "",
                  });
                  setCollapsibleState("closed");
                }}
              >
                Create
              </Button>
              <Button
                variant={"ghost"}
                onClick={() => setCollapsibleState("closed")}
              >
                Close
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
