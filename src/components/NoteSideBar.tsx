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
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Badge } from "~/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";
import { type SelectNote } from "~/server/db/schema";
import Image from "next/image";
import { deleteImage, editTodo } from "~/server/mutations";

interface NoteSideBarProps {
  isOpen: boolean;
  onClose: () => void;
  note?: SelectNote & {
    notebook?: string;
    tags?: string[];
    importance?: "High" | "Medium" | "Low";
    attachments?: Array<{
      id: string;
      name: string;
      size: string;
      type: string;
    }>;
  };
  setNoteToEdit: (noteToEdit: SelectNote | null) => void;
}

export default function NoteSideBar({
  isOpen,
  onClose,
  note,
  setNoteToEdit,
}: NoteSideBarProps) {
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

  return (
    <Sidebar
      collapsible="none"
      className="sticky top-0 hidden h-svh border-l transition-[width] duration-200 ease-linear data-[open=false]:w-0 lg:flex"
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
              onClick={onClose}
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
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-0 text-lg font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Note title"
              />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Metadata */}
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="text-sidebar-foreground text-sm">
                  Notebook:
                </span>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  {notebook}
                </Badge>
              </div>

              <div className="flex items-center gap-2 overflow-hidden">
                <Tag className="h-4 w-4" />
                <span className="text-sidebar-foreground text-sm">Tags:</span>
                <div className="flex gap-1">
                  {tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className={cn(
                        "text-xs",
                        index === 0 && "bg-amber-100 text-amber-800",
                        index === 1 && "bg-blue-100 text-blue-800",
                      )}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sidebar-foreground text-sm">
                  Importance:
                </span>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-sm font-medium">{importance}</span>
                </div>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Text Editor */}
        <SidebarGroup>
          <SidebarGroupContent>
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
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-sidebar-accent min-h-72 resize-none rounded-b-none border-0 text-sm leading-relaxed focus-visible:ring-0"
                placeholder="Start writing your note..."
              />
              {/* Actions */}
              <div className="bg-sidebar-accent flex items-center justify-between rounded-b-md p-3">
                <Button
                  size="sm"
                  onClick={async () => {
                    const updatedNote = await editTodo({
                      title,
                      content,
                      id: note?.id ?? "",
                    });
                    setNoteToEdit(updatedNote ?? null);
                    // onClose();
                  }}
                >
                  Save
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            {/* Attachments */}

            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium">
                Attachments ({attachments.length})
              </span>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-accent-foreground"
              >
                Download all
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex flex-1 basis-1/2 items-start gap-3 overflow-hidden rounded-lg bg-secondary p-2"
                >
                  <Image
                    src={attachment.imageSrc ?? ""}
                    alt={attachment.altText ?? ""}
                    width={80}
                    height={80}
                    className="-my-2 -ml-2 aspect-square self-stretch object-cover"
                  />
                  {/* <FileImage className="h-4 w-4 text-foreground" /> */}

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
                      onClick={() =>
                        deleteImage(attachment.id, attachment.key ?? "")
                      }
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
