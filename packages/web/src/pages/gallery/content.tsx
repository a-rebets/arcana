import { useDeepCompareMemo } from "@react-hookz/web";
import { stagger } from "motion/react";
import { Link } from "react-router";
import EyePlaceholderIcon from "@/assets/eye-placeholder.svg?react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { AnimatedGroup } from "@/components/ui/animated-group";
import {
  MorphingDialog,
  MorphingDialogContainer,
} from "@/components/ui/morphing-dialog";
import { ArtifactCardContext } from "@/hooks/use-artifact-card";
import type { ArtifactGalleryData } from "@/lib/types/artifacts";
import { ArtifactCard, ArtifactCardSkeleton } from "./artifact-card/default";
import { ExpandedArtifactCard } from "./artifact-card/expanded";

export type Sorting = "newest" | "oldest";

type ArtifactsProps = {
  data: ArtifactGalleryData[];
  sorting: Sorting;
};

export function Artifacts({ data, sorting }: ArtifactsProps) {
  const sortedData = useDeepCompareMemo(() => {
    return data?.sort((a, b) => {
      if (sorting === "newest")
        return b.versions[0].creationTime - a.versions[0].creationTime;
      return a.versions[0].creationTime - b.versions[0].creationTime;
    });
  }, [data, sorting]);

  return (
    <AnimatedGroup
      className="grid grid-cols-[repeat(auto-fill,minmax(min(30rem,100%),35rem))] md:grid-cols-[repeat(auto-fill,clamp(25rem,32%,35rem))] auto-rows-min gap-4 md:gap-6 px-3 py-4 md:p-6 min-h-full"
      variants={{
        container: {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              delayChildren: stagger(0.05),
            },
          },
        },
        item: {
          hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
          visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
              duration: 1.2,
              type: "spring",
              bounce: 0.3,
            },
          },
        },
      }}
    >
      {sortedData.map((artifact) => {
        const { id, ...latestVersion } = artifact.versions[0];
        return (
          <ArtifactCardContext.Provider
            key={artifact.rootId}
            value={{
              rootId: artifact.rootId,
              title: artifact.title,
              isRoot: id === artifact.rootId,
              ...latestVersion,
            }}
          >
            <MorphingDialog
              transition={{
                type: "spring",
                bounce: 0.05,
                duration: 0.5,
              }}
            >
              <ArtifactCard />
              <MorphingDialogContainer>
                <ExpandedArtifactCard />
              </MorphingDialogContainer>
            </MorphingDialog>
          </ArtifactCardContext.Provider>
        );
      })}
    </AnimatedGroup>
  );
}

export function ArtifactsLoadingPlaceholder() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(25rem,1fr))] gap-4 md:gap-6 px-3 py-4 md:p-6 min-h-full">
      {Array.from({ length: 3 }).map((_, index) => (
        <ArtifactCardSkeleton key={index.toString()} />
      ))}
    </div>
  );
}

export function ArtifactsEmptyPlaceholder() {
  return (
    <div className="flex items-center justify-center h-full flex-col gap-3 md:gap-4 dark:text-muted-foreground/50 text-muted-foreground/60 pb-36">
      <EyePlaceholderIcon className="md:size-56 size-36" />
      <h2 className="font-display md:text-3xl text-2xl font-medium">
        Nothing to see here
      </h2>
      <p className="text-base font-light md:mb-6 mb-5 text-pretty text-center max-w-3/5 md:max-w-none">
        Start extracting insights from your productivity tools now
      </p>
      <Button
        variant="outline"
        size="lg"
        className="rounded-xl min-w-48 border-[1.5px] text-muted-foreground/70"
        asChild
      >
        <Link to="/">New chat</Link>
      </Button>
    </div>
  );
}
