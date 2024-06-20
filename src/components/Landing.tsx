"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

export function Landing() {
  return (
    <div className="p-3 text-center text-base text-blohsh-foreground md:text-xl">
      <h1 className="my-12 text-3xl font-bold leading-none lg:my-24 lg:text-[3.75rem]">
        Accomplish more with better notes
      </h1>
      <h5 className="my-12 text-center text-base font-normal lg:text-2xl">
        <span className="font-semibold text-blohsh-orange">Blohsh Notes</span>{" "}
        allows you to capture those ideas that came out of nowhere and find them
        quickly
      </h5>

      <div className="mx-auto my-8 w-11/12 min-w-72 max-w-[800px] rounded-lg border border-blohsh-border bg-white text-blohsh-foreground">
        <p className="feature">Create notes</p>
        <p className="feature">Edit notes</p>
        <p className="feature">Delete notes</p>
        <p className="feature">Share notes</p>
        <p className="feature">Sort notes</p>
        <p className="feature">Your notes</p>
        <p className="feature">Your info</p>
        <p className="feature secret">
          Keep it
          <span className="secure-1"> ••••••</span>
        </p>
        <p className="feature">
          Keep it
          <span className="secure-2"> ••••</span>
        </p>
      </div>

      <div className="mx-auto grid max-w-[800px] grid-cols-[repeat(auto-fit,_minmax(260px,_1fr))] gap-4 [&_h3]:text-lg [&_h3]:font-semibold [&_p]:text-base">
        <h2 className="col-span-full text-3xl font-bold">Sneak peek</h2>
        <FeatureItem icon={"/notes.svg"}>
          <h3>Your notes, a piece of cake</h3>
          <p>Keeping important info has never been easier</p>
        </FeatureItem>

        <FeatureItem icon={"/secure.svg"}>
          <h3>Privacy, a big deal</h3>
          <p>State of the art auth system so only you can see your notes</p>
        </FeatureItem>

        <FeatureItem icon={"/responsive.svg"}>
          <h3>Notes, notes eveywhere</h3>
          <p>
            Keep important info handy. Manage notes from your phone, tablet or
            desktop
          </p>
        </FeatureItem>

        <FeatureItem icon={"/sort.svg"}>
          <h3>Find stuff fast</h3>
          <p>
            Bunch of options to search and sort notes, so you get what you need
            when you need it
          </p>
        </FeatureItem>
      </div>

      <div className="mt-8 flex h-80 flex-wrap content-center items-center justify-center gap-4 rounded bg-blohsh-hover">
        <Button onClick={() => signIn(undefined, { callbackUrl: "/notes" })}>
          Get started now
        </Button>
        <p className="w-full">Capturing ideas has never been so fun</p>
      </div>
    </div>
  );
}

const FeatureItem = ({
  icon,
  children,
}: {
  icon: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-background p-3">
      <Image src={icon} alt="Feature icon" width={88} height={88} />
      {children}
    </div>
  );
};
