import { api } from "@convex/api";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/animate-ui/components/radix/hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatRelativeTime } from "@/lib/utils";

interface ButtonWithChatPreviewProps {
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  align?: "start" | "center" | "end";
  alignOffset?: number;
  threadId: string;
  className?: string;
  children: React.ReactNode;
}

export function ButtonWithChatPreview({
  side,
  sideOffset,
  align,
  alignOffset,
  threadId,
  children,
  className,
}: ButtonWithChatPreviewProps) {
  const { data: threadMetadata, isLoading } = useQuery(
    convexQuery(api.ai.threads.public.getThreadMetadata, { threadId }),
  );

  return (
    <HoverCard openDelay={0}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        className={cn("w-64 rounded-lg py-2.5 overflow-hidden", className)}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
      >
        <div className="flex flex-col gap-0.5">
          {isLoading ? (
            <>
              <Skeleton className="h-3 w-52 mb-1" />
              <Skeleton className="h-2.5 w-40" />
            </>
          ) : threadMetadata ? (
            <>
              <p className="font-medium text-sm w-full truncate">
                {threadMetadata.title || "Untitled chat"}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatRelativeTime(threadMetadata.creationTime)}
              </p>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">Chat not found</div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
