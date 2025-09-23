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
import type { ToolLabels } from "asana-tools";
import { motion } from "motion/react";
import { type ComponentProps, type ReactNode, useState } from "react";
import AsanaIcon from "@/assets/asana-icon.svg?react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import {
  Disclosure,
  DisclosureContent,
  DisclosureTrigger,
} from "@/components/ui/disclosure";
import { TextLoop } from "@/components/ui/text-loop";
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
};

export function ToolHeader({
  className,
  state,
  isAsana,
  labels,
  ...props
}: ToolHeaderProps) {
  const [internalState, setInternalState] = useState(state);

  useUpdateEffect(() => {
    const delay = state === "output-available" ? 500 : 0;
    setTimeout(() => setInternalState(state), delay);
  }, [state]);

  return (
    <DisclosureTrigger {...props}>
      <Button
        layout
        transition={{ duration: 0.45, ease: "easeInOut" }}
        className="py-2 -ml-0.5 text-left text-sm overflow-clip"
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
          {isAsana ? (
            <AsanaIcon className="size-4 text-asana" />
          ) : (
            <GearSixIcon className="size-4 text-muted-foreground" />
          )}
          <TextLoop
            items={Object.values(labels)}
            itemsWithShimmer={[0]}
            index={internalState === "output-available" ? 1 : 0}
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
  <div className={cn("space-y-2 overflow-hidden p-4", className)} {...props}>
    <h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
      Parameters
    </h4>
    <div className="rounded-md bg-muted/50">
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

  let Output = <div>{output as ReactNode}</div>;

  if (typeof output === "object") {
    Output = (
      <CodeBlock code={JSON.stringify(output, null, 2)} language="json" />
    );
  } else if (typeof output === "string") {
    Output = <CodeBlock code={output} language="json" />;
  }

  return (
    <div className={cn("space-y-2 p-4", className)} {...props}>
      <h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
        {errorText ? "Error" : "Result"}
      </h4>
      <div
        className={cn(
          "overflow-x-auto rounded-md text-xs [&_table]:w-full",
          errorText
            ? "bg-destructive/10 text-destructive"
            : "bg-muted/50 text-foreground",
        )}
      >
        {errorText && <div>{errorText}</div>}
        {Output}
      </div>
    </div>
  );
};
