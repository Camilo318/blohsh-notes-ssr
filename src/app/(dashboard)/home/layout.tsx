import AppSidebar from "~/components/AppSidebar";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import NoteSideBarDemo from "~/components/NoteSideBarDemo";
import dynamic from "next/dynamic";

const Toaster = dynamic(
  () => import("~/components/ui/sonner").then((mod) => mod.Toaster),
  {
    loading: () => (
      <div className="h-10 animate-pulse rounded-xl bg-background" />
    ),
    ssr: false,
  },
);

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <section className="flex-1 bg-blohsh-secondary">{children}</section>
      </SidebarInset>
      <NoteSideBarDemo />
      <Toaster />
    </SidebarProvider>
  );
}
