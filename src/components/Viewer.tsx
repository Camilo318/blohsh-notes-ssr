"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Dialog, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { type SelectImage } from "~/server/db/schema";

interface ViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: SelectImage[];
  index: number;
  onIndexChange: (index: number) => void;
}

export default function Viewer({
  open,
  onOpenChange,
  images,
  index,
  onIndexChange,
}: ViewerProps) {
  const hasMultiple = images.length > 1;
  const currentImage = images[index];

  const goNext = useCallback(() => {
    if (!hasMultiple) return;
    onIndexChange((index + 1) % images.length);
  }, [hasMultiple, index, images.length, onIndexChange]);

  const goPrev = useCallback(() => {
    if (!hasMultiple) return;
    onIndexChange((index - 1 + images.length) % images.length);
  }, [hasMultiple, index, images.length, onIndexChange]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, goNext, goPrev, onOpenChange]);

  if (!currentImage) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* Custom overlay with enhanced blur */}
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/70 backdrop-blur-md",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          )}
        />

        {/* Custom content - full viewport lightbox */}
        <DialogPrimitive.Content
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center",
            "border-none bg-transparent p-0 shadow-none outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          )}
          onPointerDownOutside={(e) => e.preventDefault()}
          aria-describedby={undefined}
        >
          {/* Hidden title for accessibility */}
          <DialogTitle className="sr-only">
            Image viewer - {currentImage.altText ?? "Image"}
          </DialogTitle>

          {/* Close button - top right */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className={cn(
              "absolute right-4 top-4 z-50",
              "liquid-glass rounded-full",
              "h-10 w-10 sm:h-12 sm:w-12",
              "text-white/90 hover:text-white",
              "transition-all duration-200",
            )}
            aria-label="Close viewer"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>

          {/* Main image container */}
          <div className="relative flex h-full w-full items-center justify-center p-4 sm:p-8 md:p-12">
            {/* Liquid glass image frame */}
            <div
              className={cn(
                "liquid-glass relative overflow-hidden rounded-2xl sm:rounded-3xl",
                "max-h-[80vh] max-w-[90vw] sm:max-h-[85vh] sm:max-w-[85vw]",
                "shadow-2xl shadow-black/30",
              )}
            >
              <Image
                src={currentImage.imageSrc ?? ""}
                alt={currentImage.altText ?? "Image"}
                width={1200}
                height={800}
                className="h-auto max-h-[80vh] w-auto max-w-[90vw] object-contain sm:max-h-[85vh] sm:max-w-[85vw]"
                priority
              />
            </div>
          </div>

          {/* Navigation controls - only show if multiple images */}
          {hasMultiple && (
            <>
              {/* Previous button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={goPrev}
                className={cn(
                  "absolute left-4 top-1/2 z-50 -translate-y-1/2",
                  "liquid-glass rounded-full",
                  "h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14",
                  "text-white/90 hover:text-white",
                  "transition-all duration-200 hover:scale-105",
                )}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
              </Button>

              {/* Next button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={goNext}
                className={cn(
                  "absolute right-4 top-1/2 z-50 -translate-y-1/2",
                  "liquid-glass rounded-full",
                  "h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14",
                  "text-white/90 hover:text-white",
                  "transition-all duration-200 hover:scale-105",
                )}
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
              </Button>
            </>
          )}

          {/* Bottom info bar */}
          <div
            role="status"
            aria-live="polite"
            className={cn(
              "absolute bottom-4 left-1/2 z-50 -translate-x-1/2",
              "liquid-glass rounded-full",
              "flex items-center gap-3 px-4 py-2 sm:px-5 sm:py-2.5",
            )}
          >
            {/* Image counter */}
            {hasMultiple && (
              <span className="text-sm font-medium text-white/90 sm:text-base">
                <span className="sr-only">Image </span>
                {index + 1} / {images.length}
              </span>
            )}

            {/* Alt text / filename */}
            {currentImage.altText && (
              <>
                {hasMultiple && (
                  <span className="h-4 w-px bg-white/30" aria-hidden="true" />
                )}
                <span className="max-w-[200px] truncate text-sm text-white/70 sm:max-w-[300px]">
                  {currentImage.altText}
                </span>
              </>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  );
}
