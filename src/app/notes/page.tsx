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

  const notes = await db.query.notes.findMany();

  return (
    <section>
      <div className="px-4">
        <CreateNoteWizard />
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3">
        {[1, 2, 3].map((note, index) => (
          <Note key={index} />
        ))}
      </div>
    </section>
  );
}
