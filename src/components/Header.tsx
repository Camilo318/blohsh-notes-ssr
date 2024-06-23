"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import Link from "next/link";

const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="flex items-center justify-between p-3">
      <div className="text-xl font-bold">Blohsh Notes</div>

      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={session.user.image as string | undefined} />
              <AvatarFallback className="capitalize">
                {session.user.name?.at(0)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href={"/notes"}>My notes</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="w-full cursor-pointer">
              <button onClick={() => signOut({ callbackUrl: "/" })}>
                Sign out
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <button onClick={() => signIn(undefined, { callbackUrl: "/notes" })}>
          Sign in
        </button>
      )}
    </header>
  );
};

export default Header;
