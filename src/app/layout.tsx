import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import SessionProvider from "~/components/SessionProvider";
import Header from "~/components/Header";
import { getServerAuthSession } from "~/server/auth";
import Providers from "./providers";

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
          <SessionProvider session={session}>
            <Header />
            <main className="bg-blohsh-secondary flex-1">{children}</main>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}
