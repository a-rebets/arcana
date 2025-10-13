import { api } from "@convex/api";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { NavigationHeader } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import {
  MorphingDialog,
  MorphingDialogContainer,
} from "@/components/ui/morphing-dialog";
import { SlidingNumber } from "@/components/ui/sliding-number";
// import { AnimatedGroup } from "@/components/ui/animated-group";
import { ArtifactCardContext } from "@/hooks/use-artifact-card";
import type { ArtifactGalleryData } from "@/lib/types/artifacts";
import { ArtifactCard } from "./artifact-card/default";
import { ExpandedArtifact } from "./artifact-card/expanded";

function Page() {
  const { data: user } = useQuery(convexQuery(api.core.accounts.getUser, {}));
  const { data } = useQuery(
    convexQuery(api.artifacts.public.listLatestArtifactsForUser, {}),
  );
  return (
    <>
      <NavigationHeader className="z-30" />
      <div className="size-full grid grid-cols-1 grid-rows-[auto_1fr] min-h-0">
        <header className="bg-accent pb-20 px-6 pt-10 flex items-center">
          <p className="font-display text-3xl font-light">
            {user?.name}'s visualizations
          </p>
          {data && (
            <Badge className="rounded-full px-5 py-1.5 text-base ml-4 mt-0.5 font-light bg-transparent border border-primary/40 text-primary/60 dark:border-primary/60 dark:text-primary/80 inset-shadow-sm">
              <SlidingNumber value={data.length} animateOnMount />
            </Badge>
          )}
        </header>
        <section className="overflow-y-auto rounded-t-3xl -mt-10 z-10 bg-background border-t-[0.5px] border-accent-foreground/20">
          <div className="flex flex-wrap items-start gap-6 p-6 min-h-full">
            <Artifacts data={data} />
          </div>
        </section>
      </div>
    </>
  );
}

function Artifacts({ data }: { data: ArtifactGalleryData[] | undefined }) {
  return data?.map((artifact) => (
    <ArtifactCardContext.Provider
      key={artifact.rootId}
      value={{
        ...artifact.versions[0],
        rootId: artifact.rootId,
        isRoot: artifact.versions[0]._id === artifact.rootId,
      }}
    >
      <MorphingDialog
        transition={{
          type: "spring",
          bounce: 0.05,
          duration: 0.5,
        }}
      >
        <ArtifactCard className="flex-[1_1_30rem] max-w-full lg:max-w-[50%] xl:max-w-[33.3%]" />
        <MorphingDialogContainer>
          <ExpandedArtifact />
        </MorphingDialogContainer>
      </MorphingDialog>
    </ArtifactCardContext.Provider>
  ));
}

export default Page;
