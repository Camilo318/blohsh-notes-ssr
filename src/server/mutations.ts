"use server";
import { eq, and } from "drizzle-orm";
import { getServerAuthSession } from "./auth";
import { db } from "./db";
import { utapi } from "./uploadthing";
import {
  images,
  notes,
  notesToTags,
  type InserNote,
  type Importance,
  tags as tagsTable,
} from "./db/schema";

/**
 * Helper function to sync tags for a note.
 * Creates new tags if they don't exist, and updates the junction table.
 */
async function syncNoteTags(
  noteId: string,
  userId: string,
  tagNames: string[],
) {
  // First, delete all existing tag associations for this note
  await db.delete(notesToTags).where(eq(notesToTags.noteId, noteId));

  if (tagNames.length === 0) return;

  // For each tag name, find or create the tag
  const tagIds: string[] = [];

  for (const tagName of tagNames) {
    const trimmedName = tagName.trim();
    if (!trimmedName) continue;

    // Check if tag exists for this user
    const existingTag = await db.query.tags.findFirst({
      where: and(eq(tagsTable.name, trimmedName), eq(tagsTable.userId, userId)),
    });

    if (existingTag) {
      tagIds.push(existingTag.id);
    } else {
      // Create new tag
      const [newTag] = await db
        .insert(tagsTable)
        .values({
          name: trimmedName,
          userId: userId,
        })
        .returning();

      if (newTag) {
        tagIds.push(newTag.id);
      }
    }
  }

  // Insert the note-tag associations
  if (tagIds.length > 0) {
    await db.insert(notesToTags).values(
      tagIds.map((tagId) => ({
        noteId,
        tagId,
      })),
    );
  }
}

export const createNote = async (note: InserNote & { tags?: string[] }) => {
  const session = await getServerAuthSession();

  if (!session?.user.id) throw new Error("Unauthorized");

  const [newNote] = await db
    .insert(notes)
    .values({
      title: note.title,
      content: note.content,
      createdById: session.user.id,
      importance: "Medium",
      notebookId: null,
      color: null,
    })
    .returning();

  // Sync tags if provided
  if (newNote && note.tags && note.tags.length > 0) {
    await syncNoteTags(newNote.id, session.user.id, note.tags);
  }

  return newNote;
};

export const deleteNote = async (id: string, keys: string[]) => {
  const session = await getServerAuthSession();

  if (!session?.user.id) throw new Error("Unauthorized");

  await db.delete(images).where(eq(images.noteId, id));
  await deleteImagesFromUploadthing(keys);
  await db
    .delete(notes)
    .where(and(eq(notes.id, id), eq(notes.createdById, session.user.id)));
};

export const deleteImage = async (id: string, key: string) => {
  const session = await getServerAuthSession();

  if (!session?.user.id) throw new Error("Unauthorized");

  await db.delete(images).where(eq(images.id, id));
  await deleteImagesFromUploadthing([key]);
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
  tags,
  isFavorite,
}: {
  title: string;
  content: string;
  id: string;
  importance?: Importance;
  notebookId?: string | null;
  color?: string | null;
  tags?: string[];
  isFavorite?: boolean;
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
    isFavorite: boolean;
  }> = {
    title,
    content,
  };

  if (importance !== undefined) updateData.importance = importance;
  if (notebookId !== undefined) updateData.notebookId = notebookId;
  if (color !== undefined) updateData.color = color;
  if (isFavorite !== undefined) updateData.isFavorite = isFavorite;

  const [updatedNote] = await db
    .update(notes)
    .set(updateData)
    .where(and(eq(notes.id, id), eq(notes.createdById, session.user.id)))
    .returning();

  // Sync tags if provided
  if (updatedNote && tags !== undefined) {
    await syncNoteTags(updatedNote.id, session.user.id, tags);
  }
  return updatedNote;
};

export const toggleNoteFavorite = async (id: string) => {
  const session = await getServerAuthSession();

  if (!session?.user.id) throw new Error("Unauthorized");

  const existingNote = await db.query.notes.findFirst({
    columns: {
      id: true,
      isFavorite: true,
    },
    where: and(eq(notes.id, id), eq(notes.createdById, session.user.id)),
  });

  if (!existingNote) {
    throw new Error("Note not found");
  }

  const [updatedNote] = await db
    .update(notes)
    .set({ isFavorite: !existingNote.isFavorite })
    .where(and(eq(notes.id, id), eq(notes.createdById, session.user.id)))
    .returning();

  return updatedNote;
};
