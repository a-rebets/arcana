import * as ProgressPrimitive from "@radix-ui/react-progress";
import type * as React from "react";

import { cn } from "@/lib/utils";

function Progress({
  className,
  indicatorClassName,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  indicatorClassName?: string;
}) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className,
      )}
      value={value}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "bg-primary h-full w-full flex-1 transition-transform",
          "data-[state=indeterminate]:animate-progress-indeterminate motion-reduce:animate-none",
          indicatorClassName,
        )}
        style={
          value !== null && value !== undefined
            ? {
                transform: `translateX(-${
                  100 - Math.max(0, Math.min(100, value))
                }%)`,
              }
            : undefined
        }
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
