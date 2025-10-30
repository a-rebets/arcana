import { api } from "@convex/api";
import PatternBg from "@/assets/bg-pattern.svg";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { NavigationHeader } from "@/components/navigation";
import { useLiveChat } from "@/hooks/use-live-chat";
import { useSyncChat } from "@/hooks/use-sync-chat";
import type { Route } from "./+types/";
import { ArtifactsDesktopLayout } from "./artifacts";
import { ChatInput } from "./chat/input";
import { ChatMessages } from "./chat/messages";
import { ConversationStart } from "./chat/start";
import { Threads } from "./threads-list";

function Page({ params }: Route.ComponentProps) {
  useSyncChat({
    threadId: params.threadId,
    listQuery: api.ai.messages.listThreadMessages,
    initialNumItems: 25,
  });

  useLiveChat({
    threadId: params.threadId,
  });

  return (
    <>
      <NavigationHeader className="z-30">
        <Threads threadId={params.threadId} />
      </NavigationHeader>
      <div className="size-full flex min-h-0">
        <div className="pb-6 relative flex flex-col h-full flex-1 min-w-0">
          <ConversationBg />
          <Conversation className="flex-1 min-h-0">
            {!params.threadId && (
              <ConversationStart className="left-1/2 -translate-x-1/2 absolute top-1/2 -translate-y-3/5" />
            )}
            <ConversationContent className="max-w-4xl mx-auto md:px-6 px-4.5">
              <ChatMessages />
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
          <div className="px-4 md:px-6 max-w-4xl w-full mx-auto">
            <ChatInput />
          </div>
        </div>
        <ArtifactsDesktopLayout className="flex-1" />
      </div>
    </>
  );
}

function ConversationBg() {
  return (
    <div
      className="absolute inset-0 -z-10 dark:from-accent/70 dark:to-accent/25 to-border/35 from-border/80 bg-gradient-to-b mask-repeat md:mask-size-[25rem] mask-size-[20rem]"
      style={{
        maskImage: `url(${PatternBg})`,
        WebkitMaskImage: `url(${PatternBg})`,
        WebkitMaskRepeat: "repeat",
      }}
    />
  );
}

export default Page;
