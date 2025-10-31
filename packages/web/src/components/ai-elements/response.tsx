import type { UIMessage } from "ai";
import { lazy, Suspense } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

const Streamdown = lazy(() =>
  import("streamdown").then((m) => ({ default: m.Streamdown })),
);

type ResponseProps = {
  className?: string;
  children?: string;
  userRole: UIMessage["role"];
};

export const Response = ({ className, children, userRole }: ResponseProps) => (
  <Suspense fallback={<ResponseSkeleton role={userRole} />}>
    <Streamdown
      className={cn(
        "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className,
      )}
    >
      {children}
    </Streamdown>
  </Suspense>
);

function ResponseSkeleton({ role }: { role: UIMessage["role"] }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Skeleton
        className={cn(
          "h-2 w-[30vw] min-w-64 md:min-w-96",
          role === "assistant"
            ? "bg-muted-foreground/20"
            : "bg-muted-foreground/40",
        )}
      />
      <Skeleton
        className={cn(
          "h-2 w-3/4",
          role === "assistant"
            ? "bg-muted-foreground/15"
            : "bg-muted-foreground/30",
        )}
      />
    </div>
  );
}

Response.displayName = "Response";
