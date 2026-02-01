"use client";

import * as React from "react";
import { X, GripVertical, Plus } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

// Predefined tag colors matching Notion's style
const TAG_COLORS = [
  {
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-800 dark:text-gray-200",
    name: "gray",
  },
  {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-800 dark:text-red-300",
    name: "red",
  },
  {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    text: "text-orange-800 dark:text-orange-300",
    name: "orange",
  },
  {
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-800 dark:text-yellow-300",
    name: "yellow",
  },
  {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-800 dark:text-green-300",
    name: "green",
  },
  {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-800 dark:text-blue-300",
    name: "blue",
  },
  {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-800 dark:text-purple-300",
    name: "purple",
  },
  {
    bg: "bg-pink-100 dark:bg-pink-900/30",
    text: "text-pink-800 dark:text-pink-300",
    name: "pink",
  },
] as const;

// Get a consistent color based on tag name
function getTagColor(tagName: string) {
  const hash = tagName
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return TAG_COLORS[hash % TAG_COLORS.length]!;
}

export interface TagOption {
  id: string;
  value: string;
  label: string;
  color?: string;
}

interface NotionTagSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  options?: TagOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function NotionTagSelect({
  value,
  onChange,
  options = [],
  placeholder = "Select tags...",
  className,
  disabled = false,
}: NotionTagSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
  }, [open]);

  // Combine predefined options with any tags that are in value but not in options
  const allOptions = React.useMemo(() => {
    const optionValues = new Set(options.map((o) => o.value));
    const additionalOptions = value
      .filter((v) => !optionValues.has(v))
      .map((v) => ({ value: v, label: v }));
    return [...options, ...additionalOptions];
  }, [options, value]);

  const handleSelect = (selectedValue: string) => {
    if (value.includes(selectedValue)) {
      onChange(value.filter((v) => v !== selectedValue));
    } else {
      onChange([...value, selectedValue]);
    }
    setInputValue("");
  };

  const handleRemove = (tagToRemove: string) => {
    onChange(value.filter((v) => v !== tagToRemove));
  };

  const handleCreateTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInputValue("");
    }
  };

  const filteredOptions = allOptions.filter(
    (option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
      option.value.toLowerCase().includes(inputValue.toLowerCase()),
  );

  const showCreateOption =
    inputValue.trim() &&
    !allOptions.some(
      (o) => o.label.toLowerCase() === inputValue.trim().toLowerCase(),
    );

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild disabled={disabled}>
        <div
          role="combobox"
          aria-controls="notion-tag-select-command"
          aria-expanded={open}
          className={cn(
            "flex min-h-9 w-full cursor-pointer flex-wrap items-center gap-1 rounded-lg border border-input bg-background px-3 py-1.5 text-sm ring-offset-background",
            "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            disabled && "cursor-not-allowed opacity-50",
            className,
          )}
          onClick={() => {
            if (!disabled) {
              setOpen(true);
            }
          }}
        >
          {value.map((tag) => {
            const color = getTagColor(tag);
            return (
              <Badge
                key={tag}
                variant="secondary"
                className={cn(
                  "gap-1 pr-1 text-xs font-normal",
                  color.bg,
                  color.text,
                )}
              >
                {tag}
                <button
                  type="button"
                  className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(tag);
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
          {value.length === 0 && (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
        portalled={false}
        onOpenAutoFocus={(e: Event) => {
          e.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <Command id="notion-tag-select-command" shouldFilter={false}>
          <CommandInput
            ref={inputRef}
            placeholder="Select an option or create one"
            value={inputValue}
            onValueChange={setInputValue}
            onKeyDown={(e) => {
              if (e.key === "Enter" && showCreateOption) {
                e.preventDefault();
                handleCreateTag();
              }
              if (e.key === "Backspace" && !inputValue && value.length > 0) {
                handleRemove(value.at(-1)!);
              }
            }}
          />
          <CommandList>
            <CommandEmpty>
              {inputValue ? (
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent"
                  onClick={handleCreateTag}
                >
                  <Plus className="h-4 w-4" />
                  Create &quot;{inputValue}&quot;
                </button>
              ) : (
                "No tags found."
              )}
            </CommandEmpty>
            <CommandGroup>
              {showCreateOption && (
                <CommandItem
                  value={`create-${inputValue}`}
                  onSelect={handleCreateTag}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create &quot;{inputValue}&quot;
                </CommandItem>
              )}
              {filteredOptions.map((option) => {
                const color = getTagColor(option.value);
                const isSelected = value.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                    className="gap-2"
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                    <Badge
                      variant="secondary"
                      className={cn(
                        "font-normal",
                        color.bg,
                        color.text,
                        isSelected && "ring-1 ring-current",
                      )}
                    >
                      {option.label}
                    </Badge>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Importance selector component matching the Notion style
const IMPORTANCE_OPTIONS = [
  {
    value: "Low" as const,
    label: "Low",
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-400",
    border: "border-green-300 dark:border-green-700",
    dot: "bg-green-600 dark:bg-green-500",
  },
  {
    value: "Medium" as const,
    label: "Medium",
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-700 dark:text-yellow-400",
    border: "border-yellow-300 dark:border-yellow-700",
    dot: "bg-yellow-600 dark:bg-yellow-500",
  },
  {
    value: "High" as const,
    label: "High",
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-300 dark:border-red-700",
    dot: "bg-red-600 dark:bg-red-500",
  },
] as const;

type ImportanceValue = "Low" | "Medium" | "High";

interface ImportanceSelectProps {
  value: ImportanceValue;
  onChange: (value: ImportanceValue) => void;
  disabled?: boolean;
  className?: string;
}

export function ImportanceSelect({
  value,
  onChange,
  disabled = false,
  className,
}: ImportanceSelectProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {IMPORTANCE_OPTIONS.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-[ring,border,transform,opacity] ease-out active:scale-95 active:opacity-80",
              option.bg,
              option.text,
              option.border,
              isSelected && "ring-2 ring-offset-1 ring-offset-background",
              isSelected && option.value === "Low" && "ring-green-500",
              isSelected && option.value === "Medium" && "ring-yellow-500",
              isSelected && option.value === "High" && "ring-red-500",
              disabled && "cursor-not-allowed opacity-50",
              !disabled && "hover:opacity-80",
            )}
          >
            {option.label}
            <span className={cn("h-2 w-2 rounded-full", option.dot)} />
          </button>
        );
      })}
    </div>
  );
}
