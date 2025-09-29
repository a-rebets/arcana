import { api } from "@convex/api";
import { useQuery } from "convex/react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { useLiveChat } from "@/hooks/use-live-chat";
import { useSyncChat } from "@/hooks/use-sync-chat";
import type { ArcanaUIMessage } from "@/lib/convex-agent";
import { ChatInput } from "./chat/input";
import { ChatMessages } from "./chat/messages";
import NavigationHeader from "./navigation";

function Page() {
  return (
    <main className="h-screen grid grid-rows-[auto_1fr] grid-cols-1">
      <NavigationHeader className="sticky top-0 left-0 right-0 z-50" />
      <div className="max-w-4xl mx-auto px-6 pb-6 relative min-h-0 flex flex-col w-full">
        <Conversation className="flex-1 min-h-0">
          <ConversationContent>
            <ChatMessages />
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
        <ChatInput />
      </div>
    </main>
  );
}

function WithMessages() {
  const navigate = useNavigate();

  const { threadId } = useParams<{ threadId: string }>();
  const exists = useQuery(
    api.ai.threads.checkIfThreadExists,
    threadId ? { threadId } : "skip",
  );

  useEffect(() => {
    if (threadId && exists === false) navigate("/", { replace: true });
  }, [threadId, exists, navigate]);

  useSyncChat<ArcanaUIMessage>({
    threadId: threadId,
    listQuery: api.ai.messages.listThreadMessages,
    initialNumItems: 25,
  });

  useLiveChat<ArcanaUIMessage>({
    threadId: threadId,
  });

  return <Page />;
}

export default WithMessages;
