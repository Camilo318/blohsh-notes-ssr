"use client";

import { useState } from "react";
import NoteSideBar from "./NoteSideBar";

export default function NoteSideBarDemo() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const sampleNote = {
    id: "1",
    title: "Northanger Abbey essay",
    content: "Sample essay content...",
    notebook: "Essays",
    tags: ["University", "Literature"],
    importance: "High" as const,
    status: "In progress" as const,
    attachments: [
      { id: "1", name: "cpm.35.2025", size: "258 KB", type: "PNG" },
      { id: "2", name: "cpm.36.2025", size: "250 KB", type: "PNG" },
    ],
  };

  return (
    <NoteSideBar
      isOpen={isSidebarOpen}
      onClose={() => setIsSidebarOpen(false)}
      note={sampleNote}
    />
  );
}
