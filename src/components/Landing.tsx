"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { signIn, useSession } from "next-auth/react";
import LandingHeader from "./LandingHeader";
import { Badge } from "./ui/badge";
import { noteColorVariants, type NoteColorVariant } from "~/lib/note-colors";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(useGSAP, ScrollTrigger, TextPlugin);

export function Landing() {
  useGSAP(() => {
    const features = gsap.utils.toArray<Element>(".feature");

    features.forEach((feature) => {
      gsap.from(feature, {
        ease: "power3.inOut",
        autoAlpha: 0,
        y: 41,
        duration: 0.88,
        scrollTrigger: {
          trigger: feature,
          start: "top center",
          toggleActions: "restart none none reverse",
          // markers: true,
        },
      });
    });

    gsap.to(".secure-1", {
      text: {
        value: "secure",
      },
      scrollTrigger: {
        trigger: ".secure-1",
        start: "bottom center",
        toggleActions: "restart none none reverse",
      },
    });

    gsap.to(".secure-2", {
      text: {
        value: "safe",
      },
      scrollTrigger: {
        trigger: ".secure-2",
        start: "bottom center",
        toggleActions: "restart none none reverse",
      },
    });
  });

  const session = useSession();
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <div className="flex-1 p-3 text-center text-base text-blohsh-foreground md:text-xl">
        {/* Hero section with colorful accents */}
        <div className="relative">
          <h1 className="my-12 text-3xl font-bold leading-none md:my-24 md:text-[3.75rem]">
            Accomplish more with{" "}
            <span className="from-note-rose-text via-note-lavender-text to-note-sky-text bg-gradient-to-r bg-clip-text text-transparent">
              better notes
            </span>
          </h1>
        </div>

        <h5 className="my-12 text-center text-base font-normal md:text-2xl">
          <span className="text-note-lavender-text font-semibold">
            Blohsh Notes
          </span>{" "}
          allows you to capture those ideas that came out of nowhere and find
          them quickly
        </h5>

        {/* Main Note Card - styled like dashboard notes */}
        <div className="bg-note-lavender mx-auto my-8 w-11/12 min-w-72 max-w-[800px] overflow-hidden rounded-2xl shadow-lg">
          {/* Colored Header - like Note component */}
          <div className="flex items-center justify-between px-10 py-6">
            <span className="text-note-lavender-text text-lg font-semibold">
              ✨ Features
            </span>
            <div className="flex gap-2">
              <Badge
                variant="secondary"
                className="bg-note-content-bg/80 px-2.5 py-1 text-xs font-medium"
              >
                Productivity 🚀
              </Badge>
              <Badge
                variant="secondary"
                className="bg-note-content-bg/80 px-2.5 py-1 text-xs font-medium"
              >
                Notes 📝
              </Badge>
            </div>
          </div>

          {/* Content area - white/dark background like Note */}
          <div className="bg-note-content-bg mx-10 mb-10 rounded-2xl p-6">
            <p className="feature text-note-rose-text">Create notes</p>
            <p className="feature text-note-mint-text">Edit notes</p>
            <p className="feature text-note-cream-text">Delete notes</p>
            <p className="feature text-note-sky-text">Share notes</p>
            <p className="feature text-note-lavender-text">Sort notes</p>
            <p className="feature text-note-rose-text">Your notes</p>
            <p className="feature text-note-mint-text">Your info</p>
            <p className="secret text-note-sky-text">
              Keep it<> </>
              <span className="secure-1 inline-block">******</span>
            </p>
            <p className="secret text-note-lavender-text">
              Keep it<> </>
              <span className="secure-2 inline-block">****</span>
            </p>
          </div>
        </div>

        {/* Feature cards grid with colors */}
        <div className="mx-auto grid max-w-[800px] grid-cols-[repeat(auto-fit,_minmax(260px,_1fr))] gap-4">
          <h2 className="col-span-full text-3xl font-bold">
            <span className="text-note-cream-text">Sneak</span>{" "}
            <span className="text-note-sky-text">peek</span>
          </h2>

          <FeatureItem icon={"/notes.svg"} colorVariant={noteColorVariants[0]}>
            <h3 className="text-lg font-semibold">
              Your notes, a piece of cake
            </h3>
            <p className="text-base text-muted-foreground">
              Keeping important info has never been easier
            </p>
          </FeatureItem>

          <FeatureItem icon={"/secure.svg"} colorVariant={noteColorVariants[1]}>
            <h3 className="text-lg font-semibold">Privacy, a big deal</h3>
            <p className="text-base text-muted-foreground">
              State of the art auth system so only you can see your notes
            </p>
          </FeatureItem>

          <FeatureItem
            icon={"/responsive.svg"}
            colorVariant={noteColorVariants[3]}
          >
            <h3 className="text-lg font-semibold">Notes, notes everywhere</h3>
            <p className="text-base text-muted-foreground">
              Keep important info handy. Manage notes from your phone, tablet or
              desktop
            </p>
          </FeatureItem>

          <FeatureItem icon={"/sort.svg"} colorVariant={noteColorVariants[4]}>
            <h3 className="text-lg font-semibold">Find stuff fast</h3>
            <p className="text-base text-muted-foreground">
              Bunch of options to search and sort notes, so you get what you
              need when you need it
            </p>
          </FeatureItem>
        </div>

        {/* CTA section with gradient */}
        <div className="from-note-rose/50 via-note-lavender/50 to-note-sky/50 mt-8 flex h-80 flex-wrap content-center items-center justify-center gap-4 rounded-2xl bg-gradient-to-br">
          <Button
            size="lg"
            className="bg-note-lavender-text hover:bg-note-lavender-text/90"
            onClick={() => {
              if (session.data?.user.id) {
                router.push("/home");
              } else {
                return signIn(undefined, { callbackUrl: "/home" });
              }
            }}
          >
            Get started now ✨
          </Button>
          <p className="w-full font-medium">
            Capturing ideas has never been so{" "}
            <span className="text-note-rose-text">fun</span>
          </p>
        </div>
      </div>
    </div>
  );
}

const FeatureItem = ({
  icon,
  children,
  colorVariant,
}: {
  icon: string;
  children: React.ReactNode;
  colorVariant: NoteColorVariant;
}) => {
  return (
    <div
      className={`overflow-hidden rounded-2xl ${colorVariant.bg} shadow-sm transition-transform hover:scale-[1.02]`}
    >
      {/* Colored header */}
      <div className={`px-4 py-3 ${colorVariant.headerText}`}>
        <Image
          src={icon}
          alt="Feature icon"
          width={48}
          height={48}
          className="mx-auto"
        />
      </div>
      {/* Content area */}
      <div className="bg-note-content-bg mx-3 mb-3 flex flex-col gap-2 rounded-xl p-4 text-card-foreground">
        {children}
      </div>
    </div>
  );
};
