import {
  CaretDownIcon,
  CheckCircleIcon,
  ClockIcon,
  GearSixIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import { useDebouncedState, useUpdateEffect } from "@react-hookz/web";
import type { ToolUIPart } from "ai";
import { motion } from "motion/react";
import {
  type ComponentProps,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import {
  Disclosure,
  DisclosureContent,
  DisclosureTrigger,
} from "@/components/ui/disclosure";
import { TextLoop } from "@/components/ui/text-loop";
import type { ToolLabels } from "@/lib/tool-labels";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./code-block";

export type ToolProps = ComponentProps<typeof Disclosure>;

export const Tool = ({ className, ...props }: ToolProps) => {
  return (
    <Disclosure
      className={cn("not-prose mb-4 w-full rounded-md", className)}
      {...props}
    />
  );
};

const getHeaderBadge = (state: ToolUIPart["state"]) => {
  const icons = {
    "input-streaming": <ClockIcon className="size-3 animate-pulse" />,
    "input-available": <ClockIcon className="size-3 animate-pulse" />,
    "output-available": <CheckCircleIcon className="size-3 text-green-600" />,
    "output-error": <XCircleIcon className="size-3 text-red-600" />,
  } as const;

  return icons[state];
};

function getOrderedLabels(labels: ToolLabels, state: ToolUIPart["state"]) {
  const order = ["input-streaming", "output-available", "output-error"];
  const currentIndex = order.indexOf(state);
  return {
    orderedLabels: order.map((label) => labels[label as keyof ToolLabels]),
    currentLabelIndex: currentIndex < 0 ? 0 : currentIndex,
  };
}

export type ToolHeaderProps = {
  id?: string;
  state: ToolUIPart["state"];
  className?: string;
  isAsana?: boolean;
  labels: ToolLabels;
  children?: ReactNode;
  isPreliminary?: boolean;
};

export function ToolHeader({
  id,
  className,
  state,
  isAsana,
  labels,
  children,
  isPreliminary,
  ...props
}: ToolHeaderProps) {
  const [internalState, setInternalState] = useState(state);

  const shouldAnimate =
    internalState.startsWith("input-") || isPreliminary === true;
  const [animationComplete, setAnimationComplete] = useDebouncedState(
    false,
    500,
  );

  useUpdateEffect(() => {
    const delay = state === "output-available" ? 500 : 0;
    const timeoutId = setTimeout(() => {
      setInternalState(state);
    }, delay);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [state]);

  useEffect(() => {
    if (!shouldAnimate) {
      setAnimationComplete(true);
    }
  }, [shouldAnimate, setAnimationComplete]);

  const { currentLabelIndex, orderedLabels } = useMemo(
    () => getOrderedLabels(labels, internalState),
    [labels, internalState],
  );

  const animateLayout = animationComplete ? undefined : "position";

  return (
    <DisclosureTrigger {...props}>
      <Button
        layout="size"
        transition={{ duration: 0.45, ease: "easeInOut" }}
        className={cn("py-2 text-left text-sm overflow-clip", className)}
        type="button"
        variant="outline"
        hoverScale={1}
        tapScale={1}
        size="sm"
        style={{
          borderRadius: 50,
        }}
      >
        <motion.div className="flex items-center gap-2" layout={animateLayout}>
          {children || <GearSixIcon className="size-4 text-muted-foreground" />}
          <TextLoop
            items={orderedLabels}
            itemsWithShimmer={isPreliminary ? [0, 1] : [0]}
            index={currentLabelIndex}
            className="ml-1 mr-1.5"
            layout={animateLayout}
          />
          <motion.div layout={animateLayout}>
            {getHeaderBadge(isPreliminary ? "input-available" : internalState)}
          </motion.div>
        </motion.div>
        <motion.div layout={animateLayout}>
          <CaretDownIcon className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
        </motion.div>
      </Button>
    </DisclosureTrigger>
  );
}

export type ToolContentProps = ComponentProps<typeof DisclosureContent>;

export const ToolContent = DisclosureContent;

export type ToolInputProps = ComponentProps<"div"> & {
  input: ToolUIPart["input"];
};

export const ToolInput = ({ className, input, ...props }: ToolInputProps) => (
  <div className={cn("space-y-2 pt-4", className)} {...props}>
    <h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wide ml-0.5">
      Parameters
    </h4>
    <div className="rounded-md bg-muted/50 overflow-x-auto">
      <CodeBlock code={JSON.stringify(input, null, 2)} language="json" />
    </div>
  </div>
);

export type ToolErrorProps = ComponentProps<"div"> & {
  errorText: string;
};

export const ToolError = ({
  className,
  errorText,
  ...props
}: ToolErrorProps) => {
  // Try to extract and format Zod validation errors
  let formattedError = errorText;
  const errorMessageMatch = errorText.match(/Error message:\s*(\[.*\])\s*$/s);
  if (errorMessageMatch) {
    try {
      const errors = JSON.parse(errorMessageMatch[1]);
      const formatted = errors
        .map(
          (e: { path: string[]; message: string }) =>
            `• ${e.path.join(".")}: ${e.message}`,
        )
        .join("\n");
      formattedError = `Invalid tool inputs:\n${formatted}`;
    } catch {
      // Keep original if parsing fails
    }
  }

  return (
    <div className={cn("space-y-2 py-4", className)} {...props}>
      <h4 className="font-medium text-destructive text-xs uppercase tracking-wide ml-0.5">
        Error
      </h4>
      <div className="overflow-x-auto rounded-md dark:bg-destructive/30 bg-destructive/10 text-destructive dark:text-red-300 text-xs [&_table]:w-full">
        <div className="p-3 whitespace-pre-wrap">{formattedError}</div>
      </div>
    </div>
  );
};

export type ToolOutputProps = ComponentProps<"div"> & {
  output: ToolUIPart["output"];
  errorText: ToolUIPart["errorText"];
};

export const ToolOutput = ({
  className,
  output,
  errorText,
  ...props
}: ToolOutputProps) => {
  if (!(output || errorText)) {
    return null;
  }

  if (errorText) {
    return <ToolError className={className} errorText={errorText} {...props} />;
  }

  // Otherwise show the normal output
  let Output = <div>{output as ReactNode}</div>;

  if (typeof output === "object") {
    Output = (
      <CodeBlock code={JSON.stringify(output, null, 2)} language="json" />
    );
  } else if (typeof output === "string") {
    Output = <CodeBlock code={output} language="json" />;
  }

  return (
    <div className={cn("space-y-2 py-4", className)} {...props}>
      <h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wide ml-0.5">
        Result
      </h4>
      <div className="overflow-x-auto rounded-md bg-muted/50 text-foreground text-xs [&_table]:w-full">
        {Output}
      </div>
    </div>
  );
};
