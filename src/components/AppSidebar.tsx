"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  BookOpen,
  Bookmark,
  Clock,
  Tag,
  NotebookPen,
  Grid3X3,
  Share,
  Settings,
  RefreshCw,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "~/components/ui/sidebar";
import { NavUser } from "./NavUser";
import { usePathname } from "next/navigation";

const AppSidebar = () => {
  const { data: session } = useSession();

  const mainNavItems = [
    {
      title: "All notes",
      icon: BookOpen,
      href: "/notes",
    },
    {
      title: "Favorites",
      icon: Bookmark,
      href: "/favorites",
    },
    {
      title: "Recent notes",
      icon: Clock,
      href: "/recent",
    },
    {
      title: "Tags",
      icon: Tag,
      href: "/tags",
    },
  ];

  const orderNavItems = [
    {
      title: "Notebooks",
      icon: NotebookPen,
      href: "/notebooks",
    },
    {
      title: "Projects",
      icon: Grid3X3,
      href: "/projects",
    },
    {
      title: "Shared",
      icon: Share,
      href: "/shared",
    },
  ];

  const settingsNavItems = [
    {
      title: "Settings",
      icon: Settings,
      href: "/settings",
    },
    {
      title: "Sync Status",
      icon: RefreshCw,
      href: "/sync",
    },
  ];

  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <NavUser
          user={{
            name: session?.user?.name ?? "",
            email: session?.user?.email ?? "",
            avatar: (session?.user?.image as string | undefined) ?? "",
          }}
          signOut={() => signOut({ callbackUrl: "/" })}
        />
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>MAIN</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive(item.href)}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>ORDER</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {orderNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive(item.href)}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>SETTINGS</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive(item.href)}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
