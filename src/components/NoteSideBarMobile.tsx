"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "~/components/ui/drawer";
import {
  NoteSidebarAttachmentsSection,
  NoteSidebarEditorSection,
  NoteSidebarHeaderActions,
  NoteSidebarMetadataSection,
  NoteSidebarTitleSection,
  NoteSidebarViewer,
} from "./NoteSideBarShared";

interface NoteSideBarMobileProps {
  isOpen: boolean;
  handleOpenChanges: (open: boolean) => void;
}

export default function NoteSideBarMobile({
  isOpen,
  handleOpenChanges,
}: NoteSideBarMobileProps) {
  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChanges}>
      <DrawerContent className="h-[85vh]">
        <DrawerHeader className="pb-2">
          <div className="flex items-center justify-between">
            <DrawerTitle>Edit note</DrawerTitle>
            <NoteSidebarHeaderActions onClose={() => handleOpenChanges(false)} />
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="mb-6">
            <NoteSidebarTitleSection />
          </div>

          <NoteSidebarEditorSection
            className="mb-6 max-h-96"
            editorClassName="min-h-0 flex-1 overflow-y-auto p-1"
          />

          <div className="mb-6">
            <NoteSidebarMetadataSection />
          </div>

          <NoteSidebarAttachmentsSection />
        </div>
      </DrawerContent>

      <NoteSidebarViewer />
    </Drawer>
  );
}
