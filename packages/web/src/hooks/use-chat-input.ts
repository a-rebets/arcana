import { api } from "@convex/api";
import { useToggle } from "@react-hookz/web";
import { useAction } from "convex/react";
import { type ChangeEvent, useCallback, useState } from "react";
import { useNavigate } from "react-router";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { useChatActions } from "@/lib/convex-agent";
import type { ArcanaUIMessage } from "@/lib/convex-agent/types";

export const useChatInput = (threadId?: string) => {
  const navigate = useNavigate();

  const { sendMessage } = useChatActions<ArcanaUIMessage>();
  const sendFromNewThread = useAction(api.ai.threads.startNewThread);

  const [input, setInput] = useState("");
  const [webSearch, toggleWebSearch] = useToggle(false);

  const handleSubmit = useCallback(
    async (message: PromptInputMessage) => {
      if (!message.text || !message.text.trim()) {
        return;
      }
      setInput("");
      toggleWebSearch(false);
      if (threadId) {
        sendMessage({
          text: message.text,
          webSearch,
        });
        return;
      }
      const newThreadId = await sendFromNewThread({
        prompt: message.text,
      });
      if (newThreadId) {
        navigate(`/chat/${newThreadId}`);
      }
    },
    [
      sendFromNewThread,
      sendMessage,
      navigate,
      threadId,
      webSearch,
      toggleWebSearch,
    ],
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    [],
  );

  return { handleSubmit, toggleWebSearch, handleInputChange, input, webSearch };
};
