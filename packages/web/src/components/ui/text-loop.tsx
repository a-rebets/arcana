import {
  AnimatePresence,
  type AnimatePresenceProps,
  type HTMLMotionProps,
  motion,
  type Transition,
  type Variants,
} from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { TextShimmer } from "./text-shimmer";

export type TextLoopProps = {
  items: string[];
  className?: string;
  interval?: number;
  transition?: Transition;
  variants?: Variants;
  onIndexChange?: (index: number) => void;
  trigger?: boolean;
  mode?: AnimatePresenceProps["mode"];
  index?: number;
  itemsWithShimmer?: number[];
} & HTMLMotionProps<"div">;

export function TextLoop({
  items,
  className,
  interval = 2,
  transition = { duration: 0.3 },
  variants,
  onIndexChange,
  trigger = true,
  mode = "popLayout",
  itemsWithShimmer = [],
  index,
  ...props
}: TextLoopProps) {
  const [internalIndex, setInternalIndex] = useState(0);
  const currentIndex = typeof index === "number" ? index : internalIndex;

  useEffect(() => {
    if (typeof index === "number") return;
    if (!trigger) return;

    const intervalMs = interval * 1000;
    const timer = setInterval(() => {
      setInternalIndex((current) => {
        const next = (current + 1) % items.length;
        onIndexChange?.(next);
        return next;
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [items.length, interval, onIndexChange, trigger, index]);

  const motionVariants: Variants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  };

  const withShimmer = itemsWithShimmer.includes(currentIndex);

  return (
    <motion.div
      className={cn("relative whitespace-nowrap inline-block", className)}
    >
      <span
        style={{
          opacity: 0,
          visibility: "hidden",
          display: "inline-block",
        }}
      >
        {items[currentIndex]}
      </span>
      <AnimatePresence mode={mode} initial={true}>
        <motion.div
          layout="position"
          className="absolute inset-0"
          key={currentIndex}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
          variants={variants || motionVariants}
          {...props}
        >
          {withShimmer ? (
            <TextShimmer duration={0.8} spread={2} as="span">
              {items[currentIndex]}
            </TextShimmer>
          ) : (
            <span>{items[currentIndex]}</span>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
