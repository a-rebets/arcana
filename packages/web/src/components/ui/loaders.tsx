import { cn } from "@/lib/utils";

export function EyeLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative w-14 h-6 rounded-[50%] border-[2px] border-foreground/30",
        className,
      )}
    >
      <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-foreground/60 animate-eye" />
    </div>
  );
}
