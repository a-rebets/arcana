import { api } from "@convex/api";
import { convexQuery } from "@convex-dev/react-query";
import { useDeepCompareMemo } from "@react-hookz/web";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { NavigationHeader } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import {
  MorphingDialog,
  MorphingDialogContainer,
} from "@/components/ui/morphing-dialog";
import { Separator } from "@/components/ui/separator";
import { SlidingNumber } from "@/components/ui/sliding-number";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
// import { AnimatedGroup } from "@/components/ui/animated-group";
import { ArtifactCardContext } from "@/hooks/use-artifact-card";
import type { ArtifactGalleryData } from "@/lib/types/artifacts";
import { ArtifactCard } from "./artifact-card/default";
import { ExpandedArtifact } from "./artifact-card/expanded";

type Sorting = "newest" | "oldest";

function Page() {
  const { data: user } = useQuery(convexQuery(api.core.accounts.getUser, {}));
  const { data } = useQuery(
    convexQuery(api.artifacts.public.listLatestArtifactsForUser, {}),
  );

  const [sorting, setSorting] = useState<Sorting>("newest");

  return (
    <>
      <NavigationHeader className="z-30" />
      <div className="size-full grid grid-cols-1 grid-rows-[auto_1fr] min-h-0">
        <header className="bg-accent pb-16 px-6 pt-8 flex flex-col gap-y-6">
          <div className="flex items-center">
            <p className="font-display text-3xl font-light">
              {user?.name}'s visualizations
            </p>
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
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(30rem,100%),35rem))] md:grid-cols-[repeat(auto-fill,clamp(25rem,32%,35rem))] auto-rows-min gap-6 p-6 min-h-full">
            <Artifacts data={data} sorting={sorting} />
          </div>
        </section>
      </div>
    </>
  );
}

function Artifacts({
  data,
  sorting,
}: {
  data: ArtifactGalleryData[] | undefined;
  sorting: Sorting;
}) {
  const sortedData = useDeepCompareMemo(() => {
    return data?.sort((a, b) => {
      if (sorting === "newest")
        return b.versions[0].creationTime - a.versions[0].creationTime;
      return a.versions[0].creationTime - b.versions[0].creationTime;
    });
  }, [data, sorting]);

  return sortedData?.map((artifact) => (
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
  ));
}

export default Page;
