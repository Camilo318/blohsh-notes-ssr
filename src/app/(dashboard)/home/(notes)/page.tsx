import { redirect } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
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
    queryKey: ["notes", "all", session.user.id, ""],
    queryFn: () => getNotesByUser(session.user.id, { searchQuery: "" }),
  });

  return (
    <section className="@container/note-grid relative grid gap-3 px-4 pt-4">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesContainer user={session.user} />
      </HydrationBoundary>
    </section>
  );
}
