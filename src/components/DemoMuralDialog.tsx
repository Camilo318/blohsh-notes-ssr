"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Sparkles, WandSparkles } from "lucide-react";
import Composer, {
  ComposerCommonButtons,
  ComposerEditor,
  ComposerSaveContentButton,
} from "~/components/Composer";
import { DemoNote } from "~/components/Note";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { cn } from "~/lib/utils";
import { type SelectNote } from "~/server/db/schema";

type DemoMuralDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type ComposerTemplate = {
  id: string;
  label: string;
  description: string;
  content: string;
};

const doc = (content: Record<string, unknown>[]) =>
  JSON.stringify({ type: "doc", content });

const composerTemplates: ComposerTemplate[] = [
  {
    id: "quick-note",
    label: "Quick note",
    description: "Simple note with heading and short paragraph",
    content: doc([
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Quick capture" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Write an idea in seconds before context switches.",
          },
        ],
      },
    ]),
  },
  {
    id: "project-brief",
    label: "Project brief",
    description: "Structured note with bullet and ordered lists",
    content: doc([
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Launch plan" }],
      },
      {
        type: "paragraph",
        content: [{ type: "text", text: "Objectives for this sprint:" }],
      },
      {
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "Finalize onboarding flow" }],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "Prepare release notes" }],
              },
            ],
          },
        ],
      },
      {
        type: "orderedList",
        attrs: { start: 1 },
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  { type: "text", text: "Ship beta to internal users" },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  { type: "text", text: "Collect feedback and iterate" },
                ],
              },
            ],
          },
        ],
      },
    ]),
  },
  {
    id: "technical-note",
    label: "Technical",
    description: "Rich structure with quote and code block",
    content: doc([
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "TipTap rendering note" }],
      },
      {
        type: "blockquote",
        content: [
          {
            type: "paragraph",
            content: [
              { type: "text", text: "Keep content serializable as JSON." },
            ],
          },
        ],
      },
      {
        type: "codeBlock",
        attrs: { language: "ts" },
        content: [
          {
            type: "text",
            text: "const content = JSON.stringify(editor.getJSON());",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "This format is perfect for previews and structured storage.",
          },
        ],
      },
    ]),
  },
];

const initialDemoNotes: SelectNote[] = [
  {
    id: "demo-note-1",
    title: "Morning planning",
    content: doc([
      {
        type: "paragraph",
        content: [{ type: "text", text: "Top 3 priorities for today:" }],
      },
      {
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "Refactor notes query layer" }],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  { type: "text", text: "Polish landing interactions" },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "Write release checklist" }],
              },
            ],
          },
        ],
      },
    ]),
    notebookId: null,
    importance: "High",
    color: null,
    isFavorite: true,
    createdById: "demo-user",
    createdAt: new Date("2026-02-10T08:20:00Z"),
    updatedAt: new Date("2026-02-10T08:20:00Z"),
    tags: ["Planning", "Work"],
    notebook: "Personal Ops",
    images: [],
  },
  {
    id: "demo-note-2",
    title: "Design critique",
    content: doc([
      {
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: "Homepage feedback" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            marks: [{ type: "bold" }],
            text: "What works:",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Visual hierarchy is clearer and CTA path feels intentional.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            marks: [{ type: "italic" }],
            text: "Next: tighten spacing rhythm in mobile hero.",
          },
        ],
      },
    ]),
    notebookId: null,
    importance: "Medium",
    color: null,
    isFavorite: false,
    createdById: "demo-user",
    createdAt: new Date("2026-02-11T13:45:00Z"),
    updatedAt: new Date("2026-02-11T13:45:00Z"),
    tags: ["Design", "Review"],
    notebook: "Product",
    images: [],
  },
  {
    id: "demo-note-3",
    title: "Architecture decisions",
    content: doc([
      {
        type: "paragraph",
        content: [{ type: "text", text: "Decision log" }],
      },
      {
        type: "orderedList",
        attrs: { start: 1 },
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  { type: "text", text: "Use Motion for all feature reveals" },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Keep note previews powered by TipTap",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "codeBlock",
        attrs: { language: "tsx" },
        content: [
          {
            type: "text",
            text: "<Composer defaultContent={json} editable={false} />",
          },
        ],
      },
    ]),
    notebookId: null,
    importance: "Low",
    color: null,
    isFavorite: true,
    createdById: "demo-user",
    createdAt: new Date("2026-02-12T17:10:00Z"),
    updatedAt: new Date("2026-02-12T17:10:00Z"),
    tags: ["Engineering", "Docs"],
    notebook: "Tech Notes",
    images: [],
  },
];

const noteRotations = [
  "rotate-[-1.4deg]",
  "rotate-[1.2deg]",
  "rotate-[-0.9deg]",
  "rotate-[1.5deg]",
] as const;

export default function DemoMuralDialog({
  open,
  onOpenChange,
}: DemoMuralDialogProps) {
  const [activeTemplateId, setActiveTemplateId] = useState(
    composerTemplates[0]!.id,
  );
  const [snapshotJson, setSnapshotJson] = useState<string | null>(null);
  const [demoNotes, setDemoNotes] = useState<SelectNote[]>(initialDemoNotes);

  const activeTemplate = useMemo(
    () =>
      composerTemplates.find((template) => template.id === activeTemplateId) ??
      composerTemplates[0]!,
    [activeTemplateId],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[92vh] max-w-[min(1300px,96vw)] gap-0 overflow-hidden border-border/60 p-0 md:rounded-2xl">
        <DialogHeader className="border-b border-border/60 bg-card/65 px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <WandSparkles className="h-5 w-5 text-note-lavender-text" />
            Demo Mural
          </DialogTitle>
          <DialogDescription className="max-w-3xl text-sm">
            Explore realistic note cards and experiment with a live TipTap
            composer. This playground mirrors how Blohsh Notes handles simple
            and structured rich-text content.
          </DialogDescription>
        </DialogHeader>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[1.45fr_0.95fr]">
          <section className="relative min-h-0 overflow-auto border-b border-border/60 p-5 md:p-6 lg:border-b-0 lg:border-r">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,hsl(var(--note-lavender)_/_0.16),transparent_45%),radial-gradient(circle_at_100%_100%,hsl(var(--note-sky)_/_0.14),transparent_48%)]" />
            <div className="relative mb-4 flex flex-wrap items-center gap-2">
              <Badge className="bg-note-lavender/70 text-note-lavender-text">
                Sample Note Cards
              </Badge>
              <Badge variant="secondary" className="bg-card/80">
                Built with the real `Note` component
              </Badge>
            </div>

            <div className="relative grid grid-cols-1 gap-4 md:grid-cols-2">
              {demoNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{
                    opacity: 0,
                    transform: "translateY(20px) scale(0.985)",
                  }}
                  animate={{
                    opacity: 1,
                    transform: "translateY(0px) scale(1)",
                  }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                  // className="row-span-2"
                >
                  <div
                    className={cn(
                      "transition-transform duration-300 ease-out hover:rotate-0",
                      noteRotations[index % noteRotations.length],
                    )}
                  >
                    <DemoNote
                      note={note}
                      className="row-span-2 grid grid-rows-subgrid gap-0"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="min-h-0 overflow-auto p-5 md:p-6">
            <Card className="liquid-glass rounded-xl border-border/70">
              <CardHeader className="space-y-3">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sparkles className="h-4.5 w-4.5 text-note-sky-text" />
                  Composer Playground
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Switch templates and try rich text editing with StarterKit +
                  alignment controls.
                </p>
              </CardHeader>

              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  {composerTemplates.map((template) => (
                    <Button
                      key={template.id}
                      size="sm"
                      variant={
                        template.id === activeTemplate.id
                          ? "default"
                          : "outline"
                      }
                      className={cn(
                        "h-8 rounded-full px-3 text-xs",
                        template.id === activeTemplate.id &&
                          "bg-note-lavender text-note-lavender-text hover:bg-note-lavender/80",
                      )}
                      onClick={() => setActiveTemplateId(template.id)}
                    >
                      {template.label}
                    </Button>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground">
                  {activeTemplate.description}
                </p>

                <Composer
                  key={activeTemplate.id}
                  defaultContent={activeTemplate.content}
                >
                  <div className="sticky top-0 z-10 mb-2">
                    <ComposerCommonButtons />
                  </div>
                  <div className="min-h-[260px]">
                    <ComposerEditor />
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                      Save to inspect the JSON payload.
                    </p>
                    <ComposerSaveContentButton
                      size="sm"
                      onSave={(content) => {
                        setSnapshotJson(content);
                        setDemoNotes([
                          {
                            id: `demo-note-${demoNotes.length + 1}`,
                            title: `Note ${demoNotes.length + 1}`,
                            content: content,
                            notebookId: null,
                            importance: "Medium",
                            color: null,
                            isFavorite: false,
                            createdById: "demo-user",
                            createdAt: new Date(),
                            updatedAt: new Date(),
                          },
                          ...demoNotes,
                        ]);
                      }}
                    >
                      Capture snapshot
                    </ComposerSaveContentButton>
                  </div>
                </Composer>

                {snapshotJson ? (
                  <div className="rounded-xl border border-border/70 bg-card/65 p-3">
                    <p className="mb-2 text-xs font-semibold text-muted-foreground">
                      Latest JSON snapshot
                    </p>
                    <pre className="max-h-36 overflow-auto whitespace-pre-wrap text-[11px] text-foreground/80">
                      {snapshotJson}
                    </pre>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
