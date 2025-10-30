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
  const sendNewThreadMessage = useAction(api.ai.threads.public.startNewThread);

  const [input, setInput] = useState("");
  const [withWebSearch, toggleWebSearch] = useToggle(false);

  const submitFromNewThread = useCallback(
    async (prompt: string, search?: boolean) => {
      const newThreadId = await sendNewThreadMessage({
        prompt,
      });
      if (newThreadId) {
        const path = `/chat/${newThreadId}`;
        navigate(search ? `${path}?search=true` : path);
      }
    },
    [sendNewThreadMessage, navigate],
  );

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
          webSearch: withWebSearch,
        });
      } else {
        submitFromNewThread(message.text, withWebSearch);
      }
    },
    [
      sendMessage,
      threadId,
      withWebSearch,
      toggleWebSearch,
      submitFromNewThread,
    ],
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    [],
  );

  return {
    handleSubmit,
    toggleWebSearch,
    handleInputChange,
    input,
    withWebSearch,
    submitFromNewThread,
  };
};
