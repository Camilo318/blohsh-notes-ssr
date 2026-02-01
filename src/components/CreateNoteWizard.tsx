"use client";

import { useState, useId, useRef } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { createNote } from "~/server/mutations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
gsap.registerPlugin(useGSAP);

export default function CreateNoteWizard() {
  const [collapsibleState, setCollapsibleState] = useState<"open" | "closed">(
    "closed",
  );
  const [note, setNote] = useState({ title: "", content: "" });

  const collapsibleId = useId();
  const queryClient = useQueryClient();

  const collapsibleRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP(
    () => {
      if (collapsibleState === "closed") return;

      //open animation
      const tl = gsap.timeline();

      tl.to(".call-to-action", {
        autoAlpha: 0,
        duration: 0.2,
        ease: "circ.out",
        y: 50,
      })
        .to(
          collapsibleRef.current,
          {
            height: "218px",
            duration: 0.5,
            ease: "circ.out",
          },
          "<",
        )
        .fromTo(
          ".note-fields",
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.5,
            ease: "circ.out",
            onComplete: () => {
              setCollapsibleState("open");
            },
          },
          "-=0.3",
        );
    },
    { scope: collapsibleRef, dependencies: [collapsibleState] },
  );

  const collapseAnimation = contextSafe(() => {
    const tl = gsap.timeline();

    tl.to(".note-fields", {
      autoAlpha: 0,
      duration: 0.2,
    })
      .to(
        collapsibleRef.current,
        {
          height: "50px",
          duration: 0.5,
          ease: "circ.out",
        },
        "<",
      )
      .to(
        ".call-to-action",
        {
          autoAlpha: 1,
          duration: 0.2,
          ease: "circ.out",
          y: 0,
          onComplete: () => {
            setCollapsibleState("closed");
          },
        },
        "-=0.3",
      );
  });

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      setNote({ title: "", content: "" });
      collapseAnimation();
      toast.success("Note created successfully", {
        description: "Your new note has been saved.",
        position: "top-right",
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["notes"],
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
    <div
      ref={collapsibleRef}
      className="liquid-glass mx-auto min-h-11 w-full max-w-[600px] rounded-lg"
      aria-expanded={collapsibleState === "open"}
      data-state={collapsibleState}
    >
      <div
        data-state={collapsibleState}
        className="call-to-action cursor-text px-4 py-3 data-[state=open]:hidden"
        aria-controls={collapsibleId}
        onClick={() => setCollapsibleState("open")}
      >
        Create a note
      </div>

      <div
        data-state={collapsibleState}
        className="note-fields flex flex-col gap-3 px-4 py-4 data-[state=closed]:hidden"
        id={collapsibleId}
      >
        <Input
          value={note.title}
          onChange={(e) => {
            setNote((prevNote) => ({
              ...prevNote,
              title: e.target.value,
            }));
          }}
          aria-label="Note title"
          className="py-3 placeholder:text-base"
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
            disabled={
              (!note.content && !note.title) || createNoteMutation.isPending
            }
            onClick={() => {
              createNoteMutation.mutate({ ...note, createdById: "" });
            }}
          >
            {createNoteMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create"
            )}
          </Button>
          <Button
            variant={"ghost"}
            onClick={() => collapseAnimation()}
            disabled={createNoteMutation.isPending}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
