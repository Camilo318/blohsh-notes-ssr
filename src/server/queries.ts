"use server";

import { db } from "./db";
import { notes, type Importance } from "./db/schema";
import { eq } from "drizzle-orm";

// Helper to transform raw note data into the shape expected by components
function transformNote<
  T extends {
    notebook?: { name: string } | null;
    noteTags?: Array<{ tag: { name: string } | null }>;
    importance: string;
  },
>(
  note: T,
): Omit<T, "notebook" | "noteTags"> & {
  notebook?: string;
  tags: string[];
  importance: Importance;
} {
  return {
    ...note,
    notebook: note.notebook?.name,
    tags: note.noteTags?.map((nt) => nt.tag?.name).filter(Boolean) as string[],
    importance: note.importance as Importance,
  };
}

export const getNotesByUser = async (userId: string, searchQuery = "") => {
  try {
    const userNotes = await db.query.notes.findMany({
      with: {
        author: true,
        images: true,
        notebook: true,
        noteTags: {
          with: {
            tag: true,
          },
        },
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

    return userNotes.map(transformNote);
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw new Error("Failed to fetch notes");
  }
};

export const getNoteById = async (id: string) => {
  const note = await db.query.notes.findFirst({
    with: {
      images: {
        orderBy: (fields, { desc }) => desc(fields.createdAt),
      },
      notebook: true,
      noteTags: {
        with: {
          tag: true,
        },
      },
    },
    where: eq(notes.id, id),
  });

  if (!note) return null;

  return transformNote(note);
};

export const getTagsByUser = async (userId: string | undefined) => {
  if (!userId) return [];

  const tags = await db.query.tags.findMany({
    where: (fields, { eq }) => eq(fields.userId, userId),
    orderBy: (fields, { desc }) => desc(fields.createdAt),
  });

  console.log(tags);
  return tags;
};
