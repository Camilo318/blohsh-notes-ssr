"use server";

import { db } from "./db";

export const getNotesByUser = async (userId: string, searchQuery = "") => {
  // console.log(
  //   `Fetching notes for user ${userId} with search query: "${searchQuery}"`,
  // );

  // await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    const notes = await db.query.notes.findMany({
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

    // console.log(`Fetched ${notes.length} notes`);

    return notes;
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw new Error("Failed to fetch notes");
  }
};
