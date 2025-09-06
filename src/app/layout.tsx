import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import SessionProvider from "~/components/SessionProvider";
import Header from "~/components/Header";
import AppSidebar from "~/components/AppSidebar";
import { getServerAuthSession } from "~/server/auth";
import Providers from "./providers";
import { ThemeProvider } from "~/components/ThemeProvider";
import { SidebarProvider, SidebarInset } from "~/components/ui/sidebar";

export const metadata = {
  title: "Blohsh Notes",
  description: "Responsive Note taking app made with React Server Components",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="flex min-h-svh flex-col">
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SessionProvider session={session}>
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                  <Header />
                  <section className="flex-1 bg-blohsh-secondary">
                    {children}
                  </section>
                </SidebarInset>
              </SidebarProvider>
            </SessionProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
