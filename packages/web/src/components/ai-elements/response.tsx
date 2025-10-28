import { lazy, Suspense } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

const Streamdown = lazy(() =>
  import("streamdown").then((m) => ({ default: m.Streamdown })),
);

type ResponseProps = {
  className?: string;
  children?: string;
};

export const Response = ({ className, children }: ResponseProps) => (
  <Suspense fallback={<ResponseSkeleton />}>
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

function ResponseSkeleton() {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Skeleton className="h-2 w-[40vw] min-w-96 bg-muted-foreground/50" />
      <Skeleton className="h-2 w-3/4 bg-muted-foreground/50" />
    </div>
  );
}

Response.displayName = "Response";
