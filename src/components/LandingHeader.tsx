"use client";

import { useSession, signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { ModeToggle } from "~/components/ModeToggle";

const LandingHeader = () => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <header className="flex items-center justify-between p-3">
      <div className="text-xl font-bold">Blohsh Notes</div>

      {session ? (
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button
            variant="outline"
            className="h-8"
            onClick={() => router.push("/home")}
          >
            My notes
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button
            className="h-8"
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

export default LandingHeader;
