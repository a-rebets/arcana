import {
  CaretDownIcon,
  CheckCircleIcon,
  CircleIcon,
  ClockIcon,
  GearSixIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import { useUpdateEffect } from "@react-hookz/web";
import type { ToolUIPart } from "ai";
import { motion } from "motion/react";
import { type ComponentProps, type ReactNode, useState } from "react";
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

const getStatusBadge = (status: ToolUIPart["state"]) => {
  const icons = {
    "input-streaming": <CircleIcon className="size-3" />,
    "input-available": <ClockIcon className="size-3 animate-pulse" />,
    "output-available": <CheckCircleIcon className="size-3 text-green-600" />,
    "output-error": <XCircleIcon className="size-3 text-red-600" />,
  } as const;

  return icons[status];
};

export type ToolHeaderProps = {
  state: ToolUIPart["state"];
  className?: string;
  isAsana?: boolean;
  labels: ToolLabels;
  children?: ReactNode;
};

export function ToolHeader({
  className,
  state,
  isAsana,
  labels,
  children,
  ...props
}: ToolHeaderProps) {
  const [internalState, setInternalState] = useState(state);

  useUpdateEffect(() => {
    const delay = state === "output-available" ? 300 : 0;
    setTimeout(() => setInternalState(state), delay);
  }, [state]);

  const currentLabelIndex = Object.keys(labels).indexOf(internalState);

  return (
    <DisclosureTrigger {...props}>
      <Button
        layout
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
        <motion.div className="flex items-center gap-2" layout="position">
          {children || <GearSixIcon className="size-4 text-muted-foreground" />}
          <TextLoop
            items={Object.values(labels)}
            itemsWithShimmer={[0]}
            index={currentLabelIndex < 0 ? 0 : currentLabelIndex}
            className="ml-1 mr-1.5"
          />
          <motion.div layout="position">
            {getStatusBadge(internalState)}
          </motion.div>
        </motion.div>
        <motion.div layout="position">
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
