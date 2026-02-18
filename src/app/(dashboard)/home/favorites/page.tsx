import { redirect } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getServerAuthSession } from "~/server/auth";
import { getNotesByUser } from "~/server/queries";
import FavoritesNotes from "./favorites";

export default async function FavoritesPage() {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", "favorites", session.user.id, "", "updatedAt", "desc", true],
    queryFn: () =>
      getNotesByUser(session.user.id, {
        searchQuery: "",
        favoritesOnly: true,
        sortBy: "updatedAt",
        sortDirection: "desc",
      }),
  });

  return (
    <section className="@container/note-grid relative grid gap-3 px-4 pt-4">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <FavoritesNotes user={session.user} />
      </HydrationBoundary>
    </section>
  );
}

export const metadata = {
  title: "Favorite Notes",
  description: "Browse your favorite notes.",
};
