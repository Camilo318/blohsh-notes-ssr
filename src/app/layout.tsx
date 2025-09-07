import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import SessionProvider from "~/components/SessionProvider";
import { getServerAuthSession } from "~/server/auth";
import Providers from "./providers";
import { ThemeProvider } from "~/components/ThemeProvider";

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
            <SessionProvider session={session}>{children}</SessionProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
