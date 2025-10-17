import { api } from "@convex/api";
import { convexQuery } from "@convex-dev/react-query";
import { useDeepCompareMemo } from "@react-hookz/web";
import { useQuery } from "@tanstack/react-query";
import { stagger } from "motion/react";
import { useState } from "react";
import { Link } from "react-router";
import EyePlaceholderIcon from "@/assets/eye-placeholder.svg?react";
import { Button } from "@/components/animate-ui/components/buttons/button";
import { NavigationHeader } from "@/components/navigation";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { Badge } from "@/components/ui/badge";
import {
  MorphingDialog,
  MorphingDialogContainer,
} from "@/components/ui/morphing-dialog";
import { Separator } from "@/components/ui/separator";
import { SlidingNumber } from "@/components/ui/sliding-number";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ArtifactCardContext } from "@/hooks/use-artifact-card";
import type { ArtifactGalleryData } from "@/lib/types/artifacts";
import { ArtifactCard, ArtifactCardSkeleton } from "./artifact-card/default";
import { ExpandedArtifact } from "./artifact-card/expanded";

type Sorting = "newest" | "oldest";

function Page() {
  const { data, isPending } = useQuery(
    convexQuery(api.artifacts.public.listLatestArtifactsForUser, {}),
  );
  const [sorting, setSorting] = useState<Sorting>("newest");

  return (
    <>
      <NavigationHeader className="z-30" />
      <div className="size-full grid grid-cols-1 grid-rows-[auto_1fr] min-h-0">
        <header className="bg-accent pb-16 px-6 pt-8 flex flex-col gap-y-6">
          <div className="flex items-center">
            <HeaderTitle />
            {data && (
              <Badge className="rounded-full px-5 py-1.5 text-base ml-4 mt-0.5 font-light bg-transparent border border-primary/40 text-primary/60 dark:border-primary/60 dark:text-primary/80 inset-shadow-sm">
                <SlidingNumber value={data.length} animateOnMount />
              </Badge>
            )}
          </div>
          <div className="flex items-center">
            <p className="text-sm text-muted-foreground font-light">Sort by</p>
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-5 bg-primary/20 mx-3"
            />
            <ToggleGroup
              type="single"
              value={sorting}
              onValueChange={(value) => {
                if (value) setSorting(value as Sorting);
              }}
            >
              {["newest", "oldest"].map((sorting) => (
                <ToggleGroupItem
                  size="sm"
                  className="flex-1 rounded-xl! data-[state=on]:bg-input dark:data-[state=on]:bg-primary/20 data-[state=off]:text-muted-foreground px-4 h-7"
                  value={sorting}
                  key={sorting}
                >
                  {sorting.charAt(0).toUpperCase() + sorting.slice(1)}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </header>
        <section className="overflow-y-auto rounded-t-3xl -mt-10 z-10 bg-background border-t-[0.5px] border-accent-foreground/20">
          {isPending ? (
            <ArtifactsLoadingPlaceholder />
          ) : !data?.length ? (
            <ArtifactsEmptyPlaceholder />
          ) : (
            <Artifacts data={data} sorting={sorting} />
          )}
        </section>
      </div>
    </>
  );
}

function HeaderTitle() {
  const { data: user } = useQuery(convexQuery(api.core.accounts.getUser, {}));
  return (
    <p className="font-display text-3xl font-light">
      {user?.name}'s visualizations
    </p>
  );
}

type ArtifactsProps = {
  data: ArtifactGalleryData[];
  sorting: Sorting;
};

function Artifacts({ data, sorting }: ArtifactsProps) {
  const sortedData = useDeepCompareMemo(() => {
    return data?.sort((a, b) => {
      if (sorting === "newest")
        return b.versions[0].creationTime - a.versions[0].creationTime;
      return a.versions[0].creationTime - b.versions[0].creationTime;
    });
  }, [data, sorting]);

  return (
    <AnimatedGroup
      className="grid grid-cols-[repeat(auto-fill,minmax(min(30rem,100%),35rem))] md:grid-cols-[repeat(auto-fill,clamp(25rem,32%,35rem))] auto-rows-min gap-6 p-6 min-h-full"
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
      {sortedData.map((artifact) => (
        <ArtifactCardContext.Provider
          key={artifact.rootId}
          value={{
            ...artifact.versions[0],
            rootId: artifact.rootId,
            isRoot: artifact.versions[0].id === artifact.rootId,
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
              <ExpandedArtifact />
            </MorphingDialogContainer>
          </MorphingDialog>
        </ArtifactCardContext.Provider>
      ))}
    </AnimatedGroup>
  );
}

function ArtifactsLoadingPlaceholder() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(25rem,1fr))] gap-6 p-6 min-h-full">
      {Array.from({ length: 3 }).map((_, index) => (
        <ArtifactCardSkeleton key={index.toString()} />
      ))}
    </div>
  );
}

function ArtifactsEmptyPlaceholder() {
  return (
    <div className="flex items-center justify-center h-full flex-col gap-4 dark:text-muted-foreground/40 text-muted-foreground/60 pb-36">
      <EyePlaceholderIcon className="size-56" />
      <h2 className="font-display md:text-3xl text-2xl md:font-medium font-medium">
        Nothing to see here
      </h2>
      <p className="text-base font-light mb-6">
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

export default Page;
