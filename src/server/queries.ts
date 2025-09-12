"use server";

import { db } from "./db";
import { notes } from "./db/schema";
import { eq } from "drizzle-orm";
// import { images, notes } from "./db/schema";
// import { eq, desc, ilike, or, and } from "drizzle-orm";

export const getNotesByUser = async (userId: string, searchQuery = "") => {
  try {
    const userNotes = await db.query.notes.findMany({
      with: {
        author: true,
        images: true,
      },
      where: (fields, { eq, and, ilike, or }) =>
        and(
          eq(fields.createdById, userId),
          searchQuery
            ? or(
                ilike(fields.content, `%${searchQuery}%`),
                ilike(fields.title, `%${searchQuery}%`),
              )
            : undefined,
        ),
      orderBy: (fields, { desc }) => desc(fields.createdAt),
    });

    // const userNotes = await db
    //   .select()
    //   .from(notes)
    //   .where(
    //     and(
    //       eq(notes.createdById, userId),
    //       or(
    //         ilike(notes.content, `%${searchQuery}%`),
    //         ilike(notes.title, `%${searchQuery}%`),
    //       ),
    //     ),
    //   )
    //   .leftJoin(images, eq(notes.id, images.noteId))
    //   .orderBy(desc(notes.createdAt));

    return userNotes;
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw new Error("Failed to fetch notes");
  }
};

export const getNoteById = async (id: string) => {
  const note = await db.query.notes.findFirst({
    with: {
      images: true,
    },
    where: eq(notes.id, id),
  });
  return note;
};
