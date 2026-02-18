"use server";

import { db } from "./db";
import { notes, type Importance } from "./db/schema";
import { and, eq, ilike, or } from "drizzle-orm";

export type NoteSortBy = "createdAt" | "updatedAt" | "title" | "importance";
export type NoteSortDirection = "asc" | "desc";

export type GetNotesByUserOptions = {
  searchQuery?: string;
  sortBy?: NoteSortBy;
  sortDirection?: NoteSortDirection;
  favoritesOnly?: boolean;
};

type NormalizedGetNotesByUserOptions = {
  searchQuery: string;
  sortBy: NoteSortBy;
  sortDirection: NoteSortDirection;
  favoritesOnly: boolean;
};

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

function normalizeGetNotesOptions(
  optionsOrSearchQuery: GetNotesByUserOptions | string = "",
): NormalizedGetNotesByUserOptions {
  if (typeof optionsOrSearchQuery === "string") {
    return {
      searchQuery: optionsOrSearchQuery,
      sortBy: "createdAt",
      sortDirection: "desc",
      favoritesOnly: false,
    };
  }

  return {
    searchQuery: optionsOrSearchQuery.searchQuery ?? "",
    sortBy: optionsOrSearchQuery.sortBy ?? "createdAt",
    sortDirection: optionsOrSearchQuery.sortDirection ?? "desc",
    favoritesOnly: optionsOrSearchQuery.favoritesOnly ?? false,
  };
}

export const getNotesByUser = async (
  userId: string,
  optionsOrSearchQuery: GetNotesByUserOptions | string = "",
) => {
  const options = normalizeGetNotesOptions(optionsOrSearchQuery);

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
      where: and(
        eq(notes.createdById, userId),
        options.favoritesOnly ? eq(notes.isFavorite, true) : undefined,
        options.searchQuery
          ? or(
              ilike(notes.content, `%${options.searchQuery}%`),
              ilike(notes.title, `%${options.searchQuery}%`),
            )
          : undefined,
      ),
      orderBy: (fields, { asc, desc }) => {
        const direction = options.sortDirection === "asc" ? asc : desc;

        switch (options.sortBy) {
          case "updatedAt":
            return direction(fields.updatedAt);
          case "title":
            return direction(fields.title);
          case "importance":
            return direction(fields.importance);
          case "createdAt":
          default:
            return direction(fields.createdAt);
        }
      },
    });

    return userNotes.map(transformNote);
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw new Error("Failed to fetch notes");
  }
};

export const getFavoriteNotesByUser = async (
  userId: string,
  searchQuery = "",
) =>
  getNotesByUser(userId, {
    searchQuery,
    favoritesOnly: true,
    sortBy: "updatedAt",
    sortDirection: "desc",
  });

export const getRecentNotesByUser = async (userId: string, searchQuery = "") =>
  getNotesByUser(userId, {
    searchQuery,
    sortBy: "updatedAt",
    sortDirection: "desc",
  });

export type NotesByTagGroup = {
  tagName: string;
  notes: Awaited<ReturnType<typeof getNotesByUser>>;
  isUntagged: boolean;
};

function normalizeGroupedByTagOptions(
  optionsOrSearchQuery: GetNotesByUserOptions | string = "",
): NormalizedGetNotesByUserOptions {
  if (typeof optionsOrSearchQuery === "string") {
    return {
      searchQuery: optionsOrSearchQuery,
      sortBy: "updatedAt",
      sortDirection: "desc",
      favoritesOnly: false,
    };
  }

  return {
    searchQuery: optionsOrSearchQuery.searchQuery ?? "",
    sortBy: optionsOrSearchQuery.sortBy ?? "updatedAt",
    sortDirection: optionsOrSearchQuery.sortDirection ?? "desc",
    favoritesOnly: optionsOrSearchQuery.favoritesOnly ?? false,
  };
}

export const getNotesGroupedByTag = async (
  userId: string,
  optionsOrSearchQuery: GetNotesByUserOptions | string = "",
) => {
  const options = normalizeGroupedByTagOptions(optionsOrSearchQuery);

  const userNotes = await getNotesByUser(userId, options);

  const notesByTag = new Map<string, Awaited<ReturnType<typeof getNotesByUser>>>();
  const untaggedNotes: Awaited<ReturnType<typeof getNotesByUser>> = [];

  for (const note of userNotes) {
    if (!note.tags || note.tags.length === 0) {
      untaggedNotes.push(note);
      continue;
    }

    for (const tagName of note.tags) {
      const taggedNotes = notesByTag.get(tagName);
      if (taggedNotes) {
        taggedNotes.push(note);
      } else {
        notesByTag.set(tagName, [note]);
      }
    }
  }

  const groups: NotesByTagGroup[] = Array.from(notesByTag.entries())
    .sort(([leftTag], [rightTag]) => leftTag.localeCompare(rightTag))
    .map(([tagName, groupedNotes]) => ({
      tagName,
      notes: groupedNotes,
      isUntagged: false,
    }));

  if (untaggedNotes.length > 0) {
    groups.push({
      tagName: "Untagged",
      notes: untaggedNotes,
      isUntagged: true,
    });
  }

  return groups;
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

  return tags;
};
