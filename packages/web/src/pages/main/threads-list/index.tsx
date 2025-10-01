import { api } from "@convex/api";
import type { ThreadDoc as Thread } from "@convex-dev/agent";
import { convexQuery } from "@convex-dev/react-query";
import {
  EyesIcon,
  type Icon,
  MagnifyingGlassIcon,
  QuestionIcon,
} from "@phosphor-icons/react";
import { useMediaQuery, useToggle } from "@react-hookz/web";
import { useQuery } from "@tanstack/react-query";
import { type UsePaginatedQueryResult, usePaginatedQuery } from "convex/react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { Button } from "@/components/animate-ui/components/buttons/button";
import {
  Disclosure,
  DisclosureContent,
  DisclosureTrigger,
} from "@/components/ui/disclosure";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { TextScramble } from "@/components/ui/text-scramble";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { ThreadsList } from "./list";

const ThreadTitle = memo(({ title }: { title: string | undefined }) => {
  return (
    <TextScramble speed={0.02} baseWord="New chat">
      {title ?? "Search your chats"}
    </TextScramble>
  );
});

ThreadTitle.displayName = "ThreadTitle";

export function ThreadsBox({ className }: { className?: string }) {
  const { threadId } = useParams();
  const isMobile = useMediaQuery("only screen and (max-width : 768px)");

  const [open, toggleOpen] = useToggle(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    results: paginatedThreads,
    loadMore,
    status,
  } = usePaginatedQuery(
    api.ai.threads.listByUser,
    {},
    {
      initialNumItems: 15,
    },
  );

  const { data: searchResults, isFetching: searching } = useQuery(
    convexQuery(
      api.ai.threads.searchByTitle,
      searchTerm ? { searchTerm, limit: 20 } : "skip",
    ),
  );

  // A hack to load the selected thread if it's older than the first page
  useEffect(() => {
    if (!threadId || searchTerm || status !== "CanLoadMore") return;

    const hasSelectedThread = paginatedThreads.some((t) => t._id === threadId);
    if (!hasSelectedThread) {
      loadMore(15);
    }
  }, [threadId, paginatedThreads, loadMore, status, searchTerm]);

  const scrollHandler = useCallback(
    (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      if (
        el.scrollTop === el.scrollHeight - el.clientHeight &&
        status === "CanLoadMore"
      ) {
        setTimeout(() => loadMore(15), 300);
      }
    },
    [status, loadMore],
  );

  const scrollViewportRef = useScroll(scrollHandler);

  const threads = searchTerm ? searchResults : paginatedThreads;

  const currentThreadTitle = useMemo(() => {
    if (!threads) return;
    return threads.find((thread) => thread._id === threadId)?.title;
  }, [threadId, threads]);

  const noThreads = !threads?.length && !searchTerm;

  return (
    <Disclosure
      className={cn(
        "rounded-xl border bg-background/80 dark:bg-background/90 backdrop-blur-md h-fit",
        open && "shadow-xl dark:shadow-none",
        className,
      )}
      open={open}
      onOpenChange={toggleOpen}
      onMouseLeave={() => !isMobile && toggleOpen(false)}
    >
      <DisclosureTrigger>
        <Button
          type="button"
          className={cn(
            "w-full justify-between rounded-xl has-[>svg]:px-4",
            !currentThreadTitle && "text-muted-foreground/80 font-normal",
          )}
          variant="ghost"
          tapScale={0.98}
          hoverScale={1}
          onHoverStart={() => toggleOpen(true)}
        >
          <ThreadTitle title={currentThreadTitle} />
          <MagnifyingGlassIcon />
        </Button>
      </DisclosureTrigger>
      <DisclosureContent>
        {noThreads ? (
          <EmptyFallback
            icon={EyesIcon}
            firstLine="No chats yet."
            secondLine="Send a message to start a new chat."
          />
        ) : (
          <ScrollArea className="h-96 w-full" viewportRef={scrollViewportRef}>
            <div className="w-full sticky top-0 px-3.5 pb-4 pt-2 before:pointer-events-none before:content-[''] before:absolute before:inset-0 before:bg-linear-to-b before:from-background/95 before:to-background/0 before:from-65% before:-z-10 z-50">
              <Input
                placeholder="Find something..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:text-[0.8rem] shadow-none rounded-none w-full border-b border-x-0 border-t-0 focus-visible:outline-0 focus-visible:ring-0 px-0.5 focus-visible:border-foreground/40"
              />
            </div>
            <ThreadsBoxContent
              threads={threads}
              currentThreadId={threadId}
              searching={searching}
              status={status}
            />
          </ScrollArea>
        )}
      </DisclosureContent>
    </Disclosure>
  );
}

function ThreadsBoxContent({
  threads,
  currentThreadId,
  searching,
  status,
}: {
  threads: Thread[] | undefined;
  currentThreadId: string | undefined;
  searching: boolean;
  status: UsePaginatedQueryResult<unknown>["status"];
}) {
  if (searching || status === "LoadingFirstPage") {
    return (
      <div className="flex items-center justify-center w-full h-72">
        <Spinner
          variant="infinite"
          className="size-14 text-muted-foreground/80"
          strokeWidth={6}
        />
      </div>
    );
  }

  if (!threads?.length) {
    return (
      <EmptyFallback
        icon={QuestionIcon}
        firstLine="No chats found."
        secondLine="Try searching for something else."
        className="h-72"
      />
    );
  }

  return (
    <>
      <ThreadsList
        threads={threads}
        currentThreadId={currentThreadId}
        className="px-3 pb-5"
      />
      {status !== "Exhausted" && (
        <Progress
          value={null}
          className="w-[calc(100%-1.5rem)] ml-3 h-0.5 rounded-none mask-x-from-90% mask-x-to-100%"
          indicatorClassName="bg-primary/40 dark:bg-primary/90"
        />
      )}
    </>
  );
}

function EmptyFallback({
  icon: Icon,
  firstLine,
  secondLine,
  className,
}: {
  icon: Icon;
  firstLine: string;
  secondLine: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "px-8 pt-6 pb-10 gap-2 flex flex-col items-center justify-center dark:text-muted-foreground text-muted-foreground/60",
        className,
      )}
    >
      <Icon className="size-10" weight="light" />
      <p className="text-sm max-w-64 text-center">
        {firstLine}
        <br />
        {secondLine}
      </p>
    </div>
  );
}
