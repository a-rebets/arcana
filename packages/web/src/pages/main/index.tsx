import { useChat } from "@ai-sdk-tools/store";
import { useAuthToken } from "@convex-dev/auth/react";
import { GlobeSimpleIcon } from "@phosphor-icons/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { useAsanaRefresh } from "@/hooks/useAsanaRefresh";
import { ConversationPanel } from "./chat/conversation";
import NavigationHeader from "./navigation";

function Page() {
  const { ready: asanaReady } = useAsanaRefresh();
  const token = useAuthToken();

  const [input, setInput] = useState("");
  const [webSearch, setWebSearch] = useState(false);

  const { sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: `${import.meta.env.VITE_CONVEX_API_URL}/api/chat`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "omit",
    }),
  });

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    sendMessage(
      {
        text: message.text || "Sent with attachments",
        files: message.files,
      },
      {
        body: {
          webSearch: webSearch,
        },
      },
    );
    setInput("");
  };

  return (
    <main className="h-screen grid grid-rows-[auto_1fr] grid-cols-1">
      <NavigationHeader className="sticky top-0 left-0 right-0 z-50" />
      <div className="max-w-4xl mx-auto px-6 pb-6 relative min-h-0 flex flex-col w-full">
        <ConversationPanel />
        <PromptInput onSubmit={handleSubmit} globalDrop multiple>
          <PromptInputBody>
            <PromptInputTextarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
          </PromptInputBody>
          <PromptInputToolbar>
            <PromptInputTools>
              <PromptInputButton
                variant={webSearch ? "default" : "ghost"}
                onClick={() => setWebSearch(!webSearch)}
                hoverScale={1}
              >
                <GlobeSimpleIcon size={16} />
                <span>Search</span>
              </PromptInputButton>
            </PromptInputTools>
            <PromptInputSubmit
              disabled={(!input && !status) || !asanaReady}
              status={status}
            />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </main>
  );
}

export default Page;
