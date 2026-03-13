"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AlertCircle,
  BookOpen,
  Download,
  Loader2,
  MoreHorizontal,
  ScrollText,
  Tag,
  Trash2Icon,
  X,
} from "lucide-react";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  ImportanceSelect,
  NotionTagSelect,
} from "~/components/ui/notion-tag-select";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { useDebouncedCallback } from "~/hooks/useDebouncedCallback";
import { type Importance, type SelectNote, type SelectTag } from "~/server/db/schema";
import { deleteImage, editTodo } from "~/server/mutations";
import Composer, { ComposerCommonButtons, ComposerEditor } from "./Composer";
import Viewer from "./Viewer";

export type NoteSidebarNote = SelectNote &
  Partial<{
    notebook?: string;
    tags?: string[];
    importance?: Importance;
    attachments?: Array<{
      id: string;
      name: string;
      size: string;
      type: string;
    }>;
  }>;

type SaveNoteArgs = Omit<Partial<Parameters<typeof editTodo>[number]>, "id">;
type NoteAttachment = NonNullable<NoteSidebarNote["images"]>[number];

interface NoteSidebarContextValue {
  noteId?: string;
  defaultContent: string;
  isLoading: boolean;
  tags: SelectTag[];
  notebook: string | null;
  attachments: NoteAttachment[];
  title: string;
  editableTags: string[];
  editableImportance: Importance;
  deletingImageId: string | null;
  isSaving: boolean;
  isDeletingImage: boolean;
  viewerOpen: boolean;
  viewerIndex: number;
  updateTitle: (nextTitle: string) => void;
  updateContent: (content: string) => void;
  updateTags: (nextTags: string[]) => void;
  updateImportance: (importance: Importance) => void;
  openViewer: (index: number) => void;
  setViewerOpen: (open: boolean) => void;
  setViewerIndex: (index: number) => void;
  removeAttachment: (attachment: NoteAttachment) => void;
}

const NoteSidebarContext = createContext<NoteSidebarContextValue | null>(null);

export function NoteSidebarProvider({
  note,
  tags = [],
  isLoading = false,
  children,
}: {
  note?: NoteSidebarNote;
  tags?: SelectTag[];
  isLoading?: boolean;
  children: ReactNode;
}) {
  const queryClient = useQueryClient();
  const noteId = note?.id;

  const [title, setTitle] = useState(note?.title ?? "");
  const [editableTags, setEditableTags] = useState<string[]>(note?.tags ?? []);
  const [editableImportance, setEditableImportance] = useState<Importance>(
    note?.importance ?? "Medium",
  );
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  useEffect(() => {
    setTitle(note?.title ?? "");
    setEditableTags(note?.tags ?? []);
    setEditableImportance(note?.importance ?? "Medium");
  }, [note?.title, note?.tags, note?.importance]);

  const editNoteMutation = useMutation({
    mutationFn: editTodo,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["noteToEdit", noteId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["notes-grouped-by-tag"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["tags"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["notes"],
        }),
      ]);
      toast.success("Note saved successfully", {
        description: "Your changes have been saved.",
        position: "top-center",
      });
    },
    onError: (error) => {
      console.error("Failed to save note:", error);
      toast.error("Failed to save note", {
        description:
          "There was an error saving your changes. Please try again.",
      });
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: ({ id, key }: { id: string; key: string }) =>
      deleteImage(id, key),
    onMutate: ({ id }) => {
      setDeletingImageId(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["noteToEdit", noteId],
      });
      toast.success("Image deleted successfully", {
        description: "The image has been removed from your note.",
      });
    },
    onError: (error) => {
      console.error("Failed to delete image:", error);
      toast.error("Failed to delete image", {
        description: "There was an error deleting the image. Please try again.",
      });
    },
    onSettled: () => {
      setDeletingImageId(null);
    },
  });

  const saveNote = useDebouncedCallback(
    (args: SaveNoteArgs) => {
      if (!noteId) return;
      editNoteMutation.mutate({ ...args, id: noteId });
    },
    1000,
  );

  const updateTitle = useCallback(
    (nextTitle: string) => {
      setTitle(nextTitle);
      saveNote({ title: nextTitle });
    },
    [saveNote],
  );

  const updateContent = useCallback(
    (content: string) => {
      saveNote({ content });
    },
    [saveNote],
  );

  const updateTags = useCallback(
    (nextTags: string[]) => {
      setEditableTags(nextTags);
      saveNote({ tags: nextTags });
    },
    [saveNote],
  );

  const updateImportance = useCallback(
    (importance: Importance) => {
      setEditableImportance(importance);
      saveNote({ importance });
    },
    [saveNote],
  );

  const openViewer = useCallback((index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  }, []);

  const removeAttachment = useCallback(
    (attachment: NoteAttachment) => {
      deleteImageMutation.mutate({
        id: attachment.id,
        key: attachment.key ?? "",
      });
    },
    [deleteImageMutation],
  );

  const value = useMemo<NoteSidebarContextValue>(
    () => ({
      noteId,
      defaultContent: note?.content ?? "",
      isLoading,
      tags,
      notebook: note?.notebook ?? null,
      attachments: note?.images ?? [],
      title,
      editableTags,
      editableImportance,
      deletingImageId,
      isSaving: editNoteMutation.isPending,
      isDeletingImage: deleteImageMutation.isPending,
      viewerOpen,
      viewerIndex,
      updateTitle,
      updateContent,
      updateTags,
      updateImportance,
      openViewer,
      setViewerOpen,
      setViewerIndex,
      removeAttachment,
    }),
    [
      noteId,
      note?.content,
      note?.notebook,
      note?.images,
      isLoading,
      tags,
      title,
      editableTags,
      editableImportance,
      deletingImageId,
      editNoteMutation.isPending,
      deleteImageMutation.isPending,
      viewerOpen,
      viewerIndex,
      updateTitle,
      updateContent,
      updateTags,
      updateImportance,
      openViewer,
      removeAttachment,
    ],
  );

  return (
    <NoteSidebarContext.Provider value={value}>
      {children}
    </NoteSidebarContext.Provider>
  );
}

export function useNoteSidebar() {
  const context = useContext(NoteSidebarContext);
  if (!context) {
    throw new Error("useNoteSidebar must be used within NoteSidebarProvider");
  }
  return context;
}

export function NoteSidebarHeaderActions({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function NoteSidebarTitleSection() {
  const { isLoading, title, updateTitle } = useNoteSidebar();

  return (
    <div className="flex items-center gap-2">
      <ScrollText className="h-5 w-5" />
      {isLoading ? (
        <Skeleton className="h-7 flex-1" />
      ) : (
        <Input
          value={title}
          onChange={(event) => updateTitle(event.target.value)}
          className="h-7 bg-sidebar-accent text-lg font-medium"
          placeholder="Note title"
        />
      )}
    </div>
  );
}

export function NoteSidebarEditorSection({
  className,
  editorClassName,
}: {
  className?: string;
  editorClassName?: string;
}) {
  const { defaultContent, isLoading, isSaving, noteId, updateContent } =
    useNoteSidebar();

  return (
    <div className={cn("flex flex-col rounded-md", className)}>
      {isLoading ? (
        <div className="h-full rounded-md bg-sidebar-accent">
          <Skeleton className="h-full w-full" />
        </div>
      ) : (
        <Composer
          key={noteId}
          defaultContent={defaultContent}
          onUpdate={updateContent}
        >
          <div className="sticky top-0 z-10 -mb-2">
            <ComposerCommonButtons />
          </div>
          <div className={cn("flex-1 p-1", editorClassName)}>
            <ComposerEditor />
          </div>
          <div className="mt-3">
            {isSaving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">
                Autosave ON: Changes are saved automatically.
              </span>
            )}
          </div>
        </Composer>
      )}
    </div>
  );
}

export function NoteSidebarMetadataSection() {
  const {
    editableImportance,
    editableTags,
    isLoading,
    notebook,
    tags,
    updateImportance,
    updateTags,
  } = useNoteSidebar();

  const tagOptions = useMemo(
    () =>
      tags.map((tag) => ({
        id: tag.id,
        label: tag.name,
        value: tag.name,
      })),
    [tags],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 shrink-0" />
        <span className="text-sm text-sidebar-foreground">Notebook:</span>
        {isLoading ? (
          <Skeleton className="h-6 w-20" />
        ) : notebook ? (
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
          >
            {notebook}
          </Badge>
        ) : (
          <span className="text-sm text-muted-foreground">None</span>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 shrink-0" />
          <span className="text-sm text-sidebar-foreground">Tags:</span>
        </div>
        {isLoading ? (
          <div className="flex min-w-0 gap-1 pl-6">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
        ) : (
          <div className="pl-6">
            <NotionTagSelect
              value={editableTags}
              onChange={updateTags}
              placeholder="Add tags..."
              options={tagOptions}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="text-sm text-sidebar-foreground">Importance:</span>
        </div>
        {isLoading ? (
          <div className="flex items-center gap-1 pl-6">
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-7 w-16" />
          </div>
        ) : (
          <div className="pl-6">
            <ImportanceSelect
              value={editableImportance}
              onChange={updateImportance}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function NoteSidebarAttachmentsSection() {
  const {
    attachments,
    deletingImageId,
    isDeletingImage,
    isLoading,
    openViewer,
    removeAttachment,
  } = useNoteSidebar();

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium">
          Attachments ({isLoading ? 0 : attachments.length})
        </span>
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0 text-accent-foreground"
          disabled={isLoading}
        >
          Download all
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          {attachments.map((attachment, index) => (
            <div
              key={attachment.id}
              className="flex flex-1 basis-1/2 items-stretch gap-3 overflow-hidden rounded-lg bg-secondary"
            >
              {deletingImageId === attachment.id ? (
                <Skeleton className="h-20 w-full rounded-lg" />
              ) : (
                <>
                  <button
                    type="button"
                    className="group/image-button relative h-20 w-20 cursor-pointer overflow-hidden focus:outline-none"
                    onClick={() => openViewer(index)}
                    aria-label={`View ${attachment.altText ?? "image"}`}
                  >
                    <Image
                      src={attachment.imageSrc ?? ""}
                      alt={attachment.altText ?? ""}
                      width={100}
                      height={100}
                      className="aspect-square object-cover object-center transition-transform duration-300 ease-out will-change-transform hover:scale-110 group-active/image-button:scale-100"
                    />
                  </button>

                  <div className="flex min-w-0 flex-1 gap-3 p-2 pl-0">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {attachment.altText}
                      </p>
                      <p className="text-foreground-accent text-xs">
                        {attachment.contentType}
                      </p>
                    </div>

                    <div className="flex flex-col-reverse justify-between gap-2">
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeAttachment(attachment)}
                        disabled={isDeletingImage}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export function NoteSidebarViewer() {
  const { attachments, setViewerIndex, setViewerOpen, viewerIndex, viewerOpen } =
    useNoteSidebar();

  return (
    <Viewer
      open={viewerOpen}
      onOpenChange={setViewerOpen}
      images={attachments}
      index={viewerIndex}
      onIndexChange={setViewerIndex}
    />
  );
}
