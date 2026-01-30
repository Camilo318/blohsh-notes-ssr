"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { signIn, useSession } from "next-auth/react";
import LandingHeader from "./LandingHeader";
import { Badge } from "./ui/badge";
import { noteColorVariants, type NoteColorVariant } from "~/lib/note-colors";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Sparkles, Star, Heart, Zap } from "lucide-react";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { spaceGrotesk } from "~/app/ui/fonts";

gsap.registerPlugin(useGSAP, ScrollTrigger, TextPlugin);

export function Landing() {
  useGSAP(() => {
    const features = gsap.utils.toArray<Element>(".feature");

    features.forEach((feature) => {
      gsap.from(feature, {
        ease: "power3.out",
        autoAlpha: 0,
        y: 41,
        duration: 0.88,
        scrollTrigger: {
          trigger: feature,
          start: "top center",
          toggleActions: "restart none none reverse",
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

    // Animate floating shapes
    gsap.to(".float-shape", {
      y: "random(-20, 20)",
      x: "random(-10, 10)",
      rotation: "random(-15, 15)",
      duration: "random(3, 5)",
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      stagger: {
        each: 0.5,
        from: "random",
      },
    });
  });

  const session = useSession();
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <LandingHeader />

      {/* Dynamic gradient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-note-rose/20 via-background to-note-lavender/20" />
        <div className="animate-pulse-slow absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-note-rose/40 to-note-cream/30 blur-3xl" />
        <div className="animate-pulse-slow absolute -right-40 top-60 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-note-lavender/50 to-note-sky/30 blur-3xl [animation-delay:1s]" />
        <div className="animate-pulse-slow absolute bottom-40 left-1/3 h-[350px] w-[350px] rounded-full bg-gradient-to-br from-note-mint/40 to-note-sky/30 blur-3xl [animation-delay:2s]" />
        <div className="absolute bottom-20 right-1/4 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-note-cream/50 to-note-rose/20 blur-3xl" />
      </div>

      <div className="relative flex-1 p-3 text-center text-base text-blohsh-foreground md:text-xl">
        {/* Floating decorative elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="float-shape absolute left-[10%] top-[15%] h-16 w-16 rounded-2xl bg-note-rose/60 shadow-lg shadow-note-rose/30" />
          <div className="float-shape absolute right-[15%] top-[20%] h-12 w-12 rounded-full bg-note-mint/70 shadow-lg shadow-note-mint/30" />
          <div className="float-shape absolute left-[20%] top-[45%] h-10 w-10 rounded-xl bg-note-sky/60 shadow-lg shadow-note-sky/30" />
          <div className="float-shape absolute right-[10%] top-[55%] h-14 w-14 rounded-2xl bg-note-lavender/70 shadow-lg shadow-note-lavender/30" />
          <div className="float-shape absolute left-[8%] top-[75%] h-8 w-8 rounded-full bg-note-cream/80 shadow-lg shadow-note-cream/30" />
          <div className="float-shape absolute right-[25%] top-[35%] h-6 w-6 rounded-lg bg-note-rose/50 shadow-md" />
        </div>

        {/* Hero section */}
        <div className="relative pt-8 md:pt-16">
          {/* Decorative badge */}
          <div className="liquid-glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2">
            <Sparkles className="h-4 w-4 text-note-lavender-text" />
            <span className="text-sm font-medium text-note-lavender-text">
              Your ideas, beautifully organized
            </span>
          </div>

          <h1 className="my-8 text-4xl font-extrabold leading-tight tracking-tight md:my-12 md:text-6xl lg:text-7xl">
            Accomplish more with{" "}
            <span className="relative">
              <span className="animate-gradient bg-gradient-to-r from-note-rose-text via-note-lavender-text via-50% to-note-sky-text bg-[length:200%_auto] bg-clip-text text-transparent">
                better notes
              </span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
              >
                <path
                  d="M2 8C40 3 80 3 100 5C120 7 160 8 198 4"
                  stroke="url(#underline-gradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="underline-gradient"
                    x1="0"
                    y1="0"
                    x2="200"
                    y2="0"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="hsl(var(--note-rose-text))" />
                    <stop
                      offset="0.5"
                      stopColor="hsl(var(--note-lavender-text))"
                    />
                    <stop offset="1" stopColor="hsl(var(--note-sky-text))" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>
        </div>

        <p className="relative mx-auto my-8 max-w-2xl text-lg font-normal text-muted-foreground md:my-12 md:text-xl">
          <span className="font-bold text-note-lavender-text">
            Blohsh Notes
          </span>{" "}
          allows you to capture those ideas that came out of nowhere and find
          them quickly
        </p>

        {/* Main Note Card - styled exactly like dashboard Note component */}
        <Card className="liquid-glass relative mx-auto my-12 w-11/12 max-w-[800px] overflow-hidden rounded-2xl shadow-2xl shadow-note-lavender/10 transition-all duration-500 hover:shadow-3xl hover:shadow-note-lavender/20">
          {/* Colored Header - matching Note component */}
          <CardHeader className="flex-row items-center justify-between space-y-0 px-6 py-4 md:px-8">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-note-lavender-text md:text-xl">
              <Sparkles className="h-5 w-5" />
              Features
            </CardTitle>
            <div className="flex flex-wrap justify-end gap-2">
              <Badge
                variant="secondary"
                className="border-transparent bg-white/50 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm dark:bg-white/10"
              >
                Productivity 🚀
              </Badge>
              <Badge
                variant="secondary"
                className="border-transparent bg-white/50 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm dark:bg-white/10"
              >
                Notes 📝
              </Badge>
            </div>
          </CardHeader>

          {/* Content area - white/dark background like Note component */}
          <div className="p-4 md:p-6">
            <CardContent className="flex flex-col gap-4 rounded-2xl bg-slate-200/50 p-6 shadow-inner backdrop-blur-md md:p-8 dark:bg-white/5">
              {/* Tags row like Note component */}
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="px-2.5 py-1 text-xs font-medium"
                >
                  Getting Started ✨
                </Badge>
                <Badge
                  variant="secondary"
                  className="px-2.5 py-1 text-xs font-medium"
                >
                  Guide 📖
                </Badge>
              </div>

              <div className={spaceGrotesk.className}>
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
            </CardContent>
          </div>
        </Card>

        {/* Feature cards grid with colors */}
        <div className="relative mx-auto grid max-w-[1000px] auto-rows-[max-content,max-content] grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))] gap-6 px-4 py-8">
          <div className="col-span-full row-span-2 flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 rounded-full bg-gradient-to-r from-note-rose to-note-cream" />
              <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
                <span className="text-note-cream-text">Sneak</span>{" "}
                <span className="text-note-sky-text">peek</span>
              </h2>
              <div className="h-1 w-12 rounded-full bg-gradient-to-r from-note-sky to-note-mint" />
            </div>
            <p className="text-muted-foreground">
              Discover what makes Blohsh Notes special
            </p>
          </div>

          <FeatureItem
            icon={"/notes.svg"}
            colorVariant={noteColorVariants[0]}
            accentIcon={<Star className="size-7" />}
          >
            <h3 className="text-lg font-bold text-note-rose-text">
              Your notes, at your fingertips
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Save ideas has never been easier. Create, edit, and organize
              effortlessly.
            </p>
          </FeatureItem>

          <FeatureItem
            icon={"/secure.svg"}
            colorVariant={noteColorVariants[1]}
            accentIcon={<Heart className="size-7" />}
          >
            <h3 className="text-lg font-bold text-note-mint-text">
              Privacy, a big deal
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              State of the art auth system so only you can see your notes. Your
              data stays yours.
            </p>
          </FeatureItem>

          <FeatureItem
            icon={"/responsive.svg"}
            colorVariant={noteColorVariants[3]}
            accentIcon={<Zap className="size-7" />}
          >
            <h3 className="text-lg font-bold text-note-sky-text">
              Notes, notes everywhere
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Keep important info handy. Manage notes from your phone, tablet or
              desktop seamlessly.
            </p>
          </FeatureItem>

          <FeatureItem
            icon={"/sort.svg"}
            colorVariant={noteColorVariants[4]}
            accentIcon={<Sparkles className="size-7" />}
          >
            <h3 className="text-lg font-bold text-note-lavender-text">
              Find stuff fast
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Powerful search and sort options, so you get what you need when
              you need it.
            </p>
          </FeatureItem>
        </div>

        {/* CTA section with liquid glass effect */}
        <div className="relative mx-4 mt-16 overflow-hidden rounded-3xl">
          {/* Decorative blurred color shapes */}
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-note-mint opacity-70 blur-3xl" />
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-note-lavender opacity-70 blur-3xl" />
          <div className="absolute -bottom-16 right-1/4 h-48 w-48 rounded-full bg-note-rose opacity-60 blur-3xl" />
          <div className="absolute left-1/4 top-1/4 h-40 w-40 rounded-full bg-note-sky opacity-50 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-note-cream opacity-60 blur-2xl" />

          {/* Liquid glass container */}
          <div className="liquid-glass relative z-10 flex min-h-[350px] flex-col items-center justify-center gap-6 rounded-3xl p-8">
            <div className="mb-2 flex items-center gap-2">
              <Star className="h-6 w-6 text-note-cream-text" />
              <Star className="h-8 w-8 text-note-rose-text" />
              <Star className="h-6 w-6 text-note-sky-text" />
            </div>

            <h3 className="text-2xl font-bold text-foreground md:text-3xl">
              Ready to organize your thoughts?
            </h3>

            <Button
              size="lg"
              className="group relative overflow-hidden bg-note-lavender px-10 py-7 text-lg font-bold text-note-lavender-text shadow-sm transition-all duration-300 hover:scale-105 hover:bg-note-lavender/80"
              onClick={() => {
                if (session.data?.user.id) {
                  router.push("/home");
                } else {
                  return signIn(undefined, { callbackUrl: "/home" });
                }
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Get started now
                <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12" />
              </span>
            </Button>

            <p className="text-lg font-medium text-muted-foreground">
              Capturing ideas has never been so{" "}
              <span className="font-extrabold text-note-rose-text">
                colorful
              </span>
            </p>
          </div>
        </div>

        {/* Footer spacer */}
        <div className="h-16" />
      </div>
    </div>
  );
}

const FeatureItem = ({
  icon,
  children,
  colorVariant,
  accentIcon,
}: {
  icon: string;
  children: React.ReactNode;
  colorVariant: NoteColorVariant;
  accentIcon?: React.ReactNode;
}) => {
  return (
    <Card
      className={`liquid-glass group relative row-span-2 grid grid-rows-subgrid gap-0 overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Colored header with icon */}
      <CardHeader className="relative flex-row items-center justify-between space-y-0 px-5 py-4">
        <div
          className={`flex items-center gap-2 transition-transform duration-300 group-hover:scale-110 ${colorVariant.headerText}`}
        >
          {accentIcon}
        </div>
        <div className="rounded-xl bg-white/50 p-3 shadow-md backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/60 dark:bg-white/10 dark:group-hover:bg-white/20">
          <Image src={icon} alt="feature icon" width={36} height={36} />
        </div>
      </CardHeader>

      {/* Content area */}
      <CardContent className="relative mx-3 mb-3 flex flex-col gap-3 rounded-xl bg-slate-200/50 p-5 shadow-inner backdrop-blur-md dark:bg-white/5">
        {children}
      </CardContent>
    </Card>
  );
};
