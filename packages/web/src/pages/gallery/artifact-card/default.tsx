import {
  CaretDownIcon,
  ChatCircleTextIcon,
  DownloadSimpleIcon,
} from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Button } from "@/components/animate-ui/components/buttons/button";
import {
  MorphingDialogSubtitle,
  MorphingDialogTitle,
  MorphingDialogTrigger,
  useMorphingDialog,
} from "@/components/ui/morphing-dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useArtifactCard } from "@/hooks/use-artifact-card";
import {
  type NoPropagationCallback,
  useNoPropagationCallback,
} from "@/hooks/use-no-propagation-callback";
import { useVegaWithRef } from "@/hooks/use-vega-with-ref";
import { cn, formatRelativeTime } from "@/lib/utils";
import { ButtonWithChatPreview } from "./chat-preview";

export function ArtifactCard({ className }: { className?: string }) {
  const { isOpen } = useMorphingDialog();
  const { vegaSpec, title, creationTime, isRoot, rootId } = useArtifactCard();
  const { ref, handleDownload } = useVegaWithRef(vegaSpec, {
    metadata: {
      rootId,
      title,
    },
  });

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
        <section className="grid grid-cols-[1fr_auto] gap-6 w-full group/info-row pt-3 px-4 pb-3.5">
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <MorphingDialogTitle className="w-fit truncate">
                {title}
              </MorphingDialogTitle>
              <CaretDownIcon
                weight="bold"
                className="size-4 text-muted-foreground group-hover/info-row:text-primary/80 dark:group-hover/info-row:text-primary transition-colors"
              />
            </div>
            <MorphingDialogSubtitle className="text-[0.8rem] text-muted-foreground w-fit">
              {isRoot ? "Created" : "Updated"}{" "}
              {formatRelativeTime(creationTime)}
            </MorphingDialogSubtitle>
          </div>
          <ActionsRow className="" handleDownload={handleDownload} />
        </section>
      </div>
    </MorphingDialogTrigger>
  );
}

type ActionsRowProps = {
  className?: string;
  handleDownload: NoPropagationCallback;
};

function ActionsRow({ className, handleDownload }: ActionsRowProps) {
  const navigate = useNavigate();
  const { rootId, threadId } = useArtifactCard();

  const handleOpenChat = useNoPropagationCallback<HTMLButtonElement>(() => {
    navigate(`/chat/${threadId}?artifact=${rootId}`);
  });

  return (
    <div className={cn("flex items-center gap-1", className)}>
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
          className="rounded-lg"
          onClick={handleOpenChat}
        >
          <motion.div layoutId={`chat-icon-${rootId}`}>
            <ChatCircleTextIcon className="size-5" />
          </motion.div>
        </Button>
      </ButtonWithChatPreview>
    </div>
  );
}

export function ArtifactCardSkeleton() {
  return (
    <div className="overflow-hidden border rounded-2xl w-full h-fit">
      <div className="flex flex-col">
        <Skeleton className="w-full aspect-video rounded-none" />
        <section className="grid grid-cols-[1fr_auto] gap-6 w-full group/info-row pt-3 px-4 pb-3.5">
          <div className="flex flex-col gap-2 overflow-hidden">
            <Skeleton className="h-3 w-56" />
            <Skeleton className="h-3 w-36" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="size-9 rounded-lg" />
            <Skeleton className="size-9 rounded-lg" />
          </div>
        </section>
      </div>
    </div>
  );
}
