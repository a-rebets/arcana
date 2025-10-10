import { api } from "@convex/api";
import { useQuery } from "convex/react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { useLiveChat } from "@/hooks/use-live-chat";
import { useSyncChat } from "@/hooks/use-sync-chat";
import type { Route } from "./+types/";
import { Artifacts } from "./artifacts";
import { ChatInput } from "./chat/input";
import { ChatMessages } from "./chat/messages";
import NavigationHeader from "./navigation";

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
    <main className="h-dvh grid grid-rows-[auto_1fr] grid-cols-1">
      <NavigationHeader className="sticky top-0 left-0 right-0 z-30" />
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
        <Artifacts className="flex-1" />
      </div>
    </main>
  );
}

export default Page;
