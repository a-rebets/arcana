import {
  CaretDownIcon,
  ChatCircleTextIcon,
  DownloadSimpleIcon,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import {
  MorphingDialogSubtitle,
  MorphingDialogTitle,
  MorphingDialogTrigger,
  useMorphingDialog,
} from "@/components/ui/morphing-dialog";
import { Separator } from "@/components/ui/separator";
import { useArtifactActions } from "@/hooks/use-artifact-actions";
import { useArtifactCard } from "@/hooks/use-artifact-card";
import { useVegaWithRef } from "@/hooks/use-vega-with-ref";
import { cn, formatRelativeTime } from "@/lib/utils";
import { ButtonWithChatPreview } from "./chat-preview";

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
      layoutScroll
    >
      <div className="flex flex-col">
        <div className="w-full aspect-video [&>form]:hidden" ref={ref} />
        <Separator />
        <ArtifactInfoRow />
      </div>
    </MorphingDialogTrigger>
  );
}

function ArtifactInfoRow() {
  const { title, creationTime, isRoot, rootId, threadId } = useArtifactCard();
  const { handleDownload, handleOpenChat } = useArtifactActions(
    threadId,
    rootId,
  );

  return (
    <section className="grid grid-cols-[1fr_auto] gap-6 w-full pt-3 px-4 pb-3.5 group/info-row">
      <div className="flex flex-col gap-0.5 overflow-hidden">
        <div className="flex items-center gap-2">
          <MorphingDialogTitle className="w-fit truncate">
            {title}
          </MorphingDialogTitle>
          <CaretDownIcon
            weight="bold"
            className="size-4 text-muted-foreground group-hover/info-row:text-primary/80 dark:group-hover/info-row:text-primary transition-colors"
          />
        </div>
        <MorphingDialogSubtitle className="text-xs text-muted-foreground w-fit">
          {isRoot ? "Created" : "Updated"} {formatRelativeTime(creationTime)}
        </MorphingDialogSubtitle>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={handleDownload}
          className="rounded-lg"
        >
          <motion.div layoutId={`download-icon-${rootId}`}>
            <DownloadSimpleIcon className="size-5" />
          </motion.div>
        </Button>
        <ButtonWithChatPreview side="bottom" align="end" threadId={threadId}>
          <Button
            variant="outline"
            size="icon"
            onClick={handleOpenChat}
            className="rounded-lg"
          >
            <motion.div layoutId={`chat-icon-${rootId}`}>
              <ChatCircleTextIcon className="size-5" />
            </motion.div>
          </Button>
        </ButtonWithChatPreview>
      </div>
    </section>
  );
}
