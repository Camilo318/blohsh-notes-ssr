"use client";

import { type CSSProperties } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "~/components/ui/sidebar";
import { type SelectTag } from "~/server/db/schema";
import NoteSideBarMobile from "./NoteSideBarMobile";
import { useMediaQuery } from "~/hooks/use-media-query";
import {
  NoteSidebarAttachmentsSection,
  NoteSidebarEditorSection,
  NoteSidebarHeaderActions,
  NoteSidebarMetadataSection,
  NoteSidebarProvider,
  type NoteSidebarNote,
  NoteSidebarTitleSection,
  NoteSidebarViewer,
} from "./NoteSideBarShared";

interface NoteSideBarProps {
  isOpen: boolean;
  handleOpenChanges: (open: boolean) => void;
  tags?: SelectTag[];
  note?: NoteSidebarNote;
  isLoading?: boolean;
}

export default function NoteSideBar({
  isOpen,
  handleOpenChanges,
  note,
  isLoading = false,
  tags = [],
}: NoteSideBarProps) {
  const isMobile = useMediaQuery("(max-width: 1023px)");

  return (
    <NoteSidebarProvider note={note} tags={tags} isLoading={isLoading}>
      {isMobile ? (
        <NoteSideBarMobile
          isOpen={isOpen}
          handleOpenChanges={handleOpenChanges}
        />
      ) : (
        <DesktopNoteSideBar
          isOpen={isOpen}
          handleOpenChanges={handleOpenChanges}
        />
      )}
    </NoteSidebarProvider>
  );
}

function DesktopNoteSideBar({
  isOpen,
  handleOpenChanges,
}: Pick<NoteSideBarProps, "isOpen" | "handleOpenChanges">) {
  return (
    <Sidebar
      collapsible="none"
      className="sticky top-0 hidden h-svh overflow-hidden border-l transition-[width] duration-200 ease-out data-[open=false]:w-0 lg:flex"
      style={
        {
          "--sidebar-width": "24rem",
        } as CSSProperties
      }
      data-open={isOpen}
    >
      <SidebarHeader>
        <div className="flex items-center justify-between p-2">
          <h2 className="text-lg font-semibold">Edit note</h2>
          <NoteSidebarHeaderActions onClose={() => handleOpenChanges(false)} />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <NoteSidebarTitleSection />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="pt-0">
          <SidebarGroupContent>
            <NoteSidebarEditorSection className="h-[450px] overflow-y-auto" />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <NoteSidebarMetadataSection />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <NoteSidebarAttachmentsSection />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <NoteSidebarViewer />
    </Sidebar>
  );
}
