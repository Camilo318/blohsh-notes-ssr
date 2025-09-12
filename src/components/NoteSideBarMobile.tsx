"use client";

import { useState, useEffect } from "react";
import {
  X,
  MoreHorizontal,
  ScrollText,
  BookOpen,
  Tag,
  AlertCircle,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Smile,
  Download,
  Trash2Icon,
  Loader2,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Badge } from "~/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "~/components/ui/drawer";
import { Skeleton } from "~/components/ui/skeleton";
import { type SelectNote } from "~/server/db/schema";
import Image from "next/image";
import { deleteImage, editTodo } from "~/server/mutations";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface NoteSideBarMobileProps {
  isOpen: boolean;
  handleOpenChanges: (open: boolean) => void;
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

export default function NoteSideBarMobile({
  isOpen,
  handleOpenChanges,
  note,
  isLoading = false,
}: NoteSideBarMobileProps) {
  const queryClient = useQueryClient();
  const [notebook] = useState(note?.notebook ?? "Essays");
  const [tags] = useState(note?.tags ?? ["University", "Literature"]);
  const [importance] = useState<"High" | "Medium" | "Low">(
    note?.importance ?? "High",
  );

  const attachments = note?.images ?? [];

  const [title, setTitle] = useState(note?.title ?? "Northanger Abbey essay");
  const [content, setContent] = useState(note?.content ?? "");

  useEffect(() => {
    setTitle(note?.title ?? "");
    setContent(note?.content ?? "");
  }, [note?.title, note?.content]);

  const editNoteMutation = useMutation({
    mutationFn: editTodo,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["noteToEdit", note?.id],
      });
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
    onSettled: () => {
      handleOpenChanges(false);
    },
  });

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChanges}>
      <DrawerContent className="h-[85vh]">
        <DrawerHeader className="pb-2">
          <div className="flex items-center justify-between">
            <DrawerTitle>Edit note</DrawerTitle>
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
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {/* Note Title */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <ScrollText className="size-5" />
              {isLoading ? (
                <Skeleton className="h-7 flex-1" />
              ) : (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-7 border-0 text-lg font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="Note title"
                />
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="mb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="text-sidebar-foreground text-sm">
                  Notebook:
                </span>
                {isLoading ? (
                  <Skeleton className="h-6 w-20" />
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    {notebook}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 overflow-hidden">
                <Tag className="h-4 w-4" />
                <span className="text-sidebar-foreground text-sm">Tags:</span>
                {isLoading ? (
                  <div className="flex gap-1">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                ) : (
                  <div className="flex gap-1">
                    {tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sidebar-foreground text-sm">
                  Importance:
                </span>
                {isLoading ? (
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-2 w-2 rounded-full" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="text-sm font-medium">{importance}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Text Editor */}
          <div className="mb-6">
            {/* Formatting Toolbar */}
            <div className="mb-2 flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Underline className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Strikethrough className="h-4 w-4" />
              </Button>
              <div className="mx-1 h-6 w-px bg-gray-300" />
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <AlignRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <AlignJustify className="h-4 w-4" />
              </Button>
            </div>

            {/* Text Area */}
            <div className="flex-1">
              {isLoading ? (
                <div className="bg-sidebar-accent min-h-72 rounded-md p-3">
                  <Skeleton className="h-full w-full" />
                </div>
              ) : (
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="bg-sidebar-accent min-h-72 resize-none rounded-b-none border-0 text-sm leading-relaxed focus-visible:ring-0"
                  placeholder="Start writing your note..."
                />
              )}
              {/* Actions */}
              <div className="bg-sidebar-accent flex items-center justify-between rounded-b-md p-3">
                <Button
                  size="sm"
                  onClick={() => {
                    editNoteMutation.mutate({
                      title,
                      content,
                      id: note?.id ?? "",
                    });
                  }}
                  disabled={isLoading || editNoteMutation.isPending}
                >
                  {editNoteMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div>
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
                    className="flex flex-1 basis-1/2 items-start gap-3 overflow-hidden rounded-lg bg-secondary p-2"
                  >
                    <div className="relative -my-2 -ml-2 h-20 w-20 self-stretch overflow-hidden">
                      <Image
                        src={attachment.imageSrc ?? ""}
                        alt={attachment.altText ?? ""}
                        width={100}
                        height={100}
                        className="aspect-square object-cover object-center transition-transform duration-300 ease-in-out hover:scale-110"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {attachment.altText}
                      </p>
                      <p className="text-foreground-accent text-xs">
                        {attachment.contentType}
                      </p>
                    </div>

                    <div className="flex flex-col-reverse justify-between gap-2 self-stretch">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={async () => {
                          await deleteImage(
                            attachment.id,
                            attachment.key ?? "",
                          );
                          await queryClient.invalidateQueries({
                            queryKey: ["noteToEdit", note?.id],
                          });
                        }}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
