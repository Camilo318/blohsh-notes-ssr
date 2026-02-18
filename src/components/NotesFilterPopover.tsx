"use client";

import { useMemo } from "react";
import { Check, SlidersHorizontal, Star } from "lucide-react";
import { type NoteSortBy, type NoteSortDirection } from "~/server/queries";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

export type NotesFilterState = {
  sortBy: NoteSortBy;
  sortDirection: NoteSortDirection;
  favoritesOnly: boolean;
};

type NotesFilterPopoverProps = {
  value: NotesFilterState;
  onChange: (nextValue: NotesFilterState) => void;
  baseline?: NotesFilterState;
  showFavoritesToggle?: boolean;
};

const sortByOptions: Array<{ id: NoteSortBy; label: string }> = [
  { id: "createdAt", label: "Created date" },
  { id: "updatedAt", label: "Last edited" },
  { id: "title", label: "Title" },
  { id: "importance", label: "Importance" },
];

const sortDirectionOptions: Array<{ id: NoteSortDirection; label: string }> = [
  { id: "desc", label: "Descending" },
  { id: "asc", label: "Ascending" },
];

const defaultBaseline: NotesFilterState = {
  sortBy: "createdAt",
  sortDirection: "desc",
  favoritesOnly: false,
};

export default function NotesFilterPopover({
  value,
  onChange,
  baseline = defaultBaseline,
  showFavoritesToggle = true,
}: NotesFilterPopoverProps) {
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (value.sortBy !== baseline.sortBy) count += 1;
    if (value.sortDirection !== baseline.sortDirection) count += 1;
    if (showFavoritesToggle && value.favoritesOnly !== baseline.favoritesOnly) {
      count += 1;
    }
    return count;
  }, [baseline, showFavoritesToggle, value]);

  const setSortBy = (sortBy: NoteSortBy) => onChange({ ...value, sortBy });
  const setSortDirection = (sortDirection: NoteSortDirection) =>
    onChange({ ...value, sortDirection });
  const setFavoritesOnly = (favoritesOnly: boolean) =>
    onChange({ ...value, favoritesOnly });

  const resetFilters = () =>
    onChange({
      sortBy: baseline.sortBy,
      sortDirection: baseline.sortDirection,
      favoritesOnly: baseline.favoritesOnly,
    });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "group relative h-10 rounded-xl px-3 shadow-sm transition-all duration-200 hover:border-primary/30",
            activeFilterCount > 0 && "border-primary/40",
          )}
        >
          <SlidersHorizontal className="mr-2 h-4 w-4 text-primary/85 transition-transform duration-200 group-hover:rotate-6" />
          <span className="font-medium tracking-tight">Filters</span>
          {activeFilterCount > 0 ? (
            <Badge className="ml-2 rounded-full bg-primary px-2 py-0 text-[11px] text-primary-foreground">
              {activeFilterCount}
            </Badge>
          ) : null}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-[22rem] rounded-2xl border-border/70 bg-gradient-to-b from-background via-background to-secondary/35 p-0 shadow-xl"
      >
        <div className="p-4 pb-3">
          <h4 className="text-sm font-semibold tracking-tight">Filter notes</h4>
          <p className="mt-1 text-xs text-muted-foreground">
            Tune ordering and visibility without leaving this view.
          </p>
        </div>

        <Separator />

        <div className="space-y-4 p-4">
          <section>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Sort by
            </p>
            <div className="grid grid-cols-2 gap-2">
              {sortByOptions.map((option) => {
                const isActive = value.sortBy === option.id;
                return (
                  <Button
                    key={option.id}
                    variant="outline"
                    size="sm"
                    onClick={() => setSortBy(option.id)}
                    className={cn(
                      "justify-start rounded-lg border-border/60 bg-background/70 text-xs",
                      isActive &&
                        "border-primary/60 bg-primary/10 text-foreground",
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-1.5 h-3.5 w-3.5 transition-opacity",
                        isActive ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </section>

          <section>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Order
            </p>
            <div className="grid grid-cols-2 gap-2">
              {sortDirectionOptions.map((option) => {
                const isActive = value.sortDirection === option.id;
                return (
                  <Button
                    key={option.id}
                    variant="outline"
                    size="sm"
                    onClick={() => setSortDirection(option.id)}
                    className={cn(
                      "justify-start rounded-lg border-border/60 bg-background/70 text-xs",
                      isActive &&
                        "border-primary/60 bg-primary/10 text-foreground",
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-1.5 h-3.5 w-3.5 transition-opacity",
                        isActive ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </section>

          {showFavoritesToggle ? (
            <section>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Visibility
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFavoritesOnly(!value.favoritesOnly)}
                className={cn(
                  "w-full justify-start rounded-lg border-border/60 bg-background/70 text-xs",
                  value.favoritesOnly &&
                    "border-primary/60 bg-gradient-to-r from-primary/15 to-primary/5 text-foreground",
                )}
              >
                <Star
                  className={cn(
                    "mr-1.5 h-3.5 w-3.5",
                    value.favoritesOnly
                      ? "fill-current text-primary"
                      : "text-muted-foreground",
                  )}
                />
                Favorites only
              </Button>
            </section>
          ) : null}
        </div>

        <Separator />

        <div className="flex items-center justify-end p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Reset filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
