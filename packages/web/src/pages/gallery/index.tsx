import { api } from "@convex/api";
import { convexQuery } from "@convex-dev/react-query";
import { useDebouncedState, useUpdateEffect } from "@react-hookz/web";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { NavigationHeader } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SlidingNumber } from "@/components/ui/sliding-number";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Artifacts,
  ArtifactsEmptyPlaceholder,
  ArtifactsLoadingPlaceholder,
  type Sorting,
} from "./content";

function Page() {
  const { data, isPending } = useQuery(
    convexQuery(api.artifacts.public.listLatestArtifactsForUser, {}),
  );
  const [sorting, setSorting] = useState<Sorting>("newest");
  const [ready, setReady] = useDebouncedState(!isPending, 500, 1000);

  useUpdateEffect(() => {
    if (!isPending) setReady(true);
  }, [isPending]);

  const hasArtifacts = data !== undefined && data.length > 0;

  return (
    <>
      <NavigationHeader className="z-30" />
      <div className="size-full grid grid-cols-1 grid-rows-[auto_1fr] min-h-0">
        <header className="bg-accent md:pb-16 px-4 md:px-6 md:pt-8 pt-6 pb-14 flex flex-col gap-y-6">
          <div className="flex items-center md:gap-x-2 gap-y-1.5 w-full md:w-auto flex-wrap md:flex-nowrap">
            <HeaderTitle />
            {ready && hasArtifacts && (
              <Badge className="rounded-full px-5 py-1.5 text-base ml-6 md:ml-2 mt-0.5 font-light bg-transparent border border-primary/40 text-primary/60 dark:border-primary/60 dark:text-primary/80 inset-shadow-sm">
                <SlidingNumber value={data?.length ?? 0} animateOnMount />
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
          {!ready ? (
            <ArtifactsLoadingPlaceholder />
          ) : hasArtifacts ? (
            <Artifacts data={data} sorting={sorting} />
          ) : (
            <ArtifactsEmptyPlaceholder />
          )}
        </section>
      </div>
    </>
  );
}

function HeaderTitle() {
  const { data: user } = useQuery(convexQuery(api.core.accounts.getUser, {}));
  return (
    <>
      <p className="w-full md:w-fit flex font-display text-3xl font-light tracking-wide">
        <span className="truncate block max-w-2/3 md:max-w-none">
          {user?.name}
        </span>
        <span>&apos;s</span>
      </p>
      <p className="font-display text-3xl font-light tracking-wide">
        visualizations
      </p>
    </>
  );
}

export default Page;
