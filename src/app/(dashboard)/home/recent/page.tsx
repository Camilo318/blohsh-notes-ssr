import { redirect } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getServerAuthSession } from "~/server/auth";
import { getNotesByUser } from "~/server/queries";
import RecentNotes from "./recent";

export default async function RecentPage() {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", "recent", session.user.id, ""],
    queryFn: () =>
      getNotesByUser(session.user.id, {
        searchQuery: "",
        sortBy: "updatedAt",
        sortDirection: "desc",
      }),
  });

  return (
    <section className="@container/note-grid relative grid gap-3 px-4 pt-4">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <RecentNotes user={session.user} />
      </HydrationBoundary>
    </section>
  );
}

export const metadata = {
  title: "Recent Notes",
  description: "Notes ordered by your latest edits.",
};
