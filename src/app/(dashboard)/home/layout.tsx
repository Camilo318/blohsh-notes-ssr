import AppSidebar from "~/components/AppSidebar";
import Header from "~/components/Header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import NoteSideBarDemo from "~/components/NoteSideBarDemo";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <section className="flex-1 bg-blohsh-secondary">{children}</section>
      </SidebarInset>
      <NoteSideBarDemo />
    </SidebarProvider>
  );
}
