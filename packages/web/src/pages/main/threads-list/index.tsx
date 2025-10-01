import { api } from "@convex/api";
import { useConvexPaginatedQuery } from "@convex-dev/react-query";
import { EyesIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useMediaQuery, useToggle } from "@react-hookz/web";
import { memo, useMemo } from "react";
import { useParams } from "react-router";
import { Button } from "@/components/animate-ui/components/buttons/button";
import {
  Disclosure,
  DisclosureContent,
  DisclosureTrigger,
} from "@/components/ui/disclosure";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TextScramble } from "@/components/ui/text-scramble";
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

  const { results: threads } = useConvexPaginatedQuery(
    api.ai.threads.listByUser,
    {},
    {
      initialNumItems: 15,
    },
  );

  const currentThreadTitle = useMemo(() => {
    return threads.find((thread) => thread._id === threadId)?.title;
  }, [threadId, threads]);

  return (
    <Disclosure
      className={cn("rounded-xl border bg-background h-fit", className)}
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
        {threads.length === 0 ? (
          <div className="px-8 pt-6 pb-10 gap-2 flex flex-col items-center justify-center dark:text-muted-foreground text-muted-foreground/60">
            <EyesIcon className="size-10" weight="light" />
            <p className="text-sm max-w-64 text-center">
              No chats yet.
              <br />
              Send a message to start a new chat.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-96 w-full">
            <div className="px-3 pb-3">
              <div className="w-full sticky top-0 px-0.5 pb-4 pt-2 before:pointer-events-none before:content-[''] before:absolute before:inset-0 before:bg-linear-to-b before:from-background/95 before:to-background/0 before:from-65% before:-z-10 z-50">
                <Input
                  placeholder="Find something..."
                  className="md:text-[0.8rem] rounded-none w-full border-b border-x-0 border-t-0 focus-visible:outline-0 focus-visible:ring-0 px-0.5 focus-visible:border-foreground/40"
                />
              </div>
              <ThreadsList threads={threads} currentThreadId={threadId} />
            </div>
          </ScrollArea>
        )}
      </DisclosureContent>
    </Disclosure>
  );
}
