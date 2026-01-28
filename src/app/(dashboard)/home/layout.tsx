import AppSidebar from "~/components/AppSidebar";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import NoteSideBarDemo from "~/components/NoteSideBarDemo";
import { Toaster } from "~/components/ui/sonner";

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
