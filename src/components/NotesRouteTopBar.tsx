"use client";

import { Search, X } from "lucide-react";
import { ModeToggle } from "~/components/ModeToggle";
import { SidebarTrigger } from "~/components/ui/sidebar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/components/ui/input-group";

type NotesRouteTopBarProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
};

export default function NotesRouteTopBar({
  searchQuery,
  onSearchChange,
  placeholder = "Search notes",
}: NotesRouteTopBarProps) {
  return (
    <div className="-mx-4 -mt-4 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="h-9 w-9 shrink-0 rounded-full hover:bg-blohsh-hover" />

        <InputGroup className="h-10 flex-1 rounded-xl border-0 bg-secondary/60 dark:bg-secondary/80">
          <InputGroupInput
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
          />

          <InputGroupAddon align="inline-start">
            <Search className="h-4 w-4" />
          </InputGroupAddon>

          {searchQuery ? (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                variant="ghost"
                onClick={() => onSearchChange("")}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
                <span className="sr-only">Clear search</span>
              </InputGroupButton>
            </InputGroupAddon>
          ) : null}
        </InputGroup>

        <ModeToggle
          variant="ghost"
          className="h-9 w-9 rounded-full hover:bg-blohsh-hover"
        />
      </div>
    </div>
  );
}
