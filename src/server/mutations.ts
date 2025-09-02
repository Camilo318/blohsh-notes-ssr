"use server";

import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { getServerAuthSession } from "./auth";
import { db } from "./db";
import { notes, type InserNote } from "./db/schema";

export const createNote = async (note: InserNote) => {
  const session = await getServerAuthSession();

  if (!session?.user.id) throw new Error("Unauthorized");

  await db.insert(notes).values({
    title: note.title,
    content: note.content,
    createdById: session?.user.id,
  });

  revalidatePath("/notes");
};

export const deleteNote = async (id: string) => {
  const session = await getServerAuthSession();

  if (!session?.user.id) throw new Error("Unauthorized");

  await db
    .delete(notes)
    .where(and(eq(notes.id, id), eq(notes.createdById, session.user.id)));

  revalidatePath("/notes");
};

export const editTodo = async (note: FormData) => {
  const session = await getServerAuthSession();

  if (!session?.user.id) throw new Error("Unauthorized");

  const title = note.get("title");
  const content = note.get("content");
  const id = note.get("id") as string;

  await db
    .update(notes)
    .set({
      title: title as string,
      content: content as string,
    })
    .where(and(eq(notes.id, id), eq(notes.createdById, session.user.id)));

  revalidatePath("/notes");
};
