"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LandingHeader from "./LandingHeader";
import DemoMuralDialog from "./DemoMuralDialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { noteColorVariants, type NoteColorVariant } from "~/lib/note-colors";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { spaceGrotesk } from "~/app/ui/fonts";
import {
  ArrowRight,
  CheckCircle2,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "~/lib/utils";

const EASE_OUT: [number, number, number, number] = [0.215, 0.61, 0.355, 1];
const EASE_IN_OUT: [number, number, number, number] = [0.645, 0.045, 0.355, 1];
const SCROLL_REVEAL_VIEWPORT = { once: false, amount: 0.45 } as const;

type Feature = {
  title: string;
  description: string;
  eyebrow: string;
  icon: LucideIcon;
  colorVariant: NoteColorVariant;
};

type WorkflowStep = {
  title: string;
  description: string;
};

type ScrollStoryItem = {
  title: string;
  detail: string;
  tone: string;
};

const features: Feature[] = [
  {
    title: "Capture at the speed of thought",
    description:
      "Jot ideas in seconds, then polish them later. Fast capture keeps your momentum intact.",
    eyebrow: "Fast drafting",
    icon: Sparkles,
    colorVariant: noteColorVariants[4],
  },
  {
    title: "Private by default",
    description:
      "Secure auth and isolated data keep your notes where they belong: with you.",
    eyebrow: "Trusted security",
    icon: ShieldCheck,
    colorVariant: noteColorVariants[1],
  },
  {
    title: "Find exactly what you need",
    description:
      "Tags, filtering, and focused search help you move from chaos to clarity instantly.",
    eyebrow: "Smart retrieval",
    icon: Search,
    colorVariant: noteColorVariants[3],
  },
];

const workflow: WorkflowStep[] = [
  {
    title: "Capture",
    description: "Save fleeting ideas the moment they appear.",
  },
  {
    title: "Organize",
    description: "Group by tags, sort by intent, and keep context close.",
  },
  {
    title: "Act",
    description: "Turn notes into outcomes without friction.",
  },
];

const scrollStoryItems: ScrollStoryItem[] = [
  {
    title: "Create notes",
    detail: "Capture ideas before they disappear.",
    tone: "text-note-rose-text",
  },
  {
    title: "Edit notes",
    detail: "Refine your thinking as your plans evolve.",
    tone: "text-note-mint-text",
  },
  {
    title: "Delete notes",
    detail: "Clear clutter and keep only what matters.",
    tone: "text-note-cream-text",
  },
  {
    title: "Share notes",
    detail: "Collaborate when context needs to move.",
    tone: "text-note-sky-text",
  },
  {
    title: "Sort notes",
    detail: "Organize by tags and priorities in seconds.",
    tone: "text-note-lavender-text",
  },
  {
    title: "Keep it secure",
    detail: "Your private thoughts stay private.",
    tone: "text-note-mint-text",
  },
  {
    title: "Keep it safe",
    detail: "Authentication and data isolation by default.",
    tone: "text-note-sky-text",
  },
];

const ambientBlobs = [
  {
    className:
      "-left-24 top-24 h-72 w-72 bg-note-lavender/35 dark:bg-note-lavender/30",
    duration: 9,
    delay: 0,
  },
  {
    className:
      "right-[-5rem] top-[22%] h-64 w-64 bg-note-sky/40 dark:bg-note-sky/30",
    duration: 10.5,
    delay: 0.8,
  },
  {
    className:
      "bottom-20 left-[22%] h-80 w-80 bg-note-rose/30 dark:bg-note-rose/25",
    duration: 11.5,
    delay: 1.4,
  },
  {
    className:
      "bottom-[-3rem] right-[18%] h-56 w-56 bg-note-mint/35 dark:bg-note-mint/25",
    duration: 8.8,
    delay: 0.5,
  },
] as const;

export function Landing() {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const { data: session } = useSession();
  const router = useRouter();
  const [isDemoMuralOpen, setIsDemoMuralOpen] = useState(false);

  const goToApp = () => {
    if (session?.user.id) {
      router.push("/home");
      return;
    }

    void signIn(undefined, { callbackUrl: "/home" });
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <LandingHeader />
      <DemoMuralDialog
        open={isDemoMuralOpen}
        onOpenChange={setIsDemoMuralOpen}
      />

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,hsl(var(--note-lavender)_/_0.45),transparent_45%),radial-gradient(circle_at_86%_16%,hsl(var(--note-sky)_/_0.35),transparent_40%),radial-gradient(circle_at_55%_78%,hsl(var(--note-rose)_/_0.3),transparent_46%)]" />
        {ambientBlobs.map((blob, index) => (
          <motion.div
            key={`${blob.className}-${index}`}
            className={cn("absolute rounded-full blur-3xl", blob.className)}
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={
              shouldReduceMotion
                ? { opacity: 0.75 }
                : {
                    opacity: [0.58, 0.88, 0.58],
                    transform: [
                      "translate3d(0px, 0px, 0px) scale(1)",
                      "translate3d(14px, -16px, 0px) scale(1.07)",
                      "translate3d(0px, 0px, 0px) scale(1)",
                    ],
                  }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    duration: blob.duration,
                    delay: blob.delay,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: EASE_IN_OUT,
                  }
            }
          />
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.22)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.22)_1px,transparent_1px)] bg-[size:52px_52px] [mask-image:radial-gradient(circle_at_center,black,transparent_82%)]" />
      </div>

      <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-20 px-4 pb-20 pt-8 md:px-8 md:pt-12 lg:gap-24">
        <section className="grid items-start gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, transform: "translateY(20px)" }
            }
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 1, transform: "translateY(0px)" }
            }
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="space-y-7"
          >
            <Badge
              variant="secondary"
              className="liquid-glass rounded-full border-note-lavender-text/25 bg-note-lavender/55 px-4 py-1.5 text-xs font-semibold tracking-wide text-note-lavender-text sm:text-sm"
            >
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Modern note-taking, tuned for clarity
            </Badge>

            <h1 className="text-balance text-4xl font-black leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Organize your
              <span className="block bg-gradient-to-r from-note-rose-text via-note-lavender-text to-note-sky-text bg-clip-text pb-2 text-transparent">
                next big idea
              </span>
            </h1>

            <p className="max-w-2xl text-pretty text-base text-muted-foreground md:text-lg">
              Blohsh Notes gives your thoughts a clear home. Capture fast, stay
              secure, and surface the right note exactly when you need it.
            </p>

            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                className="group h-12 rounded-xl bg-primary px-6 text-primary-foreground shadow-lg shadow-primary/20"
                onClick={goToApp}
              >
                Start for free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-xl border-border/80 bg-card/40 px-6"
                onClick={() => setIsDemoMuralOpen(true)}
              >
                View demo notes
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {["Instant capture", "Private by default", "Dark mode ready"].map(
                (pill) => (
                  <Badge
                    key={pill}
                    variant="secondary"
                    className="rounded-full border-border/60 bg-card/65 px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {pill}
                  </Badge>
                ),
              )}
            </div>
          </motion.div>

          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, transform: "translateY(28px) scale(0.985)" }
            }
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 1, transform: "translateY(0px) scale(1)" }
            }
            transition={{ duration: 0.55, delay: 0.06, ease: EASE_OUT }}
            className="relative"
          >
            <Card className="liquid-glass overflow-hidden rounded-3xl border-border/70 shadow-2xl shadow-note-lavender/20">
              <CardHeader className="space-y-4 border-b border-border/60 bg-card/45 px-6 py-5">
                <div className="flex items-center justify-between gap-3">
                  <Badge className="rounded-full bg-note-lavender/70 text-note-lavender-text">
                    Live preview
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3.5 w-3.5 text-note-cream-text" />
                    Trusted by makers
                  </div>
                </div>
                <CardTitle className="text-left text-xl font-bold leading-snug text-foreground">
                  Your notes feel like a workspace, not a dumping ground.
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-5 md:p-6">
                {[
                  {
                    title: "Sprint planning",
                    body: "Capture blockers, ideas, and action items in one pass.",
                    tone: noteColorVariants[0],
                  },
                  {
                    title: "Product research",
                    body: "Pin references, save links, and keep insights searchable.",
                    tone: noteColorVariants[3],
                  },
                  {
                    title: "Weekly reflection",
                    body: "Turn scattered thoughts into clear next steps.",
                    tone: noteColorVariants[1],
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={
                      shouldReduceMotion
                        ? false
                        : { opacity: 0, transform: "translateY(14px)" }
                    }
                    animate={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : { opacity: 1, transform: "translateY(0px)" }
                    }
                    transition={{
                      duration: 0.35,
                      delay: shouldReduceMotion ? 0 : 0.14 + index * 0.08,
                      ease: EASE_OUT,
                    }}
                    className="rounded-2xl border border-border/60 bg-note-content-bg/80 p-4 text-left shadow-sm"
                  >
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        item.tone.headerText,
                      )}
                    >
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.body}
                    </p>
                  </motion.div>
                ))}

                <div className="grid grid-cols-3 gap-2 pt-1">
                  {["Encrypted", "Autosaved", "Synced"].map((meta) => (
                    <div
                      key={meta}
                      className="rounded-xl border border-border/70 bg-card/55 px-3 py-2 text-center text-xs font-semibold text-muted-foreground"
                    >
                      {meta}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        <motion.section
          initial={
            shouldReduceMotion
              ? false
              : { opacity: 0, transform: "translateY(20px)" }
          }
          whileInView={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 1, transform: "translateY(0px)" }
          }
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className="mx-auto w-full max-w-5xl"
        >
          <Card className="liquid-glass overflow-hidden rounded-3xl border-border/70">
            <CardHeader className="border-b border-border/60 bg-card/50 px-6 py-5 md:px-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="text-xl font-bold md:text-2xl">
                  Feature story as you scroll
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="rounded-full bg-note-lavender/65 text-note-lavender-text"
                >
                  Scroll to reveal
                </Badge>
              </div>
              <p className="max-w-2xl text-sm text-muted-foreground">
                The same feature cadence you liked, tuned to the new visual
                flow.
              </p>
            </CardHeader>
            <CardContent className="px-6 py-6 md:px-8 md:py-8">
              <div className="space-y-14 md:space-y-20">
                {scrollStoryItems.map((item, index) => (
                  <motion.article
                    key={item.title}
                    initial={
                      shouldReduceMotion
                        ? false
                        : {
                            opacity: 0,
                            transform: "translateY(34px) scale(0.985)",
                          }
                    }
                    whileInView={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : {
                            opacity: 1,
                            transform: "translateY(0px) scale(1)",
                          }
                    }
                    viewport={{ once: false, amount: 0.7 }}
                    transition={{
                      duration: 0.48,
                      delay: shouldReduceMotion ? 0 : index * 0.02,
                      ease: EASE_OUT,
                    }}
                    className="space-y-3"
                  >
                    <h3
                      className={cn(
                        spaceGrotesk.className,
                        "text-balance text-3xl font-bold leading-[1.04] tracking-[-0.025em] sm:text-4xl md:text-5xl",
                        item.tone,
                      )}
                    >
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground md:text-base">
                      {item.detail}
                    </p>
                  </motion.article>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section
          initial={
            shouldReduceMotion
              ? false
              : { opacity: 0, transform: "translateY(24px)" }
          }
          whileInView={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 1, transform: "translateY(0px)" }
          }
          viewport={{ once: false, amount: 0.35 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className="space-y-8"
        >
          <div className="space-y-3 text-center">
            <motion.p
              initial={
                shouldReduceMotion
                  ? false
                  : { opacity: 0, transform: "translateY(12px)" }
              }
              whileInView={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, transform: "translateY(0px)" }
              }
              viewport={SCROLL_REVEAL_VIEWPORT}
              transition={{ duration: 0.35, ease: EASE_OUT }}
              className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground"
            >
              Why Blohsh
            </motion.p>
            <motion.h2
              initial={
                shouldReduceMotion
                  ? false
                  : { opacity: 0, transform: "translateY(16px)" }
              }
              whileInView={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, transform: "translateY(0px)" }
              }
              viewport={SCROLL_REVEAL_VIEWPORT}
              transition={{ duration: 0.42, delay: 0.04, ease: EASE_OUT }}
              className="text-balance text-3xl font-black tracking-tight md:text-5xl"
            >
              Built for modern note workflows
            </motion.h2>
            <motion.p
              initial={
                shouldReduceMotion
                  ? false
                  : { opacity: 0, transform: "translateY(14px)" }
              }
              whileInView={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, transform: "translateY(0px)" }
              }
              viewport={SCROLL_REVEAL_VIEWPORT}
              transition={{ duration: 0.4, delay: 0.08, ease: EASE_OUT }}
              className="mx-auto max-w-2xl text-pretty text-muted-foreground"
            >
              A focused interface with expressive visuals, so your writing feels
              calm and your thoughts stay organized.
            </motion.p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                feature={feature}
                index={index}
                shouldReduceMotion={shouldReduceMotion}
              />
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={
            shouldReduceMotion
              ? false
              : { opacity: 0, transform: "translateY(20px)" }
          }
          whileInView={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 1, transform: "translateY(0px)" }
          }
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.44, ease: EASE_OUT }}
          className="grid items-stretch gap-5 lg:grid-cols-[1fr_1fr]"
        >
          <Card className="liquid-glass rounded-3xl border-border/70">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                A simple flow that scales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {workflow.map((step, index) => (
                <div
                  key={step.title}
                  className="flex gap-3 rounded-2xl border border-border/70 bg-card/55 p-4"
                >
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-note-lavender/70 text-xs font-bold text-note-lavender-text">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {step.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="liquid-glass relative overflow-hidden rounded-3xl border-border/70">
            <div className="absolute -right-16 top-0 h-44 w-44 rounded-full bg-note-lavender/35 blur-3xl" />
            <div className="absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-note-mint/35 blur-3xl" />
            <CardContent className="relative flex h-full flex-col justify-between gap-8 p-7">
              <div className="space-y-3">
                <Badge className="rounded-full bg-note-sky/60 text-note-sky-text">
                  <Zap className="mr-1.5 h-3.5 w-3.5" />
                  Focus mode
                </Badge>
                <h3 className="text-3xl font-black leading-tight">
                  Ready to turn ideas into action?
                </h3>
                <p className="text-muted-foreground">
                  Start capturing your best work in a notes app that feels fast,
                  intentional, and beautifully yours.
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  size="lg"
                  className="group h-12 w-full rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  onClick={goToApp}
                >
                  Open Blohsh Notes
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                </Button>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-note-mint-text" />
                    Free to start
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-note-sky-text" />
                    Private account data
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </main>
    </div>
  );
}

const FeatureCard = ({
  feature,
  index,
  shouldReduceMotion,
}: {
  feature: Feature;
  index: number;
  shouldReduceMotion: boolean;
}) => {
  const Icon = feature.icon;

  return (
    <motion.article
      initial={
        shouldReduceMotion
          ? false
          : { opacity: 0, transform: "translateY(28px) scale(0.985)" }
      }
      whileInView={
        shouldReduceMotion
          ? { opacity: 1 }
          : { opacity: 1, transform: "translateY(0px) scale(1)" }
      }
      viewport={SCROLL_REVEAL_VIEWPORT}
      transition={{
        duration: 0.48,
        delay: shouldReduceMotion ? 0 : index * 0.08,
        ease: EASE_OUT,
      }}
      whileHover={
        shouldReduceMotion
          ? undefined
          : { transform: "translateY(-4px)", transition: { duration: 0.18 } }
      }
      className="h-full"
    >
      <Card className="liquid-glass h-full rounded-2xl border-border/70">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge
              variant="secondary"
              className={cn(
                "rounded-full border-transparent px-3 py-1 text-xs font-semibold",
                feature.colorVariant.bg,
                feature.colorVariant.headerText,
              )}
            >
              {feature.eyebrow}
            </Badge>
            <span
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-xl border bg-card/60",
                feature.colorVariant.border,
                feature.colorVariant.headerText,
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
          </div>
          <CardTitle
            className={cn(
              "text-xl leading-tight",
              feature.colorVariant.headerText,
            )}
          >
            {feature.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {feature.description}
          </p>
        </CardContent>
      </Card>
    </motion.article>
  );
};
