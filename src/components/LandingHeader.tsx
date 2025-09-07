"use client";
import { useSession, signIn } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

const LandingHeader = () => {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <header className="flex items-center justify-between p-3">
      <div className="text-xl font-bold">Blohsh Notes</div>

      {session ? (
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button variant="outline" onClick={() => router.push("/home")}>
            My notes
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button
            onClick={() => signIn(undefined, { callbackUrl: "/home" })}
            variant="outline"
          >
            Sign in
          </Button>
        </div>
      )}
    </header>
  );
};

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setTheme("light")}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setTheme("dark")}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setTheme("system")}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LandingHeader;
