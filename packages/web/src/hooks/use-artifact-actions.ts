import { useNavigate } from "react-router";
import { useNoPropagationCallback } from "./use-no-propagation-callback";

export function useArtifactActions(threadId: string, artifactId: string) {
  const navigate = useNavigate();

  const handleDownload = useNoPropagationCallback<HTMLButtonElement>(() => {
    console.log("download");
  });

  const handleOpenChat = useNoPropagationCallback<HTMLButtonElement>(() => {
    navigate(`/chat/${threadId}?artifact=${artifactId}`);
  });

  return {
    handleDownload,
    handleOpenChat,
  };
}
