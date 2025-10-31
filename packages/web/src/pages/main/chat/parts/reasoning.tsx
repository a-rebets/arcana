import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import type { ArcanaReasoningUIPart } from "@/lib/convex-agent";

export function MessageReasoning({
  part,
  isLast,
}: {
  part: ArcanaReasoningUIPart;
  isLast: boolean;
}) {
  const text = part.text.trim();
  const isEmpty = text === "" || text === "[REDACTED]";

  return (
    <Reasoning
      className="w-full"
      isStreaming={part.state === "streaming" && isLast}
      defaultOpen={false}
    >
      <ReasoningTrigger disabled={isEmpty} />
      <ReasoningContent>{part.text}</ReasoningContent>
    </Reasoning>
  );
}
