"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

export default function NotesContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  useGSAP(() => {
    const notes = gsap.utils.toArray<Element>(".note");

    gsap.from(notes, {
      autoAlpha: 0,
      duration: 0.5,
      y: 48,
      ease: "back.out",
      stagger: 0.1,
    });
  });
  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3">
      {children}
    </div>
  );
}
