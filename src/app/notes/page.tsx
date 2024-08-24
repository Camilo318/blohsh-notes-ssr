import { redirect } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import CreateNoteWizard from "~/components/CreateNoteWizard";
import { getServerAuthSession } from "~/server/auth";
import NotesContainer from "./notes";
import { getNotesByUser } from "~/server/queries";

export default async function Notes() {
  const session = await getServerAuthSession();

  if (!session || !session?.user) {
    redirect("/api/auth/signin");
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", session.user.id, ""],
    queryFn: () => getNotesByUser(session.user.id, ""),
  });

  return (
    <section className="px-4">
      <CreateNoteWizard />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesContainer user={session.user} />
      </HydrationBoundary>
    </section>
  );
}
