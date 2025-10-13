import { api } from "@convex/api";
import { PlusIcon } from "@phosphor-icons/react";
import { useQuery } from "convex/react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Button } from "@/components/animate-ui/components/buttons/button";
import {
  MainNavigationSection,
  NavigationHeader,
} from "@/components/navigation";
import { useLiveChat } from "@/hooks/use-live-chat";
import { useSyncChat } from "@/hooks/use-sync-chat";
import type { Route } from "./+types/";
import { ArtifactsDesktopLayout } from "./artifacts";
import { ChatInput } from "./chat/input";
import { ChatMessages } from "./chat/messages";
import { ThreadsBox } from "./threads-list";

function Page({ params }: Route.ComponentProps) {
  const navigate = useNavigate();
  const exists = useQuery(
    api.ai.threads.checkIfThreadExists,
    params.threadId ? { threadId: params.threadId } : "skip",
  );

  useEffect(() => {
    if (params.threadId && exists === false) {
      navigate("/", { replace: true });
    }
  }, [params.threadId, exists, navigate]);

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
        <Threads />
      </NavigationHeader>
      <div className="size-full flex min-h-0">
        <div className="pb-6 relative flex flex-col h-full flex-1">
          <Conversation className="flex-1 min-h-0">
            <ConversationContent className="max-w-4xl mx-auto px-6 py-4">
              <ChatMessages />
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
          <div className="px-6 max-w-4xl w-full mx-auto">
            <ChatInput className="rounded-2xl" />
          </div>
        </div>
        <ArtifactsDesktopLayout className="flex-1" />
      </div>
    </>
  );
}

function Threads() {
  return (
    <MainNavigationSection className="md:pt-3.5 overflow-visible">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 grid-rows-1">
        <ThreadsBox />
        <Button
          className="h-[2.4rem] w-20 rounded-xl border dark:border-0 shrink-0"
          variant="accent"
          hoverScale={1}
          asChild
        >
          <Link to="/">
            <PlusIcon weight="bold" />
          </Link>
        </Button>
      </div>
    </MainNavigationSection>
  );
}

export default Page;
