"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "./ui/button";
import { Trash2Icon, EditIcon, ArchiveIcon, PaletteIcon } from "lucide-react";
import { type ReactNode } from "react";
import { type Note } from "~/server/mutations";

export default function Note({ note }: { note: Note }) {
  const { title, content } = note;
  return (
    <Card className="group relative border-0 bg-transparent">
      <div className="blohsh-border absolute inset-0 bg-blohsh-orange"></div>

      <div className="blohsh-border relative flex h-full flex-col justify-around bg-card transition-transform group-hover:translate-x-3 group-hover:translate-y-3">
        <CardHeader>
          <CardTitle className="mb-1 text-xl font-bold">{title}</CardTitle>
          <CardDescription className="inline-block min-w-9 rounded-md py-1 text-xs font-semibold opacity-90">
            Card Description
          </CardDescription>
        </CardHeader>
        <CardContent className="mb-6 text-lg font-semibold">
          <p>{content}</p>
        </CardContent>
        <CardFooter className="flex items-center justify-around gap-2 pb-3 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
          <>
            <NoteButton>
              <Trash2Icon className="h-[18px] w-[18px]" />
            </NoteButton>
            <NoteButton>
              <ArchiveIcon className="h-[18px] w-[18px]" />
            </NoteButton>
            <NoteButton>
              <PaletteIcon className="h-[18px] w-[18px]" />
            </NoteButton>
            <NoteButton>
              <EditIcon className="h-[18px] w-[18px]" />
            </NoteButton>
          </>
        </CardFooter>
      </div>
    </Card>
  );

  function NoteButton({
    children,

    onClick = () => {
      return;
    },
  }: {
    children: ReactNode;
    onClick?: () => void;
  }) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={onClick}
        className="rounded-[50%] opacity-70 hover:bg-blohsh-hover hover:opacity-80"
      >
        {children}
      </Button>
    );
  }
}
