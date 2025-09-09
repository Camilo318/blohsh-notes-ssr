"use client";

import { useState } from "react";
import {
  X,
  MoreHorizontal,
  ScrollText,
  BookOpen,
  Tag,
  AlertCircle,
  Zap,
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
  FileImage,
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

interface NoteSideBarProps {
  isOpen: boolean;
  onClose: () => void;
  note?: {
    id: string;
    title: string;
    content: string;
    notebook?: string;
    tags?: string[];
    importance?: "High" | "Medium" | "Low";
    status?: "In progress" | "Completed" | "Draft";
    attachments?: Array<{
      id: string;
      name: string;
      size: string;
      type: string;
    }>;
  };
}

export default function NoteSideBar({
  isOpen,
  onClose,
  note,
}: NoteSideBarProps) {
  const [title, setTitle] = useState(note?.title ?? "Northanger Abbey essay");
  const [content, setContent] = useState(
    note?.content ??
      `Jane Austen's "Northanger Abbey" stands as a brilliant parody of the Gothic novel genre while simultaneously offering a coming-of-age story that explores themes of social class, gender expectations, and the power of imagination. Published posthumously in 1817, this novel showcases Austen's characteristic wit and social commentary through the eyes of its young protagonist, Catherine Morland.

The novel follows Catherine, a seventeen-year-old from a modest family, as she navigates the social complexities of Bath society and later visits the mysterious Northanger Abbey. Austen uses Catherine's naive perspective to critique both the Gothic novel's sensationalism and the superficiality of high society.

One of the most compelling aspects of "Northanger Abbey" is Austen's masterful use of irony. Catherine's overactive imagination, fueled by her love of Gothic novels, leads her to misinterpret everyday situations as supernatural occurrences. This serves as both comedic relief and a subtle critique of how literature can distort one's perception of reality.

The novel also explores themes of social mobility and the constraints placed on women in Regency England. Catherine's journey from a country parsonage to the sophisticated world of Bath society highlights the rigid class structures of the time, while her eventual marriage to Henry Tilney suggests the possibility of upward mobility through marriage.

Austen's characterization is particularly strong in this work. Catherine, while naive, is fundamentally good-hearted and learns from her mistakes. Henry Tilney serves as both a romantic interest and a voice of reason, helping Catherine distinguish between fantasy and reality. The supporting cast, including the manipulative Isabella Thorpe and the scheming John Thorpe, provide excellent foils to Catherine's innocence.

The novel's structure is also noteworthy. Austen breaks the fourth wall on several occasions, directly addressing the reader and commenting on the conventions of novel-writing. This metafictional element adds another layer of sophistication to what might otherwise be dismissed as a simple romance.

"Northanger Abbey" ultimately serves as both entertainment and social commentary, demonstrating Austen's ability to use humor and irony to explore serious themes. It remains relevant today for its insights into human nature, social dynamics, and the power of literature to shape our understanding of the world.

/509`,
  );
  const [notebook] = useState(note?.notebook ?? "Essays");
  const [tags] = useState(note?.tags ?? ["University", "Literature"]);
  const [importance] = useState<"High" | "Medium" | "Low">(
    note?.importance ?? "High",
  );
  const [status] = useState<"In progress" | "Completed" | "Draft">(
    note?.status ?? "In progress",
  );

  const attachments = note?.attachments ?? [
    { id: "1", name: "cpm.35.2025", size: "258 KB", type: "PNG" },
    { id: "2", name: "cpm.36.2025", size: "250 KB", type: "PNG" },
  ];

  if (!isOpen) return null;

  return (
    <Sidebar
      collapsible="none"
      className="sticky top-0 hidden h-svh border-l lg:flex"
      style={
        {
          "--sidebar-width": "24rem",
        } as React.CSSProperties
      }
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
              <ScrollText className="h-5 w-5 text-gray-500" />
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
                <span className="text-sm text-gray-600">Notebook:</span>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  {notebook}
                </Badge>
              </div>

              <div className="flex items-center gap-2 overflow-hidden">
                <Tag className="h-4 w-4" />
                <span className="text-sm text-gray-600">Tags:</span>
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
                <span className="text-sm text-gray-600">Importance:</span>
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
                className="bg-sidebar-accent h-full resize-none rounded-b-none border-0 text-sm leading-relaxed focus-visible:ring-0"
                placeholder="Start writing your note..."
              />
              {/* Actions */}
              <div className="bg-sidebar-accent flex items-center justify-between rounded-b-md p-3">
                <Button size="sm">Save</Button>
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
              <span className="text-sm font-medium">Attachments (2)</span>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-accent-foreground"
              >
                Download all
              </Button>
            </div>
            <div className="flex items-center gap-2">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center gap-3 rounded-lg bg-secondary p-2"
                >
                  <FileImage className="h-4 w-4 text-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {attachment.name}
                    </p>
                    <p className="text-foreground-accent text-xs">
                      {attachment.size}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
