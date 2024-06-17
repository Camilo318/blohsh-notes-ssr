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
import { deleteNote, type NoteType } from "~/server/mutations";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export default function Note({ note }: { note: NoteType }) {
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
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={"ghost"} size={"icon"}>
                  <Trash2Icon className="h-[18px] w-[18px]" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your note
                </DialogDescription>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button onClick={() => deleteNote(note.id)}>
                      Yes, delete
                    </Button>
                  </DialogClose>

                  <DialogClose asChild>
                    <Button variant={"ghost"}>Cancel</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant={"ghost"} size={"icon"}>
              <ArchiveIcon className="h-[18px] w-[18px]" />
            </Button>
            <Button variant={"ghost"} size={"icon"}>
              <PaletteIcon className="h-[18px] w-[18px]" />
            </Button>
            <Button variant={"ghost"} size={"icon"}>
              <EditIcon className="h-[18px] w-[18px]" />
            </Button>
          </>
        </CardFooter>
      </div>
    </Card>
  );
}
