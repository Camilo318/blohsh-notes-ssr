import { redirect } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getServerAuthSession } from "~/server/auth";
import { getNotesGroupedByTag } from "~/server/queries";
import TagsNotes from "./tags";

export default async function TagsPage() {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes-grouped-by-tag", session.user.id, ""],
    queryFn: () => getNotesGroupedByTag(session.user.id, ""),
  });

  return (
    <section className="@container/note-grid relative grid gap-3 px-4 pt-4">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TagsNotes user={session.user} />
      </HydrationBoundary>
    </section>
  );
}

export const metadata = {
  title: "Tag Collections",
  description: "Explore your notes grouped by tags.",
};
