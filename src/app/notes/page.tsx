import { redirect } from "next/navigation";
import CreateNoteWizard from "~/components/CreateNoteWizard";
import Note from "~/components/Note";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";

export default async function Notes() {
  const session = await getServerAuthSession();

  if (!session || !session?.user) {
    redirect("/api/auth/signin");
  }

  const userNotes = await db.query.notes.findMany({
    where: (fields, { eq }) => eq(fields.createdById, session.user.id),
    orderBy: (fields, { desc }) => desc(fields.createdAt),
  });

  return (
    <section>
      <div className="px-4">
        <CreateNoteWizard />
      </div>

      {userNotes.length < 1 && (
        <div className="h- flex h-96 items-center justify-center">
          <h1 className="p-6 text-2xl font-bold text-blohsh-foreground">
            Looks quite empty around here. Create a note above 😏
          </h1>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3">
        {userNotes.map((note) => (
          <Note key={note.id} note={note} />
        ))}
      </div>
    </section>
  );
}
