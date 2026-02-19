"use client";
import { useMemo } from "react";
import {
  useEditor,
  EditorContent,
  EditorContext,
  type Editor,
  type ChainedCommands,
  useCurrentEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { Button, type ButtonProps } from "./ui/button";
import {
  AlignLeft,
  AlignCenter,
  Bold,
  Italic,
  Strikethrough,
  Underline,
  AlignRight,
  AlignJustify,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { useTiptapEditor } from "~/hooks/useTiptapEditor";
import { isExtensionAvailable, isNodeTypeSelected } from "~/lib/tip-tap.utils";

const Composer = ({
  children,
  defaultContent = "<p>Hello World! 🌎️</p>",
  editable = true,
}: {
  children: React.ReactNode;
  defaultContent?: string;
  editable?: boolean;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: (() => {
      try {
        const parsed: unknown = JSON.parse(defaultContent);
        if (typeof parsed === "object" && parsed !== null && "type" in parsed) {
          return parsed as Record<string, unknown>;
        }
        return defaultContent;
      } catch {
        return defaultContent;
      }
    })(),
    editable,
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,

    editorProps: {
      attributes: {
        class: editable
          ? "prose prose-sm sm:prose-base md:prose-md max-w-none text-foreground bg-input/30 rounded-lg p-4 border border-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
          : "prose prose-sm max-w-none text-foreground focus:outline-none",
        "aria-label": "Main content area, start typing to enter text.",
      },
    },
  });

  const providerValue = useMemo(
    () => ({
      editor,
    }),
    [editor],
  );

  return (
    <EditorContext.Provider value={providerValue}>
      {children}
    </EditorContext.Provider>
  );
};

export default Composer;

/**
 * Renders the Tiptap EditorContent. Must be used inside a <Composer>.
 * Place it anywhere in the children tree to control where the editor appears.
 */
export const ComposerEditor = () => {
  const { editor } = useCurrentEditor();
  return <EditorContent editor={editor} role="presentation" />;
};

const composerButtonActiveStyles = cn(
  "data-[active=true]:bg-primary/15 data-[active=true]:dark:bg-primary/20",
  "data-[active=true]:hover:bg-accent data-[active=true]:dark:hover:bg-accent",
);

type Mark = "bold" | "italic" | "underline" | "strike";

/**
 * Checks if a mark is currently active
 */
export function isMarkActive(editor: Editor | null, type: Mark): boolean {
  if (!editor?.isEditable) return false;
  return editor.isActive(type);
}

/**
 * Toggles a mark in the editor
 */
export function toggleMark(editor: Editor | null, type: Mark): boolean {
  if (!editor?.isEditable) return false;

  return editor.chain().focus().toggleMark(type).run();
}

const markIcons = {
  bold: Bold,
  italic: Italic,
  underline: Underline,
  strike: Strikethrough,
};

const ComposerMarkButton = ({ type }: { type: Mark }) => {
  const { editor } = useTiptapEditor();
  const isActive = isMarkActive(editor, type);
  const handleMark = () => toggleMark(editor, type);
  const canToggle = editor?.can().toggleMark(type);

  const Icon = markIcons[type];

  return (
    <Button
      disabled={!canToggle}
      variant="ghost"
      size="sm"
      className={cn("h-8 w-8 p-0", composerButtonActiveStyles)}
      data-active={isActive}
      aria-pressed={isActive}
      onClick={handleMark}
    >
      <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
    </Button>
  );
};

const textAlignIcons = {
  left: AlignLeft,
  center: AlignCenter,
  right: AlignRight,
  justify: AlignJustify,
};

const textAlignLabels: Record<TextAlign, string> = {
  left: "Align left",
  center: "Align center",
  right: "Align right",
  justify: "Align justify",
};

/**
 * Checks if the text alignment is currently active
 */
export function isTextAlignActive(
  editor: Editor | null,
  align: TextAlign,
): boolean {
  if (!editor?.isEditable) return false;
  return editor.isActive({ textAlign: align });
}

/**
 * Checks if text alignment can be performed in the current editor state
 */
export function canSetTextAlign(
  editor: Editor | null,
  align: TextAlign,
): boolean {
  if (!editor?.isEditable) return false;
  if (
    !isExtensionAvailable(editor, "textAlign") ||
    isNodeTypeSelected(editor, ["image", "horizontalRule"])
  )
    return false;

  return editor.can().setTextAlign(align);
}

export function hasSetTextAlign(
  commands: ChainedCommands,
): commands is ChainedCommands & {
  setTextAlign: (align: TextAlign) => ChainedCommands;
} {
  return "setTextAlign" in commands;
}

/**
 * Sets text alignment in the editor
 */
export function setTextAlign(editor: Editor | null, align: TextAlign): boolean {
  if (!editor?.isEditable) return false;
  if (!canSetTextAlign(editor, align)) return false;

  const chain = editor.chain().focus();
  if (hasSetTextAlign(chain)) {
    return chain.setTextAlign(align).run();
  }

  return false;
}

export type TextAlign = "left" | "center" | "right" | "justify";

const ComposerTextAlignButton = ({ align }: { align: TextAlign }) => {
  const { editor } = useTiptapEditor();
  const isActive = isTextAlignActive(editor, align);
  const canSet = canSetTextAlign(editor, align);
  const handleTextAlign = () => setTextAlign(editor, align);
  const Icon = textAlignIcons[align];
  return (
    <Button
      disabled={!canSet}
      variant="ghost"
      size="sm"
      className={cn("h-8 w-8 p-0", composerButtonActiveStyles)}
      data-active={isActive}
      aria-pressed={isActive}
      onClick={handleTextAlign}
      aria-label={textAlignLabels[align]}
    >
      <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
    </Button>
  );
};

export const ComposerCommonButtons = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="liquid-glass flex items-center gap-0.5 rounded-xl p-1.5">
        <ComposerMarkButton type="bold" />
        <ComposerMarkButton type="italic" />
        <ComposerMarkButton type="underline" />
        <ComposerMarkButton type="strike" />
        <div className="mx-1 h-6 w-px bg-foreground/15" />
        <ComposerTextAlignButton align="left" />
        <ComposerTextAlignButton align="center" />
        <ComposerTextAlignButton align="right" />
        <ComposerTextAlignButton align="justify" />
      </div>
    </div>
  );
};

export const ComposerSaveContentButton = ({
  children,
  onSave,
  disabled: externalDisabled,
  ...buttonProps
}: Omit<ButtonProps, "onClick"> & {
  onSave?: (content: string) => void;
}) => {
  const { editor, editorState } = useTiptapEditor();

  const handleSave = () => {
    if (!editor) return;
    const content = JSON.stringify(editor.getJSON());
    onSave?.(content);
  };

  const canSave =
    editor?.isEditable &&
    editorState?.doc.textContent &&
    editorState.doc.textContent.length > 0;

  return (
    <Button
      {...buttonProps}
      onClick={handleSave}
      disabled={externalDisabled ? externalDisabled : !canSave}
    >
      {children}
    </Button>
  );
};
