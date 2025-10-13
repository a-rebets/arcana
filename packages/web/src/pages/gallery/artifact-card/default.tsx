import {
  CaretDownIcon,
  ChatCircleTextIcon,
  DownloadSimpleIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import {
  MorphingDialogSubtitle,
  MorphingDialogTitle,
  MorphingDialogTrigger,
  useMorphingDialog,
} from "@/components/ui/morphing-dialog";
import { Separator } from "@/components/ui/separator";
import { useArtifactCard } from "@/hooks/use-artifact-card";
import { useNoPropagationCallback } from "@/hooks/use-no-propagation-callback";
import { useVegaWithRef } from "@/hooks/use-vega-with-ref";
import { cn, formatRelativeTime } from "@/lib/utils";

export function ArtifactCard({ className }: { className?: string }) {
  const { isOpen } = useMorphingDialog();
  const { vegaSpec } = useArtifactCard();
  const ref = useVegaWithRef(vegaSpec);

  return (
    <MorphingDialogTrigger
      style={{
        borderRadius: "16px",
        padding: 0,
        width: "100%",
        height: "fit-content",
      }}
      className={cn(
        "overflow-hidden border bg-card shadow-sm hover:shadow-md dark:shadow-none",
        className,
        isOpen && "z-20",
      )}
    >
      <div className="flex flex-col">
        <div className="w-full aspect-video" ref={ref} />
        <Separator />
        <ArtifactInfoRow />
      </div>
    </MorphingDialogTrigger>
  );
}

function ArtifactInfoRow() {
  const { title, _creationTime, isRoot } = useArtifactCard();

  const handleDownload = useNoPropagationCallback<HTMLButtonElement>((e) => {
    console.log("download", e);
  });
  const handleOpenChat = useNoPropagationCallback<HTMLButtonElement>((e) => {
    console.log("chat", e);
  });

  return (
    <section className="flex w-full justify-between pt-3 px-4 pb-3.5 group/info-row">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <MorphingDialogTitle className="w-fit">{title}</MorphingDialogTitle>
          <CaretDownIcon
            weight="bold"
            className="size-4 text-muted-foreground group-hover/info-row:text-primary/80 dark:group-hover/info-row:text-primary transition-colors"
          />
        </div>
        <MorphingDialogSubtitle className="text-xs text-muted-foreground w-fit">
          {isRoot ? "Created" : "Updated"} {formatRelativeTime(_creationTime)}
        </MorphingDialogSubtitle>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon" onClick={handleDownload}>
          <DownloadSimpleIcon className="size-5" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleOpenChat}>
          <ChatCircleTextIcon className="size-5" />
        </Button>
      </div>
    </section>
  );
}
