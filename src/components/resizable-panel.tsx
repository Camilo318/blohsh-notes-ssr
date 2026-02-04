"use client";

import { AnimatePresence, motion } from "motion/react";
import { type ComponentProps, type ReactNode, createContext, use } from "react";
import useMeasure from "react-use-measure";

const PanelContext = createContext({ value: "" });

export function Root<T extends string>({
  children,
  value,
  className,
  ...rest
}: {
  children: ReactNode;
  value: T;
} & ComponentProps<"div">) {
  const [ref, bounds] = useMeasure();

  return (
    <motion.div
      className={className}
      animate={{ height: bounds.height > 0 ? bounds.height : undefined }}
      transition={{ type: "spring", bounce: 0, duration: 0.8 }}
      style={{ overflow: "hidden", position: "relative" }}
    >
      <div ref={ref}>
        <PanelContext.Provider value={{ value }}>
          <div {...rest}>{children}</div>
        </PanelContext.Provider>
      </div>
    </motion.div>
  );
}

export function Content({
  value,
  children,
  ...rest
}: {
  value: string;
  children: ReactNode;
} & ComponentProps<"div">) {
  const panelContext = use(PanelContext);
  const isActive = panelContext.value === value;

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              type: "tween",
              ease: "easeInOut",
              duration: 0.3,
              delay: 0.2,
            },
          }}
          exit={{
            opacity: 0,
            transition: {
              type: "tween",
              ease: "easeInOut",
              duration: 0.2,
            },
          }}
        >
          <div {...rest}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
