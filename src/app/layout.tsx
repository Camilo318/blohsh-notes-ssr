import "~/styles/globals.css";

// import { GeistSans } from "geist/font/sans";
import { inter } from "./ui/fonts";
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
    <html lang="en">
      <body
        className={`${inter.className} flex min-h-svh flex-col antialiased`}
      >
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SessionProvider session={session}>{children}</SessionProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
