"use server";

import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { getServerAuthSession } from "./auth";
import { db } from "./db";
import { utapi } from "./uploadthing";
import { images, notes, type InserNote, type Importance } from "./db/schema";

export const createNote = async (note: InserNote) => {
  const session = await getServerAuthSession();

  if (!session?.user.id) throw new Error("Unauthorized");

  await db.insert(notes).values({
    title: note.title,
    content: note.content,
    createdById: session?.user.id,
    importance: "Medium",
    notebookId: null,
    color: null,
  });

  // revalidatePath("/home");
};

export const deleteNote = async (id: string, keys: string[]) => {
  const session = await getServerAuthSession();

  if (!session?.user.id) throw new Error("Unauthorized");

  await db.delete(images).where(eq(images.noteId, id));
  await deleteImagesFromUploadthing(keys);
  await db
    .delete(notes)
    .where(and(eq(notes.id, id), eq(notes.createdById, session.user.id)));

  revalidatePath("/home");
};

export const deleteImage = async (id: string, key: string) => {
  const session = await getServerAuthSession();

  if (!session?.user.id) throw new Error("Unauthorized");

  await db.delete(images).where(eq(images.id, id));
  await deleteImagesFromUploadthing([key]);

  revalidatePath("/home");
};

export const deleteImagesFromUploadthing = async (keys: string[]) => {
  const session = await getServerAuthSession();

  if (!session?.user.id) throw new Error("Unauthorized");

  await utapi.deleteFiles(keys);
};

export const editTodo = async ({
  title,
  content,
  id,
  importance,
  notebookId,
  color,
}: {
  title: string;
  content: string;
  id: string;
  importance?: Importance;
  notebookId?: string | null;
  color?: string | null;
}) => {
  const session = await getServerAuthSession();

  if (!session?.user.id) throw new Error("Unauthorized");

  // Build the update object with only provided fields
  const updateData: Partial<{
    title: string;
    content: string;
    importance: string;
    notebookId: string | null;
    color: string | null;
  }> = {
    title,
    content,
  };

  if (importance !== undefined) updateData.importance = importance;
  if (notebookId !== undefined) updateData.notebookId = notebookId;
  if (color !== undefined) updateData.color = color;

  const [updatedNote] = await db
    .update(notes)
    .set(updateData)
    .where(and(eq(notes.id, id), eq(notes.createdById, session.user.id)))
    .returning();

  revalidatePath("/home");
  return updatedNote;
};
