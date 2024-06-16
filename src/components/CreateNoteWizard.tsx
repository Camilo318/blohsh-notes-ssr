"use client";

import { useState, useId } from "react";
import { Button } from "./ui/button";

export default function CreateNoteWizard() {
  const [collapsibleState, setCollapsibleState] = useState<"open" | "closed">(
    "closed",
  );

  const collapsibleId = useId();
  return (
    <div className="shadow-3xl mx-auto mb-4 mt-8 min-h-11 max-w-[600px] rounded-lg border border-[#e0e0e0] bg-card">
      <div
        className="px-4 py-3 data-[state=closed]:hidden"
        data-state={collapsibleState}
      >
        Title
      </div>
      <div
        className="cursor-text px-4 py-3"
        aria-controls={collapsibleId}
        aria-expanded={collapsibleState === "open"}
        onClick={() => setCollapsibleState("open")}
      >
        Create a note
      </div>

      <div
        data-state={collapsibleState}
        className="flex justify-end px-3 pb-1 data-[state=closed]:hidden"
        id={collapsibleId}
      >
        <Button variant={"ghost"} onClick={() => setCollapsibleState("closed")}>
          Close
        </Button>
      </div>
    </div>
  );
}
