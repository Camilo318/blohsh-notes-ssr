"use client";

import { useState } from "react";
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
import { deleteNote, editTodo, type NoteType } from "~/server/mutations";
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
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "~/lib/utils";
import { Textarea } from "./ui/textarea";

export default function Note({ note }: { note: NoteType }) {
  const { title, content } = note;
  return (
    <Card className="note group relative border-0 bg-transparent">
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
                    <Button
                      variant={"destructive"}
                      onClick={() => deleteNote(note.id)}
                    >
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
            <EditNoteWizard>
              <>
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    type="text"
                    id="title"
                    name="title"
                    defaultValue={note.title}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    name="content"
                    defaultValue={note.content}
                  />
                </div>

                <input name="id" type="hidden" value={note.id} hidden />
                <DialogClose asChild>
                  <Button type="submit">Save changes</Button>
                </DialogClose>
              </>
            </EditNoteWizard>
          </>
        </CardFooter>
      </div>
    </Card>
  );
}

const EditNoteWizard = ({ children }: { children: React.ReactElement }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <EditIcon className="h-[18px] w-[18px]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit note</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Make changes to your note here. Click save when you&apos;re done.
        </DialogDescription>
        <ProfileForm>{children}</ProfileForm>
      </DialogContent>
    </Dialog>
  );
};

//   return (
//     <Drawer open={open} onOpenChange={setOpen}>
//       <DrawerTrigger asChild>
//         <Button variant="outline">Edit Profile</Button>
//       </DrawerTrigger>
//       <DrawerContent>
//         <DrawerHeader className="text-left">
//           <DrawerTitle>Edit profile</DrawerTitle>
//           <DrawerDescription>
//             Make changes to your profile here. Click save when you're done.
//           </DrawerDescription>
//         </DrawerHeader>
//         <ProfileForm className="px-4" />
//         <DrawerFooter className="pt-2">
//           <DrawerClose asChild>
//             <Button variant="outline">Cancel</Button>
//           </DrawerClose>
//         </DrawerFooter>
//       </DrawerContent>
//     </Drawer>
//   );
// };

function ProfileForm({ className, children }: React.ComponentProps<"form">) {
  return (
    <form className={cn("grid items-start gap-4", className)} action={editTodo}>
      {children}
    </form>
  );
}
