import { ArrowDownIcon } from "@phosphor-icons/react";
import { type HTMLMotionProps, motion } from "motion/react";
import type { ComponentProps } from "react";
import { useCallback } from "react";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import { cn } from "@/lib/utils";
import { Button } from "../animate-ui/components/buttons/button";

export type ConversationProps = ComponentProps<typeof StickToBottom>;

export const Conversation = ({ className, ...props }: ConversationProps) => (
  <StickToBottom
    className={cn("relative flex-1", className)}
    initial="smooth"
    resize="smooth"
    role="log"
    {...props}
  />
);

type ConversationContentProps = StickToBottom.ContentProps &
  HTMLMotionProps<"div">;

export const ConversationContent = ({
  children,
  className,
  ...props
}: ConversationContentProps) => {
  const context = useStickToBottomContext();
  return (
    <motion.div
      ref={context.scrollRef}
      style={{
        height: "100%",
        width: "100%",
      }}
      layoutScroll
    >
      <motion.div
        className={cn("p-4", className)}
        {...props}
        ref={context.contentRef}
      >
        {typeof children === "function" ? children(context) : children}
      </motion.div>
    </motion.div>
  );
};

export type ConversationEmptyStateProps = ComponentProps<"div"> & {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
};

export const ConversationEmptyState = ({
  className,
  title = "No messages yet",
  description = "Start a conversation to see messages here",
  icon,
  children,
  ...props
}: ConversationEmptyStateProps) => (
  <div
    className={cn(
      "flex size-full flex-col items-center justify-center gap-3 p-8 text-center",
      className,
    )}
    {...props}
  >
    {children ?? (
      <>
        {icon && <div className="text-muted-foreground">{icon}</div>}
        <div className="space-y-1">
          <h3 className="font-medium text-sm">{title}</h3>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>
      </>
    )}
  </div>
);

export type ConversationScrollButtonProps = ComponentProps<typeof Button>;

export const ConversationScrollButton = ({
  className,
  ...props
}: ConversationScrollButtonProps) => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  const handleScrollToBottom = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  return (
    !isAtBottom && (
      <Button
        className={cn(
          "absolute bottom-4 left-[50%] translate-x-[-50%] rounded-full dark:bg-popover/80 dark:border-primary/30",
          className,
        )}
        onClick={handleScrollToBottom}
        size="icon"
        type="button"
        variant="outline"
        {...props}
      >
        <ArrowDownIcon className="size-4" />
      </Button>
    )
  );
};
