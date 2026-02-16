"use client";

import { useState, useEffect } from "react";
import {
  X,
  MoreHorizontal,
  ScrollText,
  BookOpen,
  Tag,
  AlertCircle,
  Download,
  Trash2Icon,
  Loader2,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import {
  NotionTagSelect,
  ImportanceSelect,
} from "~/components/ui/notion-tag-select";
import { type SelectTag, type Importance } from "~/server/db/schema";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "~/components/ui/sidebar";
import { Skeleton } from "~/components/ui/skeleton";
import { type SelectNote } from "~/server/db/schema";
import Image from "next/image";
import { deleteImage, editTodo } from "~/server/mutations";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import NoteSideBarMobile from "./NoteSideBarMobile";
import { useMediaQuery } from "~/hooks/use-media-query";
import Viewer from "./Viewer";
import Composer, {
  ComposerCommonButtons,
  ComposerEditor,
  ComposerSaveContentButton,
} from "./Composer";

interface NoteSideBarProps {
  isOpen: boolean;
  handleOpenChanges: (open: boolean) => void;
  tags?: SelectTag[];
  note?: SelectNote &
    Partial<{
      notebook?: string;
      tags?: string[];
      importance?: "High" | "Medium" | "Low";
      attachments?: Array<{
        id: string;
        name: string;
        size: string;
        type: string;
      }>;
    }>;
  isLoading?: boolean;
}

export default function NoteSideBar({
  isOpen,
  handleOpenChanges,
  note,
  isLoading = false,
  tags = [],
}: NoteSideBarProps) {
  const queryClient = useQueryClient();
  const notebook = note?.notebook ?? null;

  const attachments = note?.images ?? [];

  const [title, setTitle] = useState(note?.title ?? "");
  const [editableTags, setEditableTags] = useState<string[]>(note?.tags ?? []);
  const [editableImportance, setEditableImportance] = useState<Importance>(
    note?.importance ?? "Medium",
  );
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

  // Viewer state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

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
          queryKey: ["noteToEdit", note?.id],
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
        queryKey: ["noteToEdit", note?.id],
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

  const isMobile = useMediaQuery("(max-width: 1023px)");

  if (isMobile) {
    return (
      <NoteSideBarMobile
        isOpen={isOpen}
        handleOpenChanges={handleOpenChanges}
        note={note}
        isLoading={isLoading}
        tags={tags ?? []}
      />
    );
  }

  return (
    <Sidebar
      collapsible="none"
      className="sticky top-0 hidden h-svh overflow-hidden border-l transition-[width] duration-200 ease-out data-[open=false]:w-0 lg:flex"
      style={
        {
          "--sidebar-width": "24rem",
        } as React.CSSProperties
      }
      data-open={isOpen}
    >
      <SidebarHeader>
        <div className="flex items-center justify-between p-2">
          <h2 className="text-lg font-semibold">Edit note</h2>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleOpenChanges(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Note Title */}
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="flex items-center gap-2">
              <ScrollText className="h-5 w-5" />
              {isLoading ? (
                <Skeleton className="h-7 flex-1" />
              ) : (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-7 bg-sidebar-accent text-lg font-medium"
                  placeholder="Note title"
                />
              )}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Text Editor */}
        <SidebarGroup className="pt-0">
          <SidebarGroupContent className="flex max-h-[410px] flex-col rounded-md">
            {isLoading ? (
              <div className="h-full rounded-md bg-sidebar-accent">
                <Skeleton className="h-full w-full" />
              </div>
            ) : (
              <Composer key={note?.id} defaultContent={note?.content ?? ""}>
                <div className="sticky top-0 z-10 -mb-2">
                  <ComposerCommonButtons />
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto p-1">
                  <ComposerEditor />
                </div>
                <div className="mt-3">
                  <ComposerSaveContentButton
                    size="sm"
                    onSave={(content) => {
                      editNoteMutation.mutate({
                        title,
                        content,
                        id: note?.id ?? "",
                        importance: editableImportance,
                        tags: editableTags,
                      });
                    }}
                    disabled={isLoading || editNoteMutation.isPending}
                  >
                    {editNoteMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save"
                    )}
                  </ComposerSaveContentButton>
                </div>
              </Composer>
            )}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Metadata */}
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="space-y-4">
              {/* Notebook (read-only for now) */}
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 shrink-0" />
                <span className="text-sm text-sidebar-foreground">
                  Notebook:
                </span>
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

              {/* Editable Tags */}
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
                      onChange={setEditableTags}
                      placeholder="Add tags..."
                      options={tags.map((tag) => ({
                        id: tag.id,
                        label: tag.name,
                        value: tag.name,
                      }))}
                    />
                  </div>
                )}
              </div>

              {/* Editable Importance */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span className="text-sm text-sidebar-foreground">
                    Importance:
                  </span>
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
                      onChange={setEditableImportance}
                    />
                  </div>
                )}
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            {/* Attachments */}

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
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex flex-1 basis-1/2 items-stretch gap-3 overflow-hidden rounded-lg bg-secondary"
                  >
                    {deletingImageId === attachment.id ? (
                      <Skeleton className="h-20 w-full" />
                    ) : (
                      <>
                        <button
                          type="button"
                          className="relative h-20 w-20 cursor-pointer overflow-hidden focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          onClick={() =>
                            openViewer(attachments.indexOf(attachment))
                          }
                          aria-label={`View ${attachment.altText ?? "image"}`}
                        >
                          <Image
                            src={attachment.imageSrc ?? ""}
                            alt={attachment.altText ?? ""}
                            width={100}
                            height={100}
                            className="aspect-square object-cover object-center transition-transform duration-300 ease-in-out hover:scale-110"
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
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => {
                                deleteImageMutation.mutate({
                                  id: attachment.id,
                                  key: attachment.key ?? "",
                                });
                              }}
                              disabled={deleteImageMutation.isPending}
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
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Image Viewer */}
      <Viewer
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        images={attachments}
        index={viewerIndex}
        onIndexChange={setViewerIndex}
      />
    </Sidebar>
  );
}
