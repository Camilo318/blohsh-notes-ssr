"use server";

import { revalidatePath } from "next/cache";
import { getServerAuthSession } from "./auth";
import { db } from "./db";
import { notes } from "./db/schema";

export type Note = typeof notes.$inferInsert;

export const createNote = async (note: Note) => {
  const session = await getServerAuthSession();

  if (!session?.user.id) throw new Error("Unauthorized");

  await db.insert(notes).values({
    title: note.title,
    content: note.content,
    createdById: session?.user.id,
  });

  revalidatePath("/notes");
};
