import { motion } from "motion/react";
import { type Gradient, getGradientClasses } from "@/lib/colors";
import { cn } from "@/lib/utils";

export function GradientBackground({
  className,
  gradient,
  active,
}: {
  className?: string;
  gradient: Gradient;
  active: boolean;
}) {
  return (
    <motion.div
      aria-hidden
      className={cn(
        "absolute -inset-1 -z-10 pointer-events-none rounded-xl blur-md",
        getGradientClasses(gradient),
        className,
      )}
      style={{
        background:
          "conic-gradient(from var(--gradient-angle, 0deg), var(--tw-gradient-from), var(--tw-gradient-to), var(--tw-gradient-from))",
      }}
      initial={{
        opacity: 0,
      }}
      animate={{
        "--gradient-angle": active ? "360deg" : "0deg",
        opacity: active ? 0.75 : 0,
      }}
      transition={{
        duration: active ? 4 : 0,
        repeat: Infinity,
        ease: "linear",
        opacity: { duration: 0.5 },
      }}
    />
  );
}
